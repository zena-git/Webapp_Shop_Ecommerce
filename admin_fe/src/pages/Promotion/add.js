import { DatePicker, InputNumber, Button } from 'antd/lib';
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { baseUrl, makeid, nextUrl } from '~/lib/functional';
import { redirect, useNavigate } from 'react-router-dom';
import ListDetailProduct from '~/components/promotion/ListDetailProduct'
import { useAppSelector } from '~/redux/storage';
import ReduxProvider from '~/redux/provider'
import { useDispatch } from 'react-redux';
import { set, updateSelected, disableChildren } from '~/redux/features/promotion-selected-item'
import { setDateRange } from '../../redux/features/promotion-date-selected'
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
// import { Button } from '../../components/ui/button'
import { ToastContainer, toast } from 'react-toastify';
const { RangePicker } = DatePicker
function EditPage() {

    const [name, setName] = useState("");
    const [code, setCode] = useState(makeid());
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())]);

    const [PromotionType, setPromotionType] = useState("0");

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [listProduct, setListProduct] = useState([]);


    const recheck = () => {
        let canSelectedProductDetail = listProduct.map(product => {
            return {
                id: product.id,
                productDetail: product.ProductDetail.filter(detail => {
                    return !detail.PromotionDetails.some(promotionDetail => {
                        return (
                            dayjs(promotionDetail.Promotion.start_date).toDate() >= date[0].toDate() &&
                            dayjs(promotionDetail.Promotion.end_date).toDate() <= date[1].toDate()
                        );
                    });
                })
            }
        })

        canSelectedProductDetail.map(pro => {
            pro.productDetail.map(proDetail => {
                dispatch(disableChildren(
                    {
                        parentId: pro.id,
                        id: proDetail.id,
                        disable: false,
                    }
                ))
            })
        })
    }

    useEffect(() => {
        axios.get(`${nextUrl}/product`).then(res => {
            setListProduct(res.data);
            dispatch(set({
                value: {
                    selected: res.data.map(pro => {
                        return {
                            id: pro.id, selected: false, disable: true, children: pro.ProductDetail.map(detail => {
                                return { id: detail.id, selected: false, disable: true }
                            })
                        }
                    })
                }
            }))
            recheck()
        });
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
            toast.error('chưa nhập tên chương trình')
        } else if (PromotionType == "1" && lst.length == 0) {
            toast.error('chưa chọn sản phẩm nào')
        } else if (value.toString().trim().length == 0) {
            toast.error('đặt mức giảm giá')
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
                toast.success('Thêm thành công')
                setValue("");
                setCode(makeid());
                setName("");
                setDescription("");
                // navigate(`/discount/promotion`)
            })
        }
    }

    useEffect(() => {
        setDateRange({ value: { date: { startDate: date[0].toDate().toISOString(), endDate: date[1].toDate().toISOString() } } });
        recheck();
    }, [date])

    useEffect(() => {
        console.log(listSelectedProduct)
    }, [listSelectedProduct])

    return (
        <div>
            <p className='my-1 ml-5 text-lg font-bold'>Thêm mới đợt giảm giá</p>
            <div className='w-full flex max-lg:flex-col p-5 gap-5'>
                <div className='flex flex-col gap-3 w-2/5 max-lg:w-full bg-slate-50 px-3 pb-3 rounded-lg'>
                    <ToastContainer />
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Mã chương trình giảm giá</p>
                        <Input value={code} onChange={e => { setCode(e.target.value) }} />
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
                        <Textarea value={description} onChange={e => { setDescription(e.target.value) }} />
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Đối tượng áp dụng</p>
                        <RadioGroup value={PromotionType} onValueChange={e => setPromotionType(e)}>
                            <div className='flex gap-3'>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="0" id="option-one" />
                                    <Label htmlFor="option-one">Tất cả sản phẩm</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id="option-two" />
                                    <Label htmlFor="option-two">Sản phẩm chỉ định</Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                        <RangePicker className='w-full' value={date} onChange={(val) => { setDate(val) }} showTime />
                    </label>
                    <Button className='mt-3' type='primary' onClick={() => { handleSubmitForm() }}>
                        {'Thêm mới đợt giảm giá'}
                    </Button>
                </div>
                <div className='flex-grow bg-slate-50 px-3 rounded-lg h-fit'>
                    <ListDetailProduct data={listProduct} />
                </div>

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