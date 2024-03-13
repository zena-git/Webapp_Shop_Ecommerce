import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Spin, Select, Input, Space, Modal, Upload, Divider, Tag, ColorPicker, InputNumber } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hexToColorName from "~/ultils/HexToColorName";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

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

const calculateRowSpan = (data, dataIndex, rowIndex) => {
    if (rowIndex > 0 && data[rowIndex][dataIndex] === data[rowIndex - 1][dataIndex]) {
        return 0;
    }
    let count = 1;
    for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i][dataIndex] === data[i - 1][dataIndex]) {
            count++;
        } else {
            break;
        }
    }
    return count;
};
function ProductAdd() {
    // Khai báo một biến để theo dõi rowSpan cho từng giá trị record.index
    const columnsTable = [
        {
            title: '#',
            dataIndex: '#',
            key: '#',
            render: (text, record, index) => <span>{index + 1}</span>,

        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        }
        ,
        {
            title: 'Màu Sắc',
            dataIndex: 'color',
            key: 'color',
            render: (color) => <Tag color={color.name}>{color.name}</Tag>,

        },
        {
            title: 'Kích Thước',
            dataIndex: 'size',
            key: 'size',
            render: (size) => <span>{size.name}</span>

        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => (
                <InputNumber
                    defaultValue={record.price}
                    min={1000}
                    formatter={(value) => `${value}VNĐ`}
                    parser={(value) => value.replace('VNĐ', '')}
                    onChange={(value) => onChangePrice(record.key, value)}
                />
            ),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber min={1} defaultValue={record.quantity} onChange={(value) => onChangeQuantity(record.key, value)} />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Button danger onClick={() => handleDeleteProduct(record.key)}>
                    {/* {record.index + "_" + record.key} */}
                    <DeleteOutlined />
                </Button>
            ),
        },
        {
            title: 'Upload IMG',
            dataIndex: 'imageUrl',
            key: 'imageUrl',

            render: (text, record, index, imageUrl) => {
                // Kiểm tra xem rowSpan cho record.index đã được đặt chưa, nếu chưa thì đặt mặc định là 1
                const rowSpan = calculateRowSpan(dataRowProductDetail, 'index', index);

                return {
                    children: (
                        <>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={record.imageUrl}
                                multiple
                                onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {record.imageUrl.length >= 6 ? null : uploadButton}
                            </Upload>
                            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                <img
                                    alt="example"
                                    style={{
                                        width: '100%',
                                    }}
                                    src={previewImage}
                                />
                            </Modal>

                        </>
                    ),
                    props: {
                        rowSpan: rowSpan,  // Sử dụng rowSpan cho dòng hiện tại
                    },
                };
            },
        }

    ];
    const [dataRowProductDetail, setDataRowProductDetail] = useState([]);
    const [valueNameProduct, setValueNameProduct] = useState("");
    const [valueCodeProduct, setValueCodeProduct] = useState("");
    const [valueDecProduct, setValueDecProduct] = useState("");


    const [valueCategory, setValueCategory] = useState(null);
    const [valueMaterial, setValueMaterial] = useState(null);
    const [valueBrand, setValueBrand] = useState(null);
    const [valueStyle, setValueStyle] = useState(null);
    const [valueColor, setValueColor] = useState([]);
    const [valueSize, setValueSize] = useState([]);

    const [valueInputCategory, setValueInputCategory] = useState("");
    const [valueInputMaterial, setValueInputMaterial] = useState("");
    const [valueInputBrand, setValueInputBrand] = useState("");
    const [valueInputStyle, setValueInputStyle] = useState("");
    const [valueInputColor, setValueInputColor] = useState("#1677ff");
    const [valueInputSize, setValueInputSize] = useState("");

    const [optionCategory, setOptionCategory] = useState([]);
    const [optionMaterial, setOptionMaterial] = useState([]);
    const [optionBrand, setOptionBrand] = useState([]);
    const [optionStyle, setOptionStyle] = useState([]);
    const [optionColor, setOptionColor] = useState([]);
    const [optionSize, setOptionSize] = useState([]);

    const [historyCategory, setHistoryCategory] = useState([]);
    const [historyMaterial, setHistoryMaterial] = useState([]);
    const [historyBrand, setHistoryBrand] = useState([]);
    const [historyStyle, setHistoryStyle] = useState([]);
    const [historyColor, setHistoryColor] = useState([]);
    const [historySize, setHistorySize] = useState([]);

    const inputRefCategory = useRef(null);
    const inputRefMaterial = useRef(null);
    const inputRefBrand = useRef(null);
    const inputRefStyle = useRef(null);
    const inputRefColor = useRef(null);
    const inputRefSize = useRef(null);

    const [valueInputQuantityCustom, setValueInputQuantityCustom] = useState(null);
    const [valueInputPriceCustom, setValueInputPriceCustom] = useState(null);


    // selectcategory
    const handleChangeCategory = (value) => {
        setValueCategory(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/category')
            .then((response) => {
                const newCategories = response.data.map(category => ({
                    value: category.id,
                    label: category.name,
                    key: category.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionCategory(newCategories);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, [historyCategory]);

    const addCategory = (e) => {
        e.preventDefault();
        console.log(valueInputCategory);
        axios.post('http://localhost:8080/api/v1/category', {
            name: valueInputCategory,
        })
            .then((response) => {
                const { status, message, errCode } = response.data;
                // toast[status](message);
                toast.success(message);
                setHistoryCategory(response.data)
            })
            .catch((error) => {
                console.log(error);
                const { status, message, errCode } = error.response.data;
                toast.error(message);
            });


        setValueInputCategory('');
        setTimeout(() => {
            inputRefCategory.current?.focus();
        }, 0);
    };


    //select Material 
    const handleChangeMaterial = (value) => {
        setValueMaterial(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/material')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.id,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionMaterial(newObj);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, [historyMaterial]);

    const addMaterial = (e) => {
        e.preventDefault();
        console.log(valueInputMaterial);
        axios.post('http://localhost:8080/api/v1/material', {
            name: valueInputMaterial,
        })
            .then((response) => {
                const { status, message, errCode } = response.data;
                // toast[status](message);
                toast.success(message);
                setHistoryMaterial(response.data)
            })
            .catch((error) => {
                console.log(error);
                const { status, message, errCode } = error.response.data;
                toast.error(message);
            });


        setValueInputMaterial('');
        setTimeout(() => {
            inputRefMaterial.current?.focus();
        }, 0);
    };

    //select Brand
    const handleChangeBrand = (value) => {
        setValueBrand(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/brand')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.id,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionBrand(newObj);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, [historyBrand]);
    const addBrand = (e) => {
        e.preventDefault();
        console.log(valueInputBrand);
        axios.post('http://localhost:8080/api/v1/brand', {
            name: valueInputBrand,
        })
            .then((response) => {
                const { status, message, errCode } = response.data;
                // toast[status](message);
                toast.success(message);
                setHistoryBrand(response.data)
            })
            .catch((error) => {
                console.log(error);
                const { status, message, errCode } = error.response.data;
                toast.error(message);
            });


        setValueInputBrand('');
        setTimeout(() => {
            inputRefBrand.current?.focus();
        }, 0);
    };
    //select Style
    const handleChangeStyle = (value) => {
        setValueStyle(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/style')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.id,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionStyle(newObj);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, [historyStyle]);

    const addStyle = (e) => {
        e.preventDefault();
        console.log(valueInputStyle);
        axios.post('http://localhost:8080/api/v1/style', {
            name: valueInputStyle,
        })
            .then((response) => {
                const { status, message, errCode } = response.data;
                // toast[status](message);
                toast.success(message);
                setHistoryStyle(response.data)
            })
            .catch((error) => {
                console.log(error);
                const { status, message, errCode } = error.response.data;
                toast.error(message);
            });


        setValueInputStyle('');
        setTimeout(() => {
            inputRefStyle.current?.focus();
        }, 0);
    };

    //select Size
    const handleChangeSize = (value) => {
        setValueSize(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/size')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.id,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionSize(newObj);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, [historySize]);

    const addSize = (e) => {
        e.preventDefault();
        console.log(valueInputSize);
        axios.post('http://localhost:8080/api/v1/size', {
            name: valueInputSize,
        })
            .then((response) => {
                const { status, message, errCode } = response.data;
                // toast[status](message);
                toast.success(message);
                setHistorySize(response.data)
            })
            .catch((error) => {
                console.log(error);
                const { status, message, errCode } = error.response.data;
                toast.error(message);
            });


        setValueInputStyle('');
        setTimeout(() => {
            inputRefStyle.current?.focus();
        }, 0);
    };

    //select Color
    const handleChangeColor = (value) => {
        setValueColor(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/color')
            .then((response) => {
                const newObj = response.data.map(rep => ({

                    label: hexToColorName(rep.name),
                    value: rep.id,
                    emoji: <ColorPicker defaultValue={rep.name} disabled size="small" />,
                    desc: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionColor(newObj);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }, [historyColor]);

    const addColor = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/v1/color', {
            name: valueInputColor,
        })
            .then((response) => {
                const { status, message, errCode } = response.data;
                // toast[status](message);
                toast.success(message);
                setHistoryColor(response.data)
            })
            .catch((error) => {
                console.log(error);
                const { status, message, errCode } = error.response.data;
                toast.error(message);
            });


        // setValueInputColor('');
    };

    //Table
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        const lstProductDetails = valueColor.map((cl, index) => {
            return valueSize.map((size, i) => {
                return {
                    key: `${index}_${i}`,
                    index: index,
                    group: index,
                    name: valueNameProduct,
                    color: optionColor.filter((c) => c.value == cl)
                        .map((color) => {
                            return {
                                id: color.value,
                                name: color.label
                            }
                        })[0],
                    size: optionSize.filter((s) => s.value == size)
                        .map((size) => {
                            console.log(size);
                            return {
                                id: size.value,
                                name: size.label
                            }
                        })[0],
                    price: 100000,
                    quantity: 1,
                    imageUrl: [{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                    }]
                }
            })
        })
        // console.log("---");
        console.log(lstProductDetails);
        setDataRowProductDetail(lstProductDetails.flat())
        // Cập nhật danh sách sản phẩm
    }, [valueColor, valueSize, valueNameProduct])

    const handleDeleteProduct = (key) => {
        // Assuming you have a productList state
        const updatedProductList = dataRowProductDetail.filter(product => product.key !== key);
        setDataRowProductDetail(updatedProductList);
    };

    const onChangePrice = (key, value) => {
        // Update the data array or perform any other necessary action
        const updatedProductList = dataRowProductDetail.map(product => {
            if (product.key === key) {
                return {
                    ...product,
                    price: value
                };
            }
            return product;
        });

        setDataRowProductDetail(updatedProductList);
    };

    const onChangeQuantity = (key, value) => {
        // Update the data array or perform any other necessary action
        const updatedProductList = dataRowProductDetail.map(product => {
            if (product.key === key) {
                return {
                    ...product,
                    quantity: value
                };
            }
            return product;
        });
        setDataRowProductDetail(updatedProductList);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancelModal = () => {
        setIsModalOpen(false);
    };

    const onChangeQuantityPriceCustom = () => {

        const updatedProductList = dataRowProductDetail.map(product => {
            if (selectedRowKeys.includes(product.key)) {
                return {
                    ...product,
                    price: valueInputPriceCustom,
                    quantity: valueInputQuantityCustom,
                };
            }
            return product;
        });
        setDataRowProductDetail(updatedProductList);
        setIsModalOpen(false);
    }

    //Add product
    const [loading, setLoading] = useState(false);
    const handleAddProduct = async (e) => {

        e.preventDefault();
        setLoading(true);
        try {
            const lstProductDetails = dataRowProductDetail.map((product) => ({
                imageUrl: null,
                price: product.price,
                quantity: product.quantity,
                size: product.size.id,
                color: product.color.id,
            }));

            const response = await axios.post('http://localhost:8080/api/v1/product', {
                code: valueCodeProduct,
                name: valueNameProduct,
                description: valueDecProduct,
                category: valueCategory,
                brand: valueBrand,
                material: valueMaterial,
                style: valueMaterial,
                status: '0',
                lstProductDetails: lstProductDetails,
            });
            const { status, message, errCode } = response.data;
            toast.success(message);
            console.log(response.data);
            resetModel();
        } catch (error) {
            const { status, message, errCode } = error.response.data;
            toast.error(message);
            console.log(error.response.data);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 0);
        }
    };



    const resetModel = () => {


        setValueNameProduct('');
        setValueCodeProduct('');
        setValueDecProduct('');
        setValueCategory(null)
        setValueMaterial(null)
        setValueStyle(null)
        setValueBrand(null)
        setValueSize([])
        setValueColor([])
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
    ]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );




    return (
        <div className='bg-white p-4'>
            <div>
                <div>
                    <label>Mã Sản Phẩm</label>
                    <Input className="my-4" placeholder="Nhập Mã Sản Phẩm" value={valueCodeProduct} onChange={e => setValueCodeProduct(e.target.value)} />
                </div>

                <div>
                    <label>Tên Sản Phẩm</label>
                    <Input className="my-4" placeholder="Nhập Tên Sản Phẩm" value={valueNameProduct} onChange={e => setValueNameProduct(e.target.value)} />
                </div>
                <div>
                    <label>Mô Tả Sản Phẩm</label>
                    <TextArea className="my-4" rows={4} placeholder="Nhập Mô Tả Sản Phẩm" maxLength={350} value={valueDecProduct} onChange={e => setValueDecProduct(e.target.value)} />
                </div>
                <div className='grid grid-cols-4 gap-4 my-4'>
                    <div>
                        <label>Loại</label>
                        <Select className="w-full mt-4" placeholder="Chọn Loại"

                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider className='my-4' />
                                    <Space >
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRefCategory}
                                            value={valueInputCategory}
                                            onChange={(e) => setValueInputCategory(e.target.value)}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addCategory}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            onChange={handleChangeCategory}
                            options={optionCategory}
                            value={valueCategory}
                        />
                    </div>

                    <div>
                        <label>Chất Liệu</label>
                        <Select className="w-full mt-4" placeholder="Chọn Chất Liệu"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider className='my-4' />
                                    <Space >
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRefMaterial}
                                            value={valueInputMaterial}
                                            onChange={(e) => setValueInputMaterial(e.target.value)}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addMaterial}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            onChange={handleChangeMaterial}
                            options={optionMaterial}
                            value={valueMaterial}

                        />
                    </div>

                    <div>
                        <label>Phong Cách</label>
                        <Select className="w-full mt-4" placeholder="Chọn Phong Cách"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider className='my-4' />
                                    <Space >
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRefStyle}
                                            value={valueInputStyle}
                                            onChange={(e) => setValueInputStyle(e.target.value)}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addStyle}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            onChange={handleChangeStyle}
                            options={optionStyle}
                            value={valueStyle}

                        />
                    </div>

                    <div>
                        <label>Thương Hiệu</label>
                        <Select className="w-full mt-4" placeholder="Chọn Thương Hiệu"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider className='my-4' />
                                    <Space >
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRefBrand}
                                            value={valueInputBrand}
                                            onChange={(e) => setValueInputBrand(e.target.value)}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addBrand}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            onChange={handleChangeBrand}
                            options={optionBrand}
                            value={valueBrand}
                        />
                    </div>

                </div>

                <div className='grid grid-cols-2 gap-2 my-4'>

                    <div>
                        <label>Màu Sắc</label>
                        <Select className="w-full mt-4" placeholder="Chọn Màu Sắc"
                            mode="multiple"

                            tagRender={tagRender}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider className='my-4' />
                                    <Space >

                                        <ColorPicker
                                            onChange={(e) => setValueInputColor(e.toHexString())}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            value={valueInputColor}
                                            showText
                                            trigger="hover"
                                        />

                                        <Button type="text" icon={<PlusOutlined />} onClick={addColor}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            optionRender={(option) => (
                                <Space>
                                    <span role="img" aria-label={option.data.label}>
                                        {option.data.emoji}
                                    </span>
                                    {option.data.desc + "-" + option.data.label}
                                </Space>
                            )}
                            onChange={handleChangeColor}

                            options={optionColor}
                            value={valueColor}
                        />
                    </div>

                    <div>
                        <label>Kích Thước</label>
                        <Select className="w-full mt-4" placeholder="Chọn Kích Thước"
                            mode="multiple"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider className='my-4' />
                                    <Space >
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRefSize}
                                            value={valueInputSize}
                                            onChange={(e) => setValueInputSize(e.target.value)}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addSize}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            onChange={handleChangeSize}
                            options={optionSize}
                            value={valueSize}
                        />
                    </div>
                </div>
                <div>
                    <Button type="primary" onClick={handleAddProduct}>Thêm Sản Phẩm</Button>
                    <Button type="primary" onClick={showModal}>Chỉnh Sửa Số Lượng Và Giá Chung</Button>
                    <> <Modal title="Chỉnh Sửa Số Lượng Và Giá Chung" okText="Cập Nhật" open={isModalOpen} onOk={onChangeQuantityPriceCustom} onCancel={handleCancelModal}>
                        <div>
                            <label>Số Lượng</label>
                            <Input className='mt-2 mb-2' placeholder="Nhập Số Lượng"
                                value={valueInputQuantityCustom}
                                onChange={(e) => { setValueInputQuantityCustom(e.target.value) }}
                            ></Input>
                        </div>
                        <div>
                            <label>Đơn Giá</label>
                            <Input className='mt-2 mb-2' placeholder="Nhập Đơn Giá"
                                value={valueInputPriceCustom}
                                onChange={(e) => { setValueInputPriceCustom(e.target.value) }}
                            ></Input>
                        </div>
                    </Modal></>
                </div>
                <div>
                    <Table
                        rowSelection={rowSelection}
                        columns={columnsTable}
                        dataSource={dataRowProductDetail}
                        // pagination={false}
                    />
                </div>


            </div>

            <ToastContainer />
            {loading && (

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
                    <Spin size="large" tip="Adding product..." />
                </div>
            )}
        </div>



    );
}

export default ProductAdd;