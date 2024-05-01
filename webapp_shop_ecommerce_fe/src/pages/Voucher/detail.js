import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../lib/functional";
import { Tag, Button } from "antd";
import ListDetailVoucher from '../../components/voucher/listDetailVoucher'
import { IoArrowBackSharp } from "react-icons/io5";

export default function VoucherDetail() {

    const path = useParams();
    const navigate = useNavigate();

    const [targetVoucher, setTargetVoucher] = useState({
        name: "",
        code: "",
        quantity: 0,
        value: 0,
        discountType: 0,
        orderMinValue: 0,
        maxDiscountValue: 0,
        status: 0,
        lstVoucherDetails: []
    });

    useEffect(() => {
        if (!path.id) return;
        axios.get(`${baseUrl}/voucher/${path.id}`).then(res => {
            setTargetVoucher({ ...res.data, lstVoucherDetails: res.data.lstVoucherDetails.filter(target => !target.deleted) });
        })
    }, [path])

    return (
        <div className="flex flex-col gap-5 bg-white px-5 py-3">
            <div className="flex justify-between items-center">
                <div className='flex gap-2 items-center'>
                    <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/discount/voucher') }}><IoArrowBackSharp /></div>
                    <p className="text-2xl font-semibold">Thông tin voucher {targetVoucher.code}</p>
                </div>
                <Button type="primary" variant="outline" onClick={() => { navigate(`/discount/voucher/update/${targetVoucher.id}`) }}>Chỉnh sửa</Button>
            </div>
            <div className='h-[2px] bg-slate-600'></div>
            <div className="grid grid-cols-2 grid-rows-2 grid-flow-row gap-3 bg-slate-50 p-6 pt-2 rounded-md shadow-lg">
                <p className="text-2xl font-semibold text-slate-800">Tên voucher:</p>
                <p className="text-2xl font-semibold text-slate-800">{targetVoucher?.name}</p>
                <p className="text-2xl font-semibold text-slate-800">Mã voucher:</p>
                <p className="text-2xl font-semibold text-slate-800">{targetVoucher?.code}</p>
                <p className="text-2xl font-semibold text-slate-800">Số lượng:</p>
                <p className="text-2xl font-semibold text-slate-800">{targetVoucher?.quantity || "Không có"}</p>
                <p className="text-2xl font-semibold text-slate-800">Giá trị giảm:</p>
                <p className="text-2xl font-semibold text-slate-800">{targetVoucher.discountType == 0 ? numberToPrice(targetVoucher?.value) : targetVoucher?.value + "%"}</p>
                {targetVoucher?.orderMinValue && <p className="text-2xl font-semibold text-slate-800">Giá trị đơn tối thiểu: </p>}
                {targetVoucher?.orderMinValue && <p className="text-2xl font-semibold text-slate-800">{numberToPrice(targetVoucher?.orderMinValue)}</p>}
                {targetVoucher.discountType == 1 && <p className="text-2xl font-semibold text-slate-800">Mức giảm tối đa:</p>}
                {targetVoucher.discountType == 1 && <p className="text-2xl font-semibold text-slate-800">{numberToPrice(targetVoucher?.maxDiscountValue)}</p>}
                <p className="text-2xl font-semibold text-slate-800">Trạng thái: </p>
                <p className="text-2xl font-semibold text-slate-800"><Tag
                    color={targetVoucher?.status == "0" ? "blue" : targetVoucher?.status == "1" ? "green" : targetVoucher?.status == "2" ? "gold" : "red"}
                >{targetVoucher?.status == 0 ? 'Sắp diễn ra' : targetVoucher.status == 1 ? 'Đang diễn ra' : targetVoucher.status == 2 ? 'Đã kết thúc' : 'Đã hủy'}</Tag></p>
                <p className="text-2xl font-semibold text-slate-800">Ngày bắt đầu:</p>
                <p className="text-2xl font-semibold text-slate-800">{targetVoucher?.startDate?.split("T")[1].split(".")[0] + " " + targetVoucher?.startDate?.split("T")[0].split(".")[0]}</p>
                <p className="text-2xl font-semibold text-slate-800">Ngày kết thúc:</p>
                <p className="text-2xl font-semibold text-slate-800">{targetVoucher?.endDate?.split("T")[1].split(".")[0] + " " + targetVoucher?.endDate?.split("T")[0].split(".")[0]}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-md shadow-lg flex flex-col gap-2">
                <p>Danh sách khách hàng</p>
                <div className="h-[2px] bg-slate-600"></div>
                <ListDetailVoucher data={targetVoucher.lstVoucherDetails} />
            </div>
        </div>
    )

}

const numberToPrice = (value) => {
    const formattedAmount = Number.parseFloat(value.toString()).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return formattedAmount;
}