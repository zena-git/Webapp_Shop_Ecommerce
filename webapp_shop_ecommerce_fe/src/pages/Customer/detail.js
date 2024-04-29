import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../lib/functional";
import { Tag } from "antd";
import ListAdress from '../../components/customer/ListAdress'
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";
export default function CustomerDetail() {

    const path = useParams();
    const navigate = useNavigate();

    const [targetCustomer, setTargetCustomer] = useState();

    useEffect(() => {
        if (!path.id) return;
        axios.get(`${baseUrl}/customer/${path.id}`).then(res => {
            setTargetCustomer(res.data);
        })
    }, [path])

    return (
        <div className="flex flex-col gap-3">
            <div className="p-6 bg-white rounded-md shadow-lg flex flex-col gap-3">
                <div className='flex gap-2 items-center'>
                    <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/user/customer') }}><IoArrowBackSharp /></div>
                    <p className='ml-3 text-2xl font-bold'>Thông tin khách hàng</p>
                </div>
                <div className='h-[3px] bg-slate-600'></div>
                <div className="grid grid-cols-2 gap-3">
                    <p className="text-xl font-semibold text-slate-800">Tên khách hàng: {targetCustomer?.fullName}</p>
                    <p className="text-xl font-semibold text-slate-800">Ngày sinh: {targetCustomer?.birthday || "Không có"}</p>
                    <p className="text-xl font-semibold text-slate-800">Giới tính: {targetCustomer && targetCustomer.gender ? "Nữ" : "Nam"}</p>
                    <p className="text-xl font-semibold text-slate-800">SDT: {targetCustomer?.phone}</p>
                    <p className="text-xl font-semibold text-slate-800">Email: {targetCustomer?.email}</p>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-md p-3">
                <p className='ml-3 my-3 text-2xl font-semibold'>Danh sách địa chỉ</p>
                <div className='h-[3px] bg-slate-600 mb-3'></div>
                {targetCustomer && <ListAdress data={targetCustomer.lstAddress} />}
            </div>
        </div>
    )

}