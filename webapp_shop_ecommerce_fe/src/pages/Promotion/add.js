import { DatePicker, InputNumber, Button, Input, Radio } from 'antd/lib';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl, makeid } from '~/lib/functional';
import { useNavigate } from 'react-router-dom';
import ListDetailProduct from '~/components/promotion/ListDetailProduct'
import { useAppSelector } from '~/redux/storage';
import ReduxProvider from '~/redux/provider'
import { useDispatch } from 'react-redux';
import { set } from '~/redux/features/promotion-selected-item'
import { ToastContainer, toast } from 'react-toastify';
import { IoArrowBackSharp } from "react-icons/io5";

const { TextArea } = Input
const { RangePicker } = DatePicker

function EditPage() {
    const [pending, setPending] = useState(false);
    const [name, setName] = useState("");
    const [code, setCode] = useState(makeid());
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())]);

    const [PromotionType, setPromotionType] = useState("0");

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [listProduct, setListProduct] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/product`).then(res => {
            setListProduct(res.data);
            dispatch(set({
                value: {
                    selected: res.data.map(product => {
                        return {
                            id: product.id,
                            selected: false,
                            children: product.lstProductDetails.map(detail => {
                                return {
                                    id: detail.id,
                                    selected: false,
                                }
                            })
                        }
                    }
                    )
                }
            }))
        });
    }, [])

    const listSelectedProduct = useAppSelector(state => state.promotionReducer.value.selected)

    const handleSubmitForm = () => {
        if (!pending) {
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
            } else if (value > 100) {
                toast.error('giá trị giảm không thể quá 100%')
            } else {
                setPending(true);
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
                    toast.success('Thêm thành công');
                    setPending(false);
                    setValue("");
                    setCode(makeid());
                    setName("");
                    setDescription("");
                }).catch(err => {
                    setPending(false);
                    toast.error(err.response.data.message)
                })
            }
        }
    }

    return (
        <div>
            <div className='w-full flex max-lg:flex-col py-5 gap-5 bg-white'>
                <ToastContainer />
                <div className='flex flex-col gap-3 w-2/5 max-lg:w-full bg-slate-50 px-3 py-3 rounded-lg border'>
                    <div className='flex gap-2 items-center'>
                        <div className='text-lg cursor-pointer' onClick={() => { navigate('/discount/promotion') }}><IoArrowBackSharp /></div>
                        <p className='ml-3 text-lg font-semibold'>Thêm mới sự kiện giảm giá</p>
                    </div>
                    <div className='relative after:w-full after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-slate-600'></div>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Mã chương trình giảm giá</p>
                        <Input value={code} onChange={e => { setCode(e.target.value) }} />
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Tên chương trình giảm giá</p>
                        <Input value={name} onChange={e => { setName(e.target.value) }} />
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Giá trị giảm (%)</p>
                        <InputNumber min={0} max={100} className='w-full' value={value} onChange={e => { if (e) setValue(e) }} />
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Mô tả</p>
                        <TextArea value={description} onChange={e => { setDescription(e.target.value) }} />
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Đối tượng áp dụng</p>
                        <Radio.Group name="radiogroup" defaultValue={"0"} value={PromotionType} onChange={e => setPromotionType(e.target.value)}>
                            <Radio value={"0"}>Tất cả sản phẩm</Radio>
                            <Radio value={"1"}>Sản phẩm chỉ định</Radio>
                        </Radio.Group>
                    </label>
                    <label>
                        <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                        <RangePicker className='w-full' value={date} onChange={(val) => { setDate(val) }} showTime />
                    </label>
                    <Button className='mt-3' type='primary' onClick={() => { handleSubmitForm() }}>
                        {'Thêm mới đợt giảm giá'}
                    </Button>
                </div>
                <div className='flex-grow bg-slate-50 px-3 py-3 rounded-lg h-fit flex flex-col gap-3 border'>
                    <p className='text-lg font-semibold'>Danh sách sản phẩm</p>
                    <div className='relative after:w-full after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-slate-600'></div>
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