import './Address.css';
import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Tag } from 'antd';
import axios from "axios";
import DataContext from "~/DataContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import InnerAddres from '~/components/Address/InnerAddres';
function Address() {
    const { setAddressBillClient, customer,addressBill,dataCheckout ,totalPrice,setDataShipMoney} = useContext(DataContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressCustomer, setAddressCustomer] = useState();
    const [addressCustomerModal, setAddressCustomerModal] = useState();
    const [lstAddressCustomer, setLstAddressCustomer] = useState([]);
    
    const [lstAddress, setLstAddress] = useState([]);
    const [checkValueAddress, setCheckValueAddress] = useState(1);
    
    const [isTabAddreiss, setIsTabAddress] = useState(false);
    const [valueTabAddreiss, setValueTabAddress] = useState(null);

    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);


    const [valueProvince, setValueProvince] = useState(null);
    const [valueDistrict, setValueDistrict] = useState(null);
    const [valueWard, setValueWard] = useState(null);

    const [serviceId, setServiceId] = useState('53321');
    const [leadtime, setLeadtime] = useState(null);

    useEffect(() => {
        fetchDataLstAddress();
        if(customer!=null){
            setAddressBillClient(customer.defaultAddress)
        }
    }, [customer])

    const fetchDataLstAddress = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v2/address');
            setLstAddress(response.data);
            // Kiểm tra và thiết lập giá trị kiểm tra
            response.data.forEach(address => {
                if (address.defaultAddress) {
                    setCheckValueAddress(address.id);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    // lấy province
    useEffect(() => {
        axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: {
                token: 'dfe1e7cf-e582-11ee-b290-0e922fc774da'
            }
        })
            .then((response) => {
                const lstProvince = response.data.data.map((result) => {
                    return {
                        value: result.ProvinceID,
                        label: result.ProvinceName
                    }
                })
                console.log();
                setDataProvince(lstProvince)
            })
            .catch((error) => {
                console.log(error.response.data);
            })

    }, [addressBill])

    //lấy district
    useEffect(() => {
        if (valueProvince != null) {
            console.log("---");
            axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
                {
                    headers: {
                        token: 'dfe1e7cf-e582-11ee-b290-0e922fc774da'
                    },
                    params: {
                        province_id: valueProvince
                    }
                }
            )
                .then((response) => {
                    const lstDistrict = response.data.data.map((result) => {
                        return {
                            value: result.DistrictID,
                            label: result.DistrictName
                        }
                    })
                    setDataDistrict(lstDistrict)

                    if (addressBill != null) {
                        const foundDistrict = lstDistrict.find(item => item.label === addressBill?.district);
                        // console.log(dataDistrict);
                        setValueDistrict(foundDistrict?.value);
                    }

                })
                .catch((error) => {
                    console.log(error.response.data);
                })

        }
    }, [valueProvince])

    //lấy ward
    useEffect(() => {
        if (valueDistrict != null) {
            axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
                {
                    headers: {
                        token: 'dfe1e7cf-e582-11ee-b290-0e922fc774da'
                    },
                    params: {
                        district_id: valueDistrict
                    }
                }
            )
                .then((response) => {
                    const lstWard = response.data.data.map((result) => {
                        return {
                            value: result.WardCode,
                            label: result.WardName
                        }
                    })
                    setDataWard(lstWard)

                    if (addressBill != null) {
                        const foundWard = lstWard.find(item => item.label === addressBill?.commune);
                        setValueWard(foundWard?.value);
                    }
                })
                .catch((error) => {
                    console.log(error.response.data);
                })


        }
    }, [valueDistrict])


    //Lấy Dịch Vụ Vận Chuyển
    useEffect(() => {
        if (valueDistrict != null) {
            console.log(valueWard);
            axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
                {
                    headers: {
                        token: 'dfe1e7cf-e582-11ee-b290-0e922fc774da',
                    },
                    params: {
                        shop_id: 4962936,
                        from_district: 3440,
                        to_district: valueDistrict,
                    }

                }
            )
                .then((response) => {
                    setServiceId(response.data.data[0].service_id)
                    console.log(response.data.data[0].service_id);
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueDistrict])


    //Tính phí ship
    useEffect(() => {
        if (dataCheckout.length <= 0) {
            return;
        }
    
        const weightProduct = dataCheckout.reduce((accumulator, currentProduct) => {
            return accumulator + (currentProduct.productDetails.weight * currentProduct.quantity);
        }, 0);

        if (valueDistrict != null) {

            axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                {
                    headers: {
                        token: 'dfe1e7cf-e582-11ee-b290-0e922fc774da',
                        shop_id: 4962936
                    },
                    params: {
                        service_id: serviceId,
                        insurance_value: totalPrice,
                        coupon: null,
                        from_district_id: 3440,
                        to_district_id: valueDistrict,
                        to_ward_code: valueWard,
                        weight: weightProduct,
                    }

                }
            )
                .then((response) => {

                    console.log(response.data.data);
                    setDataShipMoney(response.data.data.total)
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueDistrict, dataCheckout])

    useEffect(() => {
        const foundProvince = dataProvince.find(item => item.label === addressBill?.province);
        setValueProvince(foundProvince?.value);

        const foundDistrict = dataDistrict.find(item => item.label === addressBill?.district);
        // console.log(dataDistrict);
        setValueDistrict(foundDistrict?.value);

        const foundWard = dataWard.find(item => item.label === addressBill?.commune);
        // console.log(foundWard);
        setValueWard(foundWard?.value);
    }, [addressBill, dataProvince,dataDistrict])

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        console.log(addressCustomerModal);
        setAddressCustomer(addressCustomerModal)
        setAddressBillClient(addressCustomerModal)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onChangeAddress = (e) => {
        // const selectedAddress = lstAddress.find(address => address.id === e.target.value);
        // console.log('radio checked', selectedAddress);
        setCheckValueAddress(e.target.value)
    }
    const handleGoBack = () => {
        setIsTabAddress(false);
    };
    const handleUpdateAddres = (address) => {
        setValueTabAddress(address)
        setIsTabAddress(true);

    };

    const handleAddAddres = () => {
        setValueTabAddress(null)
        setIsTabAddress(true);

    };

    const handleOkAddress = () => {
        const address = lstAddress.find(address => {
            return address.id === checkValueAddress;
        });
        setAddressBillClient(address);
        setIsModalOpen(false);
        setIsTabAddress(false);
    };
    const handleCancelAddress = () => {
        setIsModalOpen(false);
        setIsTabAddress(false);
    };


    return (
        <>
            <div className='shadow-md px-6 py-6 bg-white mb-10'>
                <div className='box_address-tile'>
                    <h4>Địa Chỉ Nhận Hàng</h4>
                </div>
                <div className='box_address-body'>

                    <div className='address_body-name'>
                        <span>{addressBill?.receiverName}</span>
                        <span>({addressBill?.receiverPhone})</span>
                    </div>

                    <div>
                        <span>{addressBill?.detail + ' , ' + addressBill?.commune + ' , ' + addressBill?.district + ' , ' + addressBill?.province}
                        </span>
                    </div>
                    <div className='address_body-btn' onClick={showModal}>
                        Thay Đổi
                    </div>
                </div>
            </div>

            <div>
                <Modal width={680} footer={null} title="Địa Chỉ" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >

                    {
                        isTabAddreiss ? (
                            <>
                                <InnerAddres goBack={handleGoBack} customer={customer} valueAddress={valueTabAddreiss} updateDataAddress={fetchDataLstAddress}></InnerAddres>
                            </>
                        ) : (
                            <div>
                                <Radio.Group onChange={onChangeAddress} value={checkValueAddress} >

                                    {lstAddress?.sort((a, b) => a.id - b.id).map(addr => (
                                        <Radio value={addr.id} key={addr.id} className='w-full p-2 ' style={{
                                            borderBottom: '1px solid rgb(232, 232, 232)'
                                        }} >
                                            <div className='ml-4'>
                                                <div className='flex'>
                                                    <div className='font-medium mr-2'>{addr.receiverName}</div> | {addr.receiverPhone}
                                                </div>
                                                <div>
                                                    <div>{addr.detail}</div>
                                                </div>
                                                <div>{addr.commune}, {addr.district}, {addr.province}</div>
                                                <div className='flex items-center mt-2'>
                                                    <div
                                                    ><Button className='p-0 mr-4 border-none text-blue-600	' onClick={() => { handleUpdateAddres(addr) }}>Cập Nhật</Button>
                                                    </div>
                                                    {addr.defaultAddress ? <Tag color="#108ee9">Mặc Định</Tag> : ""}</div>

                                            </div>
                                        </Radio>
                                    ))}
                                </Radio.Group>
                                <div className='mt-6 ml-8 flex justify-between	'>
                                    <Button onClick={() => handleAddAddres()}><FontAwesomeIcon icon={faPlus} /> <span className='ml-2'>Thêm Địa Chỉ</span> </Button>
                                    <div>
                                        <Button className='mr-4' onClick={() => handleCancelAddress()}>Thoát</Button>
                                        <Button type='primary' onClick={() => handleOkAddress()}>Chọn</Button>
                                    </div>

                                </div>
                            </div>
                        )
                    }


                </Modal>
            </div>
        </>
    );
}

export default Address;