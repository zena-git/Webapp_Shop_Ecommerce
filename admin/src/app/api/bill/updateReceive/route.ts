import { SelectedProductDetail } from "../../../../lib/type";
import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

interface bodyRequest {
    idBill: number,
    receive_name: string,
    receive_district: string,
    receive_email: string,
    receive_phone: string,
    receive_commune: string,
    receive_detail: string,
    receive_province: string

}

export async function POST(req: NextRequest) {
    const body: bodyRequest = await req.json();

    if (!body.idBill) return new Response(JSON.stringify({ message: 'no bill id' }), { status: 403 })

    const bill = await prisma.bill.findUnique({
        where: {
            id: body.idBill
        }
    })

    if (!bill) return new Response(JSON.stringify({ message: 'bill not found' }), { status: 403 })

    const updatedBill = await prisma.bill.update({
        where: {
            id: bill.id
        },
        data: {
            receiver_commune: body.receive_commune,
            receiver_details: body.receive_detail,
            receiver_district: body.receive_district,
            receiver_phone: body.receive_phone,
            receiver_name: body.receive_name,
            receiver_province: body.receive_province
        }
    })

    return new Response(JSON.stringify({ ...updatedBill, id: updatedBill.id.toString(), customer_id: updatedBill.customer_id?.toString(), idx: updatedBill.user_id?.toString() }))
}
