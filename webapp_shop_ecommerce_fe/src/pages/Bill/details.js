import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Radio, Table, Typography, Button, Descriptions, Tag, Slider, Select, Tooltip, Space, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import hexToColorName from "~/ultils/HexToColorName";
import { useDebounce } from '~/hooks';
import { fixMoney } from '~/ultils/fixMoney';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import { FaBug, FaRegCalendarCheck, FaRegFileAlt } from 'react-icons/fa';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import BillAddress from '~/components/BillAddress';
import BillPaymentHistory from '~/components/BillPaymentHistory';
import BillProducts from '~/components/BillProducts';
import BillProductsBack from '~/components/BillProductsBack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
function BillDetail() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [lstBillDetails, setLstBillDetails] = useState([]);
    const [lstBillDetailsReturn, setLstBillDetailsReturn] = useState([]);

    const TrangThaiBill = {
        TAT_CA: '',
        TAO_DON_HANG: "-1",
        CHO_XAC_NHAN: "0",
        CHO_GIAO: "1",
        DANG_GIAO: "2",
        DA_THANH_TOAN: "3",
        HOAN_THANH: "4",
        HUY: "5",
        TRA_HANG: "6",
        DANG_BAN: "7",
        CHO_THANH_TOAN: "8",
        NEW: "New",
    }
    const [paymentHistory, setPaymentHistory] = useState({
        type: "0",
        tradingCode: "",
        paymentAmount: "0",
        paymentMethod: "0",
        description: "",
        status: "0",
        refundsMoney: "0"
    });
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

    useEffect(() => {
        const billId = bill?.id;
        if (billId != null) {
            axios.get(`http://localhost:8080/api/v1/bill/show/${billId}/billdetails/products/returns`)
                .then((res) => {
                    const data = res.data;
                    setLstBillDetailsReturn(data);
                })
                .catch((error) => {
                    console.error(error);
                });


        }
    }, [bill])

    const [isModalOpenAddress, setIsModalOpenAddress] = useState(false);
    const [isModalOpenConfirmRollback, setIsModalOpenConfirmRollback] = useState(false);
    const [isModalOpenConfirmAcceptOrder, setIsModalOpenConfirmAcceptOrder] = useState(false);
    const [isModalOpenConfirmDelivery, setIsModalOpenConfirmDelivery] = useState(false);
    const [isModalOpenConfirmCompletion, setIsModalOpenConfirmCompletion] = useState(false);
    const [isModalOpenPayment, setIsModalOpenPayment] = useState(false);
    const [isModalOpenTimelineDetails, setIsModalOpenTimelineDetails] = useState(false);
    const [isModalOpenCancelling, setIsModalOpenCancelling] = useState(false);
    const [confirmAcceptOrderDes, setConfirmAcceptOrderDes] = useState("")


    const showModalAddress = () => {
        setIsModalOpenAddress(true);
    };
    const handleCancelAddress = () => {
        setIsModalOpenAddress(false);
    };

    const handleConfigPaymentHistory = () => {
        const data = {
            ...paymentHistory,
            paymentAmount: bill?.intoMoney,
        }
        axios.post(` http://localhost:8080/api/v1/bill/${bill?.id}/payment`, data)
            .then(response => {
                toast.success(response.data.message)
                fetchDataBill();
                setIsModalOpenPayment(false)
                setPaymentHistory({
                    type: "0",
                    tradingCode: "",
                    paymentAmount: "0",
                    paymentMethod: "0",
                    description: "",
                    status: "0",
                    refundsMoney: "0"
                })
            })
            .catch(error => {
                toast.error(error.response.data.message)
            })
    }

    return (
        <>
            <div className='max-w-full'>
                <div>
                    <h3>
                        Quản Lý Đơn Hàng / <span style={{ fontSize: '14px', color: '#808080' }}>{bill?.codeBill}</span>
                    </h3>
                </div>
                <div className='bg-white px-4 pt-6 pb-5 mt-6 mb-10 shadow-lg h-fit'>
                    <div className='mb-6'>
                        <h4>Lịch Sử Đơn Hàng</h4>
                    </div>
                    <div className='max-w-[calc(100vw-300px)] w-fit'>
                        <Timeline minEvents={5} placeholder height="230">
                            <div className='w-[calc(100vw-280px)] overflow-x-auto flex'>
                                {bill?.lstHistoryBill.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map((historyBill, index) => {
                                    return (
                                        <TimelineEvent
                                            key={index}
                                            color='#87a2c7'
                                            icon={FaRegFileAlt}
                                            title=<h4 className='text-2xl	'>{historyBill?.type == "-1" ? "Tạo Đơn Hàng" :
                                                historyBill?.type == TrangThaiBill.CHO_THANH_TOAN ? "Chờ Thanh Toán" :
                                                    historyBill?.type == TrangThaiBill.CHO_XAC_NHAN ? "Chờ Xác Nhận" :
                                                        historyBill?.type == TrangThaiBill.CHO_GIAO ? "Chờ Giao" :
                                                            historyBill?.type == TrangThaiBill.DANG_GIAO ? "Đang Giao" :
                                                                historyBill?.type == TrangThaiBill.DA_THANH_TOAN ? "Đã Thanh Toán" :
                                                                    historyBill?.type == TrangThaiBill.HOAN_THANH ? "Hoàn Thành" :
                                                                        historyBill?.type == TrangThaiBill.HUY ? "Hủy" :
                                                                            historyBill?.type == TrangThaiBill.TRA_HANG ? "Trả Hàng" : ""
                                            }</h4>

                                            subtitle=<span className='text-xl font-medium	'>
                                                {dayjs(historyBill?.createdDate).format('YYYY-MM-DD HH:mm:ss')}
                                            </span>
                                        />
                                    );
                                })}
                            </div>

                        </Timeline>
                    </div>
                    <div className='flex justify-end'>
                        <Modal title="Quay Lại Trạng Thái Đơn Hàng" width={500} open={isModalOpenConfirmRollback} footer={null} onCancel={() => { setIsModalOpenConfirmAcceptOrder(false) }} >
                            <label>Nội Dung</label>
                            <Input.TextArea rows={5} minLength={50} placeholder='Ghi Chú' value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                            <div className='flex justify-end mt-4 gap-3'>
                                <Button type='primary' onClick={() => {
                                    axios.post(`http://localhost:8080/api/v1/bill/${bill.id}/historyBill`, {
                                        type: Number.parseInt(bill.status) - 1,
                                        description: confirmAcceptOrderDes
                                    }).then(res => {
                                        setConfirmAcceptOrderDes("")
                                        fetchDataBill();
                                        setIsModalOpenConfirmRollback(false)
                                        toast.success(res.data.message);
                                    }).catch(err => {
                                        toast.error(err.response.data.message);
                                    })
                                }}>Xác nhận</Button>
                                <Button type='default' onClick={() => { setIsModalOpenConfirmRollback(false) }}>Hủy</Button>
                            </div>
                        </Modal>
                        {bill && bill.status == TrangThaiBill.CHO_GIAO && <Button type='primary' onClick={() => { setIsModalOpenConfirmRollback(true) }}>Quay lại trạng thái trước</Button>}
                    </div>

                </div>


                <div className='bg-white p-4 mt-6 mb-10 pt-6 pb-6 shadow-lg '>
                    <div className='flex justify-between	'>
                        <div className='flex'>

                            <div>
                                <Modal title="Xác Nhận Đơn Hàng" width={500} open={isModalOpenConfirmAcceptOrder} footer={null} onCancel={() => { setIsModalOpenConfirmAcceptOrder(false) }} >
                                    <label>Ghi Chú</label>
                                    <Input.TextArea className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} placeholder='Ghi Chú' />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            axios.post(`http://localhost:8080/api/v1/bill/${bill.id}/historyBill`, {
                                                type: TrangThaiBill.CHO_GIAO,
                                                description: confirmAcceptOrderDes
                                            }).then(response => {
                                                setConfirmAcceptOrderDes("")
                                                fetchDataBill();
                                                toast.success(response.data.message);
                                                setIsModalOpenConfirmAcceptOrder(false)
                                            }).catch(err => {
                                                toast.error(err.response.data.message);
                                            })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenConfirmAcceptOrder(false) }}>Hủy</Button>
                                    </div>
                                </Modal>
                                {
                                    bill && bill.status == TrangThaiBill.CHO_XAC_NHAN && <Button danger onClick={() => {
                                        setIsModalOpenConfirmAcceptOrder(true);
                                    }}  >Xác Nhận Đơn Hàng</Button>
                                }
                            </div>

                            <div>
                                <Modal title="Xác Nhận Giao Hàng" width={500} open={isModalOpenConfirmDelivery} footer={null} onCancel={() => { setIsModalOpenConfirmAcceptOrder(false) }} >
                                    <label>Ghi Chú</label>
                                    <Input.TextArea className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            axios.post(`http://localhost:8080/api/v1/bill/${bill.id}/historyBill`, {
                                                type: TrangThaiBill.DANG_GIAO,
                                                description: confirmAcceptOrderDes
                                            }).then(res => {
                                                setConfirmAcceptOrderDes("")
                                                fetchDataBill();
                                                toast.success(res.data.message);
                                                setIsModalOpenConfirmDelivery(false)
                                            }).catch(err => {
                                                toast.error(err.response.data.message);
                                            })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenConfirmDelivery(false) }}>Hủy</Button>
                                    </div>
                                </Modal>

                                {
                                    bill && bill.status == TrangThaiBill.CHO_GIAO && <Button danger onClick={() => {
                                        setIsModalOpenConfirmDelivery(true)
                                    }}  >Giao Hàng</Button>
                                }
                            </div>

                            <div>
                                <Modal title="Xác Nhận Hoàn Thành" width={500} open={isModalOpenConfirmCompletion} footer={null} onCancel={() => { setIsModalOpenConfirmCompletion(false) }} >
                                    <label>Ghi Chú</label>
                                    <Input.TextArea className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            if (bill?.lstPaymentHistory.length == "0") {
                                                toast.error("Không Thể Hoàn Thành Khi Chưa Thanh Toán !");
                                                setIsModalOpenConfirmCompletion(false)
                                                return;
                                            }

                                            axios.post(`http://localhost:8080/api/v1/bill/${bill.id}/historyBill`, {
                                                type: TrangThaiBill.HOAN_THANH,
                                                description: confirmAcceptOrderDes
                                            }).then(res => {
                                                setConfirmAcceptOrderDes("")
                                                fetchDataBill();
                                                toast.success(res.data.message);
                                                setIsModalOpenConfirmCompletion(false)
                                            }).catch(err => {
                                                toast.error(err.response.data.message);
                                            })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenConfirmCompletion(false) }}>Hủy</Button>
                                    </div>
                                </Modal>

                                {
                                    bill && bill.status == TrangThaiBill.DANG_GIAO && <Button danger onClick={() => {
                                        setIsModalOpenConfirmCompletion(true)
                                    }}  >Hoàn Thành</Button>
                                }
                            </div>

                            <div>
                                <Modal title="Xác Nhận Hủy" width={500} open={isModalOpenCancelling} footer={null} onCancel={() => { setIsModalOpenCancelling(false) }} >
                                    <label>Bạn Có Chắc Muốn Hủy Hóa Đơn Này ?</label>
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            axios.put(`http://localhost:8080/api/v1/bill/${bill?.id}/cancelling`)
                                                .then(res => {
                                                    fetchDataBill();
                                                    toast.success(res.data.message);
                                                    setIsModalOpenCancelling(false)
                                                }).catch(err => {
                                                    toast.error(err.response.data.message);
                                                })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenCancelling(false) }}>Hủy</Button>
                                    </div>
                                </Modal>

                                {
                                    bill && (bill.status == TrangThaiBill.CHO_GIAO || bill.status == TrangThaiBill.CHO_XAC_NHAN) && <Button onClick={() => {
                                        setIsModalOpenCancelling(true)
                                    }} type="primary" danger className='ml-4'>
                                        Hủy Đơn
                                    </Button>
                                }
                            </div>

                            <div>
                                {
                                    bill && (bill.status == TrangThaiBill.HOAN_THANH) && <Button onClick={() => {

                                    }} type="primary" danger className='ml-4'>
                                        In Hóa Đơn
                                    </Button>
                                }
                            </div>


                        </div>

                        <div>
                            <Modal title="Chi Tiết Lịch Sử Đơn Hàng" width={800} open={isModalOpenTimelineDetails} footer={null} onCancel={() => { setIsModalOpenTimelineDetails(false) }} >
                                <Table
                                    pagination={{
                                        pageSize: 5,
                                    }}
                                    scroll={{
                                        y: 500,
                                    }}
                                    dataSource={
                                        bill?.lstHistoryBill.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map(history => {
                                            return {
                                                key: history.id,
                                                type: <Tag color="blue">{
                                                    history?.type == TrangThaiBill.TAO_DON_HANG ? "Tạo Đơn Hàng" :
                                                        history?.type == TrangThaiBill.CHO_THANH_TOAN ? "Chờ Thanh Toán" :
                                                            history?.type == TrangThaiBill.CHO_XAC_NHAN ? "Chờ Xác Nhận" :
                                                                history?.type == TrangThaiBill.CHO_GIAO ? "Chờ Giao" :
                                                                    history?.type == TrangThaiBill.DANG_GIAO ? "Đang Giao" :
                                                                        history?.type == TrangThaiBill.DA_THANH_TOAN ? "Đã Thanh Toán" :
                                                                            history?.type == TrangThaiBill.HOAN_THANH ? "Hoàn Thành" :
                                                                                history?.type == TrangThaiBill.HUY ? "Hủy" :
                                                                                    history?.type == TrangThaiBill.TRA_HANG ? "Trả Hàng" : "Khác"
                                                }</Tag>,
                                                createdDate: dayjs(history?.createdDate).format('YYYY-MM-DD HH:mm:ss'),
                                                createdBy: history.createdBy,
                                                description: history.description
                                            }
                                        })
                                    } columns={[
                                        {
                                            title: 'Trạng Thái',
                                            dataIndex: 'type',
                                            key: 'type',
                                        },
                                        {
                                            title: 'Thời Gian',
                                            dataIndex: 'createdDate',
                                            key: 'createdDate',
                                        },
                                        {
                                            title: 'Người Chỉnh Sửa',
                                            dataIndex: 'createdBy',
                                            key: 'createdBy',
                                        },
                                        {
                                            title: 'Mô Tả',
                                            dataIndex: 'description',
                                            key: 'description',
                                        },
                                    ]} />
                            </Modal>
                            <Button danger onClick={() => {
                                setIsModalOpenTimelineDetails(true)
                            }}>Chi Tiết</Button>
                        </div>
                    </div>
                </div>


                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
                    <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                        <div>
                            <h4>Thông Tin Đơn Hàng - <span>{bill?.codeBill}</span></h4>
                        </div>
                        <div>
                            {
                                (bill?.status == TrangThaiBill.CHO_XAC_NHAN || bill?.status == TrangThaiBill.CHO_GIAO) &&
                                <Button danger onClick={showModalAddress}>Cập Nhật</Button>
                            }
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
                                        bill?.status == TrangThaiBill.TAO_DON_HANG ? "Tạo Đơn Hàng" :
                                            bill?.status == TrangThaiBill.CHO_THANH_TOAN ? "Chờ Thanh Toán" :
                                                bill?.status == TrangThaiBill.CHO_XAC_NHAN ? "Chờ Xác Nhận" :
                                                    bill?.status == TrangThaiBill.CHO_GIAO ? "Chờ Giao" :
                                                        bill?.status == TrangThaiBill.DANG_GIAO ? "Đang Giao" :
                                                            bill?.status == TrangThaiBill.HOAN_THANH ? "Hoàn Thành" :
                                                                bill?.status == TrangThaiBill.HUY ? "Hủy" :
                                                                    bill?.status == TrangThaiBill.TRA_HANG ? "Trả Hàng" : ""
                                    }
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Loại</span>}>{bill?.billFormat == "0" ? "Online" : bill?.billFormat == "1" ? "Offline" : bill?.billFormat == "2" ? "Giao Hàng" : "Khác"}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Địa Chỉ</span>}>{bill?.receiverDetails} {bill?.receiverCommune} {bill?.receiverDistrict} {bill?.receiverProvince}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Ghi Chú</span>}>{bill?.description}</Descriptions.Item>

                        </Descriptions>
                    </div>
                </div>


                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
                    <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                        <h4>Lịch Sử Thanh Toán</h4>
                        <div>
                            <Modal title="Xác Nhận Thanh Toán" width={600} open={isModalOpenPayment} footer={null} onCancel={() => { setIsModalOpenPayment(false) }} >
                                <div className='mt-4 mb-4'>
                                    <div className='flex justify-between mt-4'>
                                        <p>Số Tiền Cần Thanh Toán</p>
                                        <span className='text-rose-600	font-medium	'>{fixMoney(bill?.intoMoney)}</span>
                                    </div>
                                    <div className='mt-4'>
                                        <label>Tiền Khách Đưa</label>
                                        <Input
                                            min={0}
                                            formatter={(value) => `${value}VNĐ`}
                                            parser={(value) => value.replace('VNĐ', '')}
                                            className='mt-2' placeholder="Nhập Tiền Khách Đưa" value={paymentHistory?.customMoney}
                                            onChange={(event) => {
                                                setPaymentHistory({
                                                    ...paymentHistory,
                                                    customMoney: event.target.value,
                                                    refundsMoney: event.target.value - bill?.intoMoney
                                                })

                                            }}
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <label>Tiền Thừa</label>
                                        <Input
                                            min={0}
                                            formatter={(value) => `${value}VNĐ`}
                                            parser={(value) => value.replace('VNĐ', '')}
                                            className='mt-2' disabled placeholder="Nhập Tiền Khách Đưa" value={paymentHistory?.refundsMoney} />
                                    </div>
                                    <div className='mt-4'>
                                        <label>Ghi Chú</label>
                                        <Input.TextArea className='mt-2' rows={5} placeholder='Ghi Chú' value={paymentHistory?.description}
                                            onChange={(event) => {
                                                setPaymentHistory({
                                                    ...paymentHistory,
                                                    description: event.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <div>
                                            <div className='mb-4'>Phương Thức Thanh Toán</div>
                                            <Radio.Group value={paymentHistory?.paymentMethod} size="large" style={{ width: '100%' }} buttonStyle="solid" radioButtonStyle="none"
                                                onChange={(e) => {
                                                    setPaymentHistory(
                                                        {
                                                            ...paymentHistory,
                                                            paymentMethod: e.target.value
                                                        }
                                                    )

                                                }}>
                                                <div className='flex justify-between'>
                                                    <Radio.Button className='text-center ' style={{ width: '48%' }} value="0"><FontAwesomeIcon icon={faMoneyBill1}></FontAwesomeIcon> <span className='ml-2'>Tiền Mặt</span> </Radio.Button>
                                                    <Radio.Button className='text-center' style={{ width: '48%' }} value="1"><FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon> <span className='ml-2'>Chuyển khoản</span> </Radio.Button>
                                                </div>
                                                {/* <Radio.Button className='text-center mt-4' style={{ width: '100%' }} value="2">Tiền Mặt & Chuyển khoản</Radio.Button> */}
                                            </Radio.Group>
                                        </div>
                                        <div className='mt-4' style={{ visibility: paymentHistory && paymentHistory?.paymentMethod == "1" ? 'visible' : 'hidden' }}>
                                            <Input
                                                className='mt-2'
                                                placeholder="Nhập Mã Giao Dịch"
                                                value={paymentHistory.tradingCode}
                                                onChange={(e) => {
                                                    setPaymentHistory({
                                                        ...paymentHistory,
                                                        tradingCode: e.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className='mt-14'>
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={handleConfigPaymentHistory} >Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenPayment(false) }}>Hủy</Button>
                                    </div>
                                </div>
                            </Modal>

                            {
                                bill?.status != TrangThaiBill.HUY && bill?.lstPaymentHistory.length == "0" && <Button danger onClick={() => {
                                    setIsModalOpenPayment(true)
                                }}>Xác Nhận Thanh Toán</Button>

                            }
                        </div>
                    </div>
                    <div>
                        <BillPaymentHistory bill={bill} fetchDataBill={fetchDataBill} lstPaymentHistory={bill?.lstPaymentHistory} ></BillPaymentHistory>
                    </div>
                </div>

                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>

                    <div>
                        <BillProducts bill={bill} fetchDataBill={fetchDataBill} lstBillDetails={lstBillDetails}></BillProducts>
                    </div>
                </div>
                {lstBillDetailsReturn.length > 0 &&
                    <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>

                        <div>
                            <BillProductsBack bill={bill} fetchDataBill={fetchDataBill} lstBillDetailsReturn={lstBillDetailsReturn}></BillProductsBack>
                        </div>
                    </div>
                }


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
            <ToastContainer />

        </>
    );
}

export default BillDetail;