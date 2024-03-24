import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Descriptions, Tag, Slider, Select, Tooltip, Space, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import hexToColorName from "~/ultils/HexToColorName";
import { useDebounce } from '~/hooks';
import { fixMoney } from '~/ultils/fixMoney';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import { FaBug, FaRegCalendarCheck, FaRegFileAlt } from 'react-icons/fa';
import BillAddress from '~/components/BillAddress';
import BillPaymentHistory from '~/components/BillPaymentHistory';
import BillProducts from '~/components/BillProducts';
import BillProductsBack from '~/components/BillProductsBack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
function OrderDetail() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [lstBillDetails, setLstBillDetails] = useState([]);

    const fetchDataBill = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/bill/show/' + id);
            setBill(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDataBill();
    }, [id]);

    useEffect(() => {
        const billId = bill?.id;
        if (billId != null) {
            axios.get(`http://localhost:8080/api/v1/bill/show/${billId}/billdetails/products`)
                .then((res) => {
                    const data = res.data;
                    setLstBillDetails(data);
                })
                .catch((error) => {
                    console.error(error);
                });


        }
    }, [bill])

    const [isModalOpenAddress, setIsModalOpenAddress] = useState(false);
    const showModalAddress = () => {
        setIsModalOpenAddress(true);
    };
    const handleCancelAddress = () => {
        setIsModalOpenAddress(false);
    };

    return (
        <>
            <div >
                <div>
                    <h3>
                        Quản Lý Đơn Hàng / <span style={{ fontSize: '14px', color: '#808080' }}>{bill?.codeBill}</span>
                    </h3>
                </div>
                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
                    <div className='mb-6'>
                        <h4>Lịch Sử Đơn Hàng</h4>
                    </div>
                    <div className='overflow-x-scroll' style={{ overflowY: 'hidden' }}>
                        <div >
                            <Timeline minEvents={5} placeholder>
                                {bill?.lstHistoryBill.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map((historyBill) => {
                                    return (
                                        <TimelineEvent
                                            color='#87a2c7'
                                            icon={FaRegFileAlt}
                                            title={historyBill?.type == "-1" ? "Tạo Đơn Hàng" :
                                                        historyBill?.type == "0" ? "Chờ Xác Nhận" :
                                                            historyBill?.type == "1" ? "Đã Xác Nhận" :
                                                                historyBill?.type == "2" ? "Chờ Giao" :
                                                                    historyBill?.type == "3" ? "Đang Giao" :
                                                                        historyBill?.type == "4" ? "Đã Giao Hàng" :
                                                                            historyBill?.type == "5" ? "Hoàn Thành" :
                                                                                historyBill?.type == "6" ? "Hủy" :
                                                                                    historyBill?.type == "7" ? "Trả Một Phẩn" :
                                                                                        historyBill?.type == "8" ? "Trả Hàng" : ""
                                                    }
                                            subtitle={dayjs(historyBill?.createdDate).format('YYYY-MM-DD HH:mm:ss')}
                                        />
                                    );
                                })}


                            </Timeline>
                        </div>

                    </div>

                </div>


                <div className='bg-white p-4 mt-6 mb-10 pt-6 pb-6 shadow-lg '>
                    <div className='flex justify-between	'>
                        <div>
                            <Button danger>Xác Nhận Đơn Hàng</Button>

                            <Button type="primary" danger className='ml-4'>
                                Hủy Đơn
                            </Button>
                        </div>

                        <div>
                            <Button danger>Chi Tiết</Button>
                        </div>
                    </div>
                </div>


                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
                    <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                        <div>
                            <h4>Thông Tin Đơn Hàng - <span>{bill?.codeBill}</span></h4>
                        </div>
                        <div>
                            <Button danger onClick={showModalAddress}>Cập Nhật</Button>
                            <Modal title="Cập Nhật Thông Tin" width={800} open={isModalOpenAddress} footer={null} onCancel={handleCancelAddress} >
                                <div className='mt-6'>
                                    <BillAddress bill={bill} handleCancelAddress={handleCancelAddress} fetchDataBill={fetchDataBill} lstBillDetails={lstBillDetails}></BillAddress>
                                </div>
                            </Modal>
                        </div>
                    </div>

                    <div className='pt-4'>
                        <Descriptions>
                            <Descriptions.Item label={<span className='font-medium text-black'>Tên Người Nhận</span>}>{bill?.receiverName}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Số Điện Thoại</span>}>{bill?.receiverPhone}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Trạng Thái</span>}>
                            <Tag color="blue">
                            {
                                bill?.status =='-1'?"Tạo Đơn Hàng":
                                bill?.status =='0'?"Chờ Xác Nhận":
                                bill?.status =='1'?"Đã Xác Nhận":
                                bill?.status =='2'?"Chờ Giao":
                                bill?.status =='3'?"Đang Giao":
                                bill?.status =='4'?"Đã Giao Hàng":
                                bill?.status =='5'?"Hoàn Thành":
                                bill?.status =='6'?"Hủy":
                                bill?.status =='7'?"Trả Một Phẩn":
                                bill?.status =='8'?"Trả Hàng":""
                            }
                            </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Loại</span>}>{bill?.billType == "0" ? "Online" : bill?.billType == "1" ? "Offline" : "Không Biết"}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Địa Chỉ</span>}>{bill?.receiverDetails} {bill?.receiverCommune} {bill?.receiverDistrict} {bill?.receiverProvince}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Ghi Chú</span>}>{bill?.description}</Descriptions.Item>

                        </Descriptions>
                    </div>
                </div>


                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
                    <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                        <h4>Lịch Sử Thanh Toán</h4>
                    </div>
                    <div>
                        <BillPaymentHistory></BillPaymentHistory>
                    </div>
                </div>

                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>

                    <div>
                        <BillProducts bill={bill} fetchDataBill={fetchDataBill} lstBillDetails={lstBillDetails}></BillProducts>
                    </div>
                </div>

                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>

                    <div>
                        <BillProductsBack></BillProductsBack>
                    </div>
                </div>

                <div className='bg-white p-4 mt-6 mb-20 shadow-lg '>
                    <div className='flex justify-between'>
                        <div className='text-2xl leading-loose w-1/5'>
                            <div className='flex justify-between'>
                                <div>

                                    <div>Mã Giảm Giá:</div>
                                    <div>Phiếu Giảm Giá:</div>

                                </div>
                                <div className='font-medium text-end'>
                                    <div>abc</div>
                                    <div>abc</div>
                                </div>
                            </div>
                        </div>

                        <div className='text-2xl leading-loose w-1/4'>
                            <div className='flex justify-between'>
                                <div>
                                    <div>Tiền Hàng:</div>
                                    <div>Giảm Giá:</div>
                                    <div>Phí Vận Chuyên:</div>
                                    <div>Tổng Tiền:</div>
                                </div>
                                <div className='font-medium text-end'>
                                    <div>{fixMoney(bill?.totalMoney)}</div>
                                    <div>{fixMoney(bill?.voucherMoney)}</div>
                                    <div>{fixMoney(bill?.shipMoney)}</div>
                                    <div className='text-rose-600	'>{fixMoney(bill?.intoMoney)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


            </div>
            <ToastContainer />;

        </>
    );
}

export default OrderDetail;