import React, { useState, useEffect, useContext } from 'react';
import { Button, Checkbox, Radio, Space, Input, Select } from 'antd';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
const { TextArea } = Input;
function Address({ goBack, customer, valueAddress, updateDataAddress }) {

    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);

    const [address, setAddress] = useState(valueAddress);

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
                // console.log(lstProvince);
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }, [])

    //lấy district
    useEffect(() => {
        console.log(valueProvince);
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
                })
        }
    }, [valueProvince])

    //lấy ward
    useEffect(() => {
        console.log(valueDistrict);
        if (valueDistrict != null) {
            console.log(valueDistrict);
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
                })
        }
    }, [valueDistrict])



    const handleChangeProvince = (value) => {
        console.log(value);

        if (value) {
            const selectedOption = dataProvince.find(option => option.value === value);
            setValueProvince(selectedOption.value)
            setAddress({
                ...address,
                province: selectedOption.label,
                district: null,
                commune: null,
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
                district: selectedOption.label,
                commune: null,
            }
            )
            setValueWard(null)
            setLabelWard(null);

        }

    };
    const handleChangeWard = (value) => {
        if (value) {
            const selectedOption = dataWard.find(option => option.value === value);
            setValueWard(selectedOption.value)
            setAddress({
                ...address,
                commune: selectedOption.label
            }
            )
        }

    };

    const handleOkAddress = () => {
        const dataAddress = {
            ...address,
            customer: customer.id,
        }
        console.log(dataAddress);
        if (dataAddress.commune === undefined ||
            dataAddress.province === undefined ||
            dataAddress.district === undefined ||
            dataAddress.commune === undefined ||
            dataAddress.detail === undefined ||
            dataAddress.receiverName === undefined ||
            dataAddress.receiverPhone === undefined
        ) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        // Kiểm tra định dạng số điện thoại
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(dataAddress.receiverPhone.trim())) {
            toast.error('Số điện thoại không hợp lệ');
            return;
        }
        if (address?.id == null) {
            axios.post('http://localhost:8080/api/v1/address', dataAddress)
                .then((response) => {
                    toast.success(response.data.message);
                    updateDataAddress();
                    goBack();

                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                })
        } else {
            axios.put('http://localhost:8080/api/v1/address/' + address.id, dataAddress)
                .then((response) => {
                    toast.success(response.data.message);
                    updateDataAddress();
                    goBack();

                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                })
        }
    };
    return (
        <>
            <div >
                <div >
                    <div className='mb-4'>
                        <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Họ Và Tên</div>
                        <Input placeholder="Họ Và Tên" value={address?.receiverName} onChange={(e) => {
                            setAddress({
                                ...address,
                                receiverName: e.target.value
                            }
                            )
                        }} />
                    </div>
                    <div className='flex'>
                        <div className='mb-4 w-full'>
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
                                value={address?.province}
                                onChange={handleChangeProvince}
                            />
                        </div>

                        <div className='flex flex-col w-1/3	ml-2 mr-2'>
                            <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Quận/Huyện</div>
                            <Select
                                placeholder="Quận/Huyện"
                                options={dataDistrict}
                                value={address?.district}
                                onChange={handleChangeDistrict}
                            />
                        </div>
                        <div className='flex flex-col w-1/3'>
                            <div className='mb-2'><span className='text-3xl	text-rose-600 mr-2'>*</span>Phường/Xã</div>
                            <Select
                                placeholder="Phường/Xã"
                                options={dataWard}
                                value={address?.commune}
                                onChange={handleChangeWard}
                            />
                        </div>
                    </div>
                    <div className='mb-4'>
                        <div className='mb-2'>Địa Chỉ</div>
                        <Input placeholder="Địa Chỉ" value={address?.detail}
                            onChange={(e) => {
                                setAddress({
                                    ...address,
                                    detail: e.target.value
                                }
                                )
                            }} />
                    </div>
                    <div className='mt-6 mb-10'>
                        <Checkbox value={address?.defaultAddress} checked={address?.defaultAddress} onChange={(e) => {
                            setAddress({
                                ...address,
                                defaultAddress: e.target.checked
                            })
                        }}>Đặt Làm Địa Chỉ Mặc Định</Checkbox>
                    </div>
                </div>
            </div>
            <div className='flex justify-end mt-10'>
                <Button onClick={goBack} className='mr-4'>Trở Lại</Button>
                <Button type='primary' onClick={handleOkAddress}>Hoàn Tất</Button>
            </div>
        </>

    );
}

export default Address;