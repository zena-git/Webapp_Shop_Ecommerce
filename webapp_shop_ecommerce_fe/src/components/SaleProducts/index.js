import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, Input, Table, InputNumber } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Empty } from 'antd';
import hexToColorName from '~/ultils/HexToColorName';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

function SaleProducts({ data }) {

    const columnsTable = [

        {
            title: '#',
            dataIndex: 'index', // Change 'index' to 'key'
            key: 'index',
            width: 50,
        },
        {
            title: 'Ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',

        },

        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Màu Sắc',
            dataIndex: 'color',
            key: 'color',
            render: (color) => (
                <div className='flex'>
                    <Tooltip title={hexToColorName(color.name) + ' - ' + color.name} color={color.name} key={color.name}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: color.name }}></div>
                    </Tooltip>
                    <span className='ml-2'>- {color.name}</span>
                </div>

            ),
        },
        {
            title: 'Kích Thước',
            dataIndex: 'size',
            key: 'size',
            render: (size) => (
                <>{size.name}</>
            ),
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },


    ];


    const columnsTableConfig = [

        {
            title: '#',
            dataIndex: 'index', // Change 'index' to 'key'
            key: 'index',
            width: 50,
        },
        {
            title: 'Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 250,
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },

        {
            title: 'Tổng Giá',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },

    ];


    const columnsTableCart= [

        {
            title: '#',
            dataIndex: 'index', // Change 'index' to 'key'
            key: 'index',
            width: 50,
        },
        {
            title: 'Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 250,
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },

        {
            title: 'Tổng Giá',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },

    ];

    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [openAddProductConfig, setOpenAddProductConfig] = useState(false);

    const [lstBillDetails, setLstBillDetails] = useState(data.lstBillDetails);
    const [lstProductDetails, setLstProductDetails] = useState([]);
    const [dataColumProductDetails, setDataColumProductDetails] = useState([]);

    const [lstBillDetailsConfig, setLstBillDetailsConfig] = useState([]);
    const [dataColumProductDetailsConfig, setDataColumProductDetailsConfig] = useState([]);

    const [lstProductDetailsCart, setLstProductDetailsCart] = useState([]);
    const [dataColumProductDetailsCart, setDataColumProductDetailsCart] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchDataProductDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/counters/products');
            console.log(response.data);
            setLstProductDetails(response.data)
            const sortedDataTable = [...response.data].sort((a, b) => a.id - b.id);
            const dataTable = sortedDataTable.map((data, index) => {
                let product = {
                    key: data.id,
                    id: data.id,
                    index: index + 1,
                    name: data.product.name,
                    code: data.code,
                    color: data.color,
                    size: data.size,
                    price: data.price,
                    quantity: data.quantity,
                    imageUrl: (
                        <div>
                            <img src={data.imageUrl} style={{ maxWidth: '60px', maxHeight: '60px' }} alt='Product' />
                        </div>
                    ),
                };
                return product;
            });



            setDataColumProductDetails(dataTable);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataProductDetails();
    }, [])


    const fetchDataCart = async () => {
        const idBill = data.id;
        if (!idBill) {
            toast.error("Invalid or missing bill ID.");
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/v1/counters/'+idBill);
            console.log(response.data);
            // setLstProductDetailsCart(response.data);
        fillDataProductDetailsCart(response.data)

        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchDataCart();
    }, [])

    useEffect(() => {
        fillDataProductDetailsCart(lstProductDetailsCart)
    }, [lstProductDetailsCart])

    const fillDataProductDetailsCart = (data) => {
        console.log(data);
        const lstDataCustom = data.map((data, index) => {
            return {
                key: data.id,
                id: data.id,
                index: index + 1,
                name: <>
                    <div className='flex'>
                        <div className='flex'>
                            <div>
                                <img src={data.productDetails.imageUrl} style={{ maxWidth: '60px', maxHeight: '60px' }} alt='Product' />
                            </div>
                            <div className='ml-4'>
                                <h4>{data.productDetails.product.name}</h4>
                                <div style={{ fontSize: '12px' }}>
                                    <div className='flex'>Màu Sắc:
                                        <div style={{ width: '16px', height: '16px', backgroundColor: data.productDetails.color.name, marginLeft: '4px', marginRight: '4px' }}></div>
                                        <span>- {hexToColorName(data.productDetails.color.name)}</span>
                                    </div>
                                    <div>Kích Thước: {data.productDetails.size.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                price: data.productDetails.price,
                quantity: <InputNumber
                    min={1}
                    max={data.productDetails.quantity}
                    value={data.quantity} // Sử dụng giá trị quantity như mặc định
                    onChange={(value) => onChangeQuantityProductConfig(value, data.id)} // Gọi hàm khi số lượng thay đổi
                />,
                totalMoney: data.productDetails.price * data.quantity,
                action: <>
                    <Button danger onClick={() => { handleDeleteProductConfig(data.id) }} ><DeleteOutlined></DeleteOutlined></Button>
                </>

            }
        })
        setDataColumProductDetailsCart(lstDataCustom)
        return lstDataCustom;
    }

    

    useEffect(() => {
        console.log(lstBillDetailsConfig);
        fillDataProductDetailsConfig(lstBillDetailsConfig)
    }, [lstBillDetailsConfig])

    const handleAddProductDetails = () => {
        // console.log(selectedRowKeys);
        // Lọc danh sách productDetail có id nằm trong mảng selectedRowKeys
        const selectedProductDetails = lstProductDetails.filter(productDetail => selectedRowKeys.includes(productDetail.id))
            .map(productDetail => {
                return {
                    ...productDetail,
                    quantityMax: productDetail.quantity,
                    quantity: 1,
                }
            });
        // In danh sách productDetail đã lọc
        // console.log(selectedProductDetails);
        setLstBillDetailsConfig(selectedProductDetails)
        setOpenAddProductConfig(true);
    };
    const fillDataProductDetailsConfig = (data) => {
        const lstDataCustom = data.map((data, index) => {
            return {
                key: data.id,
                id: data.id,
                index: index + 1,
                name: <>
                    <div className='flex'>
                        <div className='flex'>
                            <div>
                                <img src={data.imageUrl} style={{ maxWidth: '60px', maxHeight: '60px' }} alt='Product' />
                            </div>
                            <div className='ml-4'>
                                <h4>{data.product.name}</h4>
                                <div style={{ fontSize: '12px' }}>
                                    <div className='flex'>Màu Sắc:
                                        <div style={{ width: '16px', height: '16px', backgroundColor: data.color.name, marginLeft: '4px', marginRight: '4px' }}></div>
                                        <span>- {hexToColorName(data.color.name)}</span>
                                    </div>
                                    <div>Kích Thước: {data.size.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                price: data.price,
                quantity: <InputNumber
                    min={1}
                    max={data.quantityMax}
                    value={data.quantity} // Sử dụng giá trị quantity như mặc định
                    onChange={(value) => onChangeQuantityProductConfig(value, data.id)} // Gọi hàm khi số lượng thay đổi
                />,
                totalMoney: data.price * data.quantity,
                action: <>
                    <Button danger onClick={() => { handleDeleteProductConfig(data.id) }} ><DeleteOutlined></DeleteOutlined></Button>
                </>

            }
        })
        setDataColumProductDetailsConfig(lstDataCustom)
        return lstDataCustom;
    }

    const onChangeQuantityProductConfig = (value, id) => {
        const updatedProductDetails = lstBillDetailsConfig.map(productDetail => {
            if (productDetail.id === id) {
                return {
                    ...productDetail,
                    quantity: value,
                    totalMoney: value * productDetail.price // Cập nhật totalMoney khi quantity thay đổi
                };
            }
            return productDetail;
        });
        setLstBillDetailsConfig(updatedProductDetails);
    };


    const handleDeleteProductConfig = (id) => {
        // Filter out the product with the given id
        const updatedProductDetails = lstBillDetailsConfig.filter(productDetail => productDetail.id !== id);
        // Update the state with the new product list
        setLstBillDetailsConfig(updatedProductDetails);
    }

    const handleAddProductDetailsConfig = () => {
        setOpenAddProductConfig(false);
        setSelectedRowKeys([]);

        const dataBillDetails = lstBillDetailsConfig.map(productDetail => {
            return {
                productDetails: productDetail.id,
                quantity: productDetail.quantity,
            }
        });

        const idBill = data.id;

        if (!idBill) {
            toast.error("Invalid or missing bill ID.");
            return;
        }

        axios.post(`http://localhost:8080/api/v1/counters/${idBill}/product`, dataBillDetails)
            .then(response => {
                toast.success(response.data.message);
                fetchDataProductDetails();
                fetchDataCart();
            })
            .catch(error => {
                toast.error(error.response.data.message);
                console.error("Đã xảy ra lỗi khi thêm sản phẩm vào hóa đơn:", error);
            })
            .finally(() => {
                setOpenAddProduct(false);
            });
    }


    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    return (
        <>
            <h4>Giỏ Hàng</h4>
            <div className='bg-white p-4'>
                <div>
                    <Button>QR Code</Button>
                    <Button onClick={() => setOpenAddProduct(true)}>Thêm Sản Phẩm</Button>
                    <>
                        <Modal
                            title="Danh Sách Sản Phẩm"
                            centered
                            open={openAddProduct}
                            onOk={() => setOpenAddProduct(false)}
                            onCancel={() => {
                                setSelectedRowKeys([]);
                                setOpenAddProduct(false)
                            }}
                            width={1300}
                            footer={null}
                        >
                            <div className='flex'>
                                <Input placeholder="Tìm Kiếm" />
                                <Button>Làm Mới</Button>
                            </div>
                            <div>
                                <Button onClick={handleAddProductDetails}>
                                    Thêm Sản Phẩm
                                </Button>
                                <>
                                    <Modal
                                        okText="Hoàn Tất" // Thay đổi nội dung của nút OK
                                        cancelText="Cancel" // Thay đổi nội dung của nút Cancel
                                        width={840}
                                        title="Thêm Sản Phẩm" open={openAddProductConfig}
                                        onOk={() => handleAddProductDetailsConfig()}
                                        onCancel={() => setOpenAddProductConfig(false)}>
                                        <Table
                                            pagination={{
                                                pageSize: 5,
                                            }}
                                            scroll={{
                                                y: 300,
                                            }}
                                            dataSource={dataColumProductDetailsConfig} columns={columnsTableConfig} />
                                    </Modal>
                                </>

                            </div>
                            <div>


                                <Table
                                    rowSelection={rowSelection}
                                    pagination={{
                                        pageSize: 10,
                                    }}
                                    scroll={{
                                        y: 300,
                                    }}
                                    dataSource={dataColumProductDetails} columns={columnsTable} />
                            </div>

                        </Modal>
                    </>
                </div>

                <div>

                </div>
                <div>
                    {lstBillDetails.length === 0 ? (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                        // Hiển thị danh sách sản phẩm nếu có
                        <div>
                        <Table
                                    pagination={{
                                        pageSize: 10,
                                    }}
                                    scroll={{
                                        y: 500,
                                    }}
                                    dataSource={dataColumProductDetailsCart}
                                     columns={columnsTableCart} />
                        </div>
                    )}
                </div>

            </div>

        </>
    );
}

export default SaleProducts;