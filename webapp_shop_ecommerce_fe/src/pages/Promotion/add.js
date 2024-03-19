'use client'
import { Button, DatePicker, InputNumber } from 'antd/lib';
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { baseUrl, makeid } from '~/lib/functional';
import { redirect, useNavigate } from 'react-router-dom';
import ListDetailProduct from '~/components/promotion/ListDetailProduct'
import { useAppSelector } from '~/redux/storage';
import ReduxProvider from '~/redux/provider'
import { useDispatch } from 'react-redux';
import { set, updateSelected } from '~/redux/features/promotion-selected-item'
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
const { RangePicker } = DatePicker
function EditPage() {

    const [name, setName] = useState("");
    const [code, setCode] = useState(makeid());
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())]);

    const [PromotionType, setPromotionType] = useState("0");

    const navigate = useNavigate();

    const [listProduct, setListProduct] = useState([]);
    useEffect(() => {
        axios.get(`${baseUrl}/product`).then(res => { setListProduct(res.data) });
    }, [])

    const listSelectedProduct = useAppSelector(state => state.promotionReducer.value.selected)

    const handleSubmitForm = () => {
        let lst = []
        listSelectedProduct.map(value => {
            value.children.map(child => {
                if (child.selected) { lst.push(child.id) }
            })
        })
        if (!date) {

        } else if (name.trim().length == 0) {
            alert('chưa nhập tên chương trình')
        } else if (PromotionType == "1" && lst.length == 0) {
            alert('chưa chọn sản phẩm nào')
        } else if (value.toString().trim().length == 0) {
            alert('đặt mức giảm giá')
        } else {
            let t = [];
            listProduct.map(pro => {
                t.push(...pro.lstProductDetails.map(detail => detail.id))
            })
            axios.post(`${baseUrl}/promotion`, {
                status: 0,
                value: value,
                code: code,
                name: name,
                description: description,
                startDate: dayjs(date[0]).toDate(),
                endDate: dayjs(date[1]).toDate(),
                lstProductDetails: PromotionType == "0" ? t : lst
            }).then(res => {
                alert('Thêm thành công')
                navigate(`/promotion?id=${res.data.data.id}`)
            })
        }
    }

    return (
        <div className='w-full flex flex-col p-5 gap-5'>
            <div className='flex flex-col gap-3 w-full'>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Tên chương trình giảm giá</p>
                    <Input value={name} onChange={e => { setName(e.target.value) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Mã chương trình giảm giá</p>
                    <Input disabled value={code} onChange={e => { setCode(e.target.value) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Giá trị giảm (d)</p>
                    <InputNumber min={0} className='w-full' value={value} onChange={e => { if (e) setValue(e) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Mô tả</p>
                    <Textarea value={description} onChange={e => { setDescription(e.target.value) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Đối tượng áp dụng</p>
                    <RadioGroup value={PromotionType} onValueChange={e => setPromotionType(e)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="option-one" />
                            <Label htmlFor="option-one">Tất cả sản phẩm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-two" />
                            <Label htmlFor="option-two">Sản phẩm chỉ định</Label>
                        </div>
                    </RadioGroup>
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                    <RangePicker className='w-full' value={date} onChange={(val) => { setDate(val) }} showTime />
                </label>
                <Button onClick={() => { handleSubmitForm() }} type='primary' className='bg-blue-500'>
                    {'Thêm mới đợt giảm giá'}
                </Button>
            </div>
            <div className='w-full'>
                <ListDetailProduct data={listProduct} />
            </div>
        </div>
    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><EditPage></EditPage></ReduxProvider>
    )
}

export default Layout