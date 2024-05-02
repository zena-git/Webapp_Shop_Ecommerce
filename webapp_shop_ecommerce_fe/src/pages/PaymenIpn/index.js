import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useOrderData } from '~/provider/OrderDataProvider';
import { useLocation } from 'react-router-dom';
import { Button, Result } from 'antd';
import { SmileOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosIns from '../../lib/auth'

function PaymentIpn() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [isStatus, setIsStatus] = useState("-1");
    const [subTitle, setsubTitle] = useState("Vui Lòng Chờ Trong Giây Lát !");
    const [countdown, setCountdown] = useState();
    const { loadingContent,setDataLoadingContent } = useOrderData();
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
                // navigate('/order')
            }
        }

    }, [countdown]);

    const handlePaymentIpn = () => {
        AxiosIns.post(`v1/payment/querydr`,
            {
                vnpTxnRef: vnpTxnRef,
                vnpPayDate: vnpPayDate,
                transactionNo: transactionNo,
                vnpResponseCode: vnpResponseCode
            }
        )
            .then(response => {
                toast.success("Xác Thực Thành Công")
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
    const handlePrintView = async () => {
        try {
            // Gọi API để lấy dữ liệu hóa đơn
            const response = await AxiosIns.get(`v3/print/${vnpTxnRef}`, {
                responseType: 'arraybuffer', // Yêu cầu dữ liệu trả về dưới dạng mảng byte
            });

            // Tạo một Blob từ dữ liệu PDF
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            // Tạo một URL tạm thời từ Blob
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Tạo một iframe ẩn để hiển thị PDF và chuẩn bị cho việc in
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = pdfUrl;
            document.getElementById("printx").appendChild(iframe);

            // Đợi cho PDF load xong trước khi gọi hộp thoại in
            iframe.onload = function () {
                iframe.contentWindow.print();
                // Sau khi in, loại bỏ iframe khỏi DOM
                // setTimeout(() => {
                //     document.getElementById("printx").removeChild(iframe);
                //     URL.revokeObjectURL(pdfUrl);
                // }, 200);
            };
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                        <Button key="buy" onClick={() => { handlePrintView() }}>In Hóa Đơn</Button>,
                    ]}
                />
            </div>
            <div className='-z-50' id='printx'>

            </div>

            <ToastContainer />

        </>
    );
}

export default PaymentIpn;