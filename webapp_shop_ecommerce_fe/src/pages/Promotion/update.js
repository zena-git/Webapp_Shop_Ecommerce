import { Button, DatePicker, InputNumber, Input, Radio } from 'antd/lib';
import ReduxProvider from '~/redux/provider'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppSelector } from '~/redux/storage';
import axios from 'axios';
import { baseUrl, baseUrlV3 } from '~/lib/functional';
import ListDetailProduct from '~/components/promotion/ListDetailProduct'
import { set, toggleChildren } from '~/redux/features/promotion-selected-item'
import { ToastContainer, toast } from 'react-toastify';
import { IoArrowBackSharp } from "react-icons/io5";
const { TextArea } = Input

const { RangePicker } = DatePicker

function EditPage() {
    const dispatch = useDispatch();

    const path = useParams()

    const [targetPromotion, setTargetPromotion] = useState();

    const navigate = useNavigate();
    const [pending, setPending] = useState(false);
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
            axios.get(`${baseUrlV3}/promotion/data?id=${path.id}`).then(resp => {
                setTargetPromotion(resp.data);
                setName(resp.data.name);
                setValue(resp.data.value);
                setDescription(resp.data.description);
                setDate([dayjs(resp.data.startDate), dayjs(resp.data.endDate)])
                setCode(resp.data.code)

                resp.data.lstPromotionDetails.forEach((detail) => {
                    const t = res.data.find(product => {
                        return product.lstProductDetails.find(productDetail => productDetail.id == detail.productDetails.id)
                    })
                    dispatch(toggleChildren({ id: detail.productDetails.id, parentId: t.id, value: !detail.deleted }))
                })
            });
        });
    }, [dispatch, path.id]);

    const handleSubmitForm = () => {
        if (!pending) {
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
                setPending(true);
                axios.put(`${baseUrl}/promotion/${path.id}`, t).then(res => {
                    toast.success("cập nhật thành công");
                    setPending(false);
                    setTimeout(() => {
                        navigate(`/discount/promotion/detail/${targetPromotion.id}`)
                    }, 200)
                }).catch(err => {
                    setPending(false);
                    toast.error(err.response.data.message)
                })
            }
        }
    }

    return (
        <div>

            <div className='w-full flex max-lg:flex-col p-5 gap-5 bg-white'>
                <div className='w-2/5 max-lg:w-full flex flex-col gap-2 bg-slate-50 border rounded-md shadow-lg p-3'>
                    <div className='flex gap-2 items-center'>
                        <div className='text-lg cursor-pointer flex items-center' onClick={() => { navigate('/discount/promotion') }}><IoArrowBackSharp /></div>
                        <p className='ml-3 text-lg font-semibold'>Cập nhật đợt giảm giá</p>
                    </div>
                    <div className='h-[2px] bg-slate-600'></div>
                    <div className='flex flex-col gap-3  bg-slate-50 px-3 pb-3 rounded-lg pt-5'>
                        <label>
                            <p className='mb-1 text-sm text-slate-600'>Mã chương trình giảm giá</p>
                            <Input value={code} onChange={e => setCode(e)} />
                        </label>
                        <label>
                            <p className='mb-1 text-sm text-slate-600'>Tên chương trình giảm giá</p>
                            <Input value={name} onChange={e => { setName(e.target.value) }} />
                        </label>
                        <label>
                            <p className='mb-1 text-sm text-slate-600'>Giá trị giảm (%)</p>
                            <InputNumber min={0} className='w-full' value={value} onChange={e => { if (e) setValue(e) }} />
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
                        <Button onClick={() => { handleSubmitForm() }} type='primary' className='bg-blue-500'>
                            {'Cập nhật'}
                        </Button>
                    </div>
                </div>

                <div className='flex-grow bg-slate-50 p-3 rounded-lg h-fit flex flex-col gap-2 border'>
                    <p className='text-lg font-semibold'>Danh sách sản phẩm</p>
                    <div className='h-[2px] bg-slate-600'></div>
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