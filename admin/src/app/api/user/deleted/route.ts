import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const found = await prisma.users.findMany({
        where: {
            delete_flag: true
        },
        include: {
            User_roles: true
        }
    })

    return new Response(JSON.stringify({ ...found, User_roles: found.map(r => { return toObject(r) }) }))
}
function toObject(target: any) {
    return JSON.parse(JSON.stringify(target, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}