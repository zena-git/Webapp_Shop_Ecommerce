import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.voucherId) return new Response(JSON.stringify({ error: "no id provided" }))

    const updatedVoucher = await prisma.voucher.update({
        where: {
            id: body.voucherId
        }, data: {
            status: body.status
        }
    })
}