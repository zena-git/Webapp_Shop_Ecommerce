import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const startdate = req.nextUrl.searchParams.get("startdate");
    const enddate = req.nextUrl.searchParams.get("enddate");
    if (!startdate || !enddate) return new Response()
    const listCompletedBill = await prisma.bill.findMany({
        where: {
            status: "5",
            completion_date: {
                gte: new Date(startdate),
                lte: new Date(enddate)
            }
        },
        include: {
            BillDetails: true
        }
    });

    let revenueData = [];
    let completedOrdersData = []; // Array to store completed orders data

    const timeDiff = Math.abs(new Date(enddate) - new Date(startdate));
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (diffDays <= 14) {
        // Tính theo từng ngày
        const startDateObj = new Date(startdate);
        let currentDate = startDateObj;

        while (currentDate <= new Date(enddate)) {
            const totalRevenueOfDay = listCompletedBill.reduce((acc, bill) => {
                const billDate = new Date(bill.completion_date).toISOString().split('T')[0];
                if (billDate === currentDate.toISOString().split('T')[0]) {
                    return acc + calculateDailyRevenue(bill.BillDetails);
                }
                return acc;
            }, 0);

            const totalCompletedOrders = listCompletedBill.filter(bill => {
                const billDate = new Date(bill.completion_date).toISOString().split('T')[0];
                return billDate === currentDate.toISOString().split('T')[0];
            }).length;

            revenueData.push({
                time: currentDate.toLocaleDateString('en-GB'),
                revenue: totalRevenueOfDay,
                completedOrders: totalCompletedOrders
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else if (diffDays <= 56) {
        // Tính theo tuần
        const startDateObj = new Date(startdate);
        let currentWeek = getWeekNumber(startDateObj);

        while (startDateObj <= new Date(enddate)) {
            const totalRevenueOfWeek = listCompletedBill.reduce((acc, bill) => {
                const billWeek = getWeekNumber(new Date(bill.completion_date));
                if (billWeek === currentWeek) {
                    return acc + calculateDailyRevenue(bill.BillDetails);
                }
                return acc;
            }, 0);

            const totalCompletedOrders = listCompletedBill.filter(bill => {
                const billWeek = getWeekNumber(new Date(bill.completion_date));
                return billWeek === currentWeek;
            }).length;

            revenueData.push({
                time: `Tuần ${currentWeek}`,
                revenue: totalRevenueOfWeek,
                completedOrders: totalCompletedOrders
            });

            currentWeek++;
            startDateObj.setDate(startDateObj.getDate() + 7);
        }
    } else {
        // Tính theo tháng
        const startDateObj = new Date(startdate);
        let currentMonth = startDateObj.getMonth();

        while (startDateObj <= new Date(enddate)) {
            const totalRevenueOfMonth = listCompletedBill.reduce((acc, bill) => {
                const billMonth = new Date(bill.completion_date).getMonth();
                if (billMonth === currentMonth) {
                    return acc + calculateDailyRevenue(bill.BillDetails);
                }
                return acc;
            }, 0);

            const totalCompletedOrders = listCompletedBill.filter(bill => {
                const billMonth = new Date(bill.completion_date).getMonth();
                return billMonth === currentMonth;
            }).length;

            revenueData.push({
                time: startDateObj.toLocaleString('en-GB', { month: 'long' }),
                revenue: totalRevenueOfMonth,
                completedOrders: totalCompletedOrders
            });

            currentMonth++;
            startDateObj.setMonth(startDateObj.getMonth() + 1);
        }
    }

    console.log(revenueData);
    return new Response(JSON.stringify(revenueData));
}

function calculateDailyRevenue(billDetails) {
    return billDetails.reduce((acc, detail) => {
        return acc + (detail.unit_price * detail.quantity);
    }, 0);
}

function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
