import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const keyword = req.nextUrl.searchParams.get("keyword");

    if (keyword) {
        const data = await prisma.customer.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: keyword
                        }
                    },
                    {
                        full_name: {
                            contains: keyword
                        },
                    },
                    {
                        phone: {
                            contains: keyword
                        },
                    }
                ]
            },
            include: {
                Address: true
            }
        })

        return new Response(JSON.stringify(data.map(cus => {
            return {
                ...cus,
                id: Number.parseInt(cus.id.toString()),
                Address: cus.Address.map(add => {
                    return {...add, id: Number.parseInt(add.id.toString()), customer_id: add.customer_id ? Number.parseInt(add.customer_id.toString()) : null}
                }),
            }
        })))
    }
}