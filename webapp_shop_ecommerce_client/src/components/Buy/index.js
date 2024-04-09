import './Buy.css';
import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select, Switch } from 'antd';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { fixMoney } from '~/ultils/fixMoney';
import { ExclamationCircleFilled } from '@ant-design/icons';
import DataContext from "~/DataContext";
const { confirm } = Modal

function Buy() {
    const { dataCheckout,handlePaymentBill,shipMoney, voucherMoney,setDataPaymentMethods,intoMoney,totalPrice } = useContext(DataContext);
    const handleRadioChange = (e) => {
        console.log(e.target.value);
        setDataPaymentMethods(e.target.value);
    };
    useEffect(()=>{
        console.log(dataCheckout);
    },[dataCheckout])
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
                    <div className='mb-4'>
                        <div className='mb-4'>Phiếu Giảm Giá</div>
                        <Space.Compact
                            style={{
                                width: '100%',
                            }}>
                            <Input placeholder='Nhập Mã Giảm Giá' />
                            <Button type="primary">Áp Dụng</Button>
                        </Space.Compact>
                        {/* <div>
                            <Radio.Group>
                                <Radio value={1}>A</Radio>
                                <Radio value={2}>B</Radio>
                                <Radio value={3}>C</Radio>
                                <Radio value={4}>D</Radio>
                            </Radio.Group>
                        </div> */}
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