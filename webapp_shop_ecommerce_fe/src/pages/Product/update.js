import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Table, Spin, Select, Input, Space, Modal, Divider, Tag, ColorPicker, InputNumber, Upload, Tooltip, Popconfirm } from 'antd';
import axios from 'axios';
import Compressor from 'compressorjs';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hexToColorName from "~/ultils/HexToColorName";
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
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
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
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

function ProductUpdate() {
    const { id } = useParams();
    const [product, setProduct] = useState();
    const navigate = useNavigate();
    const [dataRowProductDetail, setDataRowProductDetail] = useState([]);
    const [dataProductDetailOld, setDataProductDetailOld] = useState([]);
    const [dataProductDetailNew, setDataProductDetailNew] = useState([]);
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
    const handleCancelImg = () => setPreviewOpen(false);
    const handlePreviewImg = async (file) => {
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
            render: (size) => <span>{size?.name || null}</span>

        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => (
                <InputNumber
                    style={{ width: '80%' }}
                    value={record?.price || null}
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
                <InputNumber min={1} value={record.quantity} onChange={(value) => onChangeQuantity(record.key, value)} />
            ),
        },
        {
            title: 'Khối Lượng',
            dataIndex: 'weight',
            key: 'weight',
            render: (text, record) => (
                <InputNumber
                    value={record?.weight || 0}
                    min={1}
                    formatter={(value) => `${value} gam`}
                    parser={(value) => value.replace('gam', '')}
                    onChange={(value) => onChangeWeight(record.key, value)}
                />
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
                    onConfirm={() => handleDeleteProduct(record.key, record.id)}
                    okText="Xác Nhận"
                    cancelText="Không"
                >
                    <Button danger>
                        {record.index + "_" + record.key}
                        <DeleteOutlined />
                    </Button>
                </Popconfirm>


            ),
        },
        {
            title: 'Ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text, record, index, imageUrl) => {
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
                                customRequest={handleUpload}
                                multiple
                                onPreview={handlePreviewImg}
                                onChange={({ fileList: newFileList }) => {
                                    // console.log(newFileList)
                                    // console.log(record.color)


                                    const validFiles = newFileList.filter(file => {
                                        return file.type === 'image/png' || file.type === 'image/jpeg';
                                        // return file.status == "done";
                                    });

                                    console.log(validFiles)
                                    if (validFiles.length >= 4) {
                                        toast.error("Chỉ Được Tải Lên Tối Đa 3 Ảnh !");
                                        return;
                                    }

                                    const productDetailFinal = dataRowProductDetail.find(product => product.uuid === record.uuid);
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

                                    console.log(product.uuid)
                                    console.log(record.uuid)

                                    // console.log(productDetailFinal)
                                    console.log(dataProductDetail)

                                    setDataRowProductDetail(dataProductDetail)


                                }}
                            >
                                {record.imageUrl.length >= 3 ? null : uploadButton}
                            </Upload>
                            <Modal open={previewOpen} title={previewTitle} footer={null}
                                onCancel={handleCancelImg}
                            >
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
        },


    ];


    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/product/${id}`)
            .then(response => {
                console.log(response.data);
                setProduct(response.data);
                fillDataProduct(response.data);
            })
            .catch(error => console.error(error));
        console.log(id);
    }, [id]);

    const fillDataProduct = (pro) => {
        console.log(pro);
        setValueCodeProduct(pro.code);
        setValueNameProduct(pro.name);
        setValueDecProduct(pro.description);
        setValueCategory(pro.category.id);
        setValueMaterial(pro.material.id);
        setValueBrand(pro.brand.id);
        setValueStyle(pro.style.id);
        setImageAvatar(pro.imageUrl)

        const dataTable = pro.lstProductDetails.sort((a, b) => a.color.id - b.color.id).map((data, index) => {
            let product = {
                key: data.id,
                id: data.id,
                uuid: data.id,
                index: index + 1,
                barcode: data.barcode,
                code: data.code,
                name: pro.name,
                color: data.color,
                size: data.size,
                price: data.price,
                quantity: data.quantity,
                weight: data.weight,
                action: <Button danger >
                    <DeleteOutlined />
                </Button>,
                imageUrl: data?.imageUrl ? data.imageUrl.split("|").map((image, index) => {
                    return {
                        uid: index + index,
                        name: index + 'image.png',
                        status: 'done',
                        url: image,
                        type: "image/jpeg"
                    };
                }) : [],
            }
            return product;
        })

        setDataProductDetailOld(dataTable)
        setDataRowProductDetail(dataTable)
    }

    useEffect(() => {
        const dataCustom = [...dataProductDetailOld, ...dataProductDetailNew]
        setDataRowProductDetail(dataCustom.sort((a, b) => a.color.id - b.color.id))
    }, [dataProductDetailOld, dataProductDetailNew])




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
        console.log(value);
        setValueColor(value)
        console.log(`selected ${value}`);
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/color')
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

    // useEffect(() => {
    //     const lstProductDetails = valueColor.map((cl, index) => {
    //         return valueSize.map((size, i) => {
    //             return {
    //                 key: `${index}_${i}`,
    //                 id: null,
    //                 index: index,
    //                 name: valueNameProduct,
    //                 color: optionColor.filter((c) => c.value == cl)
    //                     .map((color) => {
    //                         return {
    //                             id: color.value,
    //                             name: color.label
    //                         }
    //                     })[0],
    //                 size: optionSize.filter((s) => s.value == size)
    //                     .map((size) => {
    //                         console.log(size);
    //                         return {
    //                             id: size.value,
    //                             name: size.label
    //                         }
    //                     })[0],
    //                 price: 1000,
    //                 quantity: 1,
    //                 imageUrl: ''
    //             }
    //         })
    //     })
    //     // console.log("---");
    //     console.log(lstProductDetails);
    //     setDataRowProductDetail([...dataRowProductDetail, lstProductDetails.flat()])
    //     // Cập nhật danh sách sản phẩm
    // }, [valueColor, valueSize, valueNameProduct])

    useEffect(() => {
        const dataCustom = dataRowProductDetail.map((data) => {
            return {
                ...data,
                name: valueNameProduct
            }
        })
        setDataRowProductDetail(dataCustom)

    }, [valueNameProduct])

    const handleDeleteProduct = (key, id) => {

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
    //update product
    const [loading, setLoading] = useState(false);
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        console.log(dataRowProductDetail);

        setLoading(true);
        try {
            const lstProductDetails = dataRowProductDetail.map((product) => {
                let imageProduct = product.imageUrl.map((image) => {

                    return image.url || image.response
                })

                return {
                    id: product.id,
                    product: id,
                    barcode: product.barcode,
                    status: product.status,
                    imageUrl: imageProduct.join("|"),
                    code: product.code,
                    price: product.price,
                    quantity: product.quantity,
                    size: product.size.id,
                    color: product.color.id,
                    weight: product.weight
                }
            });

            console.log(lstProductDetails);
            const response = await axios.put(`http://localhost:8080/api/v1/product/${id}`, {
                code: valueCodeProduct,
                name: valueNameProduct,
                description: valueDecProduct,
                category: valueCategory,
                brand: valueBrand,
                material: valueMaterial,
                style: valueMaterial,
                imageUrl: imageUrlAvatar,
                status: '0',
                lstProductDetails: lstProductDetails,
            });
            const { status, message, errCode } = response.data;
            toast.success("Cập nhật thành công");
            console.log(response.data);
            setTimeout(() => {
                navigate('/product/' + id)
            }, 1000);

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
    //Modal add product details new
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenCustomQuantityPrice, setIsModalOpenCustomQuantityPrice] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleAddProductDetails = () => {
        const lstProductDetails = valueColor.map((cl, index) => {
            return valueSize.map((size, i) => {
                const checkProduct = dataProductDetailOld.find(product => product.color.id == cl && product.size.id == size);
                // Nếu sản phẩm đã tồn tại, bỏ qua và không thêm vào lstProductDetails
                if (checkProduct) {
                    return null;
                }

                //backup lại ảnh
                const existingProduct = dataRowProductDetail.find(product => product.color.id === cl);
                let imageUrl = [];
                if (existingProduct) {
                    imageUrl = existingProduct.imageUrl; // Copy existing image URLs
                }

                return {
                    key: `${index}_${i}`,
                    index: index,
                    uuid: index,
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
        //lọc data null
        const dataProductDetailNew = lstProductDetails.flat().filter(product => product != null);
        console.log(dataProductDetailNew);

        setDataProductDetailNew(dataProductDetailNew)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


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
    const onChangeQuantityPriceCustom = () => {
        if (selectedRowKeys.length <= 0) {
            toast.info("Vui Lòng Chọn Thuộc Tính !")
            setIsModalOpenCustomQuantityPrice(false);

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
        setDataRowProductDetail(updatedProductList)
        setIsModalOpenCustomQuantityPrice(false);
        setValueInputPriceCustom(null);
        setValueInputQuantityCustom(null);
        setValueInputWeightCustom(null);
    }


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
                    <div className='mb-10 mt-2 '>
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

                <div className='bg-white p-4 mt-4 mb-20 shadow-lg'>
                    <div className='mb-6 mt-2 '>
                        <div className='text-[16px] font-semibold'>Chi Tiết Sản Phẩm</div>
                    </div>
                    <div className='mt-4 mb-6 flex justify-between'>
                        <div>
                            <Button className='mr-4' type="primary" onClick={handleUpdateProduct} >Cập Nhật Sản Phẩm</Button>
                            <Button type="primary" onClick={showModal}>
                                Thêm Chi Tiết
                            </Button>
                            <div>
                                <Modal title="Thêm Chi Tiết Sản Phẩm" open={isModalOpen} onOk={handleAddProductDetails} onCancel={handleCancel}>
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
                                                                placement="bottom"
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
                                </Modal>
                            </div>
                        </div>
                        <div>
                            <Button type="primary" onClick={() => {
                                setIsModalOpenCustomQuantityPrice(true)
                            }}>Áp Dụng Chung Cho Các Phân Loại</Button>
                            <> <Modal title="Ap Dụng Chung Cho Các Phân Loại" okText="Cập Nhật" open={isModalOpenCustomQuantityPrice}
                                onOk={onChangeQuantityPriceCustom}
                                onCancel={() => {
                                    setIsModalOpenCustomQuantityPrice(false)
                                }}>
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
                    </div>
                    <div>
                        <Table
                            rowSelection={rowSelection}
                            columns={columnsTable}
                            dataSource={dataRowProductDetail}
                            pagination={false}
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

export default ProductUpdate;