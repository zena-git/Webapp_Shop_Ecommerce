import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Radio, Select, Input, Space, Dropdown, Divider, Tag, ColorPicker, InputNumber } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hexToColorName from "~/ultils/HexToColorName";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const columnsTable = [
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
    },
    {
        title: 'Số Lượng',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',

    },
    {
        title: 'Upload IMG',
        dataIndex: 'upload',
        key: 'upload',

    }

];
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



let index = 0;
function ProductAdd() {

    const [dataRowProductDetail, setDataRowProductDetail] = useState([]);
    const [valueNameProduct, setValueNameProduct] = useState("");


    const [valueCategory, setValueCategory] = useState("");
    const [valueMaterial, setValueMaterial] = useState("");
    const [valueBrand, setValueBrand] = useState("");
    const [valueStyle, setValueStyle] = useState("");
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
    const handleColorPickerClick = (e) => {
        // Ngăn chặn sự kiện click trên ColorPicker từ propagate lên đến Select
        e.stopPropagation();
    };


    //Table
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
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
                    key: i,
                    index: i,
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
                    price: <InputNumber
                        defaultValue={1000}
                        min={1000}
                        formatter={(value) => `${value}VNĐ`}
                        parser={(value) => value.replace('VNĐ', '')}
                    />,
                    quantity: <InputNumber min={1} defaultValue={1} />,
                    action: <Button  danger>
                       <DeleteOutlined />
                    </Button>,
                    upload: "upload",
                }
            })
        })
        console.log("---");
        console.log(lstProductDetails);
        setDataRowProductDetail(lstProductDetails)
    }, [valueColor, valueSize, valueNameProduct])


    const handleAddProduct = () => {
        console.log(dataRowProductDetail);
    }


    return (
        <div className='bg-white p-4'>
            <div>
                <div>
                    <label>Mã Sản Phẩm</label>
                    <Input className="my-4" placeholder="Nhập Mã Sản Phẩm" />
                </div>

                <div>
                    <label>Tên Sản Phẩm</label>
                    <Input className="my-4" placeholder="Nhập Tên Sản Phẩm" onChange={e => setValueNameProduct(e.target.value)} />
                </div>
                <div>
                    <label>Mô Tả Sản Phẩm</label>
                    <TextArea className="my-4" rows={4} placeholder="maxLength is 6" maxLength={6} />
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
                        />
                    </div>
                </div>

                <div>
                    {
                        dataRowProductDetail.map((pro, index) => (
                            <Table
                                key={index}
                                columns={columnsTable}
                                dataSource={pro}
                                pagination={false}
                            />
                        ))
                    }
                </div>

                <Button onClick={handleAddProduct}>adđ</Button>

            </div>

            <ToastContainer />
        </div>



    );
}

export default ProductAdd;