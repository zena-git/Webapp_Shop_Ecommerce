import React, { useState, useEffect } from 'react';
import { Button, Table, Radio, Select, Input, Space, Dropdown, Switch, Spin, Popconfirm, Tooltip, Modal } from 'antd';
import axios from 'axios';
import { useDebounce } from '~/hooks';
import { ToolOutlined, DeleteOutlined, InfoCircleOutlined, QuestionCircleOutlined, RedoOutlined, FilterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons';

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
const columnsDeleted = [
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
        title: 'Action',
        dataIndex: 'action',
        key: 'action',

    },
];
const Product = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    const [valueRadio, setValueRadio] = useState("");
    const [valueSearch, setValueSearch] = useState("");
    const [valueCategory, setValueCategory] = useState("");
    const [valueMaterial, setValueMaterial] = useState("");
    const [valueBrand, setValueBrand] = useState("");
    const [valueStyle, setValueStyle] = useState("");

    const debounceSearch = useDebounce(valueSearch.trim(), 500)

    const [optionCategory, setOptionCategory] = useState([]);
    const [optionMaterial, setOptionMaterial] = useState([]);
    const [optionBrand, setOptionBrand] = useState([]);
    const [optionStyle, setOptionStyle] = useState([]);



    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [dataColum, setDataColum] = useState([]);
    const [dataColumDeleted, setDataColumDeleted] = useState([]);
    const [historyData, setHistoryData] = useState([]);

    const [open, setOpen] = useState(false);

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
                            label: <Link style={{ color: '#ffa900' }} to={`/product/${data.id}`}> <InfoCircleOutlined /> Chi tiết </Link>,
                            key: '0',
                        },
                        {
                            label: <Link style={{ color: 'green' }} to={`/product/update/${data.id}`}><FontAwesomeIcon icon={faPen} /> Update </Link>,
                            key: '1',
                        },
                        {
                            label: <div style={{ color: 'red' }} onClick={() => showModal(data.id)}><DeleteOutlined /> Delete</div>,
                            key: '2',
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
                        status: <Tooltip placement="top" title={data.status == '0' ? "Đang Bán" : "Ngừng Bán"} >
                            <Switch value={data.status === '0'} onChange={(checked) => onChangeStatus(checked, data.id)} />
                        </Tooltip>,
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


    }, [valueRadio, debounceSearch, valueCategory, valueMaterial, valueBrand, valueStyle, historyData]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/product/deleted')
            .then(function (response) {
                const data = response.data.map((data, index) => {
                    let product = {
                        key: data.id,
                        index: index + 1,
                        code: data.code,
                        name: data.name,
                        category: data.category.name,
                        material: data.material.name,
                        style: data.style.name,
                        brand: data.brand.name,
                        action:
                            <Popconfirm
                                title="Recover"
                                description={`Bạn có chắc muốn khôi phục sản phẩm "${data.name}"?`}

                                onConfirm={() => handleProductRecover(data.id)}

                            >
                                <Button onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <RedoOutlined />
                                    </Space>
                                </Button>
                            </Popconfirm>

                    }
                    return product
                });


                setDataColumDeleted(data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })


    }, [historyData]);
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
    //onChangeStatus
    const onChangeStatus = (checked, productId) => {
        setLoadingUpdate(true);
        // Gửi yêu cầu API hoặc thực hiện các xử lý cần thiết để cập nhật trạng thái
        axios.put(`http://localhost:8080/api/v1/product/status/${productId}`, { status: checked ? '0' : '1' })
            .then(response => {
                toast.success("Trạng thái đã được cập nhật thành công.");
                console.log('Trạng thái đã được cập nhật thành công.');
                setHistoryData(response.data)

            })
            .catch(error => {
                toast.success('Lỗi khi cập nhật trạng thái');
                console.error('Lỗi khi cập nhật trạng thái:', error);
            })
            .finally(function () {
                setTimeout(() => {
                    setLoadingUpdate(false);
                }, 1000);
            });
    };

    const handleDeleteProduct = (id) => {
        setLoadingUpdate(true);
        // Gửi yêu cầu API hoặc thực hiện các xử lý cần thiết để cập nhật trạng thái
        axios.delete(`http://localhost:8080/api/v1/product/${id}`)
            .then(response => {
                toast.success("Xóa Sản Phẩm Thành Công.");
                setHistoryData(response.data)
            })
            .catch(error => {
                toast.error('Lỗi Xóa Sản Phẩm.');

            }).finally(() => {
                setTimeout(() => {
                    setLoadingUpdate(false);
                }, 1000);
            });
    };
    const handleProductRecover = (id) => {
        // Gửi yêu cầu API hoặc thực hiện các xử lý cần thiết để cập nhật trạng thái
        // setLoadingUpdate(true);

        axios.put(`http://localhost:8080/api/v1/product/recover/${id}`)
            .then(response => {
                toast.success("Recover Sản Phẩm Thành Công.");
                setHistoryData(response.data)

            })
            .catch(error => {
                toast.error('Lỗi Recover Sản Phẩm.');

            }).finally(() => {
                // setTimeout(() => {
                //     setLoadingUpdate(false);
                // }, 1000);
            });
    };


    const showModal = (productId) => {
        setModalVisible(true);
        setProductIdToDelete(productId);
    };

    const handleOk = () => {
        if (productIdToDelete) {
            handleDeleteProduct(productIdToDelete);
        }
        setModalVisible(false);
        setProductIdToDelete(null);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setProductIdToDelete(null);
    };

    return (
        <div className=''>
            <div>
                <h3>
                    Quản Lý Sản Phẩm
                </h3>
            </div>
            <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                <div className='mb-6 mt-2 '>
                    <div className='text-[16px] font-semibold'><FilterOutlined className='mr-2'></FilterOutlined>Bộ Lọc</div>
                </div>
                <div>
                    <label>Tìm Kiếm</label>
                    <div className='grid grid-cols-7 gap-4 my-4'>
                        <Input className='col-span-6' placeholder="Tìm Kiếm Sản Phẩm" onChange={onChangeSearch} />

                        <Link to={`/product/add`} ><Button type='primary'>Thêm Mới Sản Phẩm</Button></Link>
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
                            <Radio value={"0"}>Đang Bán</Radio>
                            <Radio value={"1"}>Ngừng Bán</Radio>
                        </Radio.Group>
                    </div>
                </div>

            </div>
            <div className='bg-white p-4 mt-4 mb-20 shadow-lg'>
                <div className='flex justify-between	'>

                    <div className='mb-6 mt-2 '>
                        <div className='text-[16px] font-semibold'>Danh Sách Sản Phẩm</div>
                    </div>
                    <div className='mb-6 mt-2' >
                        <Button type="primary" onClick={dowloadExcel} disabled={!hasSelected} loading={loading}>
                            Excell
                        </Button>
                        <Button type="primary" onClick={() => setOpen(true)} className='ml-4'>
                            <DeleteOutlined />
                        </Button>
                        <>
                            <Modal
                                title="Sản Phẩm Đã Xóa"
                                centered
                                open={open}
                                onOk={() => { }}
                                onCancel={() => setOpen(false)}
                                width={1000}
                                footer={null}
                            >
                                <div>
                                    <Table columns={columnsDeleted} pagination={{
                                        pageSize: 5,
                                    }} dataSource={dataColumDeleted} />
                                </div>
                            </Modal>
                        </>
                    </div>
                </div>

                <Table rowSelection={rowSelection} pagination={{
                    pageSize: 5,
                }} columns={columns} dataSource={dataColum} />

                <Modal
                    title="Xác nhận xóa"
                    visible={modalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Xác Nhận"
                    cancelText="Hủy"
                >
                    <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                </Modal>
                <ToastContainer />

                {loadingUpdate && (

                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                            backgroundColor: 'rgba(000, 000, 000, 0.08)',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                    >
                        <Spin size="large" tip="product..." />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;
