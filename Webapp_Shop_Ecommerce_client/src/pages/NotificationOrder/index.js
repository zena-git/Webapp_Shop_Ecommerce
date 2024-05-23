import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Result } from 'antd';
import { SmileOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function NotificationOrder() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [isStatus, setIsStatus] = useState("-1");
    const [subTitle, setsubTitle] = useState("Vui Lòng Chờ Trong Giây Lát !");
    const [countdown, setCountdown] = useState();
    const codeBill = searchParams.get('bill');

    const navigate = useNavigate();
    const status = searchParams.get('status');


    useEffect(() => {
        if (isStatus == "0") {
            if (countdown >= 0) {
                const timer = setTimeout(() => {
                    console.log(countdown - 1);
                    setCountdown(countdown - 1);
                    setsubTitle("Bạn Sẽ Được Chuyển Hướng Sau " + (countdown) + "s nữa !");
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                // Redirect after countdown ends
                console.log("Chuyển hướng");
                navigate('/cart')
            }
        }


    }, [countdown]);


    useEffect(() => {
        setIsStatus(status)
        setCountdown(10);
        console.log(codeBill);
        // setCodeBill(code)
    }, [status]);

    return (
        <>

            <div className='bg-white p-4 mt-6 mb-10 pt-20 pb-6 shadow-lg h-screen'>
                <Result
                    icon={
                        isStatus === '0' ? <CheckCircleOutlined style={{ color: 'green' }} /> :
                            isStatus === '1' ? <CloseCircleOutlined style={{ color: 'red' }} /> :
                                <SmileOutlined />
                    }
                    title={
                        isStatus === '0' ? "Đặt Hàng Thành Công" :
                            isStatus === '1' ? "Đặt Hàng Thất Bại" :
                                "Khác"
                    }
                    subTitle={<>
                        {subTitle}
                        <div className='mt-2'>
                            Xem Lại Đơn Hàng tại {codeBill?<Link to={"/orderInvoice/" + codeBill}> {codeBill}</Link>:
                            <Link to={"/orderTracking"}>Tra cứu</Link>}
                        </div>
                    </>}
                    extra={[
                        <Link to="/product">
                            <Button type="primary" key="console">
                                Trở Lại
                            </Button>
                        </Link>


                    ]}
                />
            </div>

            <ToastContainer />

        </>
    );
}

export default NotificationOrder;