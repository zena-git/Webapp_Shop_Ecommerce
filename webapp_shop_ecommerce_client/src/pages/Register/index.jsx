import { Pagination, Radio, DatePicker, Input, Button } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
export default function RegisterPage() {
    const navigate = useNavigate();

    const [customerName, setCustomerName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [gender, setGender] = useState(true)
    const [birthday, setBirthday] = useState('1990/01/01')
    const handleSubmit = () => {
        if (customerName.trim().length == 0) {
            toast.error('Tên không được để trống')
        } else if (phone.trim().length == 0) {
            toast.error('Số điện thoại không được để trống')
        } else if (email.trim().length == 0) {
            toast.error('Email không được để trống')
        } else if (password.trim().length == 0) {
            toast.error('Chưa nhập mật khẩu')
        } else if (confirmPassword != password) {
            toast.error('Mật khẩu không khớp')
        } else {
            const dates = dayjs(birthday)?.format("YYYY-MM-DDTHH:mm:ss")
            const data = {
                customerName: customerName,
                phone: phone,
                email: email,
                password: password,
                gender: gender,
                birthday: dates,
            }
            const usernames = /\S+@\S+\.\S+/;
            if (!usernames.test(email.trim())) {
                toast.error('Email không hợp lệ');
                return;
            }
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone.trim())) {
                toast.error('Số điện thoại không hợp lệ');
                return;
            }
            axios.post('http://localhost:8080/api/v2/register', data).then(res => {
                toast.success('Đăng ký thành công');
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            }).catch(err => {
                toast.error(err.response.data.message)
            })
        }
    }

    return (
        <div className="flex justify-center items-center mt-[10%]">
            <ToastContainer />
            <div className="flex flex-col gap-6 min-w-[40%] text-center">
                <p className="uppercase text-[40px] text-slate-700">Đăng ký tài khoản</p>
                <div className="flex flex-col gap-5">
                    <Input size="large" value={customerName} onChange={e => { setCustomerName(e.target.value) }} placeholder="Tên" prefix={<UserOutlined />} />
                    <Input size="large" value={phone} onChange={e => { setPhone(e.target.value) }} placeholder="Số điện thoại" prefix={<PhoneOutlined />} />
                    <Input size="large" value={email} onChange={e => { setEmail(e.target.value) }} placeholder="Email" prefix={<MailOutlined />} />
                    <DatePicker onChange={(date, dateString) => {
                        const dates = dayjs(date)?.format("YYYY-MM-DDTHH:mm:ss")
                        if (dates == "Invalid Date") {
                            return
                        }
                        setBirthday(birthday)
                    }} format="YYYY-MM-DD" // Specify the desired format
                        value={dayjs(birthday)} />
                    <Radio.Group className="flex" style={{ width: '100%' }} value={gender} onChange={(e) => {
                        setGender(e.target.value);
                    }}>
                        <Radio value={true}>Nam</Radio>
                        <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                    <Input.Password size="large" value={password} onChange={e => { setPassword(e.target.value) }} placeholder="Mật khẩu" prefix={<LockOutlined />} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    <Input.Password size="large" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value) }} placeholder="Nhập lại mật khẩu" prefix={<LockOutlined />} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />

                    <div className="flex justify-between">
                        <p className="text-slate-600 underline cursor-pointer text-[15px]" onClick={() => { }}>Quên mật khẩu</p>
                        <p className="text-slate-600 underline cursor-pointer text-[15px]" onClick={() => { navigate('/login') }}>Đã có tài khoản?</p>
                    </div>
                    <Button type="primary" onClick={() => { handleSubmit() }}>Đăng ký tài khoản</Button>
                </div>
            </div>
        </div>
    )
}