import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, Input, Table, InputNumber, Select, Slider, ColorPicker, Space, Tag, Spin, Carousel } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { Empty } from 'antd';
import hexToColorName from '~/ultils/HexToColorName';
import { PlusOutlined, DeleteOutlined, ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { fixMoney } from '~/ultils/fixMoney';
import { useOrderData } from '~/provider/OrderDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import BarcodeScanner from '../BarcodeScanner';
import QRScanner from '../QRScanner';
import { useDebounce } from '~/hooks';
import AxiosIns from '~/lib/auth'

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

function OrderProducts() {

    const columnsTable = [

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
                    <span className='ml-2'>- {hexToColorName(color.name)}</span>
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
            width: 320,
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
            width: 320,
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
            title: 'Kích Thước',
            dataIndex: 'size',
            key: 'size',
            width: 120,

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



    const [dataColumProductDetails, setDataColumProductDetails] = useState([]);

    const [lstBillDetailsConfig, setLstBillDetailsConfig] = useState([]);
    const [dataColumProductDetailsConfig, setDataColumProductDetailsConfig] = useState([]);

    const [dataColumProductDetailsCart, setDataColumProductDetailsCart] = useState([]);

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

    //provider
    const { totalPrice, setDataPriceCart, idBill, lstBill, lstProductDetails, lstProductDetailsCart, updateDataProductDetails, updateDataDataCart } = useOrderData();


    // useEffect(() => {
    //     updateDataDataCart();
    // }, [idBill]);


    const fillDataProductDetails = (data) => {
        const dataTable = data.map((data, index) => {
            let product = {
                key: data.id,
                id: data.id,
                index: index + 1,
                name: <>
                    <div className='flex flex-start'>
                        {data?.imageUrl && (
                            <div className='relative'>
                                <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '100px', height: '120px', overflow: 'hidden' }}>
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
        console.log(lstProductDetailsCart);
        const datacart = lstProductDetailsCart.map(data => {
            return {
                price:
                    data?.productDetails?.promotionDetailsActive ?
                        data?.productDetails?.price -
                        (data?.productDetails?.promotionDetailsActive?.promotion?.value * data?.productDetails?.price / 100) :
                        data?.productDetails?.price,
                quantity: data?.quantity,
            }
        })

        const total = datacart.reduce((accumulator, currentProduct) => {
            return accumulator + (currentProduct.price * currentProduct.quantity);
        }, 0);
        setDataPriceCart(total);

    }, [lstProductDetailsCart]);

    useEffect(() => {
        fillDataProductDetailsCart(lstProductDetailsCart)
    }, [lstProductDetailsCart, lstBill])

    const fillDataProductDetailsCart = (data) => {
        console.log(data);
        const lstDataCustom = data.map((data, index) => {
            return {
                key: index,
                id: data.id,
                index: index + 1,
                name: <>
                    <div className='flex'>
                        {data?.productDetails.imageUrl && (
                            <div className='relative'>

                                <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '80px', height: '100px',  overflow: 'hidden' }}>
                                    {data.productDetails.imageUrl.split("|").map((imageUrl, index) => (
                                        <img src={imageUrl} key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${index}`} />
                                    ))}
                                </Carousel>
                                {
                                    data?.productDetails.promotionDetailsActive &&
                                    <div className='absolute top-0 right-0 pl-2 pr-2 flex  bg-yellow-400	'>
                                        <span className='text-red-600 text-[12px]'>-{data?.productDetails.promotionDetailsActive?.promotion.value}%</span>
                                    </div>
                                }
                            </div>
                        )}

                        <div className='ml-4'>
                            <h4>{data.productDetails.product.name}</h4>
                            <div div style={{ fontSize: '12px' }}>
                                [{data.productDetails.size.name} - {hexToColorName(data.productDetails.color.name)}]
                            </div>

                        </div>
                    </div>
                </>,
                price: <>
                    {
                        data?.productDetails?.promotionDetailsActive ? (
                            <div className='flex flex-col	'>
                                <span className='line-through text-slate-500	text-xl	'>
                                    {fixMoney(data?.productDetails?.price)}
                                </span>
                                <span className='text-red-600	'>
                                    {fixMoney(data?.productDetails?.price - (data?.productDetails?.promotionDetailsActive?.promotion?.value * data?.productDetails?.price / 100))}
                                </span>
                            </div>
                        ) : (
                            <span>
                                {fixMoney(data?.productDetails?.price)}
                            </span>)
                    }
                </>,
                color: data.productDetails.color,
                size: data.productDetails.size,
                quantity: <InputNumber

                    min={1}
                    max={data?.productDetails?.quantity + data.quantity}
                    value={data?.quantity} // Sử dụng giá trị quantity như mặc định
                    onChange={(value) => onChangeQuantityProductCart(value, data.id)} // Gọi hàm khi số lượng thay đổi
                />,
                totalMoney: data?.productDetails?.promotionDetailsActive ?
                    fixMoney((data?.productDetails?.price - (data?.productDetails?.promotionDetailsActive?.promotion?.value * data?.productDetails?.price / 100)) * data.quantity)
                    : fixMoney(data?.productDetails?.price * data?.quantity),
                action: <>
                    <Button danger className='border-none' onClick={() => { showDeleteConfirmCart(data.id) }} > <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></Button>
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
                            {data?.imageUrl && (
                                <div className='relative'>
                                    <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '80px', height: '100px',  overflow: 'hidden' }}>
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


    const onChangeQuantityProductCart = (value, id) => {
        console.log(value + " " + id);

        AxiosIns.put('v1/counters/billDetails/' + id, {
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
        AxiosIns.delete('v1/counters/billDetails/' + id)
            .then(response => {
                toast.success(response.data.message);
                updateDataProductDetails();
                updateDataDataCart();
            })
            .catch(err => {
                toast.error(err.response.data.message);

            });

    }

    const handleDeleteAllProductCart = () => {
        AxiosIns.delete(`v1/counters/${idBill}/billDetails/deleteAll`)
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

        AxiosIns.post(`v1/counters/${idBill}/product`, dataBillDetails)
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

    const handleAddProductDetailsQrCode = async (barcode) => {

        if (!idBill) {
            toast.error("Invalid or missing bill ID.");
            return;
        }
        try {
            const response = await AxiosIns.post(`v1/counters/${idBill}/product/barcode/${barcode}`);
            console.log('API response:', response.data);
            toast.success(response.data.message);
            updateDataDataCart();
            updateDataProductDetails();
        } catch (error) {
            console.error('API error:', error);
            toast.error(error.response.data.message||"Thất bại");
        }
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

    const showDeleteAllConfirmCart = (id) => {
        confirm({
            title: 'Xác Nhận?',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc muốn xóa toàn bộ sản phẩm đang có?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteAllProductCart()
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    useEffect(() => {
        AxiosIns.get('v1/color')
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
        AxiosIns.get('v1/size')
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

    useEffect(() => {
        if (lstProductDetails.length > 0) {
            const highestPriceProduct = lstProductDetails.reduce((maxPriceProduct, currentProduct) => {
                return currentProduct.price > maxPriceProduct.price ? currentProduct : maxPriceProduct;
            }, lstProductDetails[0]);
            // console.log(highestPriceProduct);
            setInputValueMax(highestPriceProduct.price);
        }
    }, [lstProductDetails])
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
    const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
                                <div className='flex'>
                                    <Button danger onClick={showDeleteAllConfirmCart} >Làm Mới</Button>

                                    <BarcodeScanner idBill={bill?.id} handleAddProductDetailsQrCode={handleAddProductDetailsQrCode}></BarcodeScanner>

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
                                                    width={900}
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
                                                    dataSource={dataColumProductDetails} columns={columnsTable}

                                                /> </Spin>
                                        </div>

                                    </Modal>
                                </>
                            </div>

                        </div>


                        <div className=''>
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

export default OrderProducts;