import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, Input, Table, InputNumber } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Empty } from 'antd';
import hexToColorName from '~/ultils/HexToColorName';
import { PlusOutlined, DeleteOutlined,ExclamationCircleFilled } from '@ant-design/icons';
import { fixMoney } from '~/ultils/fixMoney';
import { useSaleData } from '~/provider/SaleDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const { confirm } = Modal;
function SaleProducts() {

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


    const columnsTableCart = [

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
            title: 'Màu Sắc',
            dataIndex: 'color',
            key: 'color',
            render: (color) => (
                <div className='flex'>
                    <Tooltip title={hexToColorName(color?.name) + ' - ' + color?.name} color={color?.name} key={color?.name}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: color?.name }}></div>
                    </Tooltip>
                    <span className='ml-2'>- {color?.name}</span>
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

    const [lstBillDetails, setLstBillDetails] = useState([]);
    const [dataColumProductDetails, setDataColumProductDetails] = useState([]);

    const [lstBillDetailsConfig, setLstBillDetailsConfig] = useState([]);
    const [dataColumProductDetailsConfig, setDataColumProductDetailsConfig] = useState([]);

    const [dataColumProductDetailsCart, setDataColumProductDetailsCart] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    //provider
    const { totalPrice, setDataPriceCart, idBill, lstBill, lstProductDetails, lstProductDetailsCart, updateDataProductDetails, updateDataDataCart } = useSaleData();


    // useEffect(() => {
    //     updateDataDataCart();
    // }, [idBill]);


    const fillDataProductDetails = () => {
        const sortedDataTable = [...lstProductDetails].sort((a, b) => a.id - b.id);
        const dataTable = sortedDataTable.map((data, index) => {
            let product = {
                key: data.id,
                id: data.id,
                index: index + 1,
                name: data?.product?.name,
                code: data?.code,
                color: data?.color,
                size: data?.size,
                price: fixMoney(data.price),
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
    }

    useEffect(() => {
        fillDataProductDetails();
    }, [lstProductDetails])

    useEffect(() => {
        const calculateTotalPrice = () => {
            const total = lstProductDetailsCart.reduce((accumulator, currentProduct) => {
                return accumulator + (currentProduct.unitPrice * currentProduct.quantity);
            }, 0);
            setDataPriceCart(total);
        };

        calculateTotalPrice();
    }, [lstProductDetailsCart]);

    useEffect(() => {
        fillDataProductDetailsCart(lstProductDetailsCart)
    }, [lstProductDetailsCart, lstBill])

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
                                <div div style={{ fontSize: '12px' }}>
                                    [{data.productDetails.size.name} - {hexToColorName(data.productDetails.color.name)}]
                                </div>

                                {/* <div style={{ fontSize: '12px' }}>
                                    <div className='flex'>Màu Sắc:
                                        <div style={{ width: '16px', height: '16px', backgroundColor: data.productDetails.color.name, marginLeft: '4px', marginRight: '4px' }}></div>
                                        <span>- {hexToColorName(data.productDetails.color.name)}</span>
                                    </div>
                                    <div>Kích Thước: {data.productDetails.size.name}</div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </>,
                price: fixMoney(data.productDetails.price),
                color: data.productDetails.color,
                size: data.productDetails.size,
                quantity: <InputNumber

                    min={1}
                    max={data.productDetails.quantity}
                    value={data.quantity} // Sử dụng giá trị quantity như mặc định
                    onChange={(value) => onChangeQuantityProductCart(value, data.id)} // Gọi hàm khi số lượng thay đổi
                />,
                totalMoney: <span className='text-rose-600	'>{fixMoney(data.productDetails.price * data.quantity)}</span>,
                action: <>
                    <Button danger className='border-none' onClick={() => {  showDeleteConfirmCart(data.id)}} > <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></Button>
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


    const onChangeQuantityProductCart = (value, id) => {
        console.log(value + " " + id);

        axios.put('http://localhost:8080/api/v1/counters/billDetails/' + id, {
            quantity: value
        })
            .then(response => {
                toast.success(response.data.message);
                updateDataProductDetails();
                updateDataDataCart();
                
            })
            .catch(error => {
                toast.error(error.response.data.message);
            });

    };


    const handleDeleteProductConfig = (id) => {
        // Filter out the product with the given id
        const updatedProductDetails = lstBillDetailsConfig.filter(productDetail => productDetail.id !== id);
        // Update the state with the new product list
        setLstBillDetailsConfig(updatedProductDetails);
    }


    const handleDeleteProductCart = (id) => {
        axios.delete('http://localhost:8080/api/v1/counters/billDetails/'+id)
        .then(response => {
            toast.success(response.data.message);
            updateDataProductDetails();
                updateDataDataCart();
        })
        .catch(err => {
             toast.error(err.response.data.message);
 
        });

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


        if (!idBill) {
            toast.error("Invalid or missing bill ID.");
            return;
        }

        axios.post(`http://localhost:8080/api/v1/counters/${idBill}/product`, dataBillDetails)
            .then(response => {
                toast.success(response.data.message);
                updateDataDataCart();
                updateDataProductDetails();
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

    const showDeleteConfirmCart = (id) => {
        confirm({
          title: 'Xác Nhận?',
          icon: <ExclamationCircleFilled />,
          content: 'Bạn Có Chắc Muốn Xóa Sản Phẩm Này ?',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            handleDeleteProductCart(id)
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };

      const bill = lstBill.find(bill => bill?.id == idBill)
    return (
        <>
            {lstBill.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <div>
                    <h4>Giỏ Hàng</h4>
                    <div className='bg-white p-4'>
                        <div className='flex justify-between items-center mb-6'>
                            <div>
                                <h4>Đơn Hàng {
                                    bill?.codeBill
                                    }</h4>
                            </div>
                            <div>
                                <div>
                                    <Button>QR Code</Button>
                                    <Button type='primary' className='ml-4' onClick={() => setOpenAddProduct(true)}><FontAwesomeIcon icon={faPlus} /> <span className='ml-2'>Thêm Sản Phẩm</span> </Button>
                                </div>
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

                        </div>


                        <div className='shadow-lg p-4'>
                            {lstProductDetailsCart.length === 0 && lstBill.length !== 0 ? (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            ) : (
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
                    <div className='flex justify-end mr-10 mt-4 mb-4'>
                        <h4 className=''>Tổng Tiền: <span className='text-rose-600	'>{fixMoney(totalPrice)}</span> </h4>
                    </div>
                </div>
            )}


        </>
    );
}

export default SaleProducts;