import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

interface RequestBody {
    billId: number,
    digitalCurrency: number,

}

export async function POST(req: NextRequest) {
    const body: RequestBody = await req.json();

    if (!body.billId) return new Response(JSON.stringify({ error: 'no bill id' }), { status: 403 })

    const listBillDetail = await prisma.billDetails.findMany({
        where: {
            bill_id: body.billId
        }
    })

    const total_money = listBillDetail.reduce((total, detail) => total + Number.parseFloat(detail.unit_price!.toString()) * detail.quantity!, 0)

    const updatedBill = await prisma.bill.update({
        where: {
            id: body.billId
        },
        data: {
            total_money: total_money,
            payment_date: new Date(),
            digital_currency: body.digitalCurrency,
            cash: body.digitalCurrency != total_money ? total_money - body.digitalCurrency : null,
            status: 'Đã thanh toán',
        }
    })

    return new Response(JSON.stringify({ ...updatedBill, id: updatedBill.id.toString(), user_id: updatedBill.user_id?.toString(), customer_id: updatedBill.customer_id?.toString() }))

}