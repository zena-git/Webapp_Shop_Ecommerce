import { Input, Button } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = () => {
        if (username.trim().length == 0) {

        } else if (password.trim().length == 0) {

        } else {
            const data = {
                username: username,
                password: password
            }
            axios.post('', data).then(res => {
                toast.success('Đăng nhập thành công');
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
        </div>
    )
}