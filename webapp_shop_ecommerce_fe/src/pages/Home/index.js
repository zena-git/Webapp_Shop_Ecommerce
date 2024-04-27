import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DatePicker, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl, currentDate, numberToPrice } from '../../lib/functional'
import Plotly from 'plotly.js-dist'
const { RangePicker } = DatePicker;

function Home() {

    const [date, setDate] = useState([dayjs(currentDate()), dayjs(currentDate())])
    const [revenueData, setRevenueData] = useState([])
    const [topSale, setTopSale] = useState([])

    useEffect(() => {
        if (date) {
            axios.get(`${baseUrl}/statistical/revenue?startdate=${date[0].add(1, 'day').toISOString()}&enddate=${date[1].add(1, 'day').toISOString()}`).then(res => {
                setRevenueData(res.data);
            })
            axios.get(`${baseUrl}/statistical/product/topsale?startdate=${date[0].add(1, 'day').toISOString()}&enddate=${date[1].add(1, 'day').toISOString()}`).then(res => {
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
            })
        }
    }, [date])

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
            <div className='grid grid-cols-1 xl:grid-cols-2 min-h-96 bg-white shadow-lg p-6'>
                <div className='px-2'>
                    <p className='text-2xl font-semibold mb-3 text-center'>Doanh thu</p>
                    <ResponsiveContainer width={'100%'} height={400}>
                        {/* <BarChart data={revenueData}>
                            <XAxis dataKey={'time'} />
                            <CartesianGrid strokeDasharray={"5 5"} />
                            <Tooltip content={data => {return <div className='bg-white p-2'>Doanh thu: {data.payload[0] && numberToPrice(data.payload[0].value)}</div>}}/>
                            <Bar fill='#fc23ca' stroke='#ff23ca' dataKey={'revenue'} />
                        </BarChart> */}
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
                <div className='px-2'>
                    <p className='text-2xl font-semibold mb-3 text-center'>Danh sách sản phẩm bán ra</p>
                    <div id='myDivx' className='w-full'></div>
                    {/* <ResponsiveContainer width={'100%'} height={400}>
                        <BarChart data={topSale}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {
                                topSale[0]?.product.map((product, index) => (
                                    <Bar dataKey={`product[${index}].quantity`} name={product.name} fill={`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`} />
                                ))
                            }
                        </BarChart>
                    </ResponsiveContainer> */}
                </div>
            </div>
        </div >
    );
}

export default Home;