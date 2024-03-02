import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Descriptions, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';



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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
                            message: `Please Input ${title}!`,
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

function ProductDetail() {

    const { id } = useParams();
    const [product, setProduct] = useState();
    const [historyProductDetails, setHistoryProductDetails] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataColum, setDataColum] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/product/${id}`)
            .then(response => {
                console.log(response.data);
                setProduct(response.data);
                const sortedDataTable = [...response.data.lstProductDetails].sort((a, b) => a.id - b.id);

                const dataTable = sortedDataTable.map((data, index) => {
                    let product = {
                        key: data.id,
                        index: index + 1,
                        barcode: data.barcode,
                        code: data.code,
                        color: data.color,
                        size: data.size,
                        price: data.price,
                        quantity: data.quantity,
                        action: <Button danger >
                            <DeleteOutlined />
                        </Button>,
                        img: 'img'
                    }
                    return product;
                })
                setDataColum(dataTable);
            })
            .catch(error => console.error(error));
        console.log(id);
    }, [id,historyProductDetails]);



    const lstInfoProduct = [
        {
            key: '1',
            label: 'Mã Sản Phẩm',
            children: product?.code || 'empty',
        },
        {
            key: '2',
            label: 'Tên Sản Phẩm',
            children: product?.name || 'empty',
        },
        {
            key: '3',
            label: 'Mô Tả Sản Phẩm',
            children: product?.description || 'empty',
        },
        {
            key: '4',
            label: 'Trạng Thái',
            children: product?.status || 'empty',
        },
        {
            key: '5',
            label: 'Loại',
            children: product?.category?.name || 'empty',
        },
        {
            key: '6',
            label: 'Chất Liệu',
            children: product?.material?.name || 'empty',
        },
        {
            key: '7',
            label: 'Phong Cách',
            children: product?.style?.name || 'empty',
        },
        {
            key: '8',
            label: 'Thương Hiệu',
            children: product?.brand?.name || 'empty',
        },
        {
            key: '9',
            label: 'Tạo bởi',
            children: product?.createdBy || 'empty',
        },
        {
            key: '10',
            label: 'Ngày Tạo',
            children: product?.createdDate || 'empty',
        },

    ];

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
            axios.put(`http://localhost:8080/api/v1/productDetail/${key}`, {
                id: key,
                imageUrl: productDetail.img,
                quantity: row.quantity,
                price: row.price,
            })
                .then((response) => {
                    const { status, message, errCode } = response.data;
                    setHistoryProductDetails(response.data.data);
                    toast.success(message);
                    console.log(response.data);

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
    const columnsTable = [

        {
            title: '#',
            dataIndex: 'index', // Change 'index' to 'key'
            key: 'index',
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            key: 'barcode',
        },
        {
            title: 'Màu Sắc',
            dataIndex: 'color',
            key: 'color',
            render: (color) => (
                <Tag color={color.name}>{color.name}</Tag>
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
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
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
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
        {
            title: 'IMG',
            dataIndex: 'img',
            key: 'img',

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
                inputType: col.dataIndex === 'price' ? 'number' : col.dataIndex === 'quantity' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <div>
            <div>
                <Descriptions title="Thông Tin Sản Phẩm"
                    layout="inline"
                    items={lstInfoProduct}
                    column={4}
                />
            </div>


            <div>
                <Button type="primary" disabled={!hasSelected} loading={loading} onClick={dowloadBarcode}>
                    BarCode
                </Button>

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
            <ToastContainer />

        </div>

    );
}

export default ProductDetail;