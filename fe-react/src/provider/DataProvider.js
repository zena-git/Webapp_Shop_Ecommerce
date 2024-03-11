// DataProvider.js
import React, { useEffect, useState, useCallback, } from 'react';
import { useNavigate } from "react-router-dom";
import DataContext from '../DataContext';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
const DataProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAccount, setIsAccount] = useState(false);

    const [data, setData] = useState([]);
    const [dataCheckout, setDataCheckout] = useState([]);
    const [totalPayment, setTotalPayment] = useState(0);
    const [addressBill, setAddressBill] = useState('');


    useEffect(() => {
        if (isAccount) {
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
        } else {
            const storedProducts = JSON.parse(localStorage.getItem('cart')) || [];
            setData(storedProducts);
        }

    }, []);

    useEffect(() => {
        if (!isAccount) {
            localStorage.setItem('cart', JSON.stringify(data));
        }
    }, [data]);

    const setAddressBillClient = (newData) => {
        setAddressBill(newData)
    };

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

    // Chỉ gọi API khi component được tạo

    const updateData = useCallback(async () => {

        if (isAccount) {
            axios.get('http://localhost:8080/api/v2/cart')
                .then(res => {
                    setData(res.data.lstCartDetails.sort((a, b) => a.id - b.id));
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, []);


    const moneyQuantity = useCallback(async (value, idCartdetail) => {

        if (isAccount) {
            axios.put(`http://localhost:8080/api/v2/cartDetails/` + idCartdetail, {
                quantity: value
            })
                .then(res => {
                    console.log(res.data);
                    updateData();
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            const existingItemIndex = data.findIndex((item) => item.id == idCartdetail);
            if (existingItemIndex != -1) {
                const existingItem = data[existingItemIndex];
                const newItem = {
                    ...existingItem,
                    quantity: value
                }
                console.log(existingItem);
                const dataCart = [...data];
                dataCart.splice(existingItemIndex, 1, newItem);
                setData(dataCart);

            }
        }
    }, [data, isAccount]);

    const deleteData = useCallback(async (itemId) => {

        if (isAccount) {
            axios.delete('http://localhost:8080/api/v2/cartDetails/' + itemId)
                .then(res => {
                    updateData()
                })
                .catch(err => {
                    console.log(err);
                })

        } else {
            const existingItemIndex = data.findIndex((item) => item.id == itemId);
            const dataCart = [...data];
            dataCart.splice(existingItemIndex, 1);
            setData(dataCart);
        }

    }, [data, isAccount]);
    const paymentBill = useCallback(async () => {
        console.log(addressBill);
        console.log(dataCheckout);
        const dataBill = {
            billType: 'Online',
            cash: totalPayment,
            digitalCurrency: totalPayment,
            totalMoney: totalPayment,
            intoMoney: totalPayment,
            email: addressBill.email,
            receiverName: addressBill.receiverName,
            receiverPhone: addressBill.receiverPhone,
            receiverDetails: addressBill.detail,
            receiverCommune: addressBill.commune,
            receiverDistrict: addressBill.district,
            receiverProvince: addressBill.province,
            lstCartDetails: dataCheckout,
        }
        if (isAccount) {
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
        }else{

            axios.post('http://localhost:8080/api/v2/bill/guest', dataBill)
            .then(res => {
                toast.success('Đặt Hàng Thành Công')
                setTimeout(() => {
                    // navigate('/cart');
                }, 1000);
            })
            .catch(err => {
                console.log(err);
            })
        }

    }, [addressBill]);


    // thêm giỏ hàng
    const addGioHang = useCallback(async (dataProduct) => {
        if (isAccount) {
            const product = {
                productDetail: dataProduct.productDetails.id,
                quantity: dataProduct.quantity
            }
            // console.log(product);
            axios.post('http://localhost:8080/api/v2/cart', product)
                .then(res => {
                    console.log(res.data);
                    toast.success(res.data.message)
                    updateData();
                })
                .catch(err => {
                    console.log(err);
                    toast.error(err.response.data.message)
                })
        } else {

            const existingItemIndex = data.findIndex((item) => item.productDetails.id == dataProduct.productDetails.id);


            if (existingItemIndex != -1) {

                const existingItem = data[existingItemIndex];
                const checkQuantity = existingItem.quantity + dataProduct.quantity > dataProduct.productDetails.quantity;
                if (checkQuantity) {
                    toast.error('Số Lượng Sản Phẩm Đang Có Không Đủ');
                    return;
                }

                const updatedItem = {
                    ...existingItem,
                    quantity: existingItem.quantity + dataProduct.quantity,
                };

                const dataCart = [...data];
                dataCart.splice(existingItemIndex, 1, updatedItem);
                setData(dataCart);
            } else {

                const dataCart = [...data, {
                    id: Math.floor(Math.random() * 1000000),
                    productDetails: dataProduct.productDetails,
                    quantity: dataProduct.quantity,
                }];
                setData(dataCart);
            }
            toast.success("Thêm Sản Phẩm Vào Giỏ Hàng Tạm Thành Công");

        }


    }, [data, isAccount]);

    // Mua ngya
    const buyCart = useCallback(async (dataProduct) => {

        if (isAccount) {
            const product = {
                productDetail: dataProduct.productDetails.id,
                quantity: dataProduct.quantity
            }
            // console.log(product);
            axios.post('http://localhost:8080/api/v2/cart', product)
                .then(res => {
                    updateData();
                    console.log(res.data);
                    navigate('/cart');
                })
                .catch(err => {
                    console.log(err);
                    toast.error(err.response.data.message)
                })
        } else {
            const existingItemIndex = data.findIndex((item) => item.productDetails.id == dataProduct.productDetails.id);
            if (existingItemIndex != -1) {
                const existingItem = data[existingItemIndex];

                const checkQuantity = existingItem.quantity + dataProduct.quantity > dataProduct.productDetails.quantity;
                if (checkQuantity) {
                    toast.error('Số Lượng Sản Phẩm Đang Có Không Đủ');
                    return;
                }

                const updatedItem = {
                    ...existingItem,
                    quantity: existingItem.quantity + dataProduct.quantity,
                };

                const dataCart = [...data];
                dataCart.splice(existingItemIndex, 1, updatedItem);
                setData(dataCart);
            } else {

                const dataCart = [...data, {
                    id: Math.floor(Math.random() * 1000000),
                    productDetails: dataProduct.productDetails,
                    quantity: dataProduct.quantity,
                }];
                setData(dataCart);
            }
            navigate('/cart');

        }

    }, [data, isAccount]);


    const dataContextValue = {
        isAccount,

        //cart
        data,
        dataLength: data.length,
        dataCheckout,
        updateData, // Include the updateData function in the context
        deleteData,
        moneyQuantity,
        setLstDataCheckout,
        totalPayment,
        setTotalPaymentMoney,
        setAddressBillClient,
        paymentBill,

        //productDetail
        addGioHang,
        buyCart
    };

    return (
        <DataContext.Provider value={dataContextValue}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
