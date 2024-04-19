
import LayoutProfile from "~/components/LayoutProfile";
import { Tabs, Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { fixMoney } from "~/ultils/fixMoney";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Scrollbar } from 'react-scrollbars-custom';
import { useContext } from "react";
import DataContext from "~/DataContext";
import axios from "axios";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function HistoryOder() {
    const TrangThaiBill = {
        TAT_CA: '',
        TAO_DON_HANG: "-1",
        CHO_XAC_NHAN: "0",
        DA_XAC_NHAN: "1",
        VAN_CHUYEN: "2",
        DA_THANH_TOAN: "3",
        HOAN_THANH: "4",
        HUY: "5",
        TRA_HANG: "6",
        DANG_BAN: "7",
        CHO_THANH_TOAN: "8",
        NEW: "New",
    }


    const tabs = [
        {
            key: TrangThaiBill.TAT_CA,
            label: 'Tất Cả',
        },
        {
            key: TrangThaiBill.CHO_XAC_NHAN,
            label: 'Chờ Xác Nhận',
        },
        {
            key: TrangThaiBill.DA_XAC_NHAN,
            label: 'Đã Xác Nhận',
        },
        {
            key: TrangThaiBill.VAN_CHUYEN,
            label: 'Vận Chuyển',
        },
        {
            key: TrangThaiBill.HOAN_THANH,
            label: 'Hoàn Thành',
        },
        {
            key: TrangThaiBill.HUY,
            label: 'Hủy',
        },
        {
            key: TrangThaiBill.CHO_THANH_TOAN,
            label: 'Chờ Thanh Toán',
        },
    ];
    const [lstBill, setLstBill] = useState([])
    const [status, setStatus] = useState('');
    const { loading, setDataLoading } = useContext(DataContext);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/bill', {
            params: {
                status: status
            }
        })
            .then(response => {
                setLstBill(response.data)
            })
            .catch(err => {

            })
    }, [status])
    const onChange = (key) => {
        console.log(key);
        setStatus(key);
    };
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

    return (<>

        <LayoutProfile>
            <div>
                <Tabs defaultActiveKey="-1" items={tabs} onChange={onChange} />
            </div>

            <Scrollbar style={{
                width: '100%',
                height: '400px',
            }}>

                {
                    lstBill?.map((bill, index) => {
                        return (
                            <div key={index} className="mt-4 mr-4" style={{
                                borderBottom: '1px solid rgb(229 231 235)'
                            }}>
                                <div className="flex justify-between items-center ">
                                    <h4 className="text-2xl	font-medium	">Mã: {bill.codeBill}</h4>

                                    <div>
                                        {
                                            bill?.status == TrangThaiBill.TAO_DON_HANG ? <Tag color="#108ee9">Tạo Đơn Hàng"</Tag> :
                                                bill?.status == TrangThaiBill.CHO_THANH_TOAN ? <Tag color="#108ee9">Chờ Thanh Toán</Tag> :
                                                    bill?.status == TrangThaiBill.CHO_XAC_NHAN ? <Tag color="#108ee9">Chờ Xác Nhận</Tag> :
                                                        bill?.status == TrangThaiBill.DA_XAC_NHAN ? <Tag color="#108ee9">Đã Xác Nhận</Tag> :
                                                            bill?.status == TrangThaiBill.VAN_CHUYEN ? <Tag color="#108ee9">Đang Vận Chuyển</Tag> :
                                                                bill?.status == TrangThaiBill.HOAN_THANH ? <Tag color="#87d068">Hoàn Thành</Tag> :
                                                                    bill?.status == TrangThaiBill.HUY ? <Tag color="#eb2727">Hủy</Tag> :
                                                                        bill?.status == TrangThaiBill.TRA_HANG ? <Tag color="#108ee9">Trả Hàng</Tag> : <Tag color="#108ee9">Khác</Tag>
                                        }
                                    </div>
                                </div>
                                <div className="flex mt-2 justify-between text-2xl font-normal	">
                                    <div className="mt-2">
                                        <div>
                                            Tổng Số Sản Phẩm
                                        </div>
                                        <div className="mt-2">
                                            Ngày Tạo: <span>{dayjs(bill.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mt-2">
                                            Tiền Ship: <span className="font-medium	">{fixMoney(bill.shipMoney)}</span>
                                        </div>
                                        <div className="mt-2">
                                            Tổng Tiền: <span className="font-medium	text-red-500	">{fixMoney(bill.intoMoney)}</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex justify-end mt-6 mb-4">
                                    {
                                        bill?.status == TrangThaiBill.CHO_THANH_TOAN &&
                                        <Button danger className="mr-4" onClick={() => {
                                            buyPayment(bill?.codeBill)
                                        }}>Thanh Toán Ngay</Button>
                                    }

                                    <Link to={"/historyOrder/" + bill.codeBill}>
                                        <Button type="primary">Xem Chi Tiết</Button>
                                    </Link>
                                </div>

                            </div>
                        )
                    })
                }
            </Scrollbar>


        </LayoutProfile>

    </>
    );
}

export default HistoryOder;