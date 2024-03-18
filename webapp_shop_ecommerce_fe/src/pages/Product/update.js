import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Spin, Select, Input, Space, Modal, Divider, Tag, ColorPicker, InputNumber, Upload, Tooltip } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hexToColorName from "~/ultils/HexToColorName";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
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
            {label}
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

const findSameColor = (data, dataIndex, rowIndex) => {
    if (rowIndex > 0 && data[rowIndex][dataIndex].name === data[rowIndex - 1][dataIndex].name) {
        return 0;
    }
    let count = [];
    for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i][dataIndex].name === data[i - 1][dataIndex].name) {
            count.push(data[i].id)
        } else {
            break;
        }
    }
    return count;
}

function ProductUpdate() {
    const { id } = useParams();
    const [product, setProduct] = useState();

    const [publicId, setPublicId] = useState("");
    // Replace with your own cloud name
    const [cloudName] = useState("db9i1b2yf");
    // Replace with your own upload preset
    const [uploadPreset] = useState("aoh4fpwm");

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

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/product/${id}`)
            .then(response => {
                console.log(response.data);
                setProduct(response.data);
                fillDataProduct(response.data);
            })
            .catch(error => console.error(error));
    }, [id]);

    const fillDataProduct = (pro) => {
        setValueCodeProduct(pro.code);
        setValueNameProduct(pro.name);
        setValueDecProduct(pro.description);
        setValueCategory(pro.category.id);
        setValueMaterial(pro.material.id);
        setValueBrand(pro.brand.id);
        setValueStyle(pro.style.id);


        const dataTable = pro.lstProductDetails.map((data, index) => {
            let product = {
                key: data.id,
                id: data.id,
                index: index + 1,
                barcode: data.barcode,
                code: data.code,
                name: pro.name,
                color: data.color,
                size: data.size,
                price: data.price,
                quantity: data.quantity,
                action: <Button danger >
                    <DeleteOutlined />
                </Button>,
                imageUrl: [pro.imageUrl],
            }
            return product;
        })


        setDataProductDetailOld(dataTable)
        setDataRowProductDetail(dataTable)
    }

    useEffect(() => {
        const dataCustom = [...dataProductDetailOld, ...dataProductDetailNew]
        setDataRowProductDetail(dataCustom)
    }, [dataProductDetailOld, dataProductDetailNew])

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
                    defaultValue={record?.price || null}
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
                <Button danger onClick={() => handleDeleteProduct(record.key, record.id)}>
                    {record.index + "_" + record.key}
                    <DeleteOutlined />
                </Button>
            ),
        },
        {
            title: 'Ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text, record, index, imageUrl) => {
                // Kiểm tra xem rowSpan cho record.index đã được đặt chưa, nếu chưa thì đặt mặc định là 1
                const same = findSameColor(dataRowProductDetail, 'color', index)
                const rowSpan = calculateRowSpan(dataRowProductDetail, 'color', index);

                return {
                    children: (
                        <>
                            {console.log(record)}
                            {record && record.imageUrl && record.imageUrl[0].split(" | ") && <img className='w-40 aspect-square rounded-sm' src={record.imageUrl[0].split(" | ")[0]}></img>}
                            <Upload
                                listType="picture-card"
                                fileList={imageUrl}
                                method='POST'
                                customRequest={(q) => {
                                    const formData = new FormData();
                                    formData.append("file", q.file);
                                    formData.append("cloud_name", "db9i1b2yf")
                                    formData.append("upload_preset", "product")
                                    axios.post(`https://api.cloudinary.com/v1_1/db9i1b2yf/image/upload`, formData).then(res => {
                                        // res.data.image là ra cái link ảnh đã upload lên cloud
                                        alert("upload image successfully")
                                        axios.get(`http://localhost:8081/api/productDetail/update/image?id=${record.id}&imageUrl=${res.data.url}`).then((response) => {
                                            //response.data là cái data của productDetail đã được update lại image url
                                            console.log("updated Detail: " + JSON.stringify(response.data))
                                        })
                                        same.map(idSame => {
                                            axios.get(`http://localhost:8081/api/productDetail/update/image?id=${idSame}&imageUrl=${res.data.url}`).then((response) => {
                                                //response.data là cái data của product đã được update lại image url
                                                console.log("updatedSameDetail :" + JSON.stringify(response.data))
                                            })
                                        })
                                    })
                                }}
                                onPreview={handlePreviewImg}
                            >
                                {record.imageUrl.length >= 6 ? null : uploadButton}
                            </Upload>
                            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelImg}>
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

    //update product
    const [loading, setLoading] = useState(false);
    const handleUpdateProduct = async (e) => {

        e.preventDefault();
        setLoading(true);
        try {
            const lstProductDetails = dataRowProductDetail.map((product) => ({
                id: product.id,
                barcode: product.barcode,
                status: product.status,
                // imageUrl: [...product.imageUrl],
                code: product.code,
                price: product.price,
                quantity: product.quantity,
                size: product.size.id,
                color: product.color.id,
            }));
            const response = await axios.put(`http://localhost:8080/api/v1/product/${id}`, {
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
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleAddProductDetails = () => {
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
                    price: 1000,
                    quantity: 1,
                    imageUrl: []
                }
            })
        })
        // console.log("---");
        // console.log(dataRowProductDetail);
        // console.log(lstProductDetails.flat() );
        setDataProductDetailNew(lstProductDetails.flat())
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
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
    return (
        <div className='bg-white p-4'>
            <div>
                <div className='flex justify-between'>
                    <div>
                        <p>Danh sách ảnh</p>
                        <div className='flex gap-2 items-center'>
                            <div className='flex gap-2'>
                                {product && product.imageUrl && product.imageUrl.split(" | ").map(img => {
                                    return <img className='w-40 aspect-square rounded-sm' src={img}></img>
                                }
                                )}
                            </div>
                            <Upload
                                method='POST'
                                className='w-40 aspect-square flex items-center justify-center border-dashed border-[1px] border-slate-600 rounded-lg'
                                customRequest={(q) => {
                                    const formData = new FormData();
                                    formData.append("file", q.file);
                                    formData.append("cloud_name", "db9i1b2yf")
                                    formData.append("upload_preset", "product")
                                    // formData.append("api_key", "845413845354532");
                                    // formData.append("public_id", "sample_image");
                                    // formData.append("timestamp", "1315060510");
                                    // formData.append("signature", "9O4m1S9dSB_3UjuvDbx2oIj0wWQ");

                                    axios.post(`https://api.cloudinary.com/v1_1/db9i1b2yf/image/upload`, formData).then(res => {
                                        axios.get(`http://localhost:8081/api/product/update/image?id=${id}&imageUrl=${res.data.image}`).then((response) => {
                                            //response.data là cái data của product đã được update lại image url
                                            console.log(response.data)
                                            setProduct(prev => {
                                                return { ...prev, imageUrl: response.data.image_url }
                                            });
                                            fillDataProduct(product)
                                            alert("upload image successfully")
                                        })
                                    })
                                }}
                            >
                                Tải ảnh lên
                            </Upload>
                        </div>
                    </div>
                    <div>
                        <label>Mã Sản Phẩm</label>
                        <Input className="my-4" placeholder="Nhập Mã Sản Phẩm" value={valueCodeProduct} onChange={e => setValueCodeProduct(e.target.value)} />
                    </div>
                    <div>
                        <label>Tên Sản Phẩm</label>
                        <Input className="my-4" placeholder="Nhập Tên Sản Phẩm" value={valueNameProduct} onChange={e => setValueNameProduct(e.target.value)} />
                    </div>
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


                <div>
                    <Button type="primary" onClick={handleUpdateProduct} >Update Sản Phẩm</Button>
                    <Button type="primary" onClick={showModal}>
                        Thêm Chi Tiết
                    </Button>
                </div>
                <div>
                    <Table
                        rowSelection={rowSelection}
                        columns={columnsTable}
                        dataSource={dataRowProductDetail}
                        pagination={false}
                    />
                </div>

                <Modal title="Basic Modal" open={isModalOpen} onOk={handleAddProductDetails} onCancel={handleCancel}>
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