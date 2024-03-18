import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Tag, Input, Select } from 'antd';
import axios from "axios";
import { useSaleData } from '~/provider/SaleDataProvider';

const { TextArea } = Input;
function AddressGress() {


    const { isDelivery, setDataAddressBill, customer, addressBill } = useSaleData();
    const [lstAddress, setLstAddress] = useState([]);
    const [checkValueAddress, setCheckValueAddress] = useState(1);
    const [address, setAddress] = useState({});

    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);


    const [valueProvince, setValueProvince] = useState(null);
    const [valueDistrict, setValueDistrict] = useState(null);
    const [valueWard, setValueWard] = useState(null);

    const [valueProvinceDefautl, setValueProvinceDefautl] = useState(null);
    const [valueDistrictDefautl, setValueDistrictDefautl] = useState(null);
    const [valueWardDefautl, setValueWardDefautl] = useState(null);


    const [receiverName, setReceiverName] = useState('');
    const [email, setEmail] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [details, setDetails] = useState('');
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
    };
    const handleCancelAddress = () => {
        setIsModalOpenAddress(false);
    };


    useEffect(() => {
        if (customer !== null && isDelivery) {
            setAddress(customer?.defaultAddress)
        } else {
            setAddress(null)
        }
    }, [customer, isDelivery])



    useEffect(() => {
        const address = {
            receiverName: receiverName,
            receiverPhone: receiverPhone,
            detail: details,
            commune: labelWard,
            district: labelDistrict,
            province: labelProvince,
        }
        setDataAddressBill(address)
    }, [receiverName, receiverPhone, details, labelProvince, labelDistrict, labelDistrict, labelWard, address])


    useEffect(() => {
        if (isDelivery) {
            setDataAddressBill(address)
            fillDataAddress(address)
        } else {
            setDataAddressBill(null)
            fillDataAddress(null)
        }

    }, [address, isDelivery])

    const fillDataAddress = (address) => {
        console.log(address);
        setReceiverName(address?.receiverName)
        setReceiverPhone(address?.receiverPhone)
        setDetails(address?.detail)

        setLabelWard(address?.commune ? address.commune : null);
        setLabelDistrict(address?.district ? address.district : null);
        setLabelProvince(address?.province ? address.province : null);

        setValueWard(address?.commune ? address.commune : null);
        setValueDistrict(address?.district ? address.district : null);
        setValueProvince(address?.province ? address.province : null);

    }

    const fetchDataLstAddress = async () => {

        try {
            const response = await axios.get('http://localhost:8080/api/v1/customer/' + customer.id);
            console.log(response.data);
            setLstAddress(response.data.lstAddress);
             // Kiểm tra và thiết lập giá trị kiểm tra
             response.data.lstAddress.forEach(address => {
            if (address.defaultAddress) {
                setCheckValueAddress(address.id);
            }
        });
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
    }, [customer,isDelivery])

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
            setLabelProvince(selectedOption.label)
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
        if (value) {
            const selectedOption = dataWard.find(option => option.value === value);
            setValueWard(selectedOption.value)
            setLabelWard(selectedOption.label)
        }

    };
    const onChangeAddress = (e) => {
        setCheckValueAddress(e.target.value)
    };

    return (
        <>
            <div >
                <div className='mb-4 flex justify-between' >
                    <h4>Thông tin giao hàng</h4>

                    <div style={{ display: customer == null ? 'none' : 'block' }}>
                        <div className='flex justify-end' >
                            <Button onClick={showModalAddress}>Chọn Địa Chỉ</Button>
                        </div>
                        <div>
                            <Modal width={680} title="Địa Chỉ" open={isModalOpenAddress} onOk={handleOkAddress} onCancel={handleCancelAddress}>

                                <Radio.Group onChange={onChangeAddress} value={checkValueAddress} >

                                    {lstAddress?.map(addr => (
                                        <Radio value={addr.id} key={addr.id} className='w-full' style={{
                                            borderTop: '1px solid #ccc',
                                            marginTop: '2px',
                                            marginBottom: '2px',
                                            paddingTop: '2px',
                                            paddingBottom: '2px',
                                        }}>
                                            <div>
                                                {addr.receiverName} | {addr.receiverPhone}
                                            </div>
                                            <div>
                                                <div>{addr.detail}</div>
                                            </div>
                                            <div>{addr.commune}, {addr.district}, {addr.province}</div>
                                            <div className='flex justify-between items-center mt-2'><div><Button>Cập Nhật</Button></div>{addr.defaultAddress ? <Tag color="#108ee9">Mặc Định</Tag> : ""}</div>
                                        </Radio>
                                    ))}
                                </Radio.Group>
                                <div className='mt-6 ml-8'>
                                    <Button>Thêm Địa Chỉ</Button>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
                <div >
                    <div className='mb-4'>
                        <div className='mb-2'>Họ Và Tên</div>
                        <Input placeholder="Họ Và Tên" value={receiverName} onChange={(e) => { setReceiverName(e.target.value) }} />
                    </div>
                    <div className='flex'>
                        <div className='mb-4 w-full'>
                            <div className='mb-2'>Số Điện Thoại</div>
                            <Input placeholder="Số Điện Thoại" value={receiverPhone} onChange={(e) => { setReceiverPhone(e.target.value) }} />
                        </div>
                    </div>
                    <div className='flex justify-between mb-4'>
                        <div className='flex flex-col w-1/3	'>
                            <div className='mb-2'>Tỉnh/Thành</div>
                            <Select
                                defaultValue={valueProvinceDefautl}
                                placeholder="Tỉnh/Thành"
                                options={dataProvince}
                                value={valueProvince}
                                onChange={handleChangeProvince}
                            />
                        </div>

                        <div className='flex flex-col w-1/3	ml-2 mr-2'>
                            <div className='mb-2'>Quận/Huyện</div>
                            <Select
                                placeholder="Quận/Huyện"
                                options={dataDistrict}
                                value={valueDistrict}
                                onChange={handleChangeDistrict}
                            />
                        </div>
                        <div className='flex flex-col w-1/3'>
                            <div className='mb-2'>Phường/Xã</div>
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
                        <TextArea rows={4} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddressGress;