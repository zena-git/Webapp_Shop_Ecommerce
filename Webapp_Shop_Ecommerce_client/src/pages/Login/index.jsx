import { Input, Button } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = () => {
        if (username.trim().length == 0) {
            toast.error('Vui lòng nhập email');
        } else if (password.trim().length == 0) {
            toast.error('Vui lòng nhập password');

        } else {
            const data = {
                email: username,
                password: password
            }
            const usernames =/\S+@\S+\.\S+/;
            if (!usernames.test(username.trim())) {
                toast.error('Email không hợp lệ');
                return;
            }
            axios.post('http://localhost:8080/api/v2/login', data).then(res => {
                toast.success('Đăng nhập thành công');
                const token = res.data.data.token;
                localStorage.setItem('token', token);
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            }).catch(err => {
                toast.error(err.response.data.message)
            })
        }
    }

    return (
        <div className="flex justify-center items-center mt-[15%]">
            <div className="flex flex-col gap-6 min-w-[40%] text-center">
                <p className="uppercase text-[40px] text-slate-700">Đăng nhập</p>
                <div className="flex flex-col gap-5">
                    <Input value={username} onChange={e => { setUsername(e.target.value) }} size="large" placeholder="Số điện thoại hoặc email" prefix={<UserOutlined />} />
                    <Input.Password value={password} onChange={e => { setPassword(e.target.value) }} size="large" placeholder="Mật khẩu" prefix={<LockOutlined />} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    <div className="flex justify-between">
                        <p className="text-slate-600 underline cursor-pointer text-[15px]" onClick={() => { }}>Quên mật khẩu</p>
                        <p className="text-slate-600 underline cursor-pointer text-[15px]" onClick={() => { navigate('/register') }}>Chưa có tài khoản?</p>
                    </div>
                    <Button type="primary" onClick={() => { handleSubmit() }}>Đăng nhập</Button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}