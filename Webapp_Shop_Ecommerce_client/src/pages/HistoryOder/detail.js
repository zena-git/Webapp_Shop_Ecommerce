import OrderDetail from "~/components/OrderDetail";
import LayoutProfile from "~/components/LayoutProfile";
import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Alert } from 'antd';
import DataContext from "~/DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosIns from '~/plugin/axios';
function HistoryOrderDetail() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const fetchDataBill = async () => {
        if (id == null) {
            return;
        }
        try {
            const response = await axiosIns.get('/api/v2/bill/codeBill/' + id);
            setBill(response.data);
            console.log(response.data);
            console.log(response.data.lstBillDetails);
        } catch (error) {
            setBill(null)
            console.error(error);
        }
    }
    useEffect(() => {
        fetchDataBill();
    }, [id]);
    const { loading, setDataLoading } = useContext(DataContext);

    const buyPayment = (codeBill) => {
        if (codeBill == null) {
            return;
        }
        setDataLoading(true);
        let returnUrl = window.location.origin;

        axiosIns.post('/api/v1/payment', {
            codeBill: codeBill,
            returnUrl: returnUrl
        })
            .then(response => {
                console.log(response.data);
                window.location.href = response.data.data;
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setDataLoading(false);
            })
    }

    const deleteBill = () => {
        if (id == null) {
            return;
        }
        setIsModalOpen(false);
        setDataLoading(true);
        axiosIns.delete('/api/v2/bill/codeBill/' + id)
            .then(response => {
                console.log(response.data);
                toast.success(response.data.message)
                fetchDataBill()
            })
            .catch(err => {
                console.log(err);
                toast.success(err.response.data.message)

            })
            .finally(() => {
                setDataLoading(false);
            })
    }
    return (
        <>
            <LayoutProfile>
                <div>
                    <div className="mt-4 mb-4">
                        <Link to="/historyOrder">
                            <Button> Trở Lại</Button>
                        </Link>
                        {
                            (bill?.status == TrangThaiBill.CHO_THANH_TOAN ||
                                bill?.status == TrangThaiBill.CHO_XAC_NHAN) &&
                            <Button className="ml-4" type="primary" onClick={showModal}> Hủy</Button>
                        }

                        {
                            bill?.status == TrangThaiBill.CHO_THANH_TOAN &&
                            <Button className="ml-4" danger onClick={() => {
                                buyPayment(id)
                            }}>Thanh Toán</Button>
                        }

                        <Modal title="Hủy Đơn Hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                            <div>
                                <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleCancel}>Thoát</Button>
                                {
                                    (bill?.paymentMethod == '1' && bill?.CHO_THANH_TOAN) ?
                                        <Button className="ml-4" type="primary" onClick={handleOk}>Xác Nhận</Button> :
                                        <Button className="ml-4" type="primary" onClick={() => {
                                            deleteBill()
                                        }}>Xác Nhận</Button>

                                }
                            </div>


                        </Modal>
                    </div>
                    {
                        bill?.status == TrangThaiBill.CHO_THANH_TOAN &&
                        <Alert message="Vui lòng thanh toán trước 23h59. Nếu không đơn hàng sẽ tự động hủy bởi hệ thống" type="warning" />
                    }

                </div>

                <div >
                    <OrderDetail bill={bill}>

                    </OrderDetail>
                </div>

                <ToastContainer></ToastContainer>
            </LayoutProfile>
        </>
    );
}

export default HistoryOrderDetail;