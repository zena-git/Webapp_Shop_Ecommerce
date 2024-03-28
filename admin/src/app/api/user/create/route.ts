import { makeid } from "../../../../lib/functional";
import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const birthday = searchParams.get("birthday")
    const commune = searchParams.get("commune")
    const detail = searchParams.get("detail")
    const district = searchParams.get("district")
    const email = searchParams.get("email")
    const full_name = searchParams.get("full_name")
    const gender = searchParams.get("gender")
    const phone = searchParams.get("phone")
    const province = searchParams.get("province")
    const image_url = searchParams.get("image_url")
    if (!birthday || !commune || !detail || !district || !email || !full_name || !gender || !phone || !province) return new Response(JSON.stringify({ error: 'not enough data' }))
    const user = await prisma.users.create({
        data: {
            birthday: birthday,
            commune: commune,
            created_by: "Admin",
            created_date: new Date(),
            delete_flag: false,
            detail: detail,
            district: district,
            email: email,
            full_name: full_name,
            gender: gender == "0",
            last_modified_by: "Admin",
            last_modified_date: new Date(),
            phone: phone,
            province: province,
            password: makeid(),
            username: email,
            image_url: image_url
        }
    })

    const user_role = await prisma.user_roles.create({
        data: {
            role_id: 1,
            user_id: user.id,
            created_by: "Admin",
            created_date: new Date(),
            delete_flag: false,
            last_modified_by: "Admin",
            last_modified_date: new Date()
        }
    })

    return new Response(JSON.stringify({ message: 'ok' }))
}