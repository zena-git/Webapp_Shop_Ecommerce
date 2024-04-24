// DataProvider.js
import React, { useEffect, useState, useCallback, } from 'react';
import { useNavigate } from "react-router-dom";
import DataContext from '../DataContext';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
const DataProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAccount, setIsAccount] = useState(true);
    const [customer, setCustomer] = useState()

    const [data, setData] = useState([]);
    const [dataCheckout, setDataCheckout] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [intoMoney, setIntoMoney] = useState(0);
    const [shipMoney, setShipMoney] = useState(0);
    const [voucherMoney, setVoucherMoney] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState(0);
    const [addressBill, setAddressBill] = useState('');
    const [voucher, setVoucher] = useState(null);

    const DiscountType = {
        GIAM_TRUC_TIEP: '0',
        GIAM_PHAN_TRAM: "1",
    }

    const [loading, setLoading] = useState(false);

    const [checkedList, setCheckedList] = useState([]);
    useEffect(() => {
        if (isAccount) {
            axios.get('http://localhost:8080/api/v2/profile')
                .then(response => {
                    setCustomer(response.data)
                    console.log(response.data);
                })
                .catch(err => {

                })
        }
    }, []);

    useEffect(() => {
        if (totalPrice <= 0 || voucher == null) {
            setVoucherMoney(0);
            return;
        }
        //%
        if (voucher.discountType == DiscountType.GIAM_PHAN_TRAM) {
            const discount = totalPrice * voucher.value / 100;
            setVoucherMoney(discount);
        } else {
            setVoucherMoney(voucher.value);
        }

    }, [voucher, totalPrice])


    useEffect(() => {
       
        const money = totalPrice - voucherMoney + shipMoney;


        if (money <= 0) {
            setIntoMoney(0);

        } else {
            setIntoMoney(money);
        }
    }, [totalPrice, voucherMoney, shipMoney])

    useEffect(() => {
        if (isAccount) {
            const fetchDataAndSetState = async () => {
                axios.get('http://localhost:8080/api/v2/cart')
                    .then(res => {
                        const dataCart = res.data.lstCartDetails.sort((a, b) => a.id - b.id).map(data => {
                            let price = data?.productDetails?.promotionDetailsActive == null ?
                                data?.productDetails.price :
                                (data?.productDetails.price - (data.productDetails.price * data.productDetails.promotionDetailsActive.promotion.value / 100))

                            return {
                                ...data,
                                price: price
                            }
                        });
                        setData(dataCart);
                        console.log(dataCart);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            };

            fetchDataAndSetState();
        } else {
            const storedProducts = JSON.parse(localStorage.getItem('cart')) || [];
            console.log(storedProducts);
            setData(storedProducts);
        }

    }, [isAccount]);

    useEffect(() => {
        if (!isAccount) {
            console.log(data);
            localStorage.setItem('cart', JSON.stringify(data));
        }
    }, [data]);

    const setAddressBillClient = (newData) => {
        setAddressBill(newData)
    };
    const setDataToTotalPrice = (newData) => {
        setTotalPrice(newData)
    };
    const setDataPaymentMethods = (newData) => {
        setPaymentMethods(newData)
    };
    const setDataVoucher = (newData) => {
        setVoucher(newData)
    };
    const setDataShipMoney = (newData) => {
        setShipMoney(newData)
    };
    const setDataVoucherMoney = (newData) => {
        setVoucherMoney(newData)
    };
    const setDataCart = (newData) => {
        setData(newData)
    };
    const setDataLoading = (newData) => {
        setLoading(newData)
    };
    const setLstDataCheckout = (newData) => {
        // console.log(newData);
        const lstCartDetail = newData.map((idData) => {
            return data.find(cartDetail => cartDetail.id === idData);
        })
        console.log(lstCartDetail);
        setDataCheckout(lstCartDetail)
    };
    useEffect(() => {
        const lstCartDetail = checkedList.map((id) => {
            return data.find(cartDetail => cartDetail.id === id);
        }).filter(cartDetail => cartDetail !== undefined)

        const price = lstCartDetail.reduce((acc, item) => acc + (item.quantity*item.price), 0);
        // console.log(lstCartDetail);

        setTotalPrice(price || 0)
    }, [data,checkedList])
    const setTotalPaymentMoney = (lstId) => {

        const lstCartDetail = lstId.map((id) => {
            return data.find(cartDetail => cartDetail.id === id);
        })
        const totalMoney = lstCartDetail.reduce((acc, item) => acc + (item.quantity*item.price), 0);
        console.log(totalMoney);
        setTotalPrice(totalMoney)
    };

    // Chỉ gọi API khi component được tạo

    const updateData = useCallback(async () => {

        if (isAccount) {
            axios.get('http://localhost:8080/api/v2/cart')
                .then(res => {
                    const dataCart = res.data.lstCartDetails.sort((a, b) => a.id - b.id).map(data => {
                        let price = data?.productDetails?.promotionDetailsActive == null ?
                            data?.productDetails.price :
                            (data?.productDetails.price -(data.productDetails.price * data.productDetails.promotionDetailsActive.promotion.value / 100))

                        return {
                            ...data,
                            price: price
                        }
                    });
                    console.log(dataCart);
                    setData(dataCart);
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, []);


    const moneyQuantity = useCallback(async (value, idCartdetail) => {
        console.log(value);
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

                let price = existingItem?.productDetails?.promotionDetailsActive == null ?
                    existingItem?.productDetails.price :
                    (existingItem?.productDetails.price - (existingItem.productDetails.price * existingItem.productDetails.promotionDetailsActive.promotion.value / 100))

                const newItem = {
                    ...existingItem,
                    quantity: value,
                    price: price
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
    const handlePaymentBill = useCallback(async () => {
        console.log(addressBill);
        console.log(dataCheckout);
        let returnUrl = window.location.origin;

        const dataBill = {
            shipMoney: shipMoney,
            totalMoney: totalPrice,
            paymentMethod: paymentMethods,
            voucherMoney: voucherMoney,
            intoMoney: intoMoney,
            email: addressBill?.email,
            receiverName: addressBill?.receiverName,
            receiverPhone: addressBill.receiverPhone,
            receiverDetails: addressBill?.detail,
            receiverCommune: addressBill?.commune,
            receiverDistrict: addressBill?.district,
            receiverProvince: addressBill?.province,
            description: addressBill?.description,
            lstCartDetails: dataCheckout,
            voucher: voucher?.id,
            returnUrl: returnUrl
        }
        console.log(dataBill);
        setLoading(true);
        if (isAccount) {
            axios.post('http://localhost:8080/api/v2/bill', dataBill)
                .then(res => {
                    updateData()

                    if (res.data.status == "redirect") {
                        window.location.href = res.data.data;
                    } else {
                        navigate('/notificationOrder?bill=' + res.data.data.codeBill + '&&status=' + res.data.errCode);
                        toast.success('Đặt Hàng Thành Công')
                        console.log(res.data);
                    }
                    setDataCheckout([]);

                })
                .catch(err => {
                    toast.error(err.response.data.message)
                    updateData()
                    toast.error("Bạn sẽ được chuyển hướng về giỏ hàng sau 3s")
                    setTimeout(() => {
                        navigate('/cart');
                    }, 3000);
                })
                .finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                })
        } else {

            axios.post('http://localhost:8080/api/v2/bill/guest', dataBill)
                .then(res => {
                    const dataCart = data.filter(item => !dataCheckout.some(checkoutItem => checkoutItem.id === item.id));
                    setData(dataCart);

                    if (res.data.status == "redirect") {
                        window.location.href = res.data.data;
                    } else {
                        navigate('/notificationOrder?bill=' +  res.data.data.codeBill + '&&status=' + res.data.errCode);
                        toast.success('Đặt Hàng Thành Công')
                    }
                    setDataCheckout([]);

                })
                .catch(err => {
                    toast.error(err.response.data.message)
                    toast.error("Bạn sẽ được chuyển hướng về giỏ hàng sau 3s")
                    setTimeout(() => {
                        navigate('/cart');
                    }, 3000);
                    console.log(err);
                })
                .finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                })
        }

    }, [addressBill, paymentMethods, voucher,dataCheckout, shipMoney,]);


    // thêm giỏ hàng
    const addGioHang = useCallback(async (dataProduct) => {
        const price = dataProduct?.productDetails?.promotionDetailsActive == null ?
            dataProduct.productDetails.price :
            (dataProduct.productDetails.price - (dataProduct.productDetails.price * dataProduct.productDetails.promotionDetailsActive.promotion.value / 100))
        console.log(price);

        if (isAccount) {

            const product = {
                productDetail: dataProduct.productDetails.id,
                quantity: dataProduct.quantity,
                price: price,
            }
            // console.log(product);
            setLoading(true)
            axios.post('http://localhost:8080/api/v2/cart', product)
                .then(res => {
                    console.log(res.data);
                    toast.success(res.data.message)
                    updateData();
                })
                .catch(err => {
                    console.log(err);
                    toast.error(err.response.data.message)
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                })
        } else {
            setLoading(true)

            const existingItemIndex = data.findIndex((item) => item.productDetails.id == dataProduct.productDetails.id);


            if (existingItemIndex != -1) {

                const existingItem = data[existingItemIndex];
                const checkQuantity = existingItem.quantity + dataProduct.quantity > dataProduct.productDetails.quantity;
                if (checkQuantity) {
                    toast.error('Số Lượng Sản Phẩm Đang Có Không Đủ');
                    return;
                }
                let price = dataProduct?.productDetails?.promotionDetailsActive == null ?
                    dataProduct.productDetails.price :
                    (dataProduct.productDetails.price - (dataProduct.productDetails.price * dataProduct.productDetails.promotionDetailsActive.promotion.value / 100))


                const updatedItem = {
                    ...existingItem,
                    quantity: existingItem.quantity + dataProduct.quantity,
                    price: price
                };

                const dataCart = [...data];
                dataCart.splice(existingItemIndex, 1, updatedItem);
                setData(dataCart);
            } else {

                const dataCart = [...data, {
                    id: Math.floor(Math.random() * 1000000),
                    productDetails: dataProduct.productDetails,
                    quantity: dataProduct.quantity,
                    price: price,
                }];
                setData(dataCart);
            }
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            toast.success("Thêm sản phẩm vào giỏ hàng tạm thành công");

        }


    }, [data, isAccount]);

    // Mua ngya
    const buyCart = useCallback(async (dataProduct) => {
        const price = dataProduct?.productDetails?.promotionDetailsActive == null ?
            dataProduct.productDetails.price :
            (dataProduct.productDetails.price -
                (dataProduct.productDetails.price * dataProduct.productDetails.promotionDetailsActive.promotion.value / 100))

        if (isAccount) {
            const product = {
                productDetail: dataProduct.productDetails.id,
                quantity: dataProduct.quantity,
                price: price
            }
            // console.log(product);
            setLoading(true)
            axios.post('http://localhost:8080/api/v2/cart', product)
                .then(res => {
                    updateData();
                    console.log(res.data);
                    navigate('/cart');
                })
                .catch(err => {
                    console.log(err);
                    toast.error(err.response.data.message)
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                })
        } else {
            setLoading(true)
            const existingItemIndex = data.findIndex((item) => item.productDetails.id == dataProduct.productDetails.id);
            if (existingItemIndex != -1) {
                const existingItem = data[existingItemIndex];

                const checkQuantity = existingItem.quantity + dataProduct.quantity > dataProduct.productDetails.quantity;
                if (checkQuantity) {
                    toast.error('Số Lượng Sản Phẩm Đang Có Không Đủ');
                    return;
                }
                let price = dataProduct?.productDetails?.promotionDetailsActive == null ?
                    dataProduct.productDetails.price :
                    (dataProduct.productDetails.price -
                        (dataProduct.productDetails.price * dataProduct.productDetails.promotionDetailsActive.promotion.value / 100))
                    * (existingItem.quantity + dataProduct.quantity)

                const updatedItem = {
                    ...existingItem,
                    quantity: existingItem.quantity + dataProduct.quantity,
                    price: price
                };

                const dataCart = [...data];
                dataCart.splice(existingItemIndex, 1, updatedItem);
                setData(dataCart);
            } else {

                const dataCart = [...data, {
                    id: Math.floor(Math.random() * 1000000),
                    productDetails: dataProduct.productDetails,
                    quantity: dataProduct.quantity,
                    price: price
                }];
                setData(dataCart);
            }
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            navigate('/cart');

        }

    }, [data, isAccount]);

    const setDataCheckedList = (data) => {
        setCheckedList(data);
    };
    const dataContextValue = {
        isAccount,
        customer,
        //cart
        data,
        dataLength: data.length,
        dataCheckout,
        checkedList,
        intoMoney,
        shipMoney,
        voucherMoney,
        paymentMethods,
        totalPrice,
        addressBill,
        loading,
        voucher,

        updateData, // Include the updateData function in the context
        deleteData,
        moneyQuantity,
        setLstDataCheckout,
        setTotalPaymentMoney,
        setDataCheckedList,
        setDataShipMoney,
        setDataVoucherMoney,
        setDataPaymentMethods,
        setDataCart,
        setDataLoading,
        setDataVoucher,
        setAddressBillClient,

        //productDetail
        addGioHang,
        buyCart,
        handlePaymentBill,

    };

    return (
        <DataContext.Provider value={dataContextValue}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
