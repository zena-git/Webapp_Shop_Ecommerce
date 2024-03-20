import { DatePicker, InputNumber, Select } from 'antd/lib';
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
import { zodResolver } from "@hookform/resolvers/zod"
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../lib/functional'
// import { Select } from '../../components/ui/select'

import { vnData } from '../../lib/extra'

dayjs.extend(customParseFormat);

const formSchema = z.object({
    codeCustomer: z.string().min(2, {
        message: "code must be at least 2 characters.",
    }),
    fullName: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    gender: z.number({
        required_error: "You need to select a target type.",
    }),
    address: z.string({
        required_error: "You need to select a discount type.",
    }),
    phone: z.string(),
    email: z.string().email({}),
    username: z.string().min(4, {
        message: "max dis must be at least 4 characters.",
    }),
    password: z.string()
})

export default function AddCustomer() {

    const [birthDay, setBirthday] = useState(dayjs(new Date()));
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);

    const [addProvince, setAddProvince] = useState("Thành phố Hà Nội");
    const [addDistrict, setAddDistrict] = useState("Quận Ba Đình");
    const [addWard, setAddWard] = useState("Phường Phúc Xá");

    useEffect(() => {
        const province = vnData.find(target => { return target.name == addProvince });
        if (!province) return;
        const t = province.districts;
        setListDistricts(t)
        setAddDistrict(t[0].name)
    }, [addProvince])

    useEffect(() => {
        if (addDistrict && listDistricts.length > 0) {
            const t = listDistricts.find(target => { return target.name == addDistrict }).wards;
            setListWards(t)
            setAddWard(t[0].name)
        }
    }, [addDistrict, listDistricts])

    const navigate = useNavigate()


    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                codeCustomer: makeid(),
                fullName: "",
                birthDay: birthDay,
                gender: "",
                address: "",
                phone: 0,
                email: 0,
                username: "",
                password: makeid(),
            },
            mode: 'all'
        }
    )

    const handleSubmitForm = (values) => {
        const data = { ...values, birthDay: birthDay }
        axios.post(`${baseUrl}/customer`, data).then(res => {
            toast.success('thêm khách hàng thành công');
            setTimeout(() => {
                navigate(`/user/customer/detail/${res.data.data.id}`)
            }, 2000)
        })

        console.log(addDistrict + " " + addProvince + " " + addWard)
    }

    return (
        <div className='flex xl:flex-col'>
            <ToastContainer />
            <div className='flex flex-col gap-3 w-full'>
                <Form {...form}>
                    <form onSubmit={e => { e.preventDefault() }} className="space-y-8">
                        <div className='grid grid-cols-2 max-lg:grid-cols-1 p-3 gap-x-6'>
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <InputNumber className='w-full h-10' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-2 max-lg:grid-cols-1 p-3 gap-x-6 items-center'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className='w-full' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex gap-5 items-center'>
                                <FormField
                                    control={form.control}
                                    name="birthday"
                                    render={({ field }) =>
                                    (
                                        <FormItem>
                                            <FormLabel></FormLabel>
                                            <FormControl>
                                                <>
                                                    <p>Sinh nhật</p>
                                                    <DatePicker format={"DD-MM-YYYY"} maxDate={dayjs(new Date(), "DD-MM-YYYY")} value={birthDay} onChange={birthDay => setBirthday(birthDay)} />
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) =>
                                    (
                                        <FormItem>
                                            <FormLabel>Giới tính</FormLabel>
                                            <FormControl defaultValue='1'>
                                                <RadioGroup className="flex gap-3 items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="0" id="option-one" />
                                                        <Label htmlFor="option-one">Nam</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="1" id="option-two" />
                                                        <Label htmlFor="option-two">Nữ</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) =>
                            (
                                <FormItem>
                                    <FormLabel>Địa chỉ chi tiết</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="địa chỉ chi tiết" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex gap-4'>
                            <Button type="submit" onClick={() => { handleSubmitForm(form.getValues()) }}>Tạo khách hàng</Button>
                        </div>
                    </form>
                </Form>
            </div>
            {/* <div className='flex-grow'>
                <p>Danh sách địa chỉ</p>
                <div>
                    <Select defaultValue={1} placeholder='Tình/ Thành phố' value={addProvince} onChange={value => { setAddProvince(value) }}>
                        {vnData.map((province) => {
                            return <option key={province.code} value={province.name}>{province.name}</option>
                        })}
                    </Select>

                    <Select placeholder='Quận/Huyện' defaultValue={1} value={addDistrict} onChange={value => { setAddDistrict(value) }}>
                        {
                            listDistricts.map(district => {
                                return <option key={district.code} value={district.name}>{district.name}</option>
                            })
                        }
                    </Select>

                    <Select placeholder='Xã/Thị trấn' defaultValue={1} value={addWard} onChange={value => { setAddWard(value) }}>
                        {
                            listWards.map(ward => {
                                return <option key={ward.code} value={ward.name}>{ward.name}</option>
                            })
                        }
                    </Select>
                </div>
            </div> */}

        </div>
    )
} 