import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("voucherId");

    if (id) {
        const t = await prisma.voucher.findFirst({
            where: {
                id: Number.parseInt(id)
            }
        })

        if (!t) return new Response(JSON.stringify({ "error": "voucher not  found" }));

        await prisma.voucher.update({
            where: {
                id: t.id
            },
            data: {
                status: t.status == "0" ? "1" : "0"
            }
        })

        return new Response(JSON.stringify({ "message": "voucher updated" }));
    }
}