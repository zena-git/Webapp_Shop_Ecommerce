import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DatePicker, Space } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { nextUrl } from '../../lib/functional'
const { RangePicker } = DatePicker;

const data = [
    {
        name: 'Tháng 1',
        sp1: 4000,
        sp2: 2500
    },
    {
        name: 'Tháng 2',
        sp1: 2000,
        sp2: 3500
    },
    {
        name: 'Tháng 3',
        sp1: 3000,
        sp2: 6500
    },
]

const revenueData = [
    {
        time: 'Tháng 1',
        revenue: 4000,
        profit: 2500
    },
    {
        time: 'Tháng 2',
        revenue: 2000,
        profit: 3500
    },
    {
        time: 'Tháng 3',
        revenue: 3000,
        profit: 6500
    },
]
function Home() {

    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())])
    const [revenueData, setRevenueData] = useState([])
    const [todayData, setTodayData] = useState([])

    useEffect(() => {
        axios.get(`${nextUrl}/statistical?startdate=${new Date()}&enddate=${new Date()}`).then(res => {
            setTodayData(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`${nextUrl}/statistical?startdate=${date[0].toDate()}&enddate=${date[1].toDate()}`).then(res => {
            setRevenueData(res.data)
        })
    }, [date])

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
                <div>
                    <p>Thống kê hôm nay</p>
                    <div className='flex gap-5'>
                        <div className='bg-yellow-100 px-3 py-2 rounded-lg w-1/3'>
                            <p className='text-sm font-semibold'>Doanh thu hôm nay</p>
                            <p className='text-2xl font-bold'>{todayData.reduce((val, data) => {
                                return val + data.revenue;
                            }, 0)}d</p>
                        </div>
                        <div className='bg-yellow-100 px-3 py-2 rounded-lg w-1/3'>
                            <p className='text-sm font-semibold'>Số hàng bán ra hôm nay</p>
                            <p className='text-2xl font-bold'>1200</p>
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
            <div className='w-screen grid grid-cols-3 min-h-96'>
                <div>
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <AreaChart data={data}>
                            <XAxis dataKey={'name'} />
                            <CartesianGrid strokeDasharray={"5 5"} />
                            <Tooltip />
                            <Legend />
                            <Area type={'monotone'} dataKey={'sp1'} />
                            <Area type={'monotone'} dataKey={'sp2'} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <BarChart data={revenueData}>
                            <XAxis dataKey={'time'} />
                            <CartesianGrid strokeDasharray={"5 5"} />
                            <Tooltip />
                            <Legend />
                            <Bar fill='#ff23ca' stroke='#ff23ca' dataKey={'revenue'} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div>

                </div>
            </div>
        </div>
    );
}

export default Home;