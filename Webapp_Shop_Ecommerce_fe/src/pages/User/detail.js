import axios from 'axios';
import { useState, useEffect } from 'react'
import { baseUrl } from '../../lib/functional';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
export default function DetailPage() {

    const path = useParams();
    const navigate = useNavigate();

    const [targetUser, setTargetUser] = useState();

    useEffect(() => {
        axios.get(`${baseUrl}/user/${path.id}`).then(res => {
            setTargetUser(res.data);
        })
    }, [path])

    return (
        <div className="flex flex-col gap-3">
            <div className="p-6 bg-white rounded-md shadow-lg flex flex-col gap-3">
                <div className='flex gap-2 items-center'>
                    <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/user/staff') }}><IoArrowBackSharp /></div>
                    <p className='ml-3 text-2xl font-bold'>Thông tin nhân viên {targetUser?.fullName}</p>
                </div>
                <div className='h-[3px] bg-slate-600'></div>
                <div className='flex gap-4'>
                    <div className='w-1/3 p-4 bg-slate-50 rounded-md shadow-lg'>
                        <p className='mt-4 text-2xl font-bold mb-2'>Hình ảnh</p>
                        <div className='mt-3 px-20'>
                            {targetUser && <img src={targetUser.imageUrl} className='w-full aspect-square rounded-full' />}
                        </div>
                    </div>
                    <div className="flex-grow pl-5 flex flex-col gap-8 p-4 bg-slate-50 rounded-md shadow-lg">
                        <p className='mt-4 text-2xl font-bold mb-2'>Thông tin</p>
                        <p className="text-2xl font-semibold">Tên nhân viên: {targetUser?.fullName}</p>
                        <p className="text-2xl font-semibold">Sinh nhật: {targetUser?.birthday?.split("T")[0] || "Không có"}</p>
                        <p className="text-2xl font-semibold">Giới tính: {targetUser && targetUser.gender == 0 ? "nam" : "nữ"}</p>
                        <p className="text-2xl font-semibold">SDT: {targetUser?.phone}</p>
                        <p className="text-2xl font-semibold">Email: {targetUser?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}