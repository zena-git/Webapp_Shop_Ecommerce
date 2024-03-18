import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select } from 'antd';
import axios from "axios";
import { useSaleData } from '~/provider/SaleDataProvider';

const { TextArea } = Input;
function AddressDelivery() {
    const { isDelivery, setDataAddressBill, customer } = useSaleData();
    

    return ( 
        <>
        <div >
            <div className='mb-4 flex justify-between' >
                <h4>Thông tin giao hàng</h4>

                <div style={{ display: customer == null ? 'none' : 'block' }}>
                    <div className='flex justify-end' >
                        <Button>Chọn Địa Chỉ</Button>
                    </div>
                </div>
            </div>
            <div >
                
                <div className='mb-4'>
                    <div className='mb-2'>Ghi Chú</div>
                    <TextArea rows={4} />
                </div>
            </div>
        </div>
    </>

     );
}

export default AddressDelivery;