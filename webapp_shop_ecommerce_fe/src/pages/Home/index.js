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
                const plotData = {
                    data: res.data.map(item => ({
                        type: 'bar',
                        name: item.time,
                        x: item.product.map(product => product.name),
                        y: item.product.map(product => product.quantity)
                    })),
                    layout: {
                        xaxis: {
                            title: 'Nhóm Sản phẩm'
                        },
                        yaxis: {
                            title: 'Số Lượng'
                        }
                    }
                };

                Plotly.newPlot('myDivx', plotData, { barmode: 'group' });
                setTopSale(res.data);
            })
        }
    }, [date])

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3 bg-white shadow-lg p-6'>
                <div>
                    <p className='text-2xl font-semibold mb-3'>Thống kê</p>
                    <div className='flex gap-3 py-3'>
                        <div className='flex w-1/2'>
                            <div className='flex-grow bg-yellow-100 px-3 py-2 rounded-lg'>
                                <p className='text-xl font-semibold'>Doanh thu</p>
                                <p className='text-2xl font-bold'>
                                    {numberToPrice(revenueData.reduce((val, data) => {
                                        return val + data.revenue;
                                    }, 0))}
                                </p>
                            </div>
                        </div>
                        <div className='flex min-w-1/3 flex-grow'>
                            <div className='flex-grow bg-yellow-100 px-3 py-2 rounded-lg'>
                                <p className='text-xl font-semibold'>Số hàng bán ra</p>
                                <p className='text-2xl font-bold'>
                                    {topSale.reduce((val, data) => {
                                        return val + data.product.reduce((v, pro) => {
                                            return v + pro.quantity
                                        }, 0)
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
                <div>
                    <p className='text-2xl font-semibold mb-3 text-center'>Doanh thu</p>
                    <ResponsiveContainer width={'100%'} height={400}>
                        <BarChart data={revenueData}>
                            <XAxis dataKey={'time'} />
                            <CartesianGrid strokeDasharray={"5 5"} />
                            <Tooltip content={data => {return <div className='bg-white p-2'>Doanh thu: {data.payload[0] && numberToPrice(data.payload[0].value)}</div>}}/>
                            <Bar fill='#fc23ca' stroke='#ff23ca' dataKey={'revenue'} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>
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