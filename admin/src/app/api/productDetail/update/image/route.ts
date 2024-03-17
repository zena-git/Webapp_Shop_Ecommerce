import prisma from "../../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const body = { id: searchParams.get("id"), imageUrl: searchParams.get("imageUrl") }

    if (!body.id || !body.imageUrl) return new Response(JSON.stringify({ error: 'no info provided' }))

    const found = await prisma.productDetail.findFirst({
        where: {
            id: Number.parseInt(body.id),
        }
    })

    if (!found) return new Response(JSON.stringify({ error: 'not found' }))

    const updated = await prisma.productDetail.update({
        where: {
            id: found.id
        },
        data: {
            image_url: found.image_url && found.image_url.trim().length > 0 ? `${found.image_url} | ${body.imageUrl}` : body.imageUrl
        }
    })

    return new Response(JSON.stringify({ ...updated, id: updated.id.toString(), color_id: updated.color_id?.toString(), product_id: updated.product_id?.toString(), size_id: updated.size_id?.toString() }))
}