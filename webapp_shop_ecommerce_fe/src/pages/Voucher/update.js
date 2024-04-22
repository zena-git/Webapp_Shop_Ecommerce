import { DatePicker, InputNumber, Button, Input, Radio } from 'antd/lib';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import { makeid } from '~/lib/functional';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAppSelector } from '../../redux/storage';
import ReduxProvider from '../../redux/provider'
import { zodResolver } from "@hookform/resolvers/zod"
import ListCustomer from '../../components/voucher/listCustomer'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set, updateSelected } from '../../redux/features/voucher-selected-item';
import { ToastContainer, toast } from 'react-toastify';
import { IoArrowBackSharp } from "react-icons/io5";

const { TextArea } = Input
const { RangePicker } = DatePicker

const formSchema = z.object({
    code: z.string().min(2, {
        message: "code must be at least 2 characters.",
    }),
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    value: z.number().min(1, {
        message: "value must be at least 1 characters.",
    }),
    target_type: z.number({
        required_error: "You need to select a target type.",
    }),
    discountType: z.number({
        required_error: "You need to select a discount type.",
    }),
    description: z.string(),
    order_min_value: z.number().min(4, {
        message: "min order must be at least 4 characters."
    }),
    max_discount_value: z.number().min(4, {
        message: "max dis must be at least 4 characters.",
    }),
    usage_limit: z.number()
})

