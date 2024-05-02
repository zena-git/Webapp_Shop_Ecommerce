import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Table, Spin, Select, Input, Space, Modal, Upload, Divider, Tag, ColorPicker, InputNumber, Form, Tooltip, Popconfirm } from 'antd';
import axios from 'axios';
import Compressor from 'compressorjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hexToColorName from "~/ultils/HexToColorName";
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import AxiosIns from '../../lib/auth'


const { TextArea } = Input;


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
            {hexToColorName(label)}
        </Tag>
    );
};


const calculateRowSpan = (data, dataIndex, rowIndex) => {
    if (rowIndex > 0 && data[rowIndex][dataIndex].name === data[rowIndex - 1][dataIndex].name) {
        return 0;
    }
    let count = 1;
    for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i][dataIndex].name === data[i - 1][dataIndex].name) {
            count++;
        } else {
            break;
        }
    }
    return count;
};
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
function ProductAdd() {
    const navigate = useNavigate();


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

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

    const handleUpload = ({ file, onSuccess, onError }) => {
        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            toast.error("Upload Sai Định Dạng")
            const error = new Error('File format is not supported. Please upload PNG or JPG files.');
            console.error(error);
            onError(error);
            return;
        }

        new Compressor(file, {
            quality: 0.6,
            maxWidth: 800,
            maxHeight: 600,
            success(result) {
                const formData = new FormData();
                formData.append('file', result);
                formData.append('upload_preset', 'aliceshop');

                axios
                    .post('https://api.cloudinary.com/v1_1/dgxbxvkso/image/upload', formData)
                    .then((response) => {
                        const { secure_url } = response.data;
                        console.log(secure_url);
                        onSuccess(secure_url);
                    })
                    .catch((error) => {
                        console.error('Error uploading image:', error);
                        onError(error);
                    });
            },
            error(error) {
                console.error('Error compressing image:', error);
                onError(error);
            },
        });
    };



    // Khai báo một biến để theo dõi rowSpan cho từng giá trị record.index
    const columnsTable = [
        {
            title: '#',
            dataIndex: '#',
            key: '#',
            render: (text, record, index) => <span>{index + 1}</span>,
            width: 50,
            align: 'center',
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
            render: (color) => <>
                <div className='flex'>
                    <Tooltip title={hexToColorName(color.name) + ' - ' + color.name} color={color.name} key={color.name}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: color.name }}></div>
                    </Tooltip>
                    <span className='ml-2 mr-2'>-</span>
                    <span>{hexToColorName(color.name)}</span>
                </div>
            </>,

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
                    style={{ width: '80%' }}
                    value={record.price}
                    min={1000}
                    formatter={(value) => `${value} VNĐ`}
                    parser={(value) => value.replace(' VNĐ', '')}
                    onChange={(value) => onChangePrice(record.key, value)}
                />
            ),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber min={1} value={record.quantity}

                    onChange={(value) => onChangeQuantity(record.key, value)} />
            ),
        }
        ,
        {
            title: 'Khối Lượng',
            dataIndex: 'weight',
            key: 'weight',
            render: (text, record) => (
                <InputNumber min={1} value={record.weight}
                    formatter={(value) => `${value} gam`}
                    parser={(value) => value.replace(' gam', '')}
                    onChange={(value) => onChangeWeight(record.key, value)} />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Loại bỏ chi tiết"
                    description="Bạn có chắc muốn loại bỏ chi tiết này khỏi khay tạm?"
                    onConfirm={() => handleDeleteProduct(record.key)}
                    okText="Xác Nhận"
                    cancelText="Không"
                >
                    <Button danger >
                        {/* {record.index + "_" + record.key} */}
                        <DeleteOutlined />
                    </Button>
                </Popconfirm>


            ),
        },
        {
            title: 'Upload IMG',
            dataIndex: 'imageUrl',
            key: 'imageUrl',

            render: (text, record, index) => {
                // Kiểm tra xem rowSpan cho record.index đã được đặt chưa, nếu chưa thì đặt mặc định là 1
                const rowSpan = calculateRowSpan(dataRowProductDetail, 'color', index);

                return {
                    children: (
                        <>
                            <Upload
                                accept="image/*"
                                key={index}
                                listType="picture-card"
                                fileList={record.imageUrl}
                                onPreview={handlePreview}
                                onChange={({ fileList: newFileList }) => {
                                    console.log("Key " + record.key)
                                    console.log("data " + dataRowProductDetail)
                                    const validFiles = newFileList.filter(file => {
                                        return file.type === 'image/png' || file.type === 'image/jpeg';
                                        // return file.status == "done";
                                    });
                                    if (validFiles.length >= 4) {
                                        toast.error("Chỉ Được Tải Lên Tối Đa 3 Ảnh !");
                                        return;
                                    }
                                    const productDetailFinal = dataRowProductDetail.find(product => product.key === record.key);
                                    console.log(productDetailFinal.color.id)
                                    const dataProductDetail = dataRowProductDetail.map((productDetail) => {
                                        if (productDetail.color.id === productDetailFinal.color.id) {
                                            return {
                                                ...productDetail,
                                                imageUrl: validFiles,
                                            }
                                        } else {
                                            return {
                                                ...productDetail
                                            }
                                        }

                                    })

                                    console.log(dataProductDetail)
                                    setDataRowProductDetail(dataProductDetail)

                                }}
                                customRequest={handleUpload}
                                multiple
                            >
                                {record.imageUrl?.length >= 3 ? null : uploadButton}
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
    const [valueImageUrl, setValueImageUrl] = useState("");
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
    const [valueInputWeightCustom, setValueInputWeightCustom] = useState(null);


    // selectcategory
    const handleChangeCategory = (value) => {
        setValueCategory(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        AxiosIns.get('v1/category')
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
        AxiosIns.post('v1/category', {
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
        AxiosIns.get('v1/material')
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
        AxiosIns.post('v1/material', {
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
        AxiosIns.get('v1/brand')
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
        AxiosIns.post('v1/brand', {
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
        AxiosIns.get('v1/style')
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
        AxiosIns.post('v1/style', {
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
        AxiosIns.get('v1/size')
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
        AxiosIns.post('v1/size', {
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


        setValueInputSize("")
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
        AxiosIns.get('v1/color')
            .then((response) => {
                const newObj = response.data.map(rep => ({

                    label: rep.name,
                    value: rep.id,
                    emoji: <ColorPicker defaultValue={rep.name} disabled size="small" />,
                    desc: hexToColorName(rep.name),
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
        AxiosIns.post('v1/color', {
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
                //backup lại ảnh
                const existingProduct = dataRowProductDetail.find(product => product.color.id === cl);
                let imageUrl = [];
                if (existingProduct) {
                    imageUrl = existingProduct.imageUrl; // Copy existing image URLs
                }
                // console.log(imageUrl);
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
                    weight: 200,
                    imageUrl: imageUrl
                }
            })
        })
        // console.log("---");
        console.log(lstProductDetails);
        // const dataTable = dataRowProductDetail.map((data)=>{

        // })
        fillDataProductDetail(lstProductDetails.flat());
        // Cập nhật danh sách sản phẩm
    }, [valueColor, valueSize])

    useEffect(() => {
        const dataTable = dataRowProductDetail.map((productDetail) => {
            return {
                ...productDetail,
                name: valueNameProduct,
            }
        })
        fillDataProductDetail(dataTable)
    }, [valueNameProduct])
    const fillDataProductDetail = (data) => {
        console.log(data);
        setDataRowProductDetail(data)
    }


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

    const onChangeWeight = (key, value) => {
        // Update the data array or perform any other necessary action
        const updatedProductList = dataRowProductDetail.map(product => {
            if (product.key === key) {
                return {
                    ...product,
                    weight: value
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
        if (selectedRowKeys.length <= 0) {
            toast.info("Vui Lòng Chọn Thuộc Tính !")
            setIsModalOpen(false);

            return;
        }
        if (valueInputQuantityCustom < 1) {
            toast.info("Số Lượng Phải Lớn Hơn 1 !")
            return;
        }

        if (valueInputPriceCustom < 1000) {
            toast.info("Giá Phải Lớn Hơn 1000 !")
            return;
        }

        if (valueInputWeightCustom < 1) {
            toast.info("Khối Lượng Phải Lớn Hơn 1 gam!")
            return;
        }
        const updatedProductList = dataRowProductDetail.map(product => {
            if (selectedRowKeys.includes(product.key)) {
                return {
                    ...product,
                    price: valueInputPriceCustom,
                    quantity: valueInputQuantityCustom,
                    weight: valueInputWeightCustom
                };
            }
            return product;
        });
        console.log(updatedProductList);
        // setDataRowProductDetail(updatedProductList);
        fillDataProductDetail(updatedProductList)
        setIsModalOpen(false);
        setValueInputPriceCustom(null);
        setValueInputQuantityCustom(null);
        setValueInputWeightCustom(null);
    }

    //Add product
    const [loading, setLoading] = useState(false);
    const handleAddProduct = async (e) => {

        e.preventDefault();
        setLoading(true);
        try {
            const lstProductDetails = dataRowProductDetail.map((product) => {
                const imageUrlList = product.imageUrl.map((image) => {
                    return image.response;
                });

                return {
                    imageUrl: imageUrlList.join("|"),
                    price: product.price,
                    quantity: product.quantity,
                    size: product.size.id,
                    color: product.color.id,
                    weight: product.weight,
                };
            });

            console.log(lstProductDetails);

            const response = await AxiosIns.post('v1/product', {
                code: valueCodeProduct,
                name: valueNameProduct,
                imageUrl: imageUrlAvatar,
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
            navigate('/product')

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
        setDataRowProductDetail([])
        setImageAvatar(null)
    }

    //Upload 
    const [imageUrlAvatar, setImageAvatar] = useState(null);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);


    const handleImageChange = (event) => {
        const file = event?.target?.files[0];
        console.log(file);
        if (file == 'undefined') {
            return
        }
        if (file?.type !== 'image/png' && file?.type !== 'image/jpeg') {
            toast.error("Upload Sai Định Dạng")
            return;
        }

        new Compressor(file, {
            quality: 0.6,
            maxWidth: 800,
            maxHeight: 600,
            success(result) {
                const formData = new FormData();
                formData.append('file', result);
                formData.append('upload_preset', 'aliceshop');
                setIsLoadingAvatar(true)
                axios
                    .post('https://api.cloudinary.com/v1_1/dgxbxvkso/image/upload', formData)
                    .then((response) => {
                        const { secure_url } = response.data;
                        setImageAvatar(secure_url);
                        console.log(secure_url);
                    })
                    .catch((error) => {
                        console.error('Error uploading image:', error);
                    })
                    .finally(() => setIsLoadingAvatar(false));
            },
            error(error) {
                console.error('Error compressing image:', error);
            },
        });
    };
    return (
        <div className=''>

            <div>
                <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                    <div className='mb-10 mt-2 '>
                        <div className='text-[16px] font-semibold	'>Thông Tin Cơ Bản</div>
                    </div>

                    <div className='flex items-end mt-4	mb-10'>
                        <div className='w-1/4 flex justify-center	'>
                            <div style={{
                                height: '200px',
                                border: '2px dashed #ccc',
                                width: '200px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',

                            }}>
                                <label
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    htmlFor="image-upload" className="label">
                                    <div className="circle"
                                        style={{
                                            width: '100%',
                                            height: '100%',

                                            position: 'relative'
                                        }}>
                                        {imageUrlAvatar ? (
                                            <div

                                            // onMouseEnter={handleMouseEnter}
                                            // onMouseLeave={handleMouseLeave}
                                            >
                                                <img
                                                    style={{
                                                        borderRadius: '10px',
                                                        padding: '10px',
                                                        width: '200px',
                                                        height: '200px',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center',
                                                        cursor: 'pointer'
                                                    }}
                                                    src={imageUrlAvatar}
                                                    alt="Selected"
                                                    className="preview-image"
                                                />

                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                    height: '100%'
                                                }}
                                                className="placeholder flex flex-col justify-center items-center"
                                            >
                                                <PlusOutlined className="text-4xl" />
                                                <span className="mt-2">Ảnh Bìa</span>
                                            </div>
                                        )}
                                        {(isLoadingAvatar &&
                                            <div style={{
                                                position: 'absolute',
                                                zIndex: '1',
                                                top: '0',
                                                left: '0',
                                                right: '0',
                                                bottom: '0',
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',

                                            }}>
                                                <LoadingOutlined
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '30px',
                                                    }}
                                                ></LoadingOutlined>
                                            </div>

                                        )}
                                    </div>
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                        </div>
                        <div className='w-3/4	'>
                            <div>
                                <label>Mã Sản Phẩm</label>
                                <Input className="my-4" placeholder="Nhập Mã Sản Phẩm" value={valueCodeProduct} onChange={e => setValueCodeProduct(e.target.value)} />
                            </div>

                            <div>
                                <label>Tên Sản Phẩm</label>
                                <Input className="my-4" placeholder="Nhập Tên Sản Phẩm" value={valueNameProduct} onChange={e => setValueNameProduct(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Mô Tả Sản Phẩm</label>
                        <TextArea className="my-4" rows={4} placeholder="Nhập Mô Tả Sản Phẩm" maxLength={350} value={valueDecProduct} onChange={e => setValueDecProduct(e.target.value)} />
                    </div>
                </div>



                <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                    <div className='mb-6 mt-2 '>
                        <div className='text-[16px] font-semibold	'>Thông Tin Chi Tiết</div>
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


                </div>

                <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                    <div className='mb-6 mt-2 '>
                        <div className='text-[16px] font-semibold	'>Thuộc Tính Sản Phẩm</div>
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
                                        {option.data.label + "-" + option.data.desc}
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
                </div>

                <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                    <div className='mb-6 mt-2 '>
                        <div className='text-[16px] font-semibold'>Chi Tiết Sản Phẩm</div>
                    </div>

                    <div className='mt-2 flex justify-between	'>
                        <Button className='mr-4' type="primary" onClick={handleAddProduct}>Thêm Sản Phẩm</Button>
                        <Button type="primary" onClick={showModal}>Áp Dụng Chung Cho Các Phân Loại</Button>
                        <> <Modal title="Áp Dụng Chung Cho Các Phân Loại" okText="Cập Nhật" open={isModalOpen}
                            onOk={onChangeQuantityPriceCustom}
                            onCancel={handleCancelModal}>
                            <div>
                                <label>Đơn Giá</label>
                                <InputNumber className='mt-2 mb-2 w-full' placeholder="Nhập Đơn Giá"
                                    value={valueInputPriceCustom}
                                    onChange={(value) => { setValueInputPriceCustom(value) }}
                                ></InputNumber>
                            </div>
                            <div>
                                <label>Số Lượng</label>
                                <InputNumber className='mt-2 mb-2 w-full' placeholder="Nhập Số Lượng"
                                    value={valueInputQuantityCustom}
                                    onChange={(value) => { setValueInputQuantityCustom(value) }}
                                ></InputNumber>
                            </div>


                            <div>
                                <label>Khối Lượng</label>
                                <InputNumber className='mt-2 mb-2 w-full' placeholder="Nhập Khối Lượng"
                                    value={valueInputWeightCustom}
                                    onChange={(value) => { setValueInputWeightCustom(value) }}
                                ></InputNumber>
                            </div>
                        </Modal></>
                    </div>

                    <div className='mt-6'>
                        <Table
                            rowSelection={rowSelection}
                            columns={columnsTable}
                            dataSource={dataRowProductDetail}
                        // pagination={false}
                        />
                    </div>
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