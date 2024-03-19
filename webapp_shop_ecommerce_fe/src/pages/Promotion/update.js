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
const { TextArea } = Input

const { RangePicker } = DatePicker

function EditPage() {
    const dispatch = useDispatch();

    const path = useParams()

    const [targetPromotion, setTargetPromotion] = useState();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())]);

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
                setDate([dayjs(res.data.startDate), dayjs(res.data.endDate)])

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
            alert('chưa nhập tên chương trình')
        } else if (lst.length == 0) {
            alert('chưa chọn sản phẩm nào')
        } else if (value.toString().trim().length == 0) {
            alert('đặt mức giảm giá')
        } else {
            const t = {
                id: targetPromotion?.id,
                name: name,
                code: targetPromotion ? targetPromotion.code : "",
                status: 0,
                value: value,
                description: description,
                startDate: dayjs(date[0]).toDate(),
                endDate: dayjs(date[1]).toDate(),
                lstProductDetails: lst
            }

            axios.put(`${baseUrl}/promotion/${t.id}`, t).then(res => {
                alert(res.data.title)
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
                    <Input value={targetPromotion ? targetPromotion.code : ""} />
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
        </div>
    )

}


const Layout = (props) => {
    return (
        <ReduxProvider><EditPage></EditPage></ReduxProvider>
    )
}

export default Layout