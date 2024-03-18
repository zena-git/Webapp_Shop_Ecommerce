import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select, Switch } from 'antd';
import axios from "axios";
import { useSaleData } from '~/provider/SaleDataProvider';

function SaleBuy() {
    //provider
    const {handlePaymentBill, totalPrice, intoMoney, shipMoney, voucherMoney,paymentCustomer, setDataIsDelivery, setDataPaymentCustomer, setDataPaymentMethods, moneyPaid, paymentMethods, customer } = useSaleData();

    const handleRadioChange = (e) => {
        setDataPaymentMethods(e.target.value);
    };
    return (
        <>
            <div className="">
                <div className='mb-4'>
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

                    <div className='mb-4' 
                         style={{ display: customer === null ? 'none' : 'block'}}
                    >
                        <Switch onChange={() => setDataIsDelivery()} />
                        <span className='ml-2'>Giao Hàng</span>
                    </div>

                    <div className='mb-4'>
                        <div className='mb-4'>Phương Thức Thanh Toán</div>

                        <Radio.Group onChange={handleRadioChange} defaultValue="0" size="large" style={{ width: '100%' }} buttonStyle="solid" radioButtonStyle="none">
                            <div className='flex justify-between'>
                                <Radio.Button className='text-center ' style={{ width: '48%' }} value="0">Tiền Mặt</Radio.Button>
                                <Radio.Button className='text-center' style={{ width: '48%' }} value="1">Chuyển khoản</Radio.Button>
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
                                <div>{totalPrice}</div>
                                <div>{voucherMoney}</div>
                                <div>{shipMoney}</div>
                                <div>{intoMoney}</div>
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
                                    <div>{moneyPaid}</div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className='w-full mt-10 mb-10'>
                        <Button className='w-full h-20' type="primary" onClick={()=>{handlePaymentBill()}} >
                            Thanh Toán
                        </Button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default SaleBuy;