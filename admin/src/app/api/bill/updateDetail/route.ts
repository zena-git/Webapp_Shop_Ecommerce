import { SelectedProductDetail } from "../../../../lib/type";
import { makeid } from "../../../../lib/functional";
import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

interface bodyRequest {
    billId: number,
    productDetails: SelectedProductDetail[]
}

export async function POST(req: NextRequest) {
    const body: bodyRequest = await req.json();

    if (!body.billId) return new Response(JSON.stringify({ message: 'no bill id' }), { status: 403 })

    const bill = await prisma.bill.findUnique({
        where: {
            id: body.billId
        }
    })

    if (!bill) return new Response(JSON.stringify({ message: 'bill not found' }), { status: 403 })

    await prisma.$transaction(async (prisma) => {
        await Promise.all(body.productDetails.map(async (detail) => {
            const found = await prisma.billDetails.findFirst({
                where: {
                    bill_id: bill.id,
                    product_detail_id: detail.detail_id
                }
            })

            if (found) {
                await prisma.billDetails.update({
                    where: {
                        id: found.id
                    },
                    data: {
                        quantity: detail.buy_quantity,
                        status: "chưa thanh toán",
                    }
                })
            } else {
                await prisma.billDetails.create({
                    data: {
                        quantity: detail.buy_quantity,
                        last_modified_by: "admin",
                        last_modified_date: new Date(),
                        created_date: new Date(),
                        created_by: 'admin',
                        bill_id: bill.id,
                        delete_flag: false,
                        product_detail_id: detail.detail_id,
                        status: "chưa thanh toán",
                        unit_price: detail.price
                    }
                })
            }
            const list = await prisma.billDetails.findMany({
                where: {
                    bill_id: bill.id,
                },
                include: {
                    ProductDetail: true
                }
            })

            const updatedList = await Promise.all(list.map(async bill => {
                const productDetail = bill.ProductDetail;

                const data = await prisma.productDetail.findUnique({
                    where: {
                        id: productDetail?.id
                    },
                    include: {
                        Product: true,
                        Color: true,
                        Size: true,
                        PromotionDetails: true
                    }
                })

                if (!data) return new Response(JSON.stringify({ message: 'do data bẩn' }), { status: 403 })

                return {
                    ...bill,
                    id: Number.parseInt(bill.id.toString()),
                    bill_id: Number.parseInt(bill.bill_id!.toString()),
                    product_detail_id: Number.parseInt(bill.product_detail_id!.toString()),
                    ProductDetail: {
                        ...data, id: Number.parseInt(data.id!.toString()),
                        color_id: Number.parseInt(data.color_id!.toString()),
                        product_id: Number.parseInt(data.product_id!.toString()),
                        size_id: Number.parseInt(data.size_id!.toString()),
                        Product: data.Product ? { ...data.Product, id: Number.parseInt(data.Product!.id.toString()), id_brand: Number.parseInt(data.Product.id_brand!.toString()), id_style: Number.parseInt(data.Product.id_style!.toString()), id_category: Number.parseInt(data.Product.id_category!.toString()), id_material: Number.parseInt(data.Product.id_material!.toString()) } : null,
                        Color: { ...data.Color, id: Number.parseInt(data.Color!.id.toString()) },
                        Size: { ...data.Color, id: Number.parseInt(data.Color!.id.toString()) },
                        PromotionDetails: data.PromotionDetails ? data.PromotionDetails.map(prom => {
                            return { ...prom, id: Number.parseInt(prom.id.toString()), promotion_id: prom.promotion_id ? Number.parseInt(prom.promotion_id.toString()) : null, product_details_id: prom.product_details_id ? Number.parseInt(prom.product_details_id.toString()) : null }
                        }) : []
                    }
                };
            }));

            return new Response(JSON.stringify(updatedList));

        }))
    })


    return new Response(JSON.stringify({ message: 'ok' }))
}
