import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Table, Input, Alert, Switch } from 'antd';
import axios from "axios";
import { useOrderData } from '~/provider/OrderDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1, faCreditCard, faTicket } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { fixMoney } from '~/ultils/fixMoney';
import { ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { confirm } = Modal
function OrderBuy() {
    //provider
    const { voucher, setDataVoucher, handlePaymentBill, totalPrice, intoMoney, setDataShipMoney, isDelivery, shipMoney, voucherMoney, paymentCustomer, setDataIsDelivery, setDataPaymentCustomer, setDataPaymentMethods, moneyPaid, paymentMethods, customer } = useOrderData();

    const [isModalOpenVoucher, setIsModalOpenVoucher] = useState(false);
    const [lstDataVoucherDetail, setLstDataVoucherDetail] = useState([]);
    const [lstDataTableVoucher, setLstataTableVoucher] = useState([]);

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
            setLstDataVoucherDetail([])
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/v1/voucherDetails/customer/' + customer.id)
            console.log(response.data);
            setLstDataVoucherDetail(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataVoucher();
    }, [customer])

    useEffect(() => {
        fillDateTableVoucher()
    }, [lstDataVoucherDetail])

    const fillDateTableVoucher = () => {
        const dataTable = lstDataVoucherDetail.map((item, index) => {
            return {
                key: index,
                //idVoucher Detail
                id: item.id,
                index: index + 1,
                code: item.voucher.code,
                name: item.voucher.name,
                value: item.voucher.value,
                maxDiscountValue: item.voucher.maxDiscountValue,
                orderMinValue: item.voucher.orderMinValue,
                endDate: dayjs(item.voucher.endDate).format('YYYY-MM-DD HH:mm:ss'),
                action: <Button key={index} danger onClick={() => {
                    handleUseVoucher(item)
                }}>Chọn</Button>
            }
        })
        setLstataTableVoucher(dataTable)
    }

    const handleUseVoucher = (voucher) => {
        setIsModalOpenVoucher(false);

        setDataVoucher(voucher)
        const id = voucher.id
        console.log(voucher.voucher.code);
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
    useEffect(() => {
        if (!isDelivery) {
            setDataShipMoney(0)
        }
    }, [isDelivery])

    const handleRadioChange = (e) => {
        setDataPaymentMethods(e.target.value);
    };

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
            <div className="">
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
                                <div>{voucher?.voucher?.code}</div>
                            </div>
                            <Button onClick={showModalVoucher} className='flex items-center'><FontAwesomeIcon icon={faTicket}></FontAwesomeIcon> <span className='ml-2'>Chọn phiếu giảm giá</span></Button>
                        </div>
                        {
                            voucher && <>
                                <Alert className='mt-4' message={
                                    <>
                                        <div className='flex justify-between flex-col'>
                                            <h4>{voucher?.voucher?.name}</h4>
                                            <span className='text-xl	'>
                                                Giảm Giá {voucher?.voucher?.discountType == 0?
                                                    voucher?.voucher?.value+ "%": 
                                                    fixMoney(voucher?.voucher?.value)
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

                    <div className='mb-4'
                        style={{ display: customer === null ? 'none' : 'block' }}
                    >
                        <div className='mb-2'>
                            Hình Thức
                        </div>

                        <Switch
                            checkedChildren="Giao Hàng"
                            unCheckedChildren="Tại Quầy"
                            value={isDelivery} onChange={() => setDataIsDelivery()} />
                    </div>

                    <div className='mb-4'>
                        <div className='mb-4'>Phương Thức Thanh Toán</div>

                        <Radio.Group onChange={handleRadioChange} defaultValue="0" size="large" style={{ width: '100%' }} buttonStyle="solid" radioButtonStyle="none">
                            <div className='flex justify-between'>
                                <Radio.Button className='text-center ' style={{ width: '48%' }} value="0"><FontAwesomeIcon icon={faMoneyBill1}></FontAwesomeIcon> <span className='ml-2'>Tiền Mặt</span> </Radio.Button>
                                <Radio.Button className='text-center' style={{ width: '48%' }} value="1"><FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon> <span className='ml-2'>Chuyển khoản</span> </Radio.Button>
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
                        <div style={{
                            display: paymentMethods != 1 ? 'block' : 'none'
                        }}>
                            <div className='flex justify-between'>
                                <div>
                                    <div>Tiền Khách đưa:</div>
                                </div>
                                <div className='font-medium text-end'>
                                </div>
                            </div>

                            <div className='w-full'>
                                <Input
                                    placeholder="Nhập Tiền Khách Đưa"
                                    suffix="VNĐ"
                                    value={paymentCustomer}
                                    onChange={(e) => setDataPaymentCustomer(e.target.value)}
                                />
                            </div>

                            <div className='flex justify-between'>
                                <div>
                                    <div>Tiền Thừa:</div>
                                </div>
                                <div className='font-medium text-end'>
                                    <div className='text-rose-600	'>{fixMoney(moneyPaid)}</div>
                                </div>
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

export default OrderBuy;