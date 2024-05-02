
import LayoutProfile from '~/components/LayoutProfile';
import { Input, Radio, DatePicker, Button } from 'antd';
import './profile.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosIns from '~/plugin/axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const Profile = () => {
    const [customer, setCustomer] = useState([])
    const [historyCustomer, setHistoryCustomer] = useState([])


    useEffect(() => {
        axiosIns.get('/api/v2/profile')
            .then(response => {
                console.log(response.data);
                setCustomer(response.data)
            })
            .catch(err => {

            })
    }, [historyCustomer]);
    const handleDateChange = (date, dateString) => {
        const dates = dayjs(date)?.format("YYYY-MM-DDTHH:mm:ss")
        if (dates == "Invalid Date") {
            return
        }
        // console.log(dates);
        setCustomer({
            ...customer,
            birthday: dates,
        });
    };

    const handleCustomers = () => {
        axiosIns.put('/api/v2/profile/' + customer.id, customer)
            .then(res => {
                console.log(res);
                setHistoryCustomer(res.data)
                toast.success('Cập nhật thành công');
            })
            .catch(err => {
                console.log(err);
                toast.success('Cập nhật thất bại');
            })
    }

    return (<>

        <LayoutProfile>
            <div>
                <h4 className='text-3xl	font-medium	'>Thông Tin Tài Khoản</h4>
            </div>
            <div className="box_profile">

                <div className="box_profile-info">
                    <label  className='text-2xl	'>Họ Và Tên</label>
                    <div className="profile_info">
                        <Input placeholder="Họ Và Tên" value={customer.fullName} onChange={(e) => {
                            setCustomer({
                                ...customer,
                                fullName: e.target.value,
                            });
                        }} />

                    </div>
                </div>

                <div className="box_profile-info">
                    <label className='text-2xl	'>Giới Tính</label>
                    <div className="profile_info">
                        <Radio.Group style={{ width: '100%' }} value={customer.gender} onChange={(e) => {
                            setCustomer({
                                ...customer,
                                gender: e.target.value,
                            });
                        }}>
                            <Radio value={true}>Nam</Radio>
                            <Radio value={false}>Nữ</Radio>
                        </Radio.Group>
                    </div>
                </div>

                <div className="box_profile-info">
                    <label className='text-2xl	'>Số điện thoại</label>
                    <div className="profile_info">
                        <Input placeholder="Số điện thoại" value={customer.phone} onChange={(e) => {
                            setCustomer({
                                ...customer,
                                phone: e.target.value,
                            });
                        }} />
                    </div>

                </div>

                <div className="box_profile-info">
                    <label className='text-2xl	'>Email</label>
                    <div className="profile_info">
                        <Input placeholder="Email" value={customer.email} onChange={(e) => {
                            setCustomer({
                                ...customer,
                                email: e.target.value,
                            });
                        }} />
                    </div>

                </div>
                <div className="box_profile-info">
                    <label className='text-2xl	'>Ngày Sinh</label>
                    <div className="profile_info">
                        <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" // Specify the desired format
                            value={dayjs(customer.birthday)} />
                    </div>

                </div>
                <Button type="primary" onClick={handleCustomers}>Lưu Thay Đổi</Button>
                <ToastContainer />

            </div>



        </LayoutProfile>


    </>);
}

export default Profile;