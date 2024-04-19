import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DatePicker, Space } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl } from '../../lib/functional'
const { RangePicker } = DatePicker;

function Home() {

    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())])
    const [revenueData, setRevenueData] = useState([])
    const [topSale, setTopSale] = useState([])


    useEffect(() => {
        axios.get(`${baseUrl}/statistical?startdate=${date[0].toDate()}&enddate=${date[1].toDate()}`).then(res => {
            setRevenueData(res.data)
        })
        axios.get(`${baseUrl}/statistical/product/topsale?startdate=${date[0].toDate()}&enddate=${date[1].toDate()}`).then(res => {
            setTopSale(res.data)
        })
    }, [date])


    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3 bg-white shadow-lg p-6'>
                <div>
                    <p className='text-lg font-semibold mb-3'>Thống kê hôm nay</p>
                    <div className='flex gap-3 py-3'>
                        <div className='flex w-1/2'>
                            <div className='flex-grow bg-yellow-100 px-3 py-2 rounded-lg'>
                                <p className='text-sm font-semibold'>Doanh thu</p>
                                <p className='text-2xl font-bold'>
                                    {revenueData.reduce((val, data) => {
                                        return val + data.revenue;
                                    }, 0)}d
                                </p>
                            </div>
                        </div>
                        <div className='flex min-w-1/3 flex-grow'>
                            <div className='flex-grow bg-yellow-100 px-3 py-2 rounded-lg'>
                                <p className='text-sm font-semibold'>Số hàng bán ra</p>
                                <p className='text-2xl font-bold'>
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
            <div className='grid grid-cols-2 min-h-96 bg-white shadow-lg p-6'>
                <div>
                    <p className='text-lg font-semibold mb-3 text-center'>Top 5 sản phẩm bán chạy nhất</p>
                    <ResponsiveContainer width={'100%'} height={400}>
                        <AreaChart data={topSale}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            {topSale[0]?.product.map((product, index) => (
                                <Area key={index} type="monotone" dataKey={`product[${index}].quantity`} name={product.name} stackId="1" fill={`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <p className='text-lg font-semibold mb-3 text-center'>Doanh thu</p>
                    <ResponsiveContainer width={'100%'} height={400}>
                        <BarChart data={revenueData}>
                            <XAxis dataKey={'time'} />
                            <CartesianGrid strokeDasharray={"5 5"} />
                            <Tooltip />
                            <Bar fill='#ff23ca' stroke='#ff23ca' dataKey={'revenue'} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>

                </div>
            </div>
        </div >
    );
}

export default Home;