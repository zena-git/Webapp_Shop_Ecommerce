import { Button, Space, Table, Tag, Form, Checkbox, DatePicker, InputNumber, Input } from 'antd/lib';
import ReduxProvider from '~/redux/provider'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, redirect, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { useAppSelector } from '~/redux/storage';
import axios from 'axios';
import { baseUrl, nextUrl } from '~/lib/functional';
import ListDetailProduct from '~/components/promotion/ListDetailProduct'
import { set, updateSelected, toggleChildren } from '~/redux/features/promotion-selected-item'
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { ToastContainer, toast } from 'react-toastify';
const { TextArea } = Input

const { RangePicker } = DatePicker

function EditPage() {
    const dispatch = useDispatch();

    const path = useParams()

    const [targetPromotion, setTargetPromotion] = useState();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())]);
    const [PromotionType, setPromotionType] = useState("0");

    const [listProduct, setListProduct] = useState([]);
    const listSelectedProduct = useAppSelector(state => state.promotionReducer.value.selected)


    useEffect(() => {
        console.log(listSelectedProduct)
    }, [listSelectedProduct])

    useEffect(() => {
        axios.get(`${baseUrl}/product`).then(res => { setListProduct(res.data) });
    }, [])

    useEffect(() => {
        if (path && path.id) {
            axios.get(`${nextUrl}/promotion/data?id=${path.id}`).then(res => {
                setTargetPromotion(res.data);
                setName(res.data.name);
                setValue(res.data.value);
                setDescription(res.data.description);
                setDate([dayjs(res.data.start_date), dayjs(res.data.end_date)])
                setCode(res.data.code_promotion)

                res.data.PromotionDetails.map((detail) => {
                    dispatch(toggleChildren({ id: detail.ProductDetail.id, targetParent: detail.ProductDetail.product_id, selected: true }))
                })

            });
        }
    }, [path])


    const handleSubmitForm = () => {

        let lst = []
        listSelectedProduct.map(value => {
            value.children.map(child => {
                if (child.selected) { lst.push(child.id) }
            })
        })
        if (!date) {

        } else if (name.trim().length == 0) {
            toast.error('chưa nhập tên chương trình')
        } else if (PromotionType == "1" && lst.length == 0) {
            toast.error('chưa chọn sản phẩm nào')
        } else if (value.toString().trim().length == 0) {
            toast.error('đặt mức giảm giá')
        } else {
            let allPro = [];
            listProduct.map(pro => {
                allPro.push(...pro.lstProductDetails.map(detail => detail.id))
            })
            const t = {
                id: path.id,
                name: name,
                code: code,
                status: 0,
                value: value,
                description: description,
                startDate: dayjs(date[0]).toDate(),
                endDate: dayjs(date[1]).toDate(),
                lstProductDetails: PromotionType == "0" ? allPro : lst
            }

            axios.put(`${baseUrl}/promotion/${t.id}`, t).then(res => {
                toast.success("cập nhật thành công");
                navigate(`/discount/promotion/detail/${targetPromotion.id}`)
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
                    <Input value={code} onChange={e => setCode(e)} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Giá trị giảm (d)</p>
                    <InputNumber min={0} className='w-full' value={value} onChange={e => { if (e) setValue(e) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Mô tả</p>
                    <TextArea value={description} onChange={e => { setDescription(e.target.value) }} />
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
                    {'Cập nhật'}
                </Button>
            </div>
            <div className='w-full'>
                <ListDetailProduct data={listProduct} />
            </div>
            <ToastContainer />
        </div>
    )

}


const Layout = (props) => {
    return (
        <ReduxProvider><EditPage></EditPage></ReduxProvider>
    )
}

export default Layout