import { Button, Modal, Input, Select, Tag, Checkbox } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import LayoutProfile from '~/components/LayoutProfile';
import axios from "axios";
import DataContext from "~/DataContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Scrollbar } from 'react-scrollbars-custom';
import axiosIns from '~/plugin/axios';
function Address() {

    const { setAddressBillClient, customer, addressBill, dataCheckout, totalPrice, setDataShipMoney } = useContext(DataContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressCustomer, setAddressCustomer] = useState();
    const [addressCustomerModal, setAddressCustomerModal] = useState();

    const [lstAddress, setLstAddress] = useState([]);
    const [checkValueAddress, setCheckValueAddress] = useState(1);

    const [isTabAddreiss, setIsTabAddress] = useState(false);
    const [valueTabAddreiss, setValueTabAddress] = useState(null);

    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);

    const [address, setAddress] = useState();

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
        fetchDataLstAddress();

    }, [customer])

    const fetchDataLstAddress = async () => {
        try {
            const response = await axiosIns.get('/api/v2/address');
            setLstAddress(response.data);
            // Kiểm tra và thiết lập giá trị kiểm tra
            response.data.forEach(address => {
                if (address.defaultAddress) {
                    setCheckValueAddress(address.id);
                    setAddressBillClient(address)
                }
            });
        } catch (error) {
            console.error(error);
        }
    }


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
        // console.log(address);
        if (address?.id == null) {
            axiosIns.post('/api/v1/address', dataAddress)
                .then((response) => {
                    toast.success(response.data.message);
                    fetchDataLstAddress();
                    setAddress();
                    setIsModalOpen(false);

                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                })
        } else {

            axiosIns.put('/api/v1/address/' + address.id, dataAddress)
                .then((response) => {
                    toast.success(response.data.message);
                    fetchDataLstAddress();
                    setAddress();
                    setIsModalOpen(false);

                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                })
        }

    };


    const handleUpdateAddres = (address) => {
        setAddress(address);
        setIsModalOpen(true);

    };
    const handleOk = () => {
        setIsModalOpen(false);
        setAddress();

    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setAddress();

    };

    return (
        <>
            <LayoutProfile>
                <div>
                    <div>
                        <h4 className='text-3xl	font-medium	'>
                            Danh Sách Địa Chỉ
                        </h4>
                    </div>
                    <div className='mt-4'>
                        <Scrollbar style={{ width: '100%', height: 380 }} >

                            {lstAddress?.sort((a, b) => a.id - b.id).map(addr => (
                                <div key={addr.id} className='w-full p-2 ' style={{
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
                                            <div>
                                                <Button className='p-0 mr-4 border-none text-rose-500' onClick={() => { handleUpdateAddres(addr) }}>Cập Nhật</Button>
                                            </div>
                                            {addr.defaultAddress ? <Tag color="#108ee9">Mặc Định</Tag> : ""}</div>

                                    </div>
                                </div>
                            ))}
                        </Scrollbar>

                        <div className='mt-8'>
                            <Button onClick={() => {
                                setIsModalOpen(true);
                                setAddress();
                            }}><FontAwesomeIcon icon={faPlus} /> <span className='ml-2'>Thêm Địa Chỉ</span> </Button>

                        </div>

                    </div>

                    <Modal width={680} footer={null} title="Địa Chỉ" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >

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
                        <div className='flex justify-end mt-10'>
                            <Button onClick={handleCancel}>Thoát</Button>
                            <Button className='ml-4' type='primary' onClick={handleOkAddress}>Hoàn Tất</Button>
                        </div>
                    </Modal>
                </div>

                <ToastContainer></ToastContainer>
            </LayoutProfile>
        </>
    );
}

export default Address;