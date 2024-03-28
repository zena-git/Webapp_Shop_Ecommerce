import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const data = await prisma.users.findMany({
        include: {
            User_roles: true
        }
    })

    return new Response(JSON.stringify(data.map(d => { return toObject(d) })))
}

function toObject(target: any) {
    return JSON.parse(JSON.stringify(target, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}