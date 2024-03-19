import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const t = req.nextUrl.searchParams.get("id");
    if (!t) return new Response(JSON.stringify({ error: 'no id provided' }))
    const id = Number.parseInt(t);

    const data = await prisma.promotion.findFirst({
        where: {
            id: id
        },
        include: {
            PromotionDetails: {
                include: {
                    ProductDetail: {
                        include: {
                            Color: true,
                            Size: true
                        }
                    },
                    Promotion: true
                }
            }
        }
    })

    if (!data) return new Response(JSON.stringify({ error: 'not found' }));

    return new Response(JSON.stringify(
        {
            ...data, id: data.id.toString(),
            PromotionDetails: data.PromotionDetails.map(promDetail => {
                return {
                    ...promDetail,
                    id: promDetail.id.toString(),
                    promotion_id: promDetail.promotion_id?.toString(),
                    product_details_id: promDetail.product_details_id?.toString(),
                    ProductDetail: { ...promDetail.ProductDetail, price: promDetail.ProductDetail?.price?.toString(), id: promDetail.ProductDetail?.id.toString(), color_id: promDetail.ProductDetail?.color_id?.toString(), size_id: promDetail.ProductDetail?.size_id?.toString(), product_id: promDetail.ProductDetail?.product_id?.toString(), Color: { ...promDetail.ProductDetail?.Color, id: promDetail.ProductDetail?.Color?.id.toString() }, Size: { ...promDetail.ProductDetail?.Size, id: promDetail.ProductDetail?.Size?.id.toString() } },
                    Promotion: { ...promDetail.Promotion, id: promDetail.Promotion?.id.toString() }
                }
            })
        }
    ))
}