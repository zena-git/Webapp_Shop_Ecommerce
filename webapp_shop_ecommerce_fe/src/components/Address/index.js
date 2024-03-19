import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select } from 'antd';
import axios from "axios";
import { useSaleData } from '~/provider/SaleDataProvider';
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
        axios.get('https://vapi.vnappmob.com/api/province')
            .then((response) => {
                const lstProvince = response.data.results.map((result) => {
                    return {
                        value: result.province_id,
                        label: result.province_name
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
        if (valueProvince != null) {
            axios.get('https://vapi.vnappmob.com/api/province/district/' + valueProvince)
                .then((response) => {
                    const lstDistrict = response.data.results.map((result) => {
                        return {
                            value: result.district_id,
                            label: result.district_name
                        }
                    })
                    setDataDistrict(lstDistrict)
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueProvince])

    //lấy ward
    useEffect(() => {
        if (valueDistrict != null) {
            axios.get('https://vapi.vnappmob.com/api/province/ward/' + valueDistrict)
                .then((response) => {
                    const lstWard = response.data.results.map((result) => {
                        return {
                            value: result.ward_id,
                            label: result.ward_name
                        }
                    })
                    setDataWard(lstWard)
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueDistrict])

    const handleChangeProvince = (value) => {
        if (value) {
            const selectedOption = dataProvince.find(option => option.value === value);
            setValueProvince(selectedOption.value)
            setAddress({
                ...address,
                province: selectedOption.label
            }
            )
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
            setAddress({
                ...address,
                district: selectedOption.label
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
        // console.log(address);
        if (address?.id == null) {
            axios.post('http://localhost:8080/api/v1/address', dataAddress)
                .then((response) => {
                    toast.success(response.data.message);
                    updateDataAddress();

                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                })
        } else {
            axios.put('http://localhost:8080/api/v1/address/' + address.id, dataAddress)
                .then((response) => {
                    toast.success(response.data.message);
                    updateDataAddress();

                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                })
        }
        goBack();
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