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
        <div className="flex flex-col gap-5">
            <p className="text-3xl font-semibold mb-3">Thông tin voucher {targetVoucher.code}</p>

            <div className="grid grid-cols-2 grid-rows-2 grid-flow-row gap-2 bg-white p-6 rounded-md shadow-lg">
                <p className="text-lg font-semibold text-slate-800">Tên Voucher:</p>
                <p className="text-lg font-semibold text-slate-800">{targetVoucher?.name}</p>
                <p className="text-lg font-semibold text-slate-800">Mã voucher:</p>
                <p className="text-lg font-semibold text-slate-800">{targetVoucher?.code}</p>
                <p className="text-lg font-semibold text-slate-800">Giới hạn:</p>
                <p className="text-lg font-semibold text-slate-800">{targetVoucher?.usage_limit || "Không có"}</p>
                <p className="text-lg font-semibold text-slate-800">Giá trị giảm:</p>
                <p className="text-lg font-semibold text-slate-800">{targetVoucher?.value} {targetVoucher && targetVoucher.discount_type == 0 ? "đ" : "%"}</p>
                {targetVoucher?.order_min_value && <p className="text-lg font-semibold text-slate-800">Giá trị đơn tối thiểu: </p>}
                {targetVoucher?.order_min_value && <p className="text-lg font-semibold text-slate-800">{targetVoucher?.order_min_value}</p>}
                {targetVoucher.discount_type == 1 && <p className="text-lg font-semibold text-slate-800">Mức giảm tối đa:</p>}
                {targetVoucher.discount_type == 1 && <p>{targetVoucher?.max_discount_value}</p>}
                <p className="text-lg font-semibold text-slate-800">Trạng thái: </p>
                <p className="text-lg font-semibold text-slate-800"><Tag color='blue'>{targetVoucher?.status == 0 ? 'Sắp diễn ra' : targetVoucher.status == 1 ? 'Đang diễn ra' : 'Đã kết thúc'}</Tag></p>
            </div>

            <div className="bg-white p-6 rounded-md shadow-lg">
                <ListDetailVoucher data={targetVoucher.lstVoucherDetails} />
            </div>
        </div>
    )

}