import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Select, Input, Space, Dropdown } from 'antd';
import axios from 'axios';
import { useDebounce } from '~/hooks';
import { ToolOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


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

    },
];

const Product = () => {

    const [valueRadio, setValueRadio] = useState("");
    const [valueSearch, setValueSearch] = useState("");
    const [valueCategory, setValueCategory] = useState("");
    const [valueMaterial, setValueMaterial] = useState("");
    const [valueBrand, setValueBrand] = useState("");
    const [valueStyle, setValueStyle] = useState("");

    const debounceSearch = useDebounce(valueSearch, 500)

    const [optionCategory, setOptionCategory] = useState([]);
    const [optionMaterial, setOptionMaterial] = useState([]);
    const [optionBrand, setOptionBrand] = useState([]);
    const [optionStyle, setOptionStyle] = useState([]);



    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataColum, setDataColum] = useState([]);



    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/product', {
            params: {
                status: valueRadio,
                search: debounceSearch,
                category: valueCategory,
                material: valueMaterial,
                brand: valueBrand,
                style: valueStyle,
            }
        })
            .then(function (response) {
                setLoading(true);
                const data = response.data.map((data, index) => {
                    const items = [
                        {
                            label: <Link to={`/product/${data.id}`}>Chi tiết </Link>,
                            key: '0',
                        },
                        {
                            label: <div><DeleteOutlined />Delete</div>,
                            key: '1',
                        }
                    ];

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
                        action: <Dropdown
                            menu={{
                                items,
                            }}
                            trigger={['click']}
                        >
                            <Button onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <ToolOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
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


    }, [valueRadio, debounceSearch, valueCategory, valueMaterial, valueBrand, valueStyle]);


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
    //checkd box table
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
        setValueSearch(e.target.value);

    };
    const hasSelected = selectedRowKeys.length > 0;


    // find product
    // selectcategory
    const handleChangeCategory = (value) => {
        setValueCategory(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/category')
            .then((response) => {
                const newCategories = response.data.map(category => ({
                    value: category.name,
                    label: category.name,
                    key: category.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionCategory([
                    {
                        value: '',
                        label: 'Tất Cả',
                    },
                    ...newCategories
                ]);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, []);

    //select Material 
    const handleChangeMaterial = (value) => {
        setValueMaterial(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/material')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.name,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionMaterial([
                    {
                        value: '',
                        label: 'Tất Cả',
                    },
                    ...newObj
                ]);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, []);

    //select Brand
    const handleChangeBrand = (value) => {
        setValueBrand(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/brand')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.name,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionBrand([
                    {
                        value: '',
                        label: 'Tất Cả',
                    },
                    ...newObj
                ]);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, []);

    //select Style
    const handleChangeStyle = (value) => {
        setValueStyle(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/style')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.name,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionStyle([
                    {
                        value: '',
                        label: 'Tất Cả',
                    },
                    ...newObj
                ]);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, []);
    // 




    return (
        <div className='bg-white p-4'>
            <div className='font-medium mb-10'>
                <div>
                    <label>Tìm Kiếm</label>
                    <div className='grid grid-cols-7 gap-4 my-4'>
                        <Input className='col-span-6' placeholder="Tìm Kiếm Sản Phẩm" onChange={onChangeSearch} />

                        <Button type="primary"><Link to={`/product/add`}>Thêm Mới Sản Phẩm</Link></Button>
                    </div>
                </div>

                <div className='grid grid-cols-4 gap-4 my-4'>
                    <div>
                        <label>Loại</label>
                        <Select className="w-full mt-4"
                            defaultValue=""
                            onChange={handleChangeCategory}
                            options={optionCategory}
                        />
                    </div>

                    <div>
                        <label>Chất Liệu</label>
                        <Select className="w-full mt-4"
                            defaultValue=""
                            onChange={handleChangeMaterial}
                            options={optionMaterial}
                        />
                    </div>

                    <div>
                        <label>Phong Cách</label>
                        <Select className="w-full mt-4"
                            defaultValue=""
                            onChange={handleChangeStyle}
                            options={optionStyle}
                        />
                    </div>

                    <div>
                        <label>Thương Hiệu</label>
                        <Select className="w-full mt-4"
                            defaultValue=""
                            onChange={handleChangeBrand}
                            options={optionBrand}
                        />
                    </div>

                </div>


                <div className=''>
                    <label>Trạng Thái</label>
                    <div className='my-4 font-normal'>
                        <Radio.Group onChange={onChangeRadio} value={valueRadio}>
                            <Radio value={""}>Tất Cả</Radio>
                            <Radio value={"0"}>Đang Hoạt Động</Radio>
                            <Radio value={"1"}>Ngừng Hoạt Động</Radio>
                        </Radio.Group>
                    </div>
                </div>






            </div>

            <div className='mb-4'>
                <Button type="primary" onClick={dowloadExcel} disabled={!hasSelected} loading={loading}>
                    Excell
                </Button>
                <Button type="primary">
                    <DeleteOutlined />
                </Button>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={dataColum} />
        </div>
    );
};

export default Product;
