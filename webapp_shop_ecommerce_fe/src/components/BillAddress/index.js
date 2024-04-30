import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select } from 'antd';
import axios from "axios";
import { LoadingOutlined } from '@ant-design/icons';
import { useSaleData } from '~/provider/OrderDataProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fixMoney } from '~/ultils/fixMoney';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { TextArea } = Input;
function BillAddress({ bill, handleCancelAddress, fetchDataBill, lstBillDetails }) {

    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);

    const [serviceId, setServiceId] = useState('53321');
    const [leadtime, setLeadtime] = useState(null);

    const [address, setAddress] = useState(bill);
    const [loading, setLoading] = useState(false);

    const [valueProvince, setValueProvince] = useState(null);
    const [valueDistrict, setValueDistrict] = useState(null);
    const [valueWard, setValueWard] = useState(null);

    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState('');
    const [labelProvince, setLabelProvince] = useState(null);
    const [labelDistrict, setLabelDistrict] = useState(null);
    const [labelWard, setLabelWard] = useState(null);

    useEffect(() => {


    }, [])

    //lấy province
    useEffect(() => {
        setLoading(true);
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
                // console.log(lstProvince);
            })
            .catch((error) => {
                console.log(error.response.data);
            }).finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, [400])
            });
    }, [])

    //lấy district
    useEffect(() => {
        console.log(valueProvince);
        setLoading(true);
        if (valueProvince != null) {
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
                    // console.log(response.data.data);
                })
                .catch((error) => {
                    console.log(error.response.data);
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, [400])
                });
        }
    }, [valueProvince])

    //lấy ward
    useEffect(() => {
        console.log(valueDistrict);
        if (valueDistrict != null) {
            console.log(valueDistrict);
            setLoading(true);
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
                    // console.log( response.data.data);
                })
                .catch((error) => {
                    console.log(error.response.data);
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, [400])
                });
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
                    console.log(response.data.data[0].service_id + '-' + response.data.data[0].short_name);
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueDistrict])

    //Tính phí ship
    useEffect(() => {
        if (lstBillDetails.length <= 0) {
            return;
        }
        const priceProduct = lstBillDetails.reduce((accumulator, currentProduct) => {
            return accumulator + (currentProduct.unitPrice * currentProduct.quantity);
        }, 0);

        const weightProduct = lstBillDetails.reduce((accumulator, currentProduct) => {
            return accumulator + (currentProduct.productDetails.weight * currentProduct.quantity);
        }, 0);
        console.log("cân nặng " + weightProduct);

        if (valueDistrict != null) {
            setLoading(true);
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

                    console.log(response.data.data.total);
                    // setDataShipMoney(response.data.data.total)
                    setAddress({
                        ...address,
                        shipMoney: response.data.data.total,
                    }
                    )
                })
                .catch((error) => {
                    console.log(error.response.data);
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, [400])
                });
        }
    }, [serviceId, lstBillDetails])


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
    }, [valueDistrict, valueWard])


    useEffect(() => {
        fillDataAddress(address)
    }, [bill, dataProvince, dataDistrict, dataWard, address])

    const fillDataAddress = (address) => {
        console.log(address);
        // setReceiverName(address?.receiverName)
        // setReceiverPhone(address?.receiverPhone)
        // setDetails(address?.detail)

        setLabelWard(address?.receiverCommune ? address.receiverCommune : null);
        setLabelDistrict(address?.receiverDistrict ? address.receiverDistrict : null);
        setLabelProvince(address?.receiverProvince ? address.receiverProvince : null);


        const foundProvince = dataProvince.find(item => item.label === address?.receiverProvince);
        setValueProvince(foundProvince?.value);
        const foundDistrict = dataDistrict.find(item => item.label === address?.receiverDistrict);
        setValueDistrict(foundDistrict?.value);
        const foundWard = dataWard.find(item => item.label === address?.receiverCommune);
        setValueWard(foundWard?.value);


    }

    const handleChangeProvince = (value) => {
        console.log(value);

        if (value) {
            const selectedOption = dataProvince.find(option => option.value === value);
            setValueProvince(selectedOption.value)
            setAddress({
                ...address,
                receiverProvince: selectedOption.label,
                receiverDistrict: null,
                receiverCommune: null,
            }
            )
            setValueDistrict(null)
            setValueWard(null)

            setLabelWard(null);
            setLabelDistrict(null);

        }

    };

    const handleChangeDistrict = (value) => {
        console.log(value);
        if (value) {
            const selectedOption = dataDistrict.find(option => option.value === value);
            setValueDistrict(selectedOption.value)
            setAddress({
                ...address,
                receiverDistrict: selectedOption.label,
                receiverCommune: null,
            }
            )
            setValueWard(null)
            setLabelWard(null);

        }

    };
    const handleChangeWard = (value) => {
        if (value) {
            console.log(value);
            const selectedOption = dataWard.find(option => option.value === value);
            setValueWard(selectedOption.value)
            setAddress({
                ...address,
                receiverCommune: selectedOption.label
            }
            )
        }

    };



    const handleOkAddress = () => {
        const addressBill = {
            id: address.id,
            receiverName: address.receiverName,
            receiverPhone: address.receiverPhone,
            receiverProvince: address.receiverProvince,
            receiverDistrict: address.receiverDistrict,
            receiverCommune: address.receiverCommune,
            receiverDetails: address.receiverDetails,
            shipMoney: address.shipMoney,
            description: address.description
        };
        console.log(addressBill);
        if (addressBill?.receiverName?.trim().length == 0 ||
            addressBill?.receiverPhone?.trim().length == 0 ||
            addressBill?.receiverProvince?.trim().length == 0 ||
            addressBill?.receiverDistrict?.trim().length == 0 ||
            addressBill?.receiverCommune?.trim().length == 0 ||
            addressBill?.receiverDetails?.trim().length == 0
        ) {
            toast.error("Không được để trống địa chỉ quan trọng")
            return;
        }

        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(addressBill?.receiverPhone?.trim())) {
            toast.error('Số điện thoại không hợp lệ');
            return;
        }
        axios.put(`http://localhost:8080/api/v1/bill/${bill.id}/address`, addressBill)
            .then((response) => {
                fetchDataBill()
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
        handleCancelAddress();
    };
    return (
        <>
            <div>
                <div >
                    <div >

                        <div className='flex justify-between mb-4'>
                            <div className='mr-2 w-1/2'>
                                <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Họ Và Tên</div>
                                <Input placeholder="Họ Và Tên" value={address?.receiverName} onChange={(e) => {
                                    setAddress({
                                        ...address,
                                        receiverName: e.target.value
                                    }
                                    )
                                }} />
                            </div>
                            <div className='ml-2 w-1/2'>
                                <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Số Điện Thoại</div>
                                <Input placeholder="Số Điện Thoại" value={address?.receiverPhone} onChange={(e) => {
                                    setAddress({
                                        ...address,
                                        receiverPhone: e.target.value
                                    }
                                    )
                                }} />
                            </div>
                        </div>
                        <div className='flex justify-between mb-4'>
                            <div className='flex flex-col w-1/3	'>
                                <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Tỉnh/Thành</div>
                                <Select
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
                        <div className='flex justify-between mb-4'>

                            <div className='w-1/2 mr-2'>
                                <div className='mb-2'>Địa Chỉ</div>
                                <Input placeholder="Địa Chỉ" value={address?.receiverDetails}
                                    onChange={(e) => {
                                        setAddress({
                                            ...address,
                                            receiverDetails: e.target.value
                                        }
                                        )
                                    }} />
                            </div>
                            <div className='w-1/2 ml-2'>
                                <div className='mb-2'>Ghi Chú</div>
                                <Input placeholder="Ghi Chú" value={address?.description}
                                    onChange={(e) => {
                                        setAddress({
                                            ...address,
                                            description: e.target.value
                                        }
                                        )
                                    }} />
                            </div>
                        </div>


                    </div>

                    <div className='mb-20 mt-10'>
                        <div>
                            <h4>Giao Hàng</h4>
                        </div>
                        <div className='leading-10	'>
                            <div>
                                Thời Gian Giao Hàng Dự Kiến: {leadtime == null ? "" : dayjs?.unix(leadtime).format('DD/MM/YYYY')}
                            </div>
                            <div>
                                Phí Ship (Tạm Tính): <span className='font-medium	'>{fixMoney(address?.shipMoney)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end mt-4'>
                    <Button danger onClick={handleCancelAddress}>Thoát</Button>
                    <Button type="primary" className='ml-4' onClick={handleOkAddress}>Xác Nhận</Button>
                </div>
                <div >
                    {loading && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                bottom: '0',
                                right: '0',
                                backgroundColor: 'rgba(146, 146, 146, 0.14)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1,
                            }}
                        >
                            <div  >
                                <LoadingOutlined className='text-6xl text-rose-500	' />
                            </div>

                        </div>
                    )}
                </div>
            </div>

        </>

    );
}

export default BillAddress;