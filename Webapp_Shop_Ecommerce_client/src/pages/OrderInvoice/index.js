import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import OrderDetail from '~/components/OrderDetail';
import { useDebounce } from '~/hooks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function OrderInvoice() {
    const [bill, setBill] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/bill/codeBill/' + id)
        .then(response => {

            setBill(response.data);
            console.log(response.data);
            console.log(response.data.lstBillDetails);
        })
        .catch(err => {
            setBill(null);
            toast.error(err.response.data.message)
        })
    },[id])
    return (
        <>
            {
                bill ? <OrderDetail bill={bill}></OrderDetail> :
                    <div className='text-center	'>
                        <h3>
                            Không Tìm Thấy Đơn Hàng
                        </h3>
                    </div>
            }
        </>
    );
}

export default OrderInvoice;