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
        <div>
            <p className="text-4xl font-bold mb-3">Thông tin Customer</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <p className="text-lg font-semibold text-slate-800">Tên khách hàng: {targetCustomer?.fullName}</p>
                <p className="text-lg font-semibold text-slate-800">Sinh nhật: {targetCustomer?.birthday || "Không có"}</p>
                <p className="text-lg font-semibold text-slate-800">Giới tính: {targetCustomer && targetCustomer.gender == 0 ? "nam" : "nữ"}</p>
                <p className="text-lg font-semibold text-slate-800">SDT: {targetCustomer?.phone}</p>
                <p className="text-lg font-semibold text-slate-800">Email: {targetCustomer?.email}</p>
            </div>

            <div>
                {targetCustomer && <ListAdress data={targetCustomer.lstAddress} />}
            </div>
        </div>
    )

}