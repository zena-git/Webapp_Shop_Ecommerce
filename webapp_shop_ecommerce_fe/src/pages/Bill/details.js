import { useParams, Link } from 'react-router-dom';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Radio, Table, Typography, Button, Descriptions, Tag, Slider, Select, Tooltip, Space, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import hexToColorName from "~/ultils/HexToColorName";
import { useDebounce } from '~/hooks';
import { AiOutlineCloseCircle } from "react-icons/ai";

import { fixMoney } from '~/ultils/fixMoney';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import { FaBug, FaCheckCircle, FaRegFileAlt } from 'react-icons/fa';
import { LoadingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import BillAddress from '~/components/BillAddress';
import BillPaymentHistory from '~/components/BillPaymentHistory';
import BillProducts from '~/components/BillProducts';
import BillProductsBack from '~/components/BillProductsBack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AxiosIns from '../../lib/auth'

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
        DA_XAC_NHAN: "1",
        CHO_GIA0: "2",
        DANG_GIAO: "3",
        HOAN_THANH: "4",
        DA_THANH_TOAN: "5",
        HUY: "6",
        TRA_HANG: "10",
        DANG_BAN: "7",
        CHO_THANH_TOAN: "8",
        HOAN_TIEN: "9",
        NEW: "New",
    }
    const BillType = {
        ONLINE: "0",
        OFFLINE: "1",
        DELIVERY: "2",
    }
    const fetchDataBill = async () => {
        try {
            const response = await AxiosIns.get('v1/bill/show/' + id);
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
            AxiosIns.get(`v1/bill/show/${billId}/billdetails/products`)
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
            AxiosIns.get(`v1/bill/show/${billId}/billdetails/products/returns`)
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
    const [isModalOpenConfirmWaitDelivery, setIsModalOpenConfirmWaitDelivery] = useState(false);
    const [isModalOpenConfirmDelivery, setIsModalOpenConfirmDelivery] = useState(false);
    const [isModalOpenConfirmCompletion, setIsModalOpenConfirmCompletion] = useState(false);
    const [isModalOpenTimelineDetails, setIsModalOpenTimelineDetails] = useState(false);
    const [isModalOpenCancelling, setIsModalOpenCancelling] = useState(false);
    const [confirmAcceptOrderDes, setConfirmAcceptOrderDes] = useState("")


    const [loadingConfirmRollback, setLoadingConfirmRollback] = useState(false);
    const [loadingConfirmAcceptOrder, setLoadingConfirmAcceptOrder] = useState(false);
    const [loadingConfirmWaitDelivery, setLoadingConfirmWaitDelivery] = useState(false);
    const [loadingConfirmDelivery, setLoadingConfirmDelivery] = useState(false);
    const [loadingConfirmCompletion, setLoadingConfirmCompletion] = useState(false);
    const [loadingCancelling, setLoadingCancelling] = useState(false);

    const showModalAddress = () => {
        setIsModalOpenAddress(true);
    };
    const handleCancelAddress = () => {
        setIsModalOpenAddress(false);
    };

    const handlePrintView = async () => {
        try {
            // Gọi API để lấy dữ liệu hóa đơn
            const response = await AxiosIns.get(`v3/print/${bill?.codeBill}`, {
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
                        <Timeline minEvents={5} height="230">
                            <div className='w-[calc(100vw-280px)] overflow-x-auto flex'>
                                {bill?.lstHistoryBill.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map((historyBill, index) => {
                                    return (
                                        <TimelineEvent
                                            key={index}
                                            color={historyBill?.type == TrangThaiBill.HOAN_THANH ? "#00c11d" : historyBill?.type == TrangThaiBill.HUY ? "#dc2020" : "#108ee9"}
                                            icon={historyBill?.type == TrangThaiBill.HOAN_THANH ? FaCheckCircle : historyBill?.type == TrangThaiBill.HUY ? AiOutlineCloseCircle : FaRegFileAlt}
                                            title=<h4 className='text-2xl	'>{historyBill?.type == "-1" ? "Tạo Đơn Hàng" :
                                                historyBill?.type == TrangThaiBill.CHO_THANH_TOAN ? "Chờ Thanh Toán" :
                                                    historyBill?.type == TrangThaiBill.CHO_XAC_NHAN ? "Chờ Xác Nhận" :
                                                        historyBill?.type == TrangThaiBill.DA_XAC_NHAN ? "Đã Xác Nhận" :
                                                            historyBill?.type == TrangThaiBill.CHO_GIA0 ? "Chờ Giao" :
                                                                historyBill?.type == TrangThaiBill.DANG_GIAO ? "Đang Giao" :
                                                                    historyBill?.type == TrangThaiBill.DA_THANH_TOAN ? "Đã Thanh Toán" :
                                                                        historyBill?.type == TrangThaiBill.HOAN_THANH ? "Hoàn Thành" :
                                                                            historyBill?.type == TrangThaiBill.HUY ? "Hủy" :
                                                                                historyBill?.type == TrangThaiBill.HOAN_TIEN ? "Hoàn Tiền" :
                                                                                    historyBill?.type == TrangThaiBill.TRA_HANG ? "Trả Hàng" : "Khác"
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
                    <div className='flex justify-end mt-2'>
                        <Modal title="Quay Lại Trạng Thái Đơn Hàng" width={500} open={isModalOpenConfirmRollback} footer={null} onCancel={() => { setIsModalOpenConfirmRollback(false) }} >
                            <label>Nội Dung</label>
                            <Input.TextArea rows={5} minLength={50} placeholder='Ghi Chú' value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                            <div className='flex justify-end mt-4 gap-3'>
                                <Button type='primary' onClick={() => {
                                    setLoadingConfirmRollback(true);
                                    AxiosIns.post(`v1/bill/${bill.id}/historyBill`, {
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
                                        .finally(() => {
                                            setTimeout(() => {
                                                setLoadingConfirmRollback(false);
                                            }, 500)
                                        })
                                }}>Xác nhận</Button>
                                <Button type='default' onClick={() => { setIsModalOpenConfirmRollback(false) }}>Hủy</Button>
                            </div>
                            {loadingConfirmRollback && (
                                <div className='absolute top-0 left-0 right-0 bottom-0 bottom-0 flex items-center justify-center' style={{
                                    backgroundColor: 'rgba(146, 146, 146, 0.16)',
                                }}>
                                    <LoadingOutlined className='text-6xl text-rose-500	' />
                                </div>
                            )}
                        </Modal>
                        {bill && (bill.status == TrangThaiBill.DA_XAC_NHAN || bill.status == TrangThaiBill.CHO_GIA0 || bill.status == TrangThaiBill.DANG_GIAO) && bill?.billFormat == BillType.DELIVERY && <Button type='primary' onClick={() => { setIsModalOpenConfirmRollback(true) }}>Quay lại trạng thái trước</Button>}
                    </div>

                </div>


                <div className='bg-white p-4 mt-6 mb-10 pt-6 pb-6 shadow-lg '>
                    <div className='flex justify-between	'>
                        <div className='flex'>

                            <div>
                                <Modal title="Xác Nhận Đơn Hàng" width={500} open={isModalOpenConfirmAcceptOrder} footer={null} onCancel={() => { setIsModalOpenConfirmAcceptOrder(false) }} >
                                    <label>Ghi Chú</label>
                                    <Input.TextArea placeholder='Ghi chú' className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            setLoadingConfirmAcceptOrder(true);
                                            AxiosIns.post(`v1/bill/${bill.id}/historyBill`, {
                                                type: TrangThaiBill.DA_XAC_NHAN,
                                                description: confirmAcceptOrderDes
                                            }).then(response => {
                                                setConfirmAcceptOrderDes("")
                                                fetchDataBill();
                                                toast.success(response.data.message);
                                                setIsModalOpenConfirmAcceptOrder(false)
                                            }).catch(err => {
                                                toast.error(err.response.data.message);
                                            })
                                                .finally(() => {
                                                    setTimeout(() => {
                                                        setLoadingConfirmAcceptOrder(false);
                                                    }, 500)
                                                })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenConfirmAcceptOrder(false) }}>Hủy</Button>
                                    </div>
                                    {loadingConfirmAcceptOrder && (
                                        <div className='absolute top-0 left-0 right-0 bottom-0 bottom-0 flex items-center justify-center' style={{
                                            backgroundColor: 'rgba(146, 146, 146, 0.16)',
                                        }}>
                                            <LoadingOutlined className='text-6xl text-rose-500	' />
                                        </div>
                                    )}
                                </Modal>
                                {
                                    bill && (bill.status == TrangThaiBill.CHO_XAC_NHAN || bill.status == TrangThaiBill.CHO_THANH_TOAN) && <Button danger onClick={() => {
                                        setIsModalOpenConfirmAcceptOrder(true);
                                    }}  >Xác Nhận Đơn Hàng</Button>
                                }
                            </div>

                            <div>
                                <Modal title="Xác Nhận Chờ Giao" width={500} open={isModalOpenConfirmWaitDelivery} footer={null}
                                    onCancel={() => { setIsModalOpenConfirmWaitDelivery(false) }} >
                                    <label>Ghi Chú</label>
                                    <Input.TextArea placeholder='Ghi chú' className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            setLoadingConfirmWaitDelivery(true);
                                            AxiosIns.post(`v1/bill/${bill.id}/historyBill`, {
                                                type: TrangThaiBill.CHO_GIA0,
                                                description: confirmAcceptOrderDes
                                            }).then(res => {
                                                setConfirmAcceptOrderDes("")
                                                fetchDataBill();
                                                toast.success(res.data.message);
                                                setIsModalOpenConfirmWaitDelivery(false)
                                            }).catch(err => {
                                                toast.error(err.response.data.message);
                                            })
                                                .finally(() => {
                                                    setTimeout(() => {
                                                        setLoadingConfirmWaitDelivery(false);
                                                    }, 500)
                                                })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenConfirmWaitDelivery(false) }}>Hủy</Button>
                                    </div>
                                    {loadingConfirmWaitDelivery && (
                                        <div className='absolute top-0 left-0 right-0 bottom-0 bottom-0 flex items-center justify-center' style={{
                                            backgroundColor: 'rgba(146, 146, 146, 0.16)',
                                        }}>
                                            <LoadingOutlined className='text-6xl text-rose-500	' />
                                        </div>
                                    )}
                                </Modal>

                                {
                                    bill && bill.status == TrangThaiBill.DA_XAC_NHAN && <Button danger onClick={() => {
                                        setIsModalOpenConfirmWaitDelivery(true)
                                    }}  >Chờ Giao</Button>
                                }
                            </div>

                            <div>
                                <Modal title="Xác Nhận Giao Hàng" width={500} open={isModalOpenConfirmDelivery} footer={null} onCancel={() => { setIsModalOpenConfirmDelivery(false) }} >
                                    <label>Ghi Chú</label>
                                    <Input.TextArea placeholder='Ghi chú' className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            setLoadingConfirmDelivery(true);
                                            AxiosIns.post(`v1/bill/${bill.id}/historyBill`, {
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
                                                .finally(() => {
                                                    setTimeout(() => {
                                                        setLoadingConfirmDelivery(false);
                                                    }, 500)
                                                })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenConfirmDelivery(false) }}>Hủy</Button>
                                    </div>

                                    {loadingConfirmDelivery && (
                                        <div className='absolute top-0 left-0 right-0 bottom-0 bottom-0 flex items-center justify-center' style={{
                                            backgroundColor: 'rgba(146, 146, 146, 0.16)',
                                        }}>
                                            <LoadingOutlined className='text-6xl text-rose-500	' />
                                        </div>
                                    )}
                                </Modal>

                                {
                                    bill && bill.status == TrangThaiBill.CHO_GIA0 && <Button danger onClick={() => {
                                        setIsModalOpenConfirmDelivery(true)
                                    }}  >Giao Hàng</Button>
                                }
                            </div>

                            <div>
                                <Modal title="Xác Nhận Hoàn Thành" width={500} open={isModalOpenConfirmCompletion} footer={null} onCancel={() => { setIsModalOpenConfirmCompletion(false) }} >
                                    <label>Ghi Chú</label>
                                    <Input.TextArea placeholder='Ghi chú' className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            const filterPayment = bill?.lstPaymentHistory?.filter(data => data?.type == "0");
                                            const filterPaymentReturn = bill?.lstPaymentHistory?.filter(data => data?.type == "1") || [];

                                            var totalPayment = filterPayment?.reduce(function (acc, cur) {
                                                return acc + cur.paymentAmount;
                                            }, 0);


                                            var totalPaymentReturn = filterPaymentReturn?.reduce(function (acc, cur) {
                                                return acc + cur.paymentAmount;
                                            }, 0);

                                            if (bill?.intoMoney != (totalPayment - totalPaymentReturn)) {
                                                toast.error("Không Thể Hoàn Thành Khi Chưa Thanh Toán Đủ!");
                                                setIsModalOpenConfirmCompletion(false)
                                                return;
                                            }
                                            setLoadingConfirmCompletion(true);
                                            AxiosIns.post(`v1/bill/${bill.id}/historyBill`, {
                                                type: TrangThaiBill.HOAN_THANH,
                                                description: confirmAcceptOrderDes
                                            }).then(res => {
                                                setConfirmAcceptOrderDes("")
                                                fetchDataBill();
                                                toast.success(res.data.message);
                                                setIsModalOpenConfirmCompletion(false)
                                            }).catch(err => {
                                                toast.error(err.response.data.message);
                                            }).finally(() => {
                                                setTimeout(() => {
                                                    setLoadingConfirmCompletion(false);
                                                }, 500)
                                            })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenConfirmCompletion(false) }}>Hủy</Button>
                                    </div>
                                    {loadingConfirmCompletion && (
                                        <div className='absolute top-0 left-0 right-0 bottom-0 bottom-0 flex items-center justify-center' style={{
                                            backgroundColor: 'rgba(146, 146, 146, 0.16)',
                                        }}>
                                            <LoadingOutlined className='text-6xl text-rose-500	' />
                                        </div>
                                    )}
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
                                    <Input.TextArea placeholder='Ghi chú' className='mt-2' rows={5} value={confirmAcceptOrderDes} onChange={e => setConfirmAcceptOrderDes(e.target.value)} />
                                    <div className='flex justify-end mt-4 gap-3'>
                                        <Button type='primary' onClick={() => {
                                            setLoadingCancelling(true);
                                            AxiosIns.put(`v1/bill/${bill?.id}/cancelling`, {
                                                description: confirmAcceptOrderDes
                                            })
                                                .then(res => {
                                                    fetchDataBill();
                                                    toast.success(res.data.message);
                                                    setConfirmAcceptOrderDes("")
                                                    setIsModalOpenCancelling(false)
                                                }).catch(err => {
                                                    toast.error(err.response.data.message);
                                                }).finally(() => {
                                                    setTimeout(() => {
                                                        setLoadingCancelling(false);
                                                    }, 500)
                                                })
                                        }}>Xác nhận</Button>
                                        <Button type='default' onClick={() => { setIsModalOpenCancelling(false) }}>Hủy</Button>
                                    </div>
                                    {loadingCancelling && (
                                        <div className='absolute top-0 left-0 right-0 bottom-0 bottom-0 flex items-center justify-center' style={{
                                            backgroundColor: 'rgba(146, 146, 146, 0.16)',
                                        }}>
                                            <LoadingOutlined className='text-6xl text-rose-500	' />
                                        </div>
                                    )}
                                </Modal>

                                {
                                    bill && (bill?.status == TrangThaiBill.DA_XAC_NHAN || bill?.status == TrangThaiBill.CHO_XAC_NHAN || bill?.status == TrangThaiBill.CHO_THANH_TOAN || bill?.status == TrangThaiBill.CHO_GIA0) && <Button onClick={() => {
                                        setIsModalOpenCancelling(true)
                                    }} type="primary" danger className='ml-4'>
                                        Hủy Đơn
                                    </Button>
                                }
                            </div>

                            <div>
                                {
                                    bill && (bill.status == TrangThaiBill.HOAN_THANH) && <Button onClick={() => {
                                        handlePrintView()
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
                                                type: <>{
                                                    history?.type == TrangThaiBill.TAO_DON_HANG ? <Tag color="#108ee9">Tạo Đơn Hàng</Tag> :
                                                        history?.type == TrangThaiBill.CHO_THANH_TOAN ? <Tag color="#108ee9">Chờ Thanh Toán</Tag> :
                                                            history?.type == TrangThaiBill.CHO_XAC_NHAN ? <Tag color="#108ee9">Chờ Xác Nhận</Tag> :
                                                                history?.type == TrangThaiBill.DA_XAC_NHAN ? <Tag color="#108ee9">Đã Xác Nhận</Tag> :
                                                                    history?.type == TrangThaiBill.CHO_GIA0 ? <Tag color="#108ee9">Chờ Giao</Tag> :
                                                                        history?.type == TrangThaiBill.DANG_GIAO ? <Tag color="#108ee9">Đang Giao</Tag> :
                                                                            history?.type == TrangThaiBill.DA_THANH_TOAN ? <Tag color="#108ee9">Đã Thanh Toán</Tag> :
                                                                                history?.type == TrangThaiBill.HOAN_THANH ? <Tag color="#00c11d">Hoàn Thành</Tag> :
                                                                                    history?.type == TrangThaiBill.HUY ? <Tag color="#dc2020">Hủy</Tag> :
                                                                                        history?.type == TrangThaiBill.HOAN_TIEN ? <Tag color="#108ee9">Hoàn Tiền</Tag> :
                                                                                            history?.type == TrangThaiBill.TRA_HANG ? <Tag color="#108ee9">Trả Hàng</Tag> : "Khác"
                                                }</>,
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
                                (bill?.status == TrangThaiBill.CHO_XAC_NHAN || bill?.status == TrangThaiBill.DA_XAC_NHAN) &&
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
                            <Descriptions.Item label={<span className='font-medium text-black'>Tên Khách Hàng</span>}>{bill?.customer ? bill?.customer?.fullName : "Khách lẻ"}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Tên Người Nhận</span>}>{bill?.receiverName}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Số Điện Thoại</span>}>{bill?.receiverPhone}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Loại</span>}> {bill?.billFormat == "0" ? <Tag color="#87d068">Online</Tag> : bill?.billFormat == "1" ? <Tag color="#108ee9">Offline</Tag> : bill?.billFormat == "2" ? <Tag color="#2db7f5">Giao Hàng</Tag> : "Khác"} </Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Trạng Thái</span>}>

                                {
                                    bill?.status == TrangThaiBill.TAO_DON_HANG ? <Tag color="#108ee9">Tạo Đơn Hàng</Tag> :
                                        bill?.status == TrangThaiBill.CHO_THANH_TOAN ? <Tag color="#108ee9">Chờ Thanh Toán</Tag> :
                                            bill?.status == TrangThaiBill.CHO_XAC_NHAN ? <Tag color="#108ee9">Chờ Xác Nhận</Tag> :
                                                bill?.status == TrangThaiBill.DA_XAC_NHAN ? <Tag color="#108ee9">Đã Xác Nhận</Tag> :
                                                    bill?.status == TrangThaiBill.CHO_GIA0 ? <Tag color="#108ee9">Chờ Giao</Tag> :
                                                        bill?.status == TrangThaiBill.DANG_GIAO ? <Tag color="#108ee9">Đang Giao</Tag> :
                                                            bill?.status == TrangThaiBill.HOAN_THANH ? <Tag color="#00c11d">Hoàn Thành</Tag> :
                                                                bill?.status == TrangThaiBill.HUY ? <Tag color="#dc2020">Hủy</Tag> :
                                                                    bill?.status == TrangThaiBill.TRA_HANG ? <Tag color="#87d068">Trả Hàng</Tag> : "Khác"
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Địa Chỉ</span>}>{bill?.receiverDetails} {bill?.receiverCommune} {bill?.receiverDistrict} {bill?.receiverProvince}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Ghi Chú</span>}>{bill?.description}</Descriptions.Item>

                        </Descriptions>
                    </div>
                </div>


                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
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
                                    <div>{bill?.lstVoucherDetails[0]?.voucher?.code}</div>
                                    <div>{bill?.lstVoucherDetails[0]?.voucher?.name}</div>
                                </div>
                            </div>
                        </div>

                        <div className='text-2xl leading-loose w-1/4'>
                            <div className='flex justify-between'>
                                <div>
                                    <div>Tiền Hàng:</div>
                                    <div>Giảm Giá:</div>
                                    <div>Phí Vận Chuyển:</div>
                                    <div>Tổng Tiền:</div>
                                </div>
                                <div className='font-medium text-end'>
                                    <div>{fixMoney(bill?.totalMoney)}</div>
                                    <div>- {fixMoney(bill?.voucherMoney)}</div>
                                    <div>{fixMoney(bill?.shipMoney)}</div>
                                    <div className='text-rose-600	'>{fixMoney(bill?.intoMoney)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='-z-50' id='printx'>

                </div>
            </div>
            <ToastContainer />

        </>
    );
}

export default BillDetail;