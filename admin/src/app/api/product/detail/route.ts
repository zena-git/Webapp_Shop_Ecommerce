import { makeid } from "../../../../lib/functional";
import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    let t = req.nextUrl.searchParams.get("id")
    if (!t) {
        const proDetail = await prisma.productDetail.findMany({
            include: {
                Product: true,
                Color: true,
                Size: true,
                PromotionDetails: true
            }
        })
        if (proDetail)
            return new Response(JSON.stringify(proDetail.map(data => {
                return {
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
            })))
    } else {
        const detailId = Number.parseInt(t)

        const data = await prisma.productDetail.findFirst({
            where: {
                id: detailId
            },
            include: {
                Product: true,
                Color: true,
                Size: true,
                PromotionDetails: true
            }
        })
        if (data) return new Response(JSON.stringify({
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
        }))
    }
}

interface RequestBody {
    id: number,
    imageUrl: string
}