import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {


    const deleted = await prisma.voucher.findMany({
        where: {
            delete_flag: true
        }
    })

    return new Response(JSON.stringify(
        deleted.map(voucher => {
            return {
                ...voucher,
                id: voucher.id.toString()
            }
        })
    ))
}