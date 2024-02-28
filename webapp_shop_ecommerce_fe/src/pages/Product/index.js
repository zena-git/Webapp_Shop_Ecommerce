import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Select, Input , Space } from 'antd';
import axios from 'axios';
const columns = [
    {
        title: '#',
        dataIndex: 'index', // Change 'index' to 'key'
        key: 'index',
    },
    {
        title: 'Mã',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Số Lượng',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Loại',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Chất Liệu',
        dataIndex: 'material',
        key: 'material',
    },
    {
        title: 'Phong Cách',
        dataIndex: 'style',
        key: 'style',
    },
    {
        title: 'Thương Hiệu',
        dataIndex: 'brand',
        key: 'brand',
    },
    {
        title: 'Trạng Thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => <a>Delete</a>,
    },
];

const Product = () => {
    var call = 0;

    const [valueRadio, setValueRadio] = useState("");
    const [valueSearch, setValueSearch] = useState("");
    const [valueCategory, setValueCategory] = useState("");
    const [valueMaterial, setValueMaterial] = useState("");
    const [valueBrand, setValueBrand] = useState("");
    const [valueStyle, setStyle] = useState("");


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataColum, setDataColum] = useState([]);



    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/product', {
            params: {
                status: valueRadio,
                search: valueSearch,
                category: valueCategory,
                material: valueMaterial,
                brand: valueBrand,
                style: valueStyle,
            }
        })
            .then(function (response) {
                setLoading(true);
                const data = response.data.map((data, index) => {
                    let quantity = data.lstProductDetails.reduce((total, product) => total + product.quantity, 0);

                    let product = {
                        key: data.id,
                        index: index + 1,
                        code: data.code,
                        name: data.name,
                        quantity: quantity,
                        category: data.category.name,
                        material: data.material.name,
                        style: data.style.name,
                        brand: data.brand.name,
                        status: data.status === "0" ? "Đang Hoạt Động" : "Ngừng Hoạt Động",
                    }
                    return product
                });


                setDataColum(data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                setLoading(false);
            })


    }, [valueRadio, valueSearch, valueCategory, valueMaterial, valueBrand, valueStyle]);


    const dowloadExcel = () => {
        setLoading(true);
        const downloadExcel = async () => {
            const apiUrl = 'http://localhost:8080/api/v1/product/excell?data=';

            try {
                const response = await axios.get(apiUrl + selectedRowKeys, { responseType: 'blob' });
                const currentDate = new Date();
                // Create a blob URL and initiate the download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Product_' + currentDate.getDate() + '_' + (currentDate.getMonth() + 1) + '_' + currentDate.getFullYear() + '.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setSelectedRowKeys([]);
                setLoading(false);
            } catch (error) {
                console.error('Error downloading Excel file:', error);
            }
        };

        // Call the function when needed
        downloadExcel();

    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    const onChangeRadio = (e) => {
        setValueRadio(e.target.value);
    };
    const onChangeSearch = (e) => {
        console.log(e.target.value);
        
    };
    const hasSelected = selectedRowKeys.length > 0;


    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    return (
        <div className='bg-white p-4'>
            <div className='flex flex-col '>
            <Input placeholder="Tìm Kiếm Sản Phẩm" onChange={onChangeSearch} />

                <Select
                    defaultValue=""
                    onChange={handleChange}
                    options={[
                        {
                            value: '',
                            label: 'Tất Cả',
                        },
                        {
                            value: '0',
                            label: 'Đang Hoạt Động',
                        },
                        {
                            value: '1',
                            label: 'Ngừng Hoạt Động',
                        }
                    ]}
                />
                <label>Trạng Thái</label>
                <Radio.Group onChange={onChangeRadio} value={valueRadio}>
                    <Radio value={""}>Tất Cả</Radio>
                    <Radio value={"0"}>Đang Hoạt Động</Radio>
                    <Radio value={"1"}>Ngừng Hoạt Động</Radio>
                </Radio.Group>

            </div>

            <div className='mb-4'>
                <Button type="primary" onClick={dowloadExcel} disabled={!hasSelected} loading={loading}>
                    Excell
                </Button>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={dataColum} />
        </div>
    );
};

export default Product;
