import './Buy.css';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Radio, Space, Input, Select } from 'antd';
import axios from "axios";

function Buy() {
    return (
        <>
            <div className="box_buy">
                <div className='box_buy-tile'>
                    <h4>Thanh Toán</h4>
                </div>
                <div className='box_buy-body'>
                    <div className='box_buy-voucher'>
                        <label>Phiếu Giảm Giá</label>
                        <Space.Compact
                            style={{
                                width: '100%',
                            }}>
                            <Input placeholder='Nhập Mã Giảm Giá' />
                            <Button type="primary">Áp Dụng</Button>
                        </Space.Compact>
                        <div>
                            <Radio.Group>
                                <Radio value={1}>A</Radio>
                                <Radio value={2}>B</Radio>
                                <Radio value={3}>C</Radio>
                                <Radio value={4}>D</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className='box_paymethot'>
                        <label>Phương Thức Thanh Toán</label>
                        <Space  size="large"></Space>
                        <Radio.Group defaultValue="a" size="large" style={{width: '100%'}}>
                            <Radio.Button style={{width: '50%'}} value="a">Thanh Toán Khi Nhận Hàng</Radio.Button>
                            <Radio.Button  style={{width: '50%'}} value="b">Chuyển khoản ngân hàng</Radio.Button>
                        </Radio.Group>
                    </div>

                    <div className='box_buy-pay'>
                        <div className='buy_pay-logic'>
                            <div className='pay_logic-item'>
                                <label>Tổng Tiền Hàng</label>
                                <span>9999999</span>
                            </div>
                            <div className='pay_logic-item'>
                                <label>Phí Vận Chuyển</label>
                                <span>0</span>
                            </div>
                            <div className='pay_logic-item'>
                                <label>Giảm Giá</label>
                                <span>9999999</span>
                            </div>
                        </div>

                        <div className='buy_pay'>
                            <div className='buy_pay-item'>
                                <label>Tổng thanh toán</label>
                                <span>9999999</span>
                            </div>
                            <Button className='buy_pay-btn' type="primary">Thanh Toán</Button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Buy;