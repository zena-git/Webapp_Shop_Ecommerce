import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){

    const voucher = await prisma.voucher.findMany();

    const res = voucher.map((value) => {
        return {
            ...value,
            id: Number.parseInt(value.id.toString()),
            
        }
    })

    return new Response(JSON.stringify(res));
}