import { makeid } from "../../../lib/functional";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const data = await prisma.bill.findMany({
        where: {
            customer_id: {
                not: null
            }
        },
        include: {
            Customer: true,
            BillDetails: true,
        }
    })

    return new Response(JSON.stringify(data.map(bill => {
        return {
            ...bill, id: Number.parseInt(bill.id.toString()), customer_id: Number.parseInt(bill.customer_id!.toString()),
            BillDetails: bill.BillDetails.map(billDetail => {
                return { ...billDetail, bill_id: Number.parseInt(billDetail.bill_id!.toString()), id: Number.parseInt(billDetail.id.toString()), product_detail_id: Number.parseInt(billDetail.product_detail_id!.toString()) }
            }),
            Customer: { ...bill.Customer, id: Number.parseInt(bill.Customer!.id.toString()) }
        }
    })))
}

export async function POST(req: NextRequest) {
    const data = await prisma.bill.create({
        data: {
            code_bill: makeid(),
            status: "chưa thanh toán",
            booking_date: new Date(),
            payment_date: null,
            delivery_date: null,
            completion_date: null,
            receiver_name: null,
            customer_id: null,
            receiver_phone: null,
            cash: null,
            created_by: "admin",
            delete_flag: false,
            digital_currency: null,
            into_money: null,
            total_money: null,
            created_date: new Date(),
            last_modified_date: new Date(),
            user_id: null,
            bill_type: "Offline",
            last_modified_by: "admin",
            email: null,
            receiver_commune: null,
            receiver_details: null,
            receiver_district: null,
            receiver_province: null,
        }
    })

    return new Response(JSON.stringify({ ...data, id: Number.parseInt(data.id.toString()) }));
}