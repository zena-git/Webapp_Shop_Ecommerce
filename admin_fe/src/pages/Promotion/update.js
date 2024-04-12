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
        axios.get(`${baseUrl}/product`).then(res => {
            setListProduct(res.data);
            let temp = []
            res.data.forEach(product => {
                temp.push(
                    {
                        id: product.id,
                        selected: false,
                        children: product.lstProductDetails.map(proDetail => {
                            return {
                                id: proDetail.id,
                                selected: false
                            }
                        })
                    }
                )
            });
            dispatch(set({ value: { selected: temp } }));
            axios.get(`${nextUrl}/promotion/data?id=${path.id}`).then(resp => {
                setTargetPromotion(resp.data);
                setName(resp.data.name);
                setValue(resp.data.value);
                setDescription(resp.data.description);
                setDate([dayjs(resp.data.start_date), dayjs(resp.data.end_date)])
                setCode(resp.data.code_promotion)

                resp.data.PromotionDetails.forEach((detail) => {
                    dispatch(toggleChildren({ id: detail.ProductDetail.id, parentId: detail.ProductDetail.product_id, value: true }))
                })

            });
        });
    }, [dispatch, path.id]);

    useEffect(() => {
        console.log(listSelectedProduct)
    }, [listSelectedProduct])

    const handleSubmitForm = () => {

        let lst = []
        listSelectedProduct.map(value => {
            value.children.map(child => {
                if (child.selected) { lst.push(child.id) }
            })
        })
        if (!date[0] || !date[1] || dayjs(date[0]).toDate().getTime() < new Date().getTime() || dayjs(date[1]).toDate().getTime() < new Date().getTime()) {
            toast.error("ngày bắt đầu hoặc kết thúc phải là tương lai")
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

            axios.post(`${nextUrl}/promotion/update`, t).then(res => {
                toast.success("cập nhật thành công");
                navigate(`/discount/promotion/detail/${targetPromotion.id}`)
            }).catch(err => {
                toast.error(err)
            })
        }
    }

    return (
        <div>
            <p className='my-1 ml-5 text-lg font-bold'>Cập nhật đợt giảm giá</p>
            <div className='w-full flex max-lg:flex-col p-5 gap-5'>
                <div className='flex flex-col gap-3 w-2/5 max-lg:w-full bg-slate-50 px-3 pb-3 rounded-lg pt-5'>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Mã chương trình giảm giá</p>
                        <Input value={code} onChange={e => setCode(e)} />
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Tên chương trình giảm giá</p>
                        <Input value={name} onChange={e => { setName(e.target.value) }} />
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
                <div className='flex-grow bg-slate-50 px-3 rounded-lg h-fit'>
                    <ListDetailProduct data={listProduct} />
                </div>
                <ToastContainer />
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