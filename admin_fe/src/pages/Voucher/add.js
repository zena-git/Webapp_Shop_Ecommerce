import { DatePicker, InputNumber, Button } from 'antd/lib';
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import { makeid } from '~/lib/functional';
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
// import { Button } from '~/components/ui/button';
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
const { RangePicker } = DatePicker

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
    discount_type: z.number({
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


    const selectedCustomer = useAppSelector(state => state.voucherReducer.value.selected)

    const [VoucherType, setVoucherType] = useState("0");

    const [discountType, setDiscountType] = useState(false);
    const [listCustomer, setListCustomer] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(set({ value: { selected: [] } }))
    }, [])

    useEffect(() => {
        console.log(selectedCustomer)
    },[selectedCustomer])

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
                discount_type: 0,
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
        if (date[0].toDate() < new Date() || date[1].toDate() < new Date()) {
            toast.error('cần nhập giá trị ngày trong tương lai')
            return;
        }
        if (!discountType && values.value > 100) {
            toast.error('mức giảm không quá 100% được');
            return;
        }
        if (VoucherType == "0") {
            axios.post(`${baseUrl}/voucher`, {
                code: values.code,
                name: values.name,
                value: values.value,
                target_type: values.target_type,
                usage_limit: values.usage_limit,
                discount_type: discountType ? 0 : 1,
                max_discount_value: values.max_discount_value,
                order_min_value: values.order_min_value,
                description: values.description,
                startDate: date[0].toDate(),
                endDate: date[1].toDate(),
                lstCustomer: listCustomer.map(val => { return val.id })
            }).then(res => {
                toast.success("Đã tạo voucher thành công")
                form.reset();
            }).catch(err => { toast.error(err) });
        } else {
            if (selectedCustomer.length > 0) {
                axios.post(`${baseUrl}/voucher`, {
                    code: values.code,
                    name: values.name,
                    value: values.value,
                    target_type: values.target_type,
                    usage_limit: values.usage_limit,
                    discount_type: discountType ? 0 : 1,
                    max_disount_value: values.max_discount_value,
                    order_min_value: values.order_min_value,
                    description: values.description,
                    startDate: date[0].toDate(),
                    endDate: date[1].toDate(),
                    lstCustomer: selectedCustomer.map(val => { return val.id })
                }).then(res => {
                    toast.success("Đã tạo voucher thành công")
                    form.reset();
                })
            } else {
                toast.error("chưa chọn khách hàng nào")
            }
        }
    }

    return (
        <>
            <div className="">
                <p className='my-2 text-lg font-bold'>Thêm Voucher</p>
                <div className=''>
                    <div className='w-full h-fit flex max-xl:flex-col justify-center gap-5'>
                        <div className='p-5 h-fit bg-white shadow-lg flex flex-col gap-3 w-5/12 max-xl:w-full'>
                            <Form {...form}>
                                <form onSubmit={e => { e.preventDefault() }} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>mã voucher</FormLabel>
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
                                                <FormLabel>tên voucher</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='grid grid-cols-2'>
                                        <FormField
                                            control={form.control}
                                            name="discount_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hình thức giảm giá</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup className="flex gap-3 items-center" defaultValue="1" onValueChange={e => { setDiscountType(e == '0') }}>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="0" id="option-one" />
                                                                <Label htmlFor="option-one">giảm trực tiếp</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="1" id="option-two" />
                                                                <Label htmlFor="option-two">giảm theo %</Label>
                                                            </div>
                                                        </RadioGroup>
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
                                                            <InputNumber className='w-full' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        }
                                    </div>
                                    <div className='grid grid-cols-2 gap-5'>
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
                                        <FormField
                                            control={form.control}
                                            name="value"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabel>Gía trị giảm</FormLabel>
                                                    <FormControl>
                                                        <InputNumber className='w-full' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="mô tả" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="target_type"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel></FormLabel>
                                                <FormControl defaultValue='1'>
                                                    <RadioGroup className=" gap-3 items-center hidden">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="0" id="option-one" />
                                                            <Label htmlFor="option-one">vận chuyển</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="1" id="option-two" />
                                                            <Label htmlFor="option-two">đơn hàng</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=''>
                                        <p className='mt-1 text-sm font-semibold mb-2'>Đối tượng áp dụng</p>
                                        <RadioGroup value={VoucherType} onValueChange={e => { setVoucherType(e) }}>
                                            <div className='flex gap-4'>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={"0"} id="option-one" />
                                                    <Label htmlFor="option-one">Tất cả khách hàng</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={"1"} id="option-two" />
                                                    <Label htmlFor="option-two">Khách hàng chỉ định</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className='mt-3'>
                                        <label>
                                            <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                                            <RangePicker className='w-full' value={date} onChange={(val) => { if (val) { setDate(val) } }} showTime />
                                        </label>
                                    </div>
                                    <div className='flex gap-4'>
                                        <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Tạo voucher</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                        <div className='flex-grow bg-white p-5 shadow-lg'>
                            <ListCustomer data={listCustomer} />
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