const VoucherPage = () => {

    const path = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const selectedCustomer = useAppSelector(state => state.voucherReducer.value.selected)

    const [VoucherType, setVoucherType] = useState("0");

    const [targetVoucher, setTargetVoucher] = useState();

    const [discountType, setDiscountType] = useState(false);
    const [listCustomer, setListCustomer] = useState([]);

    const [pending, setPending] = useState(false);

    useEffect(() => {
        axios.get(`${baseUrl}/customer`).then(res => { setListCustomer(res.data) })
    }, [])


    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())]);

    useEffect(() => {
        if (path && path.id) {
            axios.get(`${baseUrl}/voucher/${path.id}`).then(res => {
                setTargetVoucher(res.data);
                setDate([dayjs(res.data.startDate), dayjs(res.data.endDate)])
                setDiscountType(res.data.discountType == "0");
                res.data.lstVoucherDetails.map(detail => {
                    dispatch(updateSelected({ id: Number.parseInt(detail.customer.id), selected: true, disable: detail.status }))
                })
            });
        }
    }, [dispatch, path])

    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                code: targetVoucher ? targetVoucher.code : makeid(),
                name: targetVoucher ? targetVoucher.name : "",
                description: targetVoucher ? targetVoucher.description : "",
                discountType: targetVoucher ? targetVoucher.discountType : 0,
                max_discount_value: targetVoucher ? targetVoucher.max_discount_value : 0,
                order_min_value: targetVoucher ? targetVoucher.order_min_value : 0,
                target_type: targetVoucher ? targetVoucher.target_type : 0,
                usage_limit: targetVoucher ? targetVoucher.usage_limit : 0,
                value: targetVoucher ? targetVoucher.value : 0
            },
            mode: 'all',
            values: {
                code: targetVoucher ? targetVoucher.code : makeid(),
                name: targetVoucher ? targetVoucher.name : "",
                description: targetVoucher ? targetVoucher.description : "",
                discountType: targetVoucher ? targetVoucher.discountType : 0,
                max_discount_value: targetVoucher ? targetVoucher.maxDiscountValue : 0,
                order_min_value: targetVoucher ? targetVoucher.orderMinValue : 0,
                target_type: targetVoucher ? targetVoucher.target_type : 0,
                usage_limit: targetVoucher ? targetVoucher.quantity : 0,
                value: targetVoucher ? targetVoucher.value : 0
            }
        }
    )

    const handleSubmitForm = (values) => {
        if (targetVoucher.status == 0) {
            if (!pending) {
                if (date[0].toDate() < new Date() || date[1].toDate() < new Date()) {
                    toast.error('cần nhập giá trị ngày trong tương lai')
                    return;
                }
                if (VoucherType == "0") {
                    setPending(true);
                    axios.put(`${baseUrl}/voucher/${path.id}`, {
                        id: path.id,
                        code: values.code,
                        name: values.name,
                        value: values.value,
                        status: "0",
                        quantity: values.usage_limit,
                        discountType: discountType ? 0 : 1,
                        maxDiscountValue: values.max_discount_value,
                        orderMinValue: values.order_min_value,
                        description: values.description,
                        startDate: date[0].add(7, 'hour').toDate(),
                        endDate: date[1].add(7, 'hour').toDate(),
                        lstCustomer: listCustomer.map(val => { return val.id })
                    }).then(r => {
                        toast.success("Đã cập nhật voucher thành công");
                        setPending(false);
                        setTimeout(() => {
                            navigate(`/discount/voucher/detail/${path.id}`)
                        }, 200)
                    }).catch(err => {
                        toast.error(err.response.data.message);
                        setPending(false);
                    })
                } else {
                    if (selectedCustomer.length > 0) {
                        setPending(true);
                        axios.put(`${baseUrl}/voucher/${path.id}`, {
                            id: path.id,
                            code: values.code,
                            name: values.name,
                            value: values.value,
                            status: "0",
                            quantity: values.usage_limit,
                            discountType: discountType ? 0 : 1,
                            maxDiscountValue: values.max_discount_value,
                            description: values.description,
                            orderMinValue: values.order_min_value,
                            startDate: date[0].add(7, 'hour').toDate(),
                            endDate: date[1].add(7, 'hour').toDate(),
                            lstCustomer: selectedCustomer.filter(t => { return t.selected }).map(val => { return val.id })
                        }).then(res => {
                            setPending(false);
                            setTimeout(() => {
                                navigate(`/discount/voucher/detail/${path.id}`)
                            }, 200)
                        }).catch(err => {
                            toast.error(err.response.data.message);
                            setPending(false);
                        })
                    } else {
                        toast({ title: 'chưa chọn khách hàng nào' })
                        toast.error("chưa chọn khách hàng nào")
                    }
                }
            }

        }else{
            toast.error('Phiếu giảm giá đã diễn ra không thể chỉnh sửa')
        }
    }

    return (
        <>
            <div className="">
                <div>
                    <div className='w-full flex max-xl:flex-col justify-center p-5 gap-5'>
                        <div className='bg-white p-5 shadow-lg flex flex-col gap-3 w-5/12 max-xl:w-full'>
                            <div className='flex gap-2 items-center'>
                                <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/discount/voucher') }}><IoArrowBackSharp /></div>
                                <p className='ml-3 text-2xl font-semibold'>Cập nhật phiếu giảm giá</p>
                            </div>
                            <div className='h-[2px] bg-slate-600'></div>
                            <Form {...form}>
                                <form onSubmit={e => { e.preventDefault() }} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã phiếu giảm giá</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="code" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên phiếu giảm giá</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='grid grid-cols-2 gap-3'>
                                        <FormField
                                            control={form.control}
                                            name="value"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabel>Gía trị giảm</FormLabel>
                                                    <FormControl>
                                                        <InputNumber max={!discountType ? 100 : null} className='w-full' {...field} addonAfter={discountType ? "đ" : "%"} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="usage_limit"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabel>Giới hạn số lượng</FormLabel>
                                                    <FormControl>
                                                        <InputNumber className='w-full' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>

                                    <div className='grid grid-cols-2 gap-3'>
                                        {targetVoucher && <FormField
                                            control={form.control}
                                            name="discountType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hình thức giảm giá</FormLabel>
                                                    <FormControl>
                                                        <Radio.Group name="radiogroup" defaultValue={discountType ? "0" : "1"} onChange={e => setDiscountType(e.target.value == '0')}>
                                                            <Radio value={"0"}>Giảm giá trực tiếp</Radio>
                                                            <Radio value={"1"}>Giảm giá %</Radio>
                                                        </Radio.Group>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        }
                                        {!discountType
                                            &&
                                            targetVoucher &&
                                            <FormField
                                                control={form.control}
                                                name="max_discount_value"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mức giảm tối đa</FormLabel>
                                                        <FormControl>
                                                            <InputNumber addonAfter="đ" value={targetVoucher.maxDiscountValue} onChange={value => { setTargetVoucher(prev => { return { ...prev, maxDiscountValue: value } }) }} className='w-full' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        }
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="order_min_value"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel>Gía trị đơn tối thiểu</FormLabel>
                                                <FormControl>
                                                    <InputNumber className='w-full' {...field} addonAfter="đ" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {targetVoucher && <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <TextArea value={targetVoucher.description} onChange={e => setTargetVoucher(prev => { return { ...prev, description: e.target.value } })} placeholder="mô tả" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    }
                                    <div>
                                        <p className='my-1 text-xl font-semibold'>Đối tượng áp dụng</p>
                                        <Radio.Group name="radiogroup" defaultValue={"0"} value={VoucherType} onChange={e => setVoucherType(e.target.value)}>
                                            <Radio value={"0"}>Tất cả khách hàng</Radio>
                                            <Radio value={"1"}>Khách hàng chỉ định</Radio>
                                        </Radio.Group>
                                    </div>

                                    <div className='mt-1'>
                                        <label>
                                            <p className='mb-1 text-xl text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                                            {/* @ts-ignore */}
                                            <RangePicker className='w-full' value={date} onChange={(val) => { if (val) { setDate(val) } }} showTime />
                                        </label>
                                    </div>
                                    <div className='flex gap-4'>
                                        <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Cập nhật</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                        <div className='flex-grow p-5 bg-white shadow-lg flex flex-col gap-3'>
                            <p className='text-2xl font-semibold'>Danh sách khách hàng</p>
                            <div className='h-[2px] bg-slate-600'></div>
                            <ListCustomer listCustomer={listCustomer} />
                        </div>
                        <ToastContainer />
                    </div>

                </div>
            </div>
        </>
    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><VoucherPage></VoucherPage></ReduxProvider>
    )
}

export default Layout