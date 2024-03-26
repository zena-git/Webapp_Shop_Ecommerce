import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const t = req.nextUrl.searchParams.get("id");
    if (!t) return new Response(JSON.stringify({ error: 'no id provided' }))
    const id = Number.parseInt(t);
    if (id) {
        const found = await prisma.voucher.findFirst({
            where: {
                id: id,
            }
        })

        if (!found) return new Response(JSON.stringify({ error: 'not found' }))
        const updated = await prisma.voucher.update({
            where: {
                id: found.id
            },
            data: {
                delete_flag: false
            }
        })

        return new Response(JSON.stringify({ message: 'ok' }))
    }
}