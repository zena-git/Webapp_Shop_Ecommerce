import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select, DatePicker, Avatar } from 'antd';
import axios from "axios";
import { useOrderData } from '~/provider/OrderDataProvider';
import { data } from 'autoprefixer';
import { useDebounce } from '~/hooks';
import { UserOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
function OrderCustomer() {

    //provider
    const { setDataAddressBill, updateDataCustomer, customer, isDelivery } = useOrderData();
    const [optionCustomers, setOptionCustomers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [customerAdd, setCustomerAdd] = useState({
        fullName: '',
        phone: '',
        email: '',
        gender: true,
        birthday: dayjs(new Date('1990-01-01'))?.format("YYYY-MM-DD"),
    });

    const debounceSearch = useDebounce(searchText.trim(), 500)

    const [dataCustomer, setDataCustomer] = useState(null);



    const fetchDataCustomer = async () => {

        try {
            const response = await axios.get('http://localhost:8080/api/v1/customer/search', {
                params: {
                    keyWord: searchText
                }
            })
            console.log(response.data);
            const options = response.data.map((data) => {
                return {
                    key: data.id,
                    value: data.id,
                    label: data.fullName,
                    desc: data.phone,
                }
            })
            setOptionCustomers(options);


        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataCustomer()
    }, [debounceSearch])


    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        if (customerAdd?.fullName.trim().length == 0 ||
            customerAdd?.phone.trim().length == 0 ||
            customerAdd?.email.trim().length == 0
        ) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        axios.post('http://localhost:8080/api/v1/customer', customerAdd)
            .then((response) => {
                toast.success(response.data.message);
                fetchDataCustomer()
                setCustomerAdd({
                    fullName: '',
                    phone: '',
                    email: '',
                    gender: true,
                    birthday: dayjs(new Date('1990-01-01'))?.format("YYYY-MM-DD"),
                })
            })
            .catch((error) => {
                toast.error(error.response.data.message);

            });

        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChangeOption = (value) => {
        if (value === undefined) {
            updateDataCustomer(null);
        } else {
            updateDataCustomer(value)
        }

    };
    const handleChangeSearch = (input) => {
        console.log(input);
        setSearchText(input)
    };
    const handleChangeBirthday = (date, dateString) => {
        const dates = dayjs(date)?.format("YYYY-MM-DD");
        if (dates === "Invalid Date") {
            return;
        }
        setCustomerAdd({
            ...customerAdd,
            birthday: dates,
        });
    };


    return (
        <>
            <div className='mt-12 mb-4 min-h-52 shadow-lg p-4 bg-white'>
                <div className='flex justify-between items-center pt-4' style={{
                    borderBottom: '1px solid rgb(232 232 232)',
                    paddingBottom: '12px',
                }}>
                    <div>
                        <h4>Thông Tin Khách Hàng</h4>
                    </div>
                    <div className='flex'>
                        <Select
                            value={customer?.id}
                            filterOption={false}
                            onChange={handleChangeOption}
                            placeholder="Nhập tên hoặc sdt khách hàng"
                            style={{
                                width: '300px',
                            }}
                            onSearch={handleChangeSearch}
                            allowClear
                            showSearch
                            options={optionCustomers}
                            optionRender={(option) => (
                                <Space>
                                    <span role="img" aria-label={option.data.label}>
                                        {option.data.label}
                                    </span>
                                    | {option.data.desc}
                                </Space>
                            )}
                        />
                        <Button type='primary' onClick={showModal} className='ml-4'><FontAwesomeIcon icon={faPlus} /> <span className='ml-2'>Thêm Khách Hàng</span></Button>
                        <Modal
                            width={800}
                            title="Thêm Mới Khách Hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <div className='flex justify-between items-center p-4'>
                                <div className='w-2/5 flex  justify-center'>
                                    <Avatar size={180} icon={<UserOutlined />} />
                                </div>

                                <div className='w-3/5'>
                                    <div>
                                        <label>Tên Khách Hàng</label>
                                        <Input
                                            className='mt-2 mb-4'
                                            placeholder='Nhập Tên Khách Hàng'
                                            value={customerAdd.fullName}
                                            onChange={(e) => {
                                                setCustomerAdd({
                                                    ...customerAdd,
                                                    fullName: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Giới Tính</label>
                                        </div>
                                        <Radio.Group
                                            value={customerAdd.gender}
                                            className='mt-2 mb-4' defaultValue={true}
                                            onChange={(e) => {
                                                setCustomerAdd({
                                                    ...customerAdd,
                                                    gender: e.target.value,
                                                });
                                            }}
                                        >
                                            <Radio value={true}>Nam</Radio>
                                            <Radio value={false}>Nữ</Radio>
                                        </Radio.Group>
                                    </div>
                                    <div>
                                        <div>
                                            <label>Ngày Sinh</label>
                                        </div>
                                        <DatePicker className='mt-2 mb-4' onChange={handleChangeBirthday} format="YYYY-MM-DD" // Specify the desired format
                                            value={dayjs(customerAdd.birthday)} />
                                    </div>
                                    <div>
                                        <label>Số Điện Thoại</label>
                                        <Input
                                            className='mt-2 mb-4'
                                            placeholder='Nhập Số Điện Thoại'
                                            value={customerAdd.phone}
                                            onChange={(e) => {
                                                setCustomerAdd({
                                                    ...customerAdd,
                                                    phone: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <Input
                                            type='email'
                                            className='mt-2 mb-4'
                                            placeholder='Email'
                                            value={customerAdd.email}
                                            onChange={(e) => {
                                                setCustomerAdd({
                                                    ...customerAdd,
                                                    email: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>

                        </Modal>

                    </div>
                </div>
                <div style={{
                    minHeight: '100px'
                }}>
                    {(customer !== null) ? (
                        <>
                            <div className='w-2/5 text-2xl leading-10 p-4'>
                                <div className='flex justify-between'>
                                    <div>
                                        <h5>Tên Khách Hàng</h5>
                                        <h5>Số Điện Thoại</h5>
                                        <h5>Email</h5>
                                    </div>
                                    <div>
                                        <div>{customer.fullName || 'khách hàng'}</div>
                                        <div>{customer.phone || '0123456789'}</div>
                                        <div>{customer.email || 'abc@abc.com'}</div>
                                    </div>
                                </div>

                            </div>
                        </>
                    ) : (
                        <>
                            <div className='w-2/5 text-2xl leading-10 p-4'>
                                <div className='flex justify-between'>
                                    <div>
                                        <h5>Tên Khách Hàng</h5>
                                    </div>
                                    <div>
                                        <div>Khách Lẻ</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

        </>
    );
}

export default OrderCustomer;