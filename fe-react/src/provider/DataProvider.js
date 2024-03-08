// DataProvider.js
import React, { useEffect, useState, useCallback,  } from 'react';
import { useNavigate  } from "react-router-dom";
import DataContext from '../DataContext';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
const DataProvider = ({ children }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [dataCheckout, setDataCheckout] = useState([]);
    const [totalPayment, setTotalPayment] = useState(0);
    const [addressBill, setAddressBill] = useState('sadasd');

    useEffect(() => {
        const fetchDataAndSetState = async () => {
            axios.get('http://localhost:8080/api/v2/cart')
                .then(res => {

                    setData(res.data.lstCartDetails.sort((a, b) => a.id - b.id));
                })
                .catch(err => {
                    console.log(err);
                })
        };

        fetchDataAndSetState();
    }, []); // Chỉ gọi API khi component được tạo
    const updateData = useCallback(async () => {
        axios.get('http://localhost:8080/api/v2/cart')
            .then(res => {
                setData(res.data.lstCartDetails.sort((a, b) => a.id - b.id));
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const deleteData = useCallback(async (itemId) => {
        axios.delete('http://localhost:8080/api/v2/cartDetails/' + itemId)
            .then(res => {
                updateData()
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const setAddressBillClient = (newData) => {
        setAddressBill(newData)
    };
    const paymentBill = useCallback(async () => {
        console.log(addressBill);
        console.log(dataCheckout);
        const dataBill = {
            // email: "emailltest",
            receiverName: addressBill.receiverName,
            receiverPhone: addressBill.receiverPhone,
            receiverDetails: addressBill.detail,
            receiverCommune: addressBill.commune,
            receiverDistrict: addressBill.district,
            receiverProvince: addressBill.province,
            lstCartDetails: dataCheckout.map(data => data.id)
        }

        console.log(dataBill);

        axios.post('http://localhost:8080/api/v2/bill', dataBill)
            .then(res => {
                updateData()
                toast.success('Đặt Hàng Thành Công')
                setTimeout(() => {
                    navigate('/cart');
                }, 1000);
            })
            
            .catch(err => {
                console.log(err);
            })
    }, [addressBill]);
    const setLstDataCheckout = (newData) => {
        // console.log(newData);
        const lstCartDetail = newData.map((idData) => {
            return data.find(cartDetail => cartDetail.id === idData);
        })
        console.log(lstCartDetail);
        setDataCheckout(lstCartDetail)
    };

    const setTotalPaymentMoney = (lstId) => {
        const lstCartDetail = lstId.map((id) => {
            return data.find(cartDetail => cartDetail.id === id);
        })
        const totalMoney = lstCartDetail.reduce((acc, item) => acc + (item.productDetails.price * item.quantity), 0);
        console.log(totalMoney);
        setTotalPayment(totalMoney)
    };

    const dataContextValue = {
        data,
        dataLength: data.length,
        dataCheckout,
        updateData, // Include the updateData function in the context
        deleteData,
        setLstDataCheckout,
        totalPayment,
        setTotalPaymentMoney,
        setAddressBillClient,
        paymentBill
    };

    return (
        <DataContext.Provider value={dataContextValue}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
