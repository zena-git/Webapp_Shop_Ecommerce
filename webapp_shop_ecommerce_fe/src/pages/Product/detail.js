import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Carousel, Popconfirm, Table, Typography, Button, Descriptions, Tag, Slider, Select, Tooltip, Space, ColorPicker } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import hexToColorName from "~/ultils/HexToColorName";
import { useDebounce } from '~/hooks';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AxiosIns from '../../lib/auth'

dayjs.extend(customParseFormat);

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber min={1} /> : inputType === 'numberPrice' ? <InputNumber min={1000} className='w-full min-w-16	' /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui Lòng Nhập ${title}!`,
                        },

                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
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
function ProductDetail() {

    const { id } = useParams();
    const [product, setProduct] = useState();
    const [historyProductDetails, setHistoryProductDetails] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataColum, setDataColum] = useState([]);

    const [valueColor, setValueColor] = useState("");
    const [valueSize, setValueSize] = useState("");
    const [optionColor, setOptionColor] = useState([]);
    const [optionSize, setOptionSize] = useState([]);

    const [valueMin, setValueMin] = useState("0");
    const [valueMax, setValueMax] = useState("99999999999999");
    const debounceMin = useDebounce(valueMin, 500)
    const debounceMax = useDebounce(valueMax, 500)

    const [checkPrice, setCheckPrice] = useState(true);
    const lstInfoProduct = [
        {
            key: '1',
            label: <>
                <span className='text-black'>Mã Sản Phẩm</span>
            </>,
            children: product?.code || 'empty',
        },
        {
            key: '2',
            label: <>
                <span className='text-black'>Tên Sản Phẩm</span>
            </>,
            children: product?.name || 'empty',
        },
        {
            key: '3',
            label: <span className='text-black'>Mô Tả Sản Phẩm</span>,
            children: product?.description.length > 80 ? product?.description.substring(0, 80) + '...' : product?.description || 'empty',
        },
        {
            key: '4',
            label: <span className='text-black'>Trạng Thái</span>,
            children: product?.status == "0" ? "Đang Bán" : product?.status == "1" ? "Ngừng Bán" : "Khác" || 'empty',
        },
        {
            key: '5',
            label: <span className='text-black'>Loại</span>,
            children: product?.category?.name || 'empty',
        },
        {
            key: '6',
            label: <span className='text-black'>Chất Liệu</span>,
            children: product?.material?.name || 'empty',
        },
        {
            key: '7',
            label: <span className='text-black'>Phong Cách</span>,
            children: product?.style?.name || 'empty',
        },
        {
            key: '8',
            label: <span className='text-black'>Thương Hiệu</span>,
            children: product?.brand?.name || 'empty',
        },
        {
            key: '9',
            label: <span className='text-black'>Tạo bởi</span>,
            children: product?.createdBy || 'empty',
        },
        {
            key: '10',
            label: <span className='text-black'>Ngày Tạo</span>,
            children: dayjs(product?.createdDate).format('YYYY-MM-DD HH:mm:ss') || 'empty',
        },

    ];
    const columnsTable = [

        {
            title: '#',
            dataIndex: 'index', // Change 'index' to 'key'
            key: 'index',
            width: 50,
            align: 'center',
        },
        {
            title: 'Ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                // Kiểm tra xem rowSpan cho record.index đã được đặt chưa, nếu chưa thì đặt mặc định là 1
                const rowSpan = calculateRowSpan(dataColum, 'color', index);

                return {
                    children: (
                        <><div className='flex justify-center'>
                            <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '80px', height: '100px' }}>
                                {
                                    record.imageUrl.map((imageUrl, index) => {
                                        return (
                                            <img src={imageUrl} key={index} style={{ width: '100px' }}></img>
                                        )
                                    })
                                }
                            </Carousel>
                        </div>
                        </>
                    ),
                    props: {
                        rowSpan: rowSpan,  // Sử dụng rowSpan cho dòng hiện tại
                    },
                };
            },
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
                    <span className='ml-2 mr-2'>-</span>
                    <span>{hexToColorName(color.name)}</span>
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
            editable: true,
            width: 200,

        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            editable: true,
        },

        {
            title: 'Khối Lượng',
            dataIndex: 'weight',
            key: 'weight',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Xác Nhận
                        </Typography.Link>
                        <Popconfirm title="Chắc chắn sẽ hủy?" onConfirm={cancel}>
                            <a>Hủy Bỏ</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Chỉnh Sửa
                    </Typography.Link>
                );
            },
        }

    ];


    const mergedColumns = columnsTable.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'price' ? 'numberPrice' : col.dataIndex === 'quantity' ? 'number' : col.dataIndex === 'weight' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                min: 1,
            }),
        };
    });


    const fetchData = async () => {
        try {
            const response = await AxiosIns.get(`v1/product/${id}`, {
                params: {
                    size: valueSize,
                    color: valueColor,
                    min: valueMin,
                    max: valueMax,
                },
            });

            console.log(response.data);
            setProduct(response.data);

            const sortedDataTable = [...response.data.lstProductDetails].sort((a, b) => a.color.id - b.color.id);

            const dataTable = sortedDataTable.map((data, index) => {
                let product = {
                    key: data.id,
                    index: index + 1,
                    name: (
                        <>
                            <div className='flex'>
                                <div className='mr-4 '>{response.data.name}</div>
                            </div>
                        </>
                    ),
                    code: data.code,
                    color: data.color,
                    size: data.size,
                    price: data.price,
                    quantity: data.quantity,
                    weight: data.weight,
                    imageUrl: data.imageUrl ? data.imageUrl.split("|") : [],
                };
                return product;
            });

            if (checkPrice) {
                const highestPriceProduct = dataTable.reduce((maxPriceProduct, currentProduct) => {
                    return currentProduct.price > maxPriceProduct.price ? currentProduct : maxPriceProduct;
                }, dataTable[0]);
                console.log("setMaxx");
                setInputValueMax(highestPriceProduct.price);
                setCheckPrice(false);
            }

            setDataColum(dataTable);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, historyProductDetails, valueSize, valueColor, debounceMin, debounceMax]);



    //checkd box table
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    //dowload barcode

    const dowloadBarcode = () => {
        setLoading(true);
        const downloadBarcode = async () => {
            const apiUrl = 'http://localhost:8080/api/v1/product/barcode?data=';

            try {
                const response = await axios.get(apiUrl + selectedRowKeys, { responseType: 'blob' });
                const currentDate = new Date();
                // Create a blob URL and initiate the download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Barcode_' + currentDate.getDate() + '_' + (currentDate.getMonth() + 1) + '_' + currentDate.getFullYear() + '.zip');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setSelectedRowKeys([]);
                setLoading(false);
            } catch (error) {
                console.error('Error downloading Barcode file:', error);
            }
        };
        // Call the function when needed
        downloadBarcode();
    };

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            quantity: '',
            price: '',
            weight: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        console.log(key);
        try {
            const row = await form.validateFields();
            console.log('Received values of form: ', row);
            const productDetail = dataColum.filter(pro => {
                return pro.key === key;
            })[0];

            const lstProductDetail = dataColum.filter(pro => {
                return pro.key !== key;
            })[0];
            console.log(productDetail);
            AxiosIns.put(`v1/productDetail/${key}`, {
                id: key,
                quantity: row.quantity,
                price: row.price,
                weight: row.weight
            })
                .then((response) => {
                    const { status, message, errCode } = response.data;
                    // setHistoryProductDetails(response.data.data);
                    toast.success(message);
                    console.log(response.data);
                    setCheckPrice(true);
                    fetchData();
                    setTimeout(() => {
                        setEditingKey('');

                    }, 500);
                })
                .catch((error) => {
                    const { status, message, errCode } = error.response.data;
                    toast.error(message);
                    console.log(error.response.data);
                    setEditingKey('');
                });


        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleChangeColor = (value) => {
        setValueColor(value)
        console.log(`selected ${value}`);
    };
    const handleChangeSize = (value) => {
        setValueSize(value)
        console.log(`selected ${value}`);
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
                setOptionColor([
                    {
                        value: '',
                        emoji: '',
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

    useEffect(() => {
        AxiosIns.get('v1/size')
            .then((response) => {
                const newObj = response.data.map(rep => ({
                    value: rep.name,
                    label: rep.name,
                    key: rep.id, // Sử dụng một trường duy nhất từ dữ liệu làm key
                }));
                setOptionSize([
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
    const [inputValueMin, setInputValueMin] = useState(0);
    const [inputValueMax, setInputValueMax] = useState(10000000);

    const onChangeSlider = (values) => {
        // Xử lý logic khi giá trị của Slider thay đổi
        console.log('Giá trị mới:', values);
        // Thêm các bước xử lý khác tùy thuộc vào yêu cầu của bạn
        setValueMin(values[0])
        setValueMax(values[1])
    };

    return (
        <div>
            <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>

                <div>
                    <Descriptions title="Thông Tin Sản Phẩm"
                        layout="inline"
                        items={lstInfoProduct}
                        column={4}
                    />
                </div>
               
            </div>

            <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                <div>
                    <h4>Bộ lọc</h4>
                </div>

                <div className='grid grid-cols-4 gap-4 my-4'>
                    <div>
                        <label>Loại</label>
                        <Select className="w-full mt-4" placeholder="Chọn Màu Sắc"


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
                        <Select className="w-full mt-4"
                            defaultValue=""
                            onChange={handleChangeSize}
                            options={optionSize}
                        />
                    </div>
                    <div>
                        <label>Khoảng Giá</label>
                        <Slider
                            className="w-full mt-4"
                            range
                            max={inputValueMax}
                            defaultValue={[inputValueMin, inputValueMax]} // Đặt giá trị mặc định
                            onChange={onChangeSlider}
                        />
                    </div>
                </div>
            </div>

            <div className='bg-white p-4 mt-4 mb-20 shadow-lg'>
                <div className='mb-6 mt-2 '>
                    <div className='text-[16px] font-semibold'>Danh Sách Sản Phẩm</div>
                </div>
                <div >

                    <div className='flex justify-between mb-6 mt-4'>
                        <Button type="primary" disabled={!hasSelected} loading={loading} onClick={dowloadBarcode}>
                            BarCode
                        </Button>
                        <Link to={`/product/update/${id}`}> <Button type="primary">Update Sản Phẩm</Button></Link>
                    </div>

                    <Form form={form} component={false}>
                        <Table
                            rowSelection={rowSelection}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={dataColum}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={{
                                onChange: cancel,
                            }}
                        />
                    </Form>
                </div>

            </div>

            <ToastContainer />

        </div>

    );
}

export default ProductDetail;