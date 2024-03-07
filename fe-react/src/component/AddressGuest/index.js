import React, { useState, useEffect } from 'react';
import { Button, Modal, Radio, Space, Input, Select } from 'antd';
import axios from "axios";
import './AddressGress.css';

function AddressGress() {

    const dataOption = [
        {
            value: 'VN',
            label: 'VN',
        },
        {
            value: 'VN',
            label: 'VN',
        },
        {
            value: 'VN',
            label: 'VN',
        }
    ]


    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    return (<>
        <div className="box_addressGress">
            <div className='box_addressGress-tile'>
                <h4>Thông tin giao hàng</h4>
            </div>
            <div className='box_addressGress-body'>
                <div>
                    <label>Họ Và Tên</label>
                    <Input placeholder="Họ Và Tên" />
                </div>
                <div className='addressGress_body-emailphone'>
                    <div style={{ flex: '0.9' }}>
                        <label>Email</label>
                        <Input placeholder="Email" />
                    </div>
                    <div >
                        <label>Số Điện Thoại</label>
                        <Input placeholder="Số Điện Thoại" />
                    </div>
                </div>


                <div>
                    <label>Địa Chỉ</label>
                    <Input placeholder="Địa Chỉ" />
                </div>

                <div className='addressGress_body-address'>
                    <div>
                        <label>Tỉnh/Thành</label>
                        <Select
                        placeholder="Tỉnh/Thành" 
                            options={dataOption}
                        />
                    </div>

                    <div>
                        <label>Quận/Huyện</label>
                        <Select
                        placeholder="Quận/Huyện" 
                            options={dataOption}
                        />
                    </div>
                    <div>
                        <label>Phường/Xã</label>
                        <Select
                        placeholder="Phường/Xã" 
                            options={dataOption}
                        />
                    </div>
                </div>


            </div>
        </div>
    </>);
}

export default AddressGress;