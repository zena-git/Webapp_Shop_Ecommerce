import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const id = req.nextUrl.searchParams.get("id");

    if (id && Number.parseInt(id)) {
        const voucher = await prisma.voucher.findFirst({
            where: {
                id: Number.parseInt(id)
            },
            include: {
                VoucherDetail: true
            }
        })

        const VoucherDetailx = await prisma.voucherDetail.findFirst({
            where: {
                id: 1
            }
        })
        VoucherDetailx?.id
        if (voucher) {
            const res = {
                ...voucher,
                id: voucher.id.toString(),
                VoucherDetail: voucher.VoucherDetail.map(detail => {
                    return { ...detail, bill_id: detail.bill_id?.toString(), id: detail.id.toString(), customer_id: detail.customer_id?.toString(), voucher_id: detail.voucher_id?.toString() }
                }),

            }
            return new Response(JSON.stringify(res));
        }

    }
}
