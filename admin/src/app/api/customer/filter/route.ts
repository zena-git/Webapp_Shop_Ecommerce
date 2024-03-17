import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    let cc = req.nextUrl.searchParams.get("type");
    if (cc) {
        const type = Number.parseInt(cc);
        if (type == 1) {
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

            // Step 1: Tìm danh sách các hóa đơn trong tháng gần đây
            const recentCustomer = await prisma.customer.findMany({
                where: {
                    created_date: {
                        gte: lastMonth,
                        lt: today
                    }
                }
            })

            return new Response(JSON.stringify(recentCustomer.map(customer => { return { ...customer, id: customer.id.toString() } })))
        } else if (type == 2) {
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

            // Step 1: Tìm danh sách các hóa đơn trong tháng gần đây
            const recentBills = await prisma.bill.findMany({
                where: {
                    created_date: {
                        gte: lastMonth,
                        lt: today
                    },
                    NOT: {
                        customer_id: null
                    }
                },

                select: {
                    customer_id: true
                }
            });

            const listId = recentBills.map(bill => bill.customer_id!.toString())
            // Step 2 & 3: Trích xuất và loại bỏ các customer_id trùng lặp
            const uniqueCustomerIds = [...new Set(listId)];

            // Step 4: Tìm thông tin của các khách hàng dựa trên danh sách các customer_id
            const customersWithRecentBills = await prisma.customer.findMany({
                where: {
                    id: {
                        in: uniqueCustomerIds
                    }
                }
            });

            return new Response(JSON.stringify(customersWithRecentBills.map(cus => { return { ...cus, id: cus.id.toString() } })))
        }

        return new Response(JSON.stringify({ message: 'type not supported' }))


    }



}