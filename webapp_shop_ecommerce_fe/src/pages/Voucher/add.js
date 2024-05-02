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
import { set, toggleAll, deselectAll } from '../../redux/features/voucher-selected-item';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";

const { RangePicker } = DatePicker
const { TextArea } = Input

const formSchema = z.object({
    code: z.string().min(2, {
        message: "Mã tối thiểu phải có 2 ký tự",
    }),
    name: z.string().min(2, {
        message: "Tên tối thiểu phải có 2 ký tự",
    }),
    value: z.number({ invalid_type_error: 'giá trị giảm phải là số' }).min(1, {
        message: "Giá trị tối thiểu là 1 ký tự",
    }),
    target_type: z.number({
        required_error: "Cần lựa chọn 1 loại hình thức",
    }),
    discountType: z.number({
        required_error: "Cần lựa chọn 1 loại hình thức",
    }),
    description: z.string(),
    order_min_value: z.number({ invalid_type_error: 'Giá trị đơn tối thiểu phải là số' }),
    max_discount_value: z.number({ invalid_type_error: 'Giá trị giảm tối đa phải là số' }),
    usage_limit: z.number({ invalid_type_error: 'Số lượng phải là số' })
})

const VoucherPage = () => {

    const navigate = useNavigate();
    const selectedCustomer = useAppSelector(state => state.voucherReducer.value.selected)

    const [VoucherType, setVoucherType] = useState("1");

    const [discountType, setDiscountType] = useState(false);
    const [listCustomer, setListCustomer] = useState([]);

    const [pending, setPending] = useState(false);

    const dispatch = useDispatch();

    const [detail, setDetail] = useState('');

    useEffect(() => {
        dispatch(set({ value: { selected: [] } }))
    }, [dispatch])

    useEffect(() => {
        axios.get(`${baseUrl}/customer`).then(res => {
            setListCustomer(res.data);
            dispatch(set({
                value: {
                    selected: res.data.map(cus => {
                        return {
                            id: cus.id,
                            selected: false
                        }
                    })
                }
            }))
        })
    }, []);

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
                value: 1
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
                        description: detail,
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

    useEffect(() => {
        let t = selectedCustomer.every(cus => cus.selected)
        if(t){
            setVoucherType("0");
        }else{
            setVoucherType("1");
        }
    }, [selectedCustomer])

    useEffect(() => {
        if (VoucherType == "0") {
            dispatch(toggleAll());
        }
    }, [VoucherType, dispatch])

    return (
        <>
            <div className="">
                <div className=''>
                    <div className='w-full h-fit flex max-xl:flex-col justify-center gap-3'>
                        <div className='px-3 py-5 h-fit bg-white shadow-lg gap-2 flex flex-col w-5/12 max-xl:w-full'>
                            <div className='flex gap-2 items-center'>
                                <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/discount/voucher') }}><IoArrowBackSharp /></div>
                                <p className='ml-3 text-2xl font-semibold'>Thêm voucher</p>
                            </div>
                            <div className='h-[2px] bg-slate-600 mt-1 mb-2'></div>
                            <Form {...form}>
                                <form onSubmit={e => { e.preventDefault() }} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã voucher</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Mã" {...field} />
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
                                                <FormLabel>Tên voucher</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tên" {...field} />
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
                                                        <InputNumber min={1} max={!discountType ? 100 : null} addonAfter={discountType ? "đ" : "%"} className='w-full' {...field} />
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
                                    <div className='grid grid-cols-2 gap-5'>
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
                                                    <TextArea placeholder="mô tả" value={detail} onChange={e => setDetail(e.target.value)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=''>
                                        <FormLabel>Đối tượng áp dụng</FormLabel>
                                        <div className='mt-2'>
                                            <Radio.Group name="radiogroup" defaultValue={"0"} value={VoucherType} onChange={e => setVoucherType(e.target.value)}>
                                                <Radio value={"0"}>Tất cả khách hàng</Radio>
                                                <Radio value={"1"}>Khách hàng chỉ định</Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>

                                    <div className='mt-1'>
                                        <FormLabel>Ngày bắt đầu {"->"} Ngày kết thúc</FormLabel>
                                        <div className='mt-3'>
                                            <RangePicker className='w-full' value={date} onChange={(val) => { if (val) { setDate(val) } }} showTime />
                                        </div>
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