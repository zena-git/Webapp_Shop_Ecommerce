import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { nextUrl, baseUrl } from "../../lib/functional";
import { Tag } from "antd";
import ListAdress from '../../components/customer/ListAdress'

export default function CustomerDetail() {

    const path = useParams();

    const [targetCustomer, setTargetCustomer] = useState();

    useEffect(() => {
        if (!path.id) return;
        axios.get(`${baseUrl}/customer/${path.id}`).then(res => {
            setTargetCustomer(res.data);
        })
    }, [path])

    return (
        <div className="flex flex-col gap-3">
            <p className="text-4xl font-bold">Thông tin Customer</p>

            <div className="grid grid-cols-2 gap-3 p-3 bg-white shadow-lg rounded-md">
                <p className="text-lg font-semibold text-slate-800">Tên khách hàng: {targetCustomer?.fullName}</p>
                <p className="text-lg font-semibold text-slate-800">Sinh nhật: {targetCustomer?.birthday || "Không có"}</p>
                <p className="text-lg font-semibold text-slate-800">Giới tính: {targetCustomer && targetCustomer.gender == 0 ? "nam" : "nữ"}</p>
                <p className="text-lg font-semibold text-slate-800">SDT: {targetCustomer?.phone}</p>
                <p className="text-lg font-semibold text-slate-800">Email: {targetCustomer?.email}</p>
            </div>

            <div className="bg-white shadow-lg rounded-md p-3">
                {targetCustomer && <ListAdress data={targetCustomer.lstAddress} />}
            </div>
        </div>
    )

}