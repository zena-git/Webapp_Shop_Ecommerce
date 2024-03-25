import prisma from "../../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const startdate = req.nextUrl.searchParams.get("startdate");
    const enddate = req.nextUrl.searchParams.get("enddate");
    if (!startdate || !enddate) return new Response("Missing startdate or enddate parameters", { status: 400 });

    const listCompletedBill = await prisma.bill.findMany({
        where: {
            status: "5",
            completion_date: {
                gte: new Date(startdate),
                lte: new Date(enddate)
            }
        },
        include: {
            BillDetails: {
                include: {
                    ProductDetail: {
                        include: {
                            Product: true
                        }
                    }
                }
            }
        }
    });

    const salesDataByTime = [];

    const timeDiff = Math.abs(new Date(enddate) - new Date(startdate));
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (diffDays <= 14) {
        // Calculate sales data by day
        const startDateObj = new Date(startdate);
        let currentDate = new Date(startdate);

        while (currentDate <= new Date(enddate)) {
            const salesData = listCompletedBill.reduce((acc, bill) => {
                const billDate = new Date(bill.completion_date).toISOString().split('T')[0];
                if (billDate === currentDate.toISOString().split('T')[0]) {
                    bill.BillDetails.forEach(billDetail => {
                        const productName = billDetail.ProductDetail?.Product?.name;
                        const quantity = billDetail.ProductDetail?.quantity;
                        if (productName && quantity) {
                            const existingProduct = acc.find(item => item.name === productName);
                            if (existingProduct) {
                                existingProduct.quantity += quantity;
                            } else {
                                acc.push({ name: productName, quantity: quantity });
                            }
                        }
                    });
                }
                return acc;
            }, []);

            const sortedSales = salesData.sort((a, b) => b.quantity - a.quantity);
            const topProducts = sortedSales.slice(0, 5);

            salesDataByTime.push({
                time: currentDate.toLocaleDateString('en-GB'),
                product: topProducts
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else if (diffDays <= 56) {
        const startDateObj = new Date(startdate);
        let currentWeek = getWeekNumber(startDateObj);

        while (startDateObj <= new Date(enddate)) {
            const salesData = listCompletedBill.reduce((acc, bill) => {
                const billWeek = getWeekNumber(new Date(bill.completion_date));
                if (billWeek === currentWeek) {
                    bill.BillDetails.forEach(billDetail => {
                        const productName = billDetail.ProductDetail?.Product?.name;
                        const quantity = billDetail.ProductDetail?.quantity;
                        if (productName && quantity) {
                            const existingProduct = acc.find(item => item.name === productName);
                            if (existingProduct) {
                                existingProduct.quantity += quantity;
                            } else {
                                acc.push({ name: productName, quantity: quantity });
                            }
                        }
                    });
                }
                return acc;
            }, []);

            const sortedSales = salesData.sort((a, b) => b.quantity - a.quantity);
            const topProducts = sortedSales.slice(0, 5);

            salesDataByTime.push({
                time: `Week ${currentWeek}`,
                product: topProducts
            });

            currentWeek++;
            startDateObj.setDate(startDateObj.getDate() + 7);
        }
    } else {
        const startDateObj = new Date(startdate);
        let currentMonth = startDateObj.getMonth();

        while (startDateObj <= new Date(enddate)) {
            const salesData = listCompletedBill.reduce((acc, bill) => {
                const billMonth = new Date(bill.completion_date).getMonth();
                if (billMonth === currentMonth) {
                    bill.BillDetails.forEach(billDetail => {
                        const productName = billDetail.ProductDetail?.Product?.name;
                        const quantity = billDetail.ProductDetail?.quantity;
                        if (productName && quantity) {
                            const existingProduct = acc.find(item => item.name === productName);
                            if (existingProduct) {
                                existingProduct.quantity += quantity;
                            } else {
                                acc.push({ name: productName, quantity: quantity });
                            }
                        }
                    });
                }
                return acc;
            }, []);

            const sortedSales = salesData.sort((a, b) => b.quantity - a.quantity);
            const topProducts = sortedSales.slice(0, 5);

            salesDataByTime.push({
                time: `${new Date(startdate).toLocaleString('en-GB', { month: 'long', year: new Date(startdate).getFullYear() })}`,
                product: topProducts
            });

            currentMonth++;
            startDateObj.setMonth(startDateObj.getMonth() + 1);
        }
    }

    return new Response(JSON.stringify(salesDataByTime), { headers: { "Content-Type": "application/json" } });
}
function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}