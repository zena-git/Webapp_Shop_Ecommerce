import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Tag, Input, Select, InputNumber } from 'antd';
import axios from "axios";
import { useOrderData } from '~/provider/OrderDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import Address from '../Address';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { TextArea } = Input;
function AddressDelivery() {


    const { isDelivery, setDataAddressBill, customer, addressBill, lstProductDetailsCart, setDataShipMoney } = useOrderData();
    const [lstAddress, setLstAddress] = useState([]);
    const [checkValueAddress, setCheckValueAddress] = useState(1);
    const [address, setAddress] = useState({});

    const [isTabAddreiss, setIsTabAddress] = useState(false);
    const [valueTabAddreiss, setValueTabAddress] = useState(null);

    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);


    const [valueProvince, setValueProvince] = useState(null);
    const [valueDistrict, setValueDistrict] = useState(null);
    const [valueWard, setValueWard] = useState(null);

    const [valueProvinceDefautl, setValueProvinceDefautl] = useState(null);
    const [valueDistrictDefautl, setValueDistrictDefautl] = useState(null);
    const [valueWardDefautl, setValueWardDefautl] = useState(null);

    const [serviceId, setServiceId] = useState('53321');
    const [leadtime, setLeadtime] = useState(null);


    const [receiverName, setReceiverName] = useState('');
    const [email, setEmail] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [details, setDetails] = useState('');
    const [description, setDescription] = useState('');
    const [labelProvince, setLabelProvince] = useState(null);
    const [labelDistrict, setLabelDistrict] = useState(null);
    const [labelWard, setLabelWard] = useState(null);

    const [isModalOpenAddress, setIsModalOpenAddress] = useState(false);

    const showModalAddress = () => {
        setIsModalOpenAddress(true);
    };
    const handleOkAddress = () => {
        const address = lstAddress.find(address => {
            return address.id === checkValueAddress;
        });
        setAddress(address);
        setIsModalOpenAddress(false);
        setIsTabAddress(false);
    };
    const handleCancelAddress = () => {
        setIsModalOpenAddress(false);
        setIsTabAddress(false);
    };


    useEffect(() => {
        if (customer !== null && isDelivery) {
            console.log(lstAddress);
            lstAddress.map(address => {
                if (address?.defaultAddress) {
                    setAddress(address)
                    setCheckValueAddress(address.id);
                }
            })
        } else {
            setAddress(null)
        }
    }, [customer, isDelivery, lstAddress])



    useEffect(() => {
        const address = {
            receiverName: receiverName || "",
            receiverPhone: receiverPhone || "",
            detail: details || "",
            commune: labelWard || "",
            district: labelDistrict || "",
            province: labelProvince || "",
            description: description || ""
        }
        setDataAddressBill(address)
    }, [receiverName, receiverPhone, details, labelProvince, labelDistrict, labelDistrict, labelWard, address, description])


    useEffect(() => {
        if (isDelivery) {
            setDataAddressBill(address)
            fillDataAddress(address)
        } else {
            setDataAddressBill(null)
            fillDataAddress(null)
        }

    }, [address, isDelivery,])

    const fillDataAddress = (address) => {
        setReceiverName(address?.receiverName)
        setReceiverPhone(address?.receiverPhone)
        setDetails(address?.detail)

        setLabelWard(address?.commune ? address.commune : null);
        setLabelDistrict(address?.district ? address.district : null);
        setLabelProvince(address?.province ? address.province : null);


        const foundProvince = dataProvince.find(item => item.label === address?.province);
        setValueProvince(foundProvince?.value);

        const foundDistrict = dataDistrict.find(item => item.label === address?.district);
        // console.log(dataDistrict);
        setValueDistrict(foundDistrict?.value);

        const foundWard = dataWard.find(item => item.label === address?.commune);
        // console.log(foundWard);
        setValueWard(foundWard?.value);


    }

    const fetchDataLstAddress = async () => {

        try {
            const response = await axios.get('http://localhost:8080/api/v1/customer/' + customer.id);
            console.log(response.data);
            setLstAddress(response.data.lstAddress);
            // Kiểm tra và thiết lập giá trị kiểm tra

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log(customer);
        if (isDelivery && customer !== null) {
            // console.log(isDelivery);
            fetchDataLstAddress();
        }
    }, [customer, isDelivery])

    //lấy province
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
                setDataProvince(lstProvince)


            })
            .catch((error) => {
                console.log(error.response.data);
            })

    }, [])

    //lấy district
    useEffect(() => {
        console.log("222");
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

                    if (address != null) {
                        const foundDistrict = lstDistrict.find(item => item.label === address?.district);
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
        console.log(valueDistrict);
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

                    if (address != null) {
                        const foundWard = lstWard.find(item => item.label === address?.commune);
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
        if (lstProductDetailsCart.length <= 0) {
            return;
        }
        const priceProduct = lstProductDetailsCart.reduce((accumulator, currentProduct) => {
            return accumulator + (currentProduct.unitPrice * currentProduct.quantity);
        }, 0);

        const weightProduct = lstProductDetailsCart.reduce((accumulator, currentProduct) => {
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
                        insurance_value: priceProduct,
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
    }, [valueDistrict, lstProductDetailsCart,serviceId])

    //Lấy Thời Gian Giao Hàng Dự Kiến
    useEffect(() => {
        if (valueDistrict != null && valueWard != null) {
            console.log(valueWard);
            axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime',
                {
                    headers: {
                        token: 'dfe1e7cf-e582-11ee-b290-0e922fc774da',
                    },
                    params: {
                        from_district_id: 3440,
                        from_ward_code: 13007,
                        to_district_id: valueDistrict,
                        to_ward_code: valueWard,
                        service_id: serviceId,
                    }

                }
            )
                .then((response) => {
                    setLeadtime(response.data.data.leadtime)
                    console.log(response.data.data);
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueDistrict, valueWard, serviceId])

    const handleChangeProvince = (value) => {
        if (value) {
            const selectedOption = dataProvince.find(option => option.value === value);
            setValueProvince(selectedOption.value)
            setLabelProvince(selectedOption.label)

            setDataShipMoney(0)

            setValueDistrict(null)
            setValueWard(null)

            setLabelWard(null);
            setLabelDistrict(null);

        }

    };

    const handleChangeDistrict = (value) => {
        if (value) {
            const selectedOption = dataDistrict.find(option => option.value === value);
            setValueDistrict(selectedOption.value)
            setLabelDistrict(selectedOption.label)
            setValueWard(null)
            setLabelWard(null);

        }

    };
    const handleChangeWard = (value) => {
        console.log(value);
        if (value) {
            const selectedOption = dataWard.find(option => option.value === value);
            setValueWard(selectedOption.value)
            setLabelWard(selectedOption.label)
        }

    };
    const onChangeAddress = (e) => {
        setCheckValueAddress(e.target.value)
    };
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
    return (
        <>
            <div >
                <div className='flex justify-between pb-2 mb-2' style={{
                    borderBottom: '1px solid rgb(232, 232, 232)'
                }}>
                    <h4>Thông tin giao hàng</h4>

                    <div style={{ display: customer == null ? 'none' : 'block' }}>
                        <div className='flex justify-end' >
                            <Button className='border-none text-blue-600 p-0' onClick={showModalAddress}> <FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon> <span className='ml-2'>Chọn Địa Chỉ</span></Button>
                        </div>
                        <div>
                            <Modal width={680} footer={null} title="Địa Chỉ" open={isModalOpenAddress} onOk={handleOkAddress} onCancel={handleCancelAddress} >

                                {
                                    isTabAddreiss ? (
                                        <>
                                            <Address goBack={handleGoBack} customer={customer} valueAddress={valueTabAddreiss} updateDataAddress={fetchDataLstAddress}></Address>
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
                    </div>
                </div>
                <div >
                    <div className='mb-4'>
                        <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Họ Và Tên</div>
                        <Input placeholder="Họ Và Tên" value={receiverName} onChange={(e) => { setReceiverName(e.target.value) }} />
                    </div>
                    <div className='flex'>
                        <div className='mb-4 w-full'>
                            <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Số Điện Thoại</div>
                            <Input placeholder="Số Điện Thoại" value={receiverPhone} onChange={(e) => { setReceiverPhone(e.target.value) }} />
                        </div>
                    </div>
                    <div className='flex justify-between mb-4'>
                        <div className='flex flex-col w-1/3	'>
                            <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Tỉnh/Thành</div>
                            <Select
                                defaultValue={valueProvinceDefautl}
                                placeholder="Tỉnh/Thành"
                                options={dataProvince}
                                value={valueProvince}
                                onChange={handleChangeProvince}
                            />
                        </div>

                        <div className='flex flex-col w-1/3	ml-2 mr-2'>
                            <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Quận/Huyện</div>
                            <Select
                                placeholder="Quận/Huyện"
                                options={dataDistrict}
                                value={valueDistrict}
                                onChange={handleChangeDistrict}
                            />
                        </div>
                        <div className='flex flex-col w-1/3'>
                            <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Phường/Xã</div>
                            <Select
                                placeholder="Phường/Xã"
                                options={dataWard}
                                value={valueWard}
                                onChange={handleChangeWard}
                            />
                        </div>
                    </div>
                    <div className='mb-4'>
                        <div className='mb-2'>Địa Chỉ</div>
                        <Input placeholder="Địa Chỉ" value={details} onChange={(e) => { setDetails(e.target.value) }} />
                    </div>
                    <div className='mb-4'>
                        <div className='mb-2'>Ghi Chú</div>
                        <TextArea rows={4} placeholder="Ghi Chú" onChange={(e) => { setDescription(e.target.value) }} />
                    </div>
                    <div className='mb-4'>
                        <img style={{ width: '180px' }} src='https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-En.png'></img>
                        <div className='mt-2'>
                            Thời Gian Giao Hàng Dự Kiến: {leadtime == null ? "" : dayjs?.unix(leadtime).format('DD/MM/YYYY')}
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default AddressDelivery;