
import LayoutProfile from "~/components/LayoutProfile";
import { Tabs, Button, Tag, Badge, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { fixMoney } from "~/ultils/fixMoney";
import { SearchOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from "react-router-dom";
import { Scrollbar } from 'react-scrollbars-custom';
import { useDebounce } from '~/hooks';
import { useContext } from "react";
import DataContext from "~/DataContext";
import axios from "axios";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axiosIns from '~/plugin/axios';
dayjs.extend(customParseFormat);

function HistoryOder() {
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



    const [lstBill, setLstBill] = useState([])
    const [dataColumBill, setDataColumBill] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const { loading, setDataLoading } = useContext(DataContext);

    const debounceSearch = useDebounce(search.trim(), 500)
    const tabs = [
        {
            key: '-1',
            label: <Badge count={lstBill?.length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Tất Cả</span>
            </Badge>,
        },
        {
            key: TrangThaiBill.CHO_XAC_NHAN,
            label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.CHO_XAC_NHAN).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Chờ Xác Nhận</span>
            </Badge>,
        },
        {
            key: TrangThaiBill.DA_XAC_NHAN,
            label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.DA_XAC_NHAN).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Đã Xác Nhận</span>
            </Badge>,
        },
        {
            key: TrangThaiBill.CHO_GIA0,
            label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.CHO_GIA0).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Chờ Giao</span>
            </Badge>,
        },
        {
            key: TrangThaiBill.DANG_GIAO,
            label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.DANG_GIAO).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Đang Giao</span>
            </Badge>,
        },
        {
            key: TrangThaiBill.HOAN_THANH,
            label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.HOAN_THANH).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Hoàn Thành</span>
            </Badge>,
        },
        {
            key: TrangThaiBill.HUY,
            label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.HUY).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Hủy</span>
            </Badge>,
        },
        {
            key: TrangThaiBill.CHO_THANH_TOAN,
            label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.CHO_THANH_TOAN).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
                <span>Chờ Thanh Toán</span>
            </Badge>,
        },
    ];

    const fetchDataBill = async () => {

        try {
            const response = await axiosIns.get('/api/v2/bill'
                // , {
                //     params: {
                //         status: status
                //     }
                // }
            )
            console.log(response.data);
            setLstBill(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataBill();
    }, [status, debounceSearch])

    useEffect(() => {
        const dataTable = lstBill?.filter(bill => {
            // Lọc theo tên ,phone
            if (debounceSearch &&
                !(bill?.codeBill?.toLowerCase().includes(debounceSearch.toLowerCase())
                )) {
                return false;
            }

            if (status &&
                !(bill?.status?.toLowerCase().includes(status.toLowerCase()))) {
                return false;
            }
            return true;
        })

        setDataColumBill(dataTable);
    }, [lstBill]);
    const onChange = (key) => {
        if (key == -1) {
            setStatus('')
        } else {
            setStatus(key);
        }
    };
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
    const handleInputSearch = (e) => {
        console.log(e.target.value);
        setSearch(e.target.value);
    }
    return (<>

        <LayoutProfile>
            <div>
                <Tabs defaultActiveKey="-1" items={tabs} onChange={onChange} />
            </div>

            <div className="mb-4">
                <Input placeholder="Nhập mã hóa đơn hoặc số điện thoại" prefix={<SearchOutlined />} value={search} onChange={handleInputSearch} />
            </div>

            <Scrollbar style={{
                width: '100%',
                height: '400px',
            }}>

                {
                    dataColumBill?.map((bill, index) => {
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
                                                            bill?.status == TrangThaiBill.CHO_GIA0 ? <Tag color="#108ee9">Chờ Giao</Tag> :
                                                                bill?.status == TrangThaiBill.DANG_GIAO ? <Tag color="#108ee9">Đang Giao</Tag> :
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
                                        <div>
                                            <Button danger className="mr-4" onClick={() => {
                                                buyPayment(bill?.codeBill)
                                            }}>Thanh Toán Ngay</Button>
                                        </div>

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