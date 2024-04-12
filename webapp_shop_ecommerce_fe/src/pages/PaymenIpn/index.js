import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Result } from 'antd';
import { SmileOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function PaymentIpn() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [isStatus, setIsStatus] = useState("-1");
    const [subTitle, setsubTitle] = useState("Vui Lòng Chờ Trong Giây Lát !");
    const [countdown, setCountdown] = useState();

    const vnpTxnRef = searchParams.get('vnp_TxnRef');
    const vnpPayDate = searchParams.get('vnp_PayDate');
    const transactionNo = searchParams.get('vnp_TransactionNo');
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');
    const navigate = useNavigate();

    useEffect(() => {
        handlePaymentIpn();
    }, [vnpTxnRef])

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
                navigate('/order')
            }
        }

    }, [countdown]);

    const handlePaymentIpn = () => {
        axios.post(`http://localhost:8080/api/v1/payment/querydr`,
            {
                vnpTxnRef: vnpTxnRef,
                vnpPayDate: vnpPayDate,
                transactionNo: transactionNo,
                vnpResponseCode: vnpResponseCode
            }
        )
            .then(response => {
                toast.success(response.data.message)
                console.log(response.data.message);
                setIsStatus('0')
                setCountdown(15);

            })
            .catch(error => {
                console.log(error.response.data.message);
                // toast.error(error.response.data.message)
                // setIsStatus('1')
                // setsubTitle("Liên Hệ Tới Cửa Hàng Để Được Hỗ Trợ !");

            });
    }

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
                        isStatus === '0' ? "Thanh Toán Thành Công" :
                            isStatus === '1' ? "Thanh Toán Thất Bại" :
                                "Đang Xác Thực"
                    }
                    subTitle={subTitle}
                    extra={[
                        <Button type="primary" key="console">
                            Trả Lại
                        </Button>,
                        <Button key="buy">In Hóa Đơn</Button>,
                    ]}
                />
            </div>

            <ToastContainer />

        </>
    );
}

export default PaymentIpn;