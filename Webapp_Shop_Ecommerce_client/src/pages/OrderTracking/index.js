import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import OrderDetail from '~/components/OrderDetail';
import { useDebounce } from '~/hooks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { Search } = Input;
function OrderTracking() {

    const [bill, setBill] = useState(null);
    const [valueSearch, setValueSearch] = useState(null);

    const handleSearch = async () => {
        if (valueSearch.trim() === '') {
            toast.error("Chưa Nhập Mã Đơn Hàng")
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/v2/bill/codeBill/' + valueSearch.trim());
            setBill(response.data);
            console.log(response.data);
            console.log(response.data.lstBillDetails);
        } catch (error) {
            setBill(null)
            toast.error(error.response.data.message)
            console.error(error);
        }
    };


    return (
        <>
            <div>
                <div className='bg-white p-4 shadow-lg '>
                    <h4 className='text-2xl font-medium mb-6 mt-2'>
                        Tra Cứu Đơn Hàng
                    </h4>
                    <div>

                        <Input className='w-1/3' placeholder="Nhập Mã Đơn Hàng" value={valueSearch} onChange={
                            (e) => {
                                setValueSearch(e.target.value)
                            }
                        } />
                        <Button type="primary" className='ml-2' onClick={handleSearch}>Tìm Kiếm</Button>
                    </div>
                </div>
                {
                    bill && <OrderDetail bill={bill}></OrderDetail>
                }
            </div>
            <ToastContainer></ToastContainer>
        </>
    );
}

export default OrderTracking;