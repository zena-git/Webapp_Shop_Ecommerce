import OrderDetail from "~/components/OrderDetail";
import LayoutProfile from "~/components/LayoutProfile";
import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Tag } from 'antd';
import DataContext from "~/DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams, useNavigate } from "react-router-dom";
function HistoryOrderDetail() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
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
            const response = await axios.get('http://localhost:8080/api/v2/bill/codeBill/' + id);
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

        axios.post('http://localhost:8080/api/v1/payment', {
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
        axios.delete('http://localhost:8080/api/v2/bill/codeBill/' + id)
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
                <div className="mt-4 mb-4">
                    <Link to="/historyOrder">
                        <Button> Trở Lại</Button>
                    </Link>
                    {
                        (bill?.status == TrangThaiBill.CHO_THANH_TOAN ||
                            bill?.status == TrangThaiBill.CHO_XAC_NHAN ||
                            bill?.status == TrangThaiBill.CHO_GIAO) &&
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
                            {
                                (bill?.paymentMethod == '1' && bill?.CHO_THANH_TOAN) ?
                                    <>
                                        <div>
                                            <p>Vì bạn đã thanh toán chuyển khoản</p>
                                            <p>Bạn vui lòng liên hệ cửa hàng để hủy đơn hàng</p>
                                            <p>Hotline: 09123456789 </p>
                                            <p>Email: alice@alice.com </p>
                                        </div>
                                    </> :
                                    <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                            }
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