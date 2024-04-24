import { DatePicker, InputNumber, Button, Radio, Input } from 'antd/lib';
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
import { useDispatch } from 'react-redux';
import { set } from '../../redux/features/voucher-selected-item';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";

const { RangePicker } = DatePicker
const { TextArea } = Input

const formSchema = z.object({
    code: z.string().min(2, {
        message: "mã tối thiểu phải có 2 ký tự",
    }),
    name: z.string().min(2, {
        message: "tên tối thiểu phải có 2 ký tự",
    }),
    value: z.number().min(1, {
        message: "giá trị tối thiểu là 1 ký tự",
    }),
    target_type: z.number({
        required_error: "cần lựa chọn 1 loại hình thức",
    }),
    discountType: z.number({
        required_error: "cần lựa chọn 1 loại hình thức",
    }),
    description: z.string(),
    order_min_value: z.number().min(4, {
        message: "phải có tối thiểu 4 ký tự"
    }),
    max_discount_value: z.number().min(4, {
        message: "phải có tối thiểu 4 ký tự",
    }),
    usage_limit: z.number()
})

const VoucherPage = () => {

    const navigate = useNavigate();
    const selectedCustomer = useAppSelector(state => state.voucherReducer.value.selected)

    const [VoucherType, setVoucherType] = useState("0");

    const [discountType, setDiscountType] = useState(false);
    const [listCustomer, setListCustomer] = useState([]);

    const [pending, setPending] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(set({ value: { selected: [] } }))
    }, [])

    useEffect(() => {
        axios.get(`${baseUrl}/customer`).then(res => { setListCustomer(res.data) })
    }, [])

    const [date, setDate] = useState([dayjs(new Date()), dayjs(new Date())]);

    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                code: makeid(),
                name: "",
                description: "",
                discountType: 0,
                max_discount_value: 0,
                order_min_value: 0,
                target_type: 0,
                usage_limit: 0,
                value: 0
            },
            mode: 'all'
        }
    )

    useEffect(() => {
        setDate([dayjs(Date.now()), dayjs(Date.now())])
    }, [])

    const handleSubmitForm = (values) => {
        if (!pending) {
            if (date[0].toDate() < new Date() || date[1].toDate() < new Date()) {
                toast.error('cần nhập giá trị ngày trong tương lai')
                return;
            }
            if (!discountType && values.value > 100) {
                toast.error('mức giảm không quá 100% được');
                return;
            }
            if (VoucherType == "0") {
                setPending(true);
                axios.post(`${baseUrl}/voucher`, {
                    code: values.code,
                    name: values.name,
                    value: values.value,
                    status: "0",
                    target_type: values.target_type,
                    quantity: values.usage_limit,
                    discountType: discountType ? 0 : 1,
                    maxDiscountValue: discountType ? values.value : values.max_discount_value,
                    orderMinValue: values.order_min_value,
                    description: values.description,
                    startDate: date[0].add(7, 'hour').toDate(),
                    endDate: date[1].add(7, 'hour').toDate(),
                    lstCustomer: listCustomer.map(val => { return val.id })
                }).then(res => {
                    setPending(false);
                    toast.success("Đã tạo voucher thành công")
                    form.reset();
                    dispatch(set({ value: { selected: [] } }));
                    setTimeout(() => {
                        navigate('/discount/voucher');
                    }, 2000)
                }).catch(err => {
                    setPending(false);
                    toast.error(err.response.data.message)
                });
            } else {
                if (selectedCustomer.length > 0) {
                    setPending(true);
                    axios.post(`${baseUrl}/voucher`, {
                        code: values.code,
                        name: values.name,
                        value: values.value,
                        status: "0",
                        target_type: values.target_type,
                        quantity: values.usage_limit,
                        discountType: discountType ? 0 : 1,
                        maxDiscountValue: discountType ? values.value : values.max_discount_value,
                        orderMinValue: values.order_min_value,
                        description: values.description,
                        startDate: date[0].add(7, 'hour').toDate(),
                        endDate: date[1].add(7, 'hour').toDate(),
                        lstCustomer: selectedCustomer.filter(t => { return t.selected }).map(val => { return val.id })
                    }).then(res => {
                        setPending(false);
                        toast.success("Đã tạo voucher thành công")
                        dispatch(set({ value: { selected: [] } }))
                        form.reset();
                        setTimeout(() => {
                            navigate('/discount/voucher');
                        }, 2000)
                    }).catch(err => {
                        setPending(false);
                        toast.error(err.response.data.message)
                    })
                } else {
                    toast.error("chưa chọn khách hàng nào")
                }
            }
        }
    }

    return (
        <>
            <div className="">
                <div className=''>
                    <div className='w-full h-fit flex max-xl:flex-col justify-center gap-3'>
                        <div className='px-3 py-5 h-fit bg-white shadow-lg gap-2 flex flex-col w-5/12 max-xl:w-full'>
                            <div className='flex gap-2 items-center'>
                                <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/discount/voucher') }}><IoArrowBackSharp /></div>
                                <p className='ml-3 text-2xl font-semibold'>Thêm phiếu giảm giá</p>
                            </div>
                            <div className='h-[2px] bg-slate-600 mt-1'></div>
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
                                    <div className='grid grid-cols-2 gap-5'>
                                        <FormField
                                            control={form.control}
                                            name="value"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabel>Gía trị giảm</FormLabel>
                                                    <FormControl>
                                                        <InputNumber min={0} max={!discountType ? 100 : null} addonAfter={discountType ? "đ" : "%"} className='w-full' {...field} />
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
                                                        <InputNumber min={0} className='w-full' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <FormField
                                            control={form.control}
                                            name="discountType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hình thức giảm giá</FormLabel>
                                                    <FormControl>
                                                        <div>
                                                            <Radio.Group name="radiogroup" defaultValue={"1"} onChange={e => setDiscountType(e.target.value == '0')}>
                                                                <Radio value={"0"}>Giảm giá trực tiếp</Radio>
                                                                <Radio value={"1"}>Giảm giá %</Radio>
                                                            </Radio.Group>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {!discountType
                                            &&
                                            <FormField
                                                control={form.control}
                                                name="max_discount_value"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mức giảm tối đa</FormLabel>
                                                        <FormControl>
                                                            <InputNumber min={0} addonAfter="đ" className='w-full' {...field} />
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
                                                    <InputNumber min={0} addonAfter="đ" className='w-full' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <TextArea placeholder="mô tả" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=''>
                                        <p className='mt-1 text-xl font-semibold mb-2'>Đối tượng áp dụng</p>
                                        <Radio.Group name="radiogroup" defaultValue={"0"} value={VoucherType} onChange={e => setVoucherType(e.target.value)}>
                                            <Radio value={"0"}>Tất cả khách hàng</Radio>
                                            <Radio value={"1"}>Khách hàng chỉ định</Radio>
                                        </Radio.Group>
                                    </div>

                                    <div className='mt-1'>
                                        <label>
                                            <p className='mb-1 text-xl text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                                            <RangePicker className='w-full' value={date} onChange={(val) => { if (val) { setDate(val) } }} showTime />
                                        </label>
                                    </div>
                                    <div className='flex gap-4'>
                                        <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Tạo voucher</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                        <div className='flex-grow bg-white p-5 shadow-lg flex flex-col gap-3'>
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