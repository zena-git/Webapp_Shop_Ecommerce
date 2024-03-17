import prisma from "../../../../../lib/prisma";
import { NextRequest } from "next/server";

interface RequestBody {
    id: number,
    imageUrl: string
}

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const body = { id: searchParams.get("id"), imageUrl: searchParams.get("imageUrl") }

    if (!body.id || !body.imageUrl) return new Response(JSON.stringify({ error: 'no info provided' }))

    const found = await prisma.product.findFirst({
        where: {
            id: Number.parseInt(body.id),
        }
    })

    if (!found) return new Response(JSON.stringify({ error: 'not found' }))

    const updated = await prisma.product.update({
        where: {
            id: found.id
        },
        data: {
            image_url: `${found.image_url} | ${body.imageUrl}`
        }
    })

    return new Response(JSON.stringify({ ...updated, id: updated.id.toString(), id_brand: updated.id_brand?.toString(), id_category: updated.id_category?.toString(), id_material: updated.id_material?.toString(), id_style: updated.id_style?.toString() }))
}