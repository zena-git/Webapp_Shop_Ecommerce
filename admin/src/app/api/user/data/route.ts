import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const t = req.nextUrl.searchParams.get("id");
    if (!t) return new Response(JSON.stringify({ error: 'no id provided' }))
    const id = Number.parseInt(t);
    const found = await prisma.users.findFirst({
        where: {
            id: id
        },
        include: {
            User_roles: true
        }
    })

    return new Response(JSON.stringify(toObject(found)))
}

function toObject(target: any) {
    return JSON.parse(JSON.stringify(target, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}