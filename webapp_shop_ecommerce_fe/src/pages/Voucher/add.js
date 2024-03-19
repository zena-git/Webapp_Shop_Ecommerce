import { DatePicker, InputNumber } from 'antd/lib';
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import { useToast } from '~/components/ui/use-toast';
import { makeid } from '~/lib/functional';
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Button } from '~/components/ui/button';
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
    discount_type: z.number({
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


    const selectedCustomer = useAppSelector(state => state.voucherReducer.value.selected)

    const [VoucherType, setVoucherType] = useState("0");

    const [discountType, setDiscountType] = useState(false);
    const [listCustomer, setListCustomer] = useState([]);

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
        if (VoucherType == "0") {
            axios.post(`${baseUrl}/voucher`, {
                code: values.code,
                name: values.name,
                value: values.value,
                target_type: values.target_type,
                usage_limit: values.usage_limit,
                discount_type: values.discount_type,
                max_disount_value: values.max_discount_value,
                order_min_value: values.order_min_value,
                startDate: date[0].toDate(),
                endDate: date[1].toDate(),
                lstCustomer: listCustomer.map(val => { return val.id })
            }).then(res => {
                alert("Đã tạo voucher thành công")
            })
        } else {
            if (selectedCustomer.length > 0) {
                axios.post(`${baseUrl}/voucher`, {
                    code: values.code,
                    name: values.name,
                    value: values.value,
                    target_type: values.target_type,
                    usage_limit: values.usage_limit,
                    discount_type: values.discount_type,
                    max_disount_value: values.max_discount_value,
                    order_min_value: values.order_min_value,
                    startDate: date[0].toDate(),
                    endDate: date[1].toDate(),
                    lstCustomer: selectedCustomer.map(val => { return val.id })
                }).then(res => {
                    alert("Đã tạo voucher thành công")
                })
            } else {
                alert("chưa chọn khách hàng nào")
            }
        }

    }

    return (
        <>
            <div className="p-6">
                <p className='my-2 text-lg font-semibold'>Thêm Voucher</p>
                <div>
                    <div className='w-full flex max-xl:flex-col justify-center p-5 gap-5'>
                        <div className='flex flex-col gap-3 w-5/12 max-xl:w-full'>
                            <Form {...form}>
                                <form onSubmit={e => { e.preventDefault() }} className="space-y-8">
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
                                        name="discount_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hình thức giảm giá</FormLabel>
                                                <FormControl>
                                                    <RadioGroup className="flex gap-3 items-center" defaultValue='0' onValueChange={e => { setDiscountType(e == '1') }}>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="0" id="option-one" defaultChecked />
                                                            <Label htmlFor="option-one">giảm trực tiếp</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="1" id="option-two" />
                                                            <Label htmlFor="option-two">%</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {discountType
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
                                                <FormLabel>Loại hình áp dụng</FormLabel>
                                                <FormControl defaultValue='1'>
                                                    <RadioGroup className="flex gap-3 items-center">
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
                                    <p className='mt-1 text-sm font-semibold'>Đối tượng áp dụng</p>
                                    <RadioGroup value={VoucherType} onValueChange={e => { setVoucherType(e) }}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={"0"} id="option-one" />
                                            <Label htmlFor="option-one">Tất cả khách hàng</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={"1"} id="option-two" />
                                            <Label htmlFor="option-two">Khách hàng chỉ định</Label>
                                        </div>
                                    </RadioGroup>

                                    <div className='mt-3'>
                                        <label>
                                            <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                                            <RangePicker className='w-full' value={date} onChange={(val) => { if (val) { setDate(val) } }} showTime />
                                        </label>
                                    </div>
                                    <div className='flex gap-4'>
                                        <Button type="submit" onClick={() => { handleSubmitForm(form.getValues()) }}>Submit</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                        <div className='flex-grow'>
                            <ListCustomer data={listCustomer} />
                        </div>
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