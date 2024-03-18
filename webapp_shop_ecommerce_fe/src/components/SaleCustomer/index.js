import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select } from 'antd';
import axios from "axios";
import { useSaleData } from '~/provider/SaleDataProvider';
import { data } from 'autoprefixer';
import { useDebounce } from '~/hooks';

function SaleCustomer() {

    //provider
    const { setDataAddressBill, updateDataCustomer, customer, isDelivery } = useSaleData();
    const [optionCustomers, setOptionCustomers] = useState([]);
    const [searchText, setSearchText] = useState('');

    const debounceSearch = useDebounce(searchText.trim(), 500)

    const [dataCustomer, setDataCustomer] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/customer/search', {
            params: {
                keyWord: searchText
            }
        })
            .then(res => {
                console.log(res.data);
                const options = res.data.map((data) => {
                    return {
                        key: data.id,
                        value: data.id,
                        label: data.fullName,
                        desc: data.phone,
                    }
                })
                setOptionCustomers(options);

            })
            .catch(err => {
                console.log(err);
            });
    }, [debounceSearch])



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
    return (
        <>
            <div className='mt-4 mb-4 min-h-52 '>
                <div className='flex justify-between'>
                    <div>
                        <h4>Thông Tin Khách Hàng</h4>
                    </div>
                    <div className='flex'>
                        <Select
                            value={customer?.id}
                            filterOption={false}
                            onChange={handleChangeOption}
                            placeholder="Search to Select"
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
                                    {option.data.desc}
                                </Space>
                            )}
                        />
                        <Button>Thêm Khách Hàng</Button>
                    </div>
                </div>
                {(customer !== null) ? (
                    <>
                        <div className='w-2/5 text-2xl leading-10 p-4 '>
                            <div className='flex justify-between'>
                                <div>
                                    <h5>Tên Khách Hàng</h5>
                                    <h5>Số Điện Thoại</h5>
                                    <h5>Email</h5>
                                </div>
                                <div>
                                    <div>{customer.fullName}</div>
                                    <div>{customer.phone}</div>
                                    <div>{customer.email}</div>
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

        </>
    );
}

export default SaleCustomer;