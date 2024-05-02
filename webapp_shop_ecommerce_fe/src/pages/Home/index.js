import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DatePicker, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { baseUrl, currentDate, numberToPrice } from '../../lib/functional'
import Plotly from 'plotly.js-dist'
import AxiosIns from '../../lib/auth'

const { RangePicker } = DatePicker;

function Home() {

    const [date, setDate] = useState([dayjs(currentDate()).add(-7, 'day'), dayjs(currentDate())])
    const [revenueData, setRevenueData] = useState([])
    const [topSale, setTopSale] = useState([])
    const [thisData, setThisData] = useState();
    const [beforeData, setBeforeData] = useState()
    const [type, setType] = useState(1);
    const [top, setTop] = useState([])

    useEffect(() => {
        if (type == 0) {
            AxiosIns.get(`v1/statistical/lastweek`).then(res => {
                if (res.data) {
                    setThisData(res.data[0]);
                }
            })
            AxiosIns.get(`v1/statistical/beforelastweek`).then(res => {
                if (res.data) {
                    setBeforeData(res.data[0]);
                }
            })
        } else if (type == 1) {
            AxiosIns.get(`v1/statistical/lastmonth`).then(res => {
                if (res.data) {
                    setThisData(res.data[0]);
                }
            })
            AxiosIns.get(`v1/statistical/beforelastmonth`).then(res => {
                if (res.data) {
                    setBeforeData(res.data[0]);
                }
            })
        } else if (type == 2) {

        }
    }, [type])

    useEffect(() => {
        if (date) {
            AxiosIns.get(`v1/statistical/top?startdate=${date[0].add(1, 'day').toISOString()}&enddate=${date[1].add(1, 'day').toISOString()}`).then(res => {
                console.log(res)
                if (res.data) {
                    setTop(res.data);
                }
            })
            AxiosIns.get(`v1/statistical/revenue?startdate=${date[0].add(1, 'day').toISOString()}&enddate=${date[1].add(1, 'day').toISOString()}`).then(res => {
                if (res.data) {
                    setRevenueData(res.data.map(r => {
                        if (r.revenue == null) {
                            return { ...r, revenue: 0 };
                        } else {
                            return r;
                        }
                    }));
                }
            })
            AxiosIns.get(`/v1/statistical/product/topsale?startdate=${date[0].add(1, 'day').toISOString()}&enddate=${date[1].add(1, 'day').toISOString()}`).then(res => {
                if (res.data) {
                    const dates = res.data.map(entry => entry.time + ".");
                    console.log(dates);
                    const products = res.data.reduce((acc, entry) => {
                        entry.product.forEach(product => {
                            if (!acc[product.name]) {
                                acc[product.name] = Array(res.data.length).fill(0);
                            }
                            acc[product.name][dates.indexOf(entry.time + ".")] = product.quantity;
                        });
                        return acc;
                    }, {});

                    const traces = Object.keys(products).map(productName => ({
                        x: dates,
                        y: products[productName],
                        name: productName,
                        type: 'bar',
                    }));
                    const layout = {
                        title: '',
                        xaxis: {
                            title: 'Ngày',
                        },
                        yaxis: {
                            title: 'Số lượng',
                        },
                        barmode: 'group',
                    };
                    Plotly.newPlot('myDivx', traces, layout);
                    setTopSale(res.data);
                }
            })
        }
    }, [date])

    const Calculate = () => {
        let t = beforeData && beforeData.revenue !== null && beforeData.revenue !== 0 && thisData ?
            ((thisData.revenue - beforeData.revenue) / beforeData.revenue * 100).toFixed(2) + '%' :
            beforeData && beforeData.revenue === 0 ? '0%' : 'N/A'

        return <div className={`${t != 'N/A' ? t > 0 ? 'text-red-500' : 'text-emerald-500' : 'text-blue-500'}`}>
            {t}
        </div>
    }

    const CalculateOrder = () => {
        let t = beforeData && beforeData.completedOrders !== null && beforeData.completedOrders !== 0 && thisData ?
            ((thisData.completedOrders - beforeData.completedOrders) / beforeData.completedOrders * 100).toFixed(2) + '%' :
            beforeData && beforeData.completedOrders === 0 ? '0%' : 'N/A'

        return <div className={`${t != 'N/A' ? t > 0 ? 'text-red-500' : 'text-emerald-500' : 'text-blue-500'}`}>
            {t}
        </div>
    }

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3 bg-white shadow-lg p-6'>
                <div>
                    <p className='text-2xl font-semibold mb-3'>Thống kê</p>
                    <div className='grid grid-flow-col'>
                        <div className='flex w-full px-[5%] justify-center'>
                            <div className='w-full bg-slate-200 px-4 py-2 rounded-lg'>
                                <p className='text-xl font-semibold'>Doanh thu</p>
                                <p className='text-2xl font-bold text-blue-600'>
                                    {numberToPrice(revenueData.reduce((val, data) => {
                                        return val + data.revenue;
                                    }, 0))}
                                </p>
                            </div>
                        </div>
                        <div className='flex w-full px-[5%] justify-center'>
                            <div className='w-full bg-slate-200 px-4 py-2 rounded-lg'>
                                <p className='text-xl font-semibold'>Số hàng bán ra</p>
                                <p className='text-2xl font-bold text-blue-600'>
                                    {topSale.reduce((val, data) => {
                                        return val + data.product.reduce((v, pro) => {
                                            return v + pro.quantity
                                        }, 0)
                                    }, 0)}
                                </p>
                            </div>
                        </div>
                        <div className='flex w-full px-[5%] justify-center'>
                            <div className='w-full bg-slate-200 px-4 py-2 rounded-lg'>
                                <p className='text-xl font-semibold'>Số đơn hàng bán ra</p>
                                <p className='text-2xl font-bold text-blue-600'>
                                    {revenueData.reduce((val, data) => {
                                        return val + data.completedOrders;
                                    }, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex gap-2 items-center'>
                    <p>Thống kê từ ngày</p>
                    <RangePicker
                        value={date}
                        format="YYYY-MM-DD"
                        onChange={date => setDate(date)}
                    />
                </div>
            </div>
            <div className='min-h-96 bg-white shadow-lg p-6'>
                <div className='px-2'>
                    <p className='text-2xl font-semibold mb-3 text-center'>Danh sách sản phẩm bán ra</p>
                    <div id='myDivx' className='w-full'></div>
                </div>
                <div className='grid grid-cols-2 max-xl:grid-cols-1'>
                    <div className='px-2 w-full flex flex-col gap-4 bg-slate-100'>
                        <p className='text-2xl font-semibold mt-2'>So sánh số liệu</p>
                        <div className='flex justify-between px-[5%]'>
                            <div className={`min-w-40 w-1/3 py-4 text-center font-bold cursor-pointer ${type == 0 ? 'bg-blue-400' : 'bg-slate-200'}`} onClick={() => { setType(0) }}>Tuần</div>
                            <div className={`min-w-40 w-1/3 py-4 text-center font-bold cursor-pointer ${type == 1 ? 'bg-blue-400' : 'bg-slate-200'}`} onClick={() => { setType(1) }}>Tháng</div>
                        </div>
                        <div className='flex flex-col gap-4 px-4 py-2 bg-slate-50'>
                            <p className='text-2xl font-semibold'>Doanh thu</p>
                            <div className='grid grid-cols-3'>
                                <div>
                                    {beforeData ? numberToPrice(beforeData.revenue || 0) : numberToPrice(0)}
                                </div>
                                <div>
                                    {thisData ? numberToPrice(thisData.revenue || 0) : numberToPrice(0)}
                                </div>
                                {Calculate()}
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 px-4 py-2 bg-slate-50'>
                            <p className='text-2xl font-semibold'>Đơn hàng hoàn thành</p>
                            <div className='grid grid-cols-3'>
                                <div>
                                    {beforeData ? beforeData.completedOrders : 0}
                                </div>
                                <div>
                                    {thisData ? thisData.completedOrders : 0}
                                </div>
                                {CalculateOrder()}
                            </div>
                        </div>
                    </div>
                    <div className='px-2'>
                        <p className='text-2xl font-semibold mb-3 text-center'>Doanh thu</p>
                        <ResponsiveContainer width={'100%'} height={400}>
                            <AreaChart width={730} height={250} data={revenueData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip content={data => { return <div className='bg-white p-2'>Doanh thu: {data.payload[0] && numberToPrice(data.payload[0].value)}</div> }} />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="#82ca9d" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className='bg-white shadow-lg p-6'>
                <div className='grid grid-cols-2 max-xl:grid-cols-1'>
                    <div className='text-center'>
                        <p className='text-[18px] font-bold'>Top 5 sản phẩm bán chạy</p>
                        <div className='grid grid-cols-2 bg-slate-50 py-3'>
                            <p className='text-2xl font-semibold'>Tên sản phẩm</p>
                            <p className='text-2xl font-semibold'>Số lượng</p>
                        </div>
                        <div className='flex flex-col gap-3'>
                            {top.map(pro => {
                                return <div className='w-full px-3 py-5 bg-slate-100 shadow-lg border grid grid-cols-2'>
                                    <p className='text-start'>{pro.name}</p>
                                    <p>{pro.quantity}</p>
                                </div>
                            })}
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;