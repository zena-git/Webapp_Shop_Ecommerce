import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const receiverName = searchParams.get("receiverName");
    const receiverPhone = searchParams.get("receiverPhone");
    const detail = searchParams.get("detail");
    const commune = searchParams.get("commune");
    const district = searchParams.get("district");
    const province = searchParams.get("province");
    const customer = searchParams.get("customer");
    const defaultAddress = searchParams.get("defaultAddress");

    if(!receiverName || !receiverPhone || !detail || !commune || !district || !customer || !defaultAddress) return new Response(JSON.stringify({error: 'not enough data'}))

    const data = await prisma.address.create({
        data: {
            commune: commune,
            created_by: "admin",
            created_date: new Date(),
            customer_id: Number.parseInt(customer),
            receiver_name: receiverName,
            receiver_phone: receiverPhone,
            delete_flag: false,
            detail: "",
            is_default: !!defaultAddress,
            district: district,
            province: province,
            last_modified_by: 'admin',
            last_modified_date: new Date()
        }
    })

    return new Response(JSON.stringify({
        ...data,
        id: data.id.toString(),
        customer_id: data.customer_id?.toString(),
    }))
}