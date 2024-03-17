import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const t = req.nextUrl.searchParams.get("id");
    if (!t) return new Response(JSON.stringify({ message: 'error' }), { status: 403 })
    const id = Number.parseInt(t);
    const list = await prisma.billDetails.findMany({
        where: {
            bill_id: id,
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
}
