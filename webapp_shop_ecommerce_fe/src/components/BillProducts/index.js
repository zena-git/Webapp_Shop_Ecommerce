import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, Input, Table, InputNumber, Select, Slider, ColorPicker, Space, Tag, Spin, Carousel } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Empty } from 'antd';
import hexToColorName from '~/ultils/HexToColorName';
import { PlusOutlined, DeleteOutlined, RollbackOutlined, LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { fixMoney } from '~/ultils/fixMoney';
import { useOrderData } from '~/provider/OrderDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';


const columnsTableProduct = [

    {
        title: '#',
        dataIndex: 'index', // Change 'index' to 'key'
        key: 'index',
        width: 50,
    },

    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
        width: 380,

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
        width: 300,
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


const columnsTable = [

    {
        title: '#',
        dataIndex: 'index', // Change 'index' to 'key'
        key: 'index',
        width: 50,
        render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
        title: 'Thông Tin Sản Phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 550,
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
                <span className='ml-2'>- {hexToColorName(color?.name)}</span>
            </div>

        ),
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

const { confirm } = Modal;
const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag

            color={label}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{
                marginRight: 3,
            }}
        >
            {label}
        </Tag>
    );
};

function BillProducts({ bill, fetchDataBill, lstBillDetails }) {
    const TrangThaiBill = {
        TAT_CA: '',
        TAO_DON_HANG: "-1",
        CHO_XAC_NHAN: "0",
        DA_XAC_NHAN: "1",
        CHO_GIA0: "2",
        DANG_GIAO: "3",
        HOAN_THANH: "4",
        DA_THANH_TOAN: "5",
        HUY: "6",
        TRA_HANG: "10",
        DANG_BAN: "7",
        CHO_THANH_TOAN: "8",
        HOAN_TIEN: "9",
        NEW: "New",
    }
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [openAddProductConfig, setOpenAddProductConfig] = useState(false);

    const [dataColumProductDetails, setDataColumProductDetails] = useState([]);

    const [lstBillDetailsConfig, setLstBillDetailsConfig] = useState([]);
    const [dataColumProductDetailsConfig, setDataColumProductDetailsConfig] = useState([]);


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [valueColor, setValueColor] = useState([]);
    const [valueSize, setValueSize] = useState([]);
    const [optionColor, setOptionColor] = useState([]);
    const [optionSize, setOptionSize] = useState([]);
    const [searchName, setSearchName] = useState('');

    const [inputValueMin, setInputValueMin] = useState(0);
    const [inputValueMax, setInputValueMax] = useState(10000000);
    const [priceRange, setPriceRange] = useState([0, inputValueMax]);

    const [loadingProductDetail, setLoadingProductDetail] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);


    const [dataReturntProduct, setDataReturntProduct] = useState({
        description: '',
        quantity: '',
    });
    const [isOpenModalReturntProduct, setIsOpenModalReturntProduct] = useState(false);


    //provider
    const { lstProductDetails, updateDataProductDetails } = useOrderData();


    const fillDataProductDetails = (data) => {
        console.log(data);
        const dataTable = data.map((data, index) => {
            let product = {
                key: data.id,
                id: data.id,
                index: index + 1,
                name: <>
                    <div className='flex flex-start'>
                        {data?.imageUrl && (
                            <div className='relative'>
                                <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '100px', height: '120px' }}>
                                    {data.imageUrl.split("|").map((imageUrl, index) => (
                                        <img src={imageUrl} key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${index}`} />
                                    ))}
                                </Carousel>
                                {
                                    data?.promotionDetailsActive &&
                                    <div className='absolute top-0 right-0 pl-2 pr-2 flex  bg-yellow-400	'>
                                        <span className='text-red-600 text-[12px]'>-{data?.promotionDetailsActive.promotion.value}%</span>
                                    </div>
                                }
                            </div>

                        )}
                        <h4 className='ml-4'> {data?.product?.name}</h4>
                    </div>

                </>,
                code: data?.code,
                color: data?.color,
                size: data?.size,
                price: <>
                    {
                        data?.promotionDetailsActive ? (
                            <div className='flex flex-col	'>
                                <span className='line-through text-slate-500	text-xl	'>
                                    {fixMoney(data.price)}
                                </span>
                                <span className='text-red-600	'>
                                    {fixMoney(data.price - (data.promotionDetailsActive.promotion.value * data.price / 100))}
                                </span>
                            </div>
                        ) : (
                            <span>
                                {fixMoney(data.price)}
                            </span>)
                    }
                </>,
                quantity: data.quantity,
            };
            return product;
        });



        setDataColumProductDetails(dataTable);
    }

    useEffect(() => {
        fillDataProductDetails(lstProductDetails);
    }, [lstProductDetails])
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
                            {data?.imageUrl && (
                                <div className='relative'>

                                    <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '80px', height: '100px' }}>
                                        {data.imageUrl.split("|").map((imageUrl, index) => (
                                            <img src={imageUrl} key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${index}`} />
                                        ))}
                                    </Carousel>
                                    {
                                        data?.promotionDetailsActive &&
                                        <div className='absolute top-0 right-0 pl-2 pr-2 flex  bg-yellow-400	'>
                                            <span className='text-red-600 text-[12px]'>-{data?.promotionDetailsActive?.promotion.value}%</span>
                                        </div>
                                    }
                                </div>
                            )}
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
                price: <>
                    {
                        data?.promotionDetailsActive ? (
                            <div className='flex flex-col	'>
                                <span className='line-through text-slate-500	text-xl	'>
                                    {fixMoney(data.price)}
                                </span>
                                <span className='text-red-600	'>
                                    {fixMoney(data.price - (data.promotionDetailsActive.promotion.value * data.price / 100))}
                                </span>
                            </div>
                        ) : (
                            <span>
                                {fixMoney(data.price)}
                            </span>)
                    }
                </>,
                quantity: <InputNumber
                    min={1}
                    max={data.quantityMax}
                    value={data.quantity} // Sử dụng giá trị quantity như mặc định
                    onChange={(value) => onChangeQuantityProductConfig(value, data.id)} // Gọi hàm khi số lượng thay đổi
                />,
                totalMoney: data?.promotionDetailsActive ?
                    fixMoney((data.price - (data.promotionDetailsActive.promotion.value * data.price / 100)) * data.quantity)
                    : fixMoney(data.price * data.quantity),
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

        const idBill = bill?.id;
        if (idBill == null) {
            toast.error("Invalid or missing bill ID.");
            return;
        }
        setLoadingTable(true);
        axios.post(`http://localhost:8080/api/v1/bill/${idBill}/product`, dataBillDetails)
            .then(response => {
                toast.success(response.data.message);
                fetchDataBill();
                updateDataProductDetails();
            })
            .catch(error => {
                toast.error(error.response.data.message);
            })
            .finally(() => {
                setOpenAddProduct(false);
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            });
    }

    const handleChangeQuantity = (value, id) => {
        if (value == null) {
            return;
        }
        console.log(value, id);
        const idBill = bill?.id;
        if (idBill == null) {
            toast.error("Invalid or missing bill ID.");
            return;
        }

        setLoadingTable(true);
        axios.put(`http://localhost:8080/api/v1/bill/${idBill}/billDetails/${id}`, {
            quantity: value
        })
            .then(response => {
                toast.success(response.data.message);
                fetchDataBill();
                updateDataProductDetails();

            })
            .catch(error => {
                toast.error(error.response.data.message);
            }).finally(() => {
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })

    };

    const handleDeleteProduct = (id) => {
        const idBill = bill?.id;
        if (idBill == null) {
            toast.error("Invalid or missing bill ID.");
            return;
        }
        if (lstBillDetails.length <= 1) {
            toast.error("Còn 1 Sản Phẩm Không Thể Xóa");
            return;
        }
        setLoadingTable(true);
        axios.delete(`http://localhost:8080/api/v1/bill/${idBill}/billDetails/${id}`)
            .then(response => {
                toast.success(response.data.message);
                fetchDataBill();
                updateDataProductDetails();


            })
            .catch(err => {
                toast.error(err.response.data.message);

            }).finally(() => {
                setTimeout(() => {
                    setLoadingTable(false);
                }, 1000);
            })

    }

    const showDeleteAllProduct = (id) => {
        confirm({
            title: 'Xác Nhận?',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc muốn xóa sản phẩm này?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteProduct(id)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/color')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.name,
                    label: rep.name,
                    emoji: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionColor(newObj);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/size')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.name,
                    label: rep.name,
                    key: rep.id,
                }));
                setOptionSize(newObj);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, []);
    const onChangeSearch = (e) => {
        console.log(e.target.value);
        setSearchName(e.target.value);
    }

    const handleChangeSize = (values) => {
        setValueSize(values);
        console.log(values);

    }

    const handleChangeColor = (values) => {
        setValueColor(values);
        console.log(values);

    }

    const onChangeSlider = (values) => {
        console.log(values);
        setPriceRange(values);
    };
    const handleSearchProduct = () => {
        setLoadingProductDetail(true);

        const filteredProducts = lstProductDetails.filter((product) => {
            // Lọc theo tên
            if (searchName && !product.product.name.toLowerCase().includes(searchName.toLowerCase())) {
                return false;
            }

            // Lọc theo màu sắc
            if (valueColor.length > 0 && !valueColor.includes(product.color.name)) {
                return false;
            }
            // // Lọc theo kích thước
            if (valueSize.length > 0 && !valueSize.includes(product.size.name)) {
                return false;
            }
            // Lọc theo phạm vi giá
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }
            return true;
        });

        setTimeout(() => {
            fillDataProductDetails(filteredProducts);
            setLoadingProductDetail(false);
        }, 1000);


    }

    const handleResetSearch = () => {
        setLoadingProductDetail(true);
        setSearchName("");
        setValueColor([]);
        setValueSize([]);
        setPriceRange([0, inputValueMax]);
        fillDataProductDetails(lstProductDetails);
        updateDataProductDetails();
        setTimeout(() => {
            setLoadingProductDetail(false);
        }, 1000);

    }

    const [dataColumTable, setDataColumTable] = useState([]);
    useEffect(() => {
        fillDataColumTable(lstBillDetails);
    }, [lstBillDetails])
    const fillDataColumTable = (data) => {
        console.log(data);
        const dataTable = data.map((data) => {
            return {
                key: data.id,
                id: data.id,
                code: data.productDetails.code,
                barcode: data.productDetails.barcode,
                imageUrl: data.productDetails.imageUrl,
                name: <>
                    <div className='flex items-start'>
                        <div className='mr-6'>
                            {data?.productDetails.imageUrl && (
                                <div className='relative'>

                                    <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '140px', height: '180px' }}>
                                        {data.productDetails.imageUrl.split("|").map((imageUrl, index) => (
                                            <img src={imageUrl} key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${index}`} />
                                        ))}
                                    </Carousel>
                                    {
                                        data?.promotionDetailsActive &&
                                        <div className='absolute top-0 right-0 pl-2 pr-2 flex  bg-yellow-400	'>

                                            <span className='text-red-600 text-[12px]'>{data?.promotionDetailsActive?.promotionValue == null ? "Giảm giá" : "- " + data?.promotionDetailsActive?.promotionValue + " %"}</span>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                        <div className='leading-10	'>
                            <div className='flex text-[16px]'>
                                <h4>{data.productDetails.product.name}</h4>
                                <div className='ml-2 font-medium'>
                                    [{hexToColorName(data.productDetails.color?.name)} - {data.productDetails.size.name}]
                                </div>
                            </div>
                            <div className='flex flex-col font-medium'>
                                {
                                    data?.promotionDetailsActive ? (
                                        <div className='flex flex-col'>
                                            <span className='text-red-600 text-[15px] '>
                                                {fixMoney(data.unitPrice)}

                                            </span>
                                            <span className='text-gray-400 line-through text-[13px] '>
                                                {fixMoney(data.originalPrice)}

                                            </span>
                                        </div>
                                    ) : (
                                        <span className='text-red-600 text-[15px] '>
                                            {fixMoney(data.unitPrice)}
                                        </span>)
                                }

                            </div>
                            <div className='flex text-[14px] font-medium'>
                                x<span> {data.quantity}</span>
                            </div>
                        </div>
                    </div>
                </>,
                color: data.productDetails.color,
                size: data.productDetails.size,
                quantity: <>
                    {bill && (bill?.status == TrangThaiBill.CHO_XAC_NHAN) ?
                        <InputNumber min={1} max={data.productDetails.quantity} value={data.quantity} onChange={(value) => { handleChangeQuantity(value, data.id) }} /> :
                        <span>{data.quantity}</span>
                    }

                </>,
                unitPrice: data.unitPrice,
                status: data.status,
                totalMoney: <>
                    <span className='text-red-600  font-medium'>{fixMoney(data.quantity * data.unitPrice)}</span>
                </>,
                action: <>
                    {/* {bill && (bill?.status == TrangThaiBill.DA_XAC_NHAN || bill?.status === TrangThaiBill.CHO_GIAO) ? ( */}
                    <Button
                        disabled={bill?.status != TrangThaiBill.CHO_XAC_NHAN}
                        onClick={() => { showDeleteAllProduct(data.id) }}>
                        <DeleteOutlined />
                    </Button>
                    {/* ) : (
                        bill && bill?.status != TrangThaiBill.HUY &&
                        <div>
                            <Button onClick={() => {
                                setDataReturntProduct({
                                    ...dataReturntProduct,
                                    id: data.id,
                                    quantity: data.quantity,

                                });
                                setIsOpenModalReturntProduct(true)
                            }}>
                                <RollbackOutlined />
                            </Button>

                        </div>
                    )} */}
                </>
            }
        })

        setDataColumTable(dataTable);

    }

    const handleReturntProduct = (idBillDetail) => {
        console.log(idBillDetail);
        console.log(dataReturntProduct);
        axios.post(`http://localhost:8080/api/v1/returnsOrder/bill/${bill.id}/billDetails/${idBillDetail}`, dataReturntProduct)
            .then(response => {
                fetchDataBill();
                toast.success(response.data.message)
                setIsOpenModalReturntProduct(false)
            })
            .catch(error => {
                toast.error(error.response.data.message)
            })


    }

    const openRertunProduct = () => {
        setIsOpenModalReturntProduct(true)
    }



    const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const loadingIconTable = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <>
            <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                <h4>Danh Sách Sản Phẩm</h4>
                <div>
                    {bill && (bill?.status == TrangThaiBill.CHO_XAC_NHAN) &&
                        <Button type='primary' className='ml-4' onClick={() => {
                            setOpenAddProduct(true)
                        }}
                        ><FontAwesomeIcon icon={faPlus} /> <span className='ml-2'>Thêm Sản Phẩm</span> </Button>
                    }
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
                        <div >
                            <div>Bộ Lọc</div>
                            <div className='font-medium mb-6'>

                                <div className='grid grid-cols-4 gap-4 my-4'>
                                    <div>
                                        <label>Tìm Kiếm</label>
                                        <div className=' mt-2'>
                                            <Input className='col-span-6' value={searchName} placeholder="Tìm Kiếm Sản Phẩm" onChange={onChangeSearch} />
                                        </div>
                                    </div>
                                    <div>
                                        <label>Màu Sắc</label>
                                        <Select className="w-full mt-2" placeholder="Chọn Màu Sắc"
                                            mode="multiple"
                                            tagRender={tagRender}

                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}

                                                </>
                                            )}
                                            optionRender={(option) => (
                                                <Space>
                                                    <span role="img" aria-label={option.data.label}>

                                                        <ColorPicker defaultValue={option.data.emoji} disabled size="small" />
                                                    </span>
                                                    {option.data.label + "-" + hexToColorName(option.data.emoji)}
                                                </Space>
                                            )}
                                            onChange={handleChangeColor}

                                            options={optionColor}
                                            value={valueColor}
                                        />
                                    </div>

                                    <div>
                                        <label>Kích Thước</label>
                                        <Select className="w-full mt-2"
                                            mode="multiple"
                                            placeholder="Chọn Kích Thước"
                                            onChange={handleChangeSize}
                                            options={optionSize}
                                            value={valueSize}
                                        />
                                    </div>
                                    <div>
                                        <label>Khoảng Giá</label>
                                        <Slider
                                            className="w-full mt-2"
                                            range
                                            max={inputValueMax}
                                            defaultValue={[inputValueMin, inputValueMax]} // Đặt giá trị mặc định
                                            value={priceRange}
                                            onChange={onChangeSlider}
                                        />
                                    </div>
                                </div>


                            </div>
                            <div className='flex justify-center	items-center'>
                                <Button onClick={() => { handleResetSearch() }}>Làm Mới</Button>
                                <Button type='primary' className='ml-4' onClick={() => { handleSearchProduct() }}>Tìm Kiếm</Button>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <Button type='primary' onClick={handleAddProductDetails} className='mb-4 mt-2'>
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
                            <Spin spinning={loadingProductDetail} indicator={loadingIcon}>


                                <Table
                                    rowSelection={rowSelection}
                                    pagination={{
                                        pageSize: 10,
                                    }}
                                    scroll={{
                                        y: 300,
                                    }}
                                    dataSource={dataColumProductDetails} columns={columnsTableProduct}

                                /> </Spin>
                        </div>

                    </Modal>
                </>
            </div>
            <div>
                <div>
                    <Spin spinning={loadingTable} indicator={loadingIconTable}>
                        <Table
                            pagination={{
                                pageSize: 10,
                            }}
                            scroll={{
                                y: 500,
                            }}
                            dataSource={dataColumTable}
                            columns={columnsTable} />
                    </Spin>
                </div>
            </div>

            <Modal title="Trả Hàng" width={500} visible={isOpenModalReturntProduct} footer={null} onCancel={() => { setIsOpenModalReturntProduct(false) }} >
                <div>
                    <label>Số Lượng</label>
                    <Input placeholder="Nhập Số Lượng" value={dataReturntProduct.quantity} onChange={e => {
                        setDataReturntProduct({ ...dataReturntProduct, quantity: e.target.value })
                    }} />
                </div>
                <div>
                    <label>Nội Dung</label>
                    <Input.TextArea rows={5} minLength={50} placeholder='Ghi Chú' value={dataReturntProduct?.description} onChange={e => {
                        setDataReturntProduct({ ...dataReturntProduct, description: e.target.value })
                    }} />
                </div>
                <div className='flex justify-end mt-4 gap-3'>
                    <Button type='primary' onClick={() => {
                        handleReturntProduct(dataReturntProduct.id)
                    }}>Xác nhận</Button>
                    <Button type='default' onClick={() => { setIsOpenModalReturntProduct(false) }}>Hủy</Button>
                </div>
            </Modal>

        </>
    );
}

export default BillProducts;