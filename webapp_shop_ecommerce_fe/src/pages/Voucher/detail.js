import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { nextUrl, baseUrl } from "../../lib/functional";
import { Tag } from "antd";
import ListDetailVoucher from '../../components/voucher/listDetailVoucher'

export default function VoucherDetail() {

    const path = useParams();

    const [targetVoucher, setTargetVoucher] = useState({
        name: "",
        code: "",
        usage_limit: 0,
        value: 0,
        discount_type: 0,
        order_min_value: 0,
        max_discount_value: 0,
        status: "",
        lstVoucherDetails: []
    });

    useEffect(() => {
        if (!path.id) return;
        axios.get(`${baseUrl}/voucher/${path.id}`).then(res => {
            setTargetVoucher(res.data);
        })
    }, [path])

    return (
        <div>
            <p className="text-4xl font-bold mb-3">Thông tin voucher</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <p className="text-lg font-semibold text-slate-800">Tên Voucher: {targetVoucher?.name}</p>
                <p className="text-lg font-semibold text-slate-800">Mã voucher: {targetVoucher?.code}</p>
                <p className="text-lg font-semibold text-slate-800">Giới hạn: {targetVoucher?.usage_limit || "Không có"}</p>
                <p className="text-lg font-semibold text-slate-800">Giá trị giảm: {targetVoucher?.value} {targetVoucher && targetVoucher.discount_type == 0 ? "đ" : "%"}</p>
                <p className="text-lg font-semibold text-slate-800">Giá trị đơn tối thiểu: {targetVoucher?.order_min_value}</p>
                {targetVoucher.discount_type == 1 && <p className="text-lg font-semibold text-slate-800">Mức giảm tối đa: {targetVoucher?.max_discount_value}</p>}
                <div className="flex items-center gap-1"><p className="text-lg font-semibold text-slate-800">Trạng thái: </p><Tag>{targetVoucher?.status}</Tag></div>
            </div>

            <div>
                <ListDetailVoucher data={targetVoucher.lstVoucherDetails} />
            </div>
        </div>
    )

}