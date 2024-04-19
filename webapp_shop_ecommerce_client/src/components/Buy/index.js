import './Buy.css';
import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Table, Alert } from 'antd';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1, faCreditCard, faTicket } from '@fortawesome/free-solid-svg-icons';
import { fixMoney } from '~/ultils/fixMoney';
import { ExclamationCircleFilled } from '@ant-design/icons';
import DataContext from "~/DataContext";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { confirm } = Modal

function Buy() {
    const { dataCheckout, handlePaymentBill, shipMoney, voucherMoney, setDataPaymentMethods, intoMoney, totalPrice, customer, voucher, setDataVoucher } = useContext(DataContext);
    const [isModalOpenVoucher, setIsModalOpenVoucher] = useState(false);
    const [lstDataVoucher, setLstDataVoucher] = useState([]);
    const [lstDataTableVoucher, setLstDataTableVoucher] = useState([]);

    const DiscountType = {
        GIAM_TRUC_TIEP: '0',
        GIAM_PHAN_TRAM: "1",
    }
    const columnsVoucher = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá Trị Giảm',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Giá Trị Giảm Tối Đa',
            dataIndex: 'maxDiscountValue',
            key: 'maxDiscountValue',
        },
        {
            title: 'Đơn Tối Thiểu',
            dataIndex: 'orderMinValue',
            key: 'orderMinValue',
        },
        {
            title: 'Ngày Kết Thúc',
            dataIndex: 'endDate',
            key: 'endDate',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },

    ];

    const fetchDataVoucher = async () => {
        if (customer == null) {
            setDataVoucher(null);
            setLstDataVoucher([])
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/v1/voucher/customer/' + customer.id)
            console.log(response.data);
            setLstDataVoucher(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataVoucher();
    }, [customer])
    useEffect(() => {
        fillDateTableVoucher()
        setDataVoucher(null)
    }, [lstDataVoucher])

    const fillDateTableVoucher = () => {
        const dataTable = lstDataVoucher.map((item, index) => {
            return {
                key: index,
                //idVoucher Detail
                id: item.id,
                index: index + 1,
                code: item.code,
                name: item.name,
                value: <>
                    {item.discountType == DiscountType.GIAM_TRUC_TIEP ? fixMoney(item.value) : item.value + " %"}
                </>,
                maxDiscountValue: fixMoney(item.maxDiscountValue),
                orderMinValue: fixMoney(item.orderMinValue),
                endDate: dayjs(item.endDate).format('YYYY-MM-DD HH:mm:ss'),
                action: <Button key={index} danger onClick={() => {
                    handleUseVoucher(item)
                }}>Chọn</Button>
            }
        })
        setLstDataTableVoucher(dataTable)
    }

    const handleUseVoucher = (voucher) => {
        setIsModalOpenVoucher(false);
        setDataVoucher(voucher)

    }

    const handleQuitUseVoucher = () => {
        setIsModalOpenVoucher(false);
        setDataVoucher(null)
        console.log("Bỏ sử dụng");
    }
    const showModalVoucher = () => {
        setIsModalOpenVoucher(true);
    };
    const handleOkVoucher = () => {
        setIsModalOpenVoucher(false);
    };
    const handleCancelVoucher = () => {
        setIsModalOpenVoucher(false);
    };

    const handleRadioChange = (e) => {
        console.log(e.target.value);
        setDataPaymentMethods(e.target.value);
    };
    useEffect(() => {
        console.log(dataCheckout);
    }, [dataCheckout])
    const showConfirm = () => {
        confirm({
            title: 'Xác Nhận?',
            icon: <ExclamationCircleFilled />,
            content: 'Xác Nhận Thanh Toán ?',
            onOk() {
                handlePaymentBill()
            },
            okText: 'Đồng ý',
            cancelText: 'Thoát',
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    return (
        <>
            <div className='shadow-md px-6 py-4 bg-white	'>
                <div className='mb-4 pb-4' style={{
                    borderBottom: '1px solid rgb(232, 232, 232)'
                }}>
                    <h4>Thanh Toán</h4>
                </div>
                <div className=''>
                    <div className='pb-4 mb-4' style={{
                        borderBottom: '1px solid rgb(232, 232, 232)'
                    }}>
                        <div className='mb-4'>Phiếu giảm giá</div>

                        <div className='flex justify-between items-center	'>
                            <div className='flex'>
                                <div>Mã: </div>
                                <div>{voucher?.code}</div>
                            </div>
                            <Button onClick={showModalVoucher} className='flex items-center'><FontAwesomeIcon icon={faTicket}></FontAwesomeIcon> <span className='ml-2'>Chọn phiếu giảm giá</span></Button>
                        </div>
                        {
                            voucher && <>
                                <Alert className='mt-4' message={
                                    <>
                                        <div className='flex justify-between flex-col'>
                                            <h4>{voucher?.name}</h4>
                                            <span className='text-xl	'>
                                                Giảm Giá {voucher?.discountType == 1 ?
                                                    voucher?.value + "%" :
                                                    fixMoney(voucher?.value)
                                                } Cho Đơn Hàng
                                            </span>
                                        </div>
                                    </>
                                } type="warning" />
                            </>
                        }

                        <Modal footer={null} width={1000} title="Chọn phiếu giảm giá" open={isModalOpenVoucher} onOk={handleOkVoucher} onCancel={handleCancelVoucher}>
                            <div>
                                <Table dataSource={lstDataTableVoucher} columns={columnsVoucher} />;
                            </div>
                            <div className='flex justify-end'>
                                <Button type='primary' onClick={handleQuitUseVoucher}>Bỏ Áp Dụng</Button>
                                <Button className='ml-4' onClick={fetchDataVoucher}>Làm Mới</Button>
                                <Button className='ml-4' onClick={handleCancelVoucher}>Thoát</Button>
                            </div>
                        </Modal>

                    </div>

                    <div className='mb-4'>
                        <div className='mb-4'>Phương Thức Thanh Toán</div>

                        <Radio.Group onChange={handleRadioChange} defaultValue="0" size="large" style={{ width: '100%' }} buttonStyle="solid" radioButtonStyle="none">
                            <div className='flex justify-between'>
                                <Radio.Button className='text-center ' style={{ width: '48%' }} value="0"><FontAwesomeIcon icon={faMoneyBill1}></FontAwesomeIcon> <span className='ml-2 text-xl'>Thanh toán khi nhận hàng</span> </Radio.Button>
                                <Radio.Button className='text-center' style={{ width: '48%' }} value="1"><FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon> <span className='ml-2 text-xl'>Chuyển khoản VNPay</span> </Radio.Button>
                            </div>
                            {/* <Radio.Button className='text-center mt-4' style={{ width: '100%' }} value="2">Tiền Mặt & Chuyển khoản</Radio.Button> */}
                        </Radio.Group>
                    </div>


                    <div className='text-2xl leading-loose'>
                        <div className='flex justify-between'>
                            <div>
                                <div>Tiền Hàng:</div>
                                <div>Giảm Giá:</div>
                                <div>Phí Vận Chuyên:</div>
                                <div>Tổng Tiền:</div>
                            </div>
                            <div className='font-medium text-end'>
                                <div>{fixMoney(totalPrice)}</div>
                                <div>{fixMoney(voucherMoney)}</div>
                                <div>{fixMoney(shipMoney)}</div>
                                <div className='text-rose-600	'>{fixMoney(intoMoney)}</div>
                            </div>
                        </div>

                    </div>

                    <div className='w-full mt-10 mb-10'>
                        <Button className='w-full h-20' type="primary" onClick={showConfirm}  >
                            Thanh Toán
                        </Button>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Buy;