import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Modal, Popconfirm, Form } from 'antd';
import axios from 'axios';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
function Material() {
    const [form] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => (
                <React.Fragment key={index}>
                    <span>{index + 1}</span>
                </React.Fragment>
            ),
            align: 'center',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 400,
            align: 'center',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            align: 'center',
            render: (text, record, index) => (
                <React.Fragment key={index}>
                    <span> {dayjs(record.createdDate).format('DD-MM-YYYY')}</span>
                </React.Fragment>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (text, record, index) => (
                <React.Fragment key={index}>
                    <Button type="primary" onClick={() => showModal(record)}>
                        <FontAwesomeIcon icon={faPen} />
                    </Button>
                </React.Fragment>
            ),
        },
    ];


    const [dataColum, setDataColum] = useState([]);
    const [dataEntity, setDataEntity] = useState();
    const [valueInputAdd, setValueInputAdd] = useState(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/material');
            console.log(response.data);
            setDataColum(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array ensures the effect runs once when the component mounts




    const handleUpDate = () => {
        axios.put('http://localhost:8080/api/v1/material/' + dataEntity.id, dataEntity)
            .then(response => {

                console.log('Update data:', dataEntity);
                toast.success("Cập Nhật Thành Công");
                fetchData();
                setOpen(false);
                formUpdate.resetFields();

            })
            .catch(err => {
                toast.error(err.response.data.message);
                console.error(err)
            });

    };

    const handleDelete = (id) => {
        axios.delete('http://localhost:8080/api/v1/material/' + dataEntity.id)
            .then(response => {
                console.log('Update data:', dataEntity);
                toast.success("Xóa Thành Công");
                fetchData();
                console.log('Delete data with id:', id);
                setOpen(false);
            })
            .catch(err => {
                toast.error(err.response.data.message);
                console.error(err)
            });
    }
    const showModal = (data) => {
        console.log(data);
        setDataEntity(data)
        formUpdate.setFieldsValue({ value: data?.name });
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
        formUpdate.resetFields();

    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleInputChange = (e) => {
        // Update the dataEntity state when input changes
        setDataEntity({
            ...dataEntity,
            name: e.target.value,
        });
    };


    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };
    const handleOkAdd = () => {

        axios.post('http://localhost:8080/api/v1/material', {
            name: valueInputAdd
        })
            .then(response => {
                console.log('Thêm Mới Thành Công');
                toast.success(response.data.message);
                setValueInputAdd(null)
                fetchData();
                setIsModalOpenAdd(false);
                form.resetFields();

            })
            .catch(err => {
                toast.error(err.response.data.message);
                console.error(err)
            });
        console.log(valueInputAdd);
    };
    const handleCancelAdd = () => {
        setValueInputAdd(null)
        setIsModalOpenAdd(false);
        form.resetFields();

    };
    const filteredData = dataColum.filter(item => item && item.name && item.name.toLowerCase().includes(searchTerm.trim().toLowerCase()));

    return (
        <>
            <h3>Quản Lý Chất Liệu</h3>
            <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                <label>Tìm Kiếm</label>
                <Input className='mt-4 mb-4' type="text" placeholder='Nhập value cần tìm' onChange={(e) => handleSearch(e.target.value)} />
            </div>

            <div className='bg-white p-4 mt-4 mb-10 shadow-lg'>
                <div className='mb-4 flex justify-between	'>
                    <div className='text-[16px] font-semibold'>
                        Danh Sách
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button type="primary" onClick={showModalAdd}>
                            Thêm Mới
                        </Button>
                        <Modal title="Thêm Mới" open={isModalOpenAdd} footer={null} onCancel={handleCancelAdd}>
                            <div>
                                <Form form={form} onFinish={handleOkAdd}>
                                    <Form.Item
                                        name={['value']}
                                        label="Tên"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giá trị',
                                            },
                                        ]}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <Input
                                            type="text"
                                            name='value'
                                            placeholder='Nhập value'
                                            onChange={(e) => { setValueInputAdd(e.target.value) }}
                                        />
                                    </Form.Item>

                                    <div className='flex justify-end mt-10'>
                                        <Button onClick={handleCancelAdd}>
                                            Thoát
                                        </Button>
                                        <Button className='ml-4' type="primary" htmlType="submit">
                                            Lưu
                                        </Button>
                                    </div>

                                </Form>
                            </div>
                        </Modal>
                    </div>
                </div>
                <Table pagination={{
                    pageSize: 5,
                }} dataSource={filteredData} columns={columns} />
            </div>

            <Modal
                open={open}
                title="Sửa Chất Liệu"
                onOk={handleUpDate}
                onCancel={handleCancel}
                footer={null}
            >

                <div>
                    <Form form={formUpdate} onFinish={handleUpDate}>
                        <Form.Item
                            name='value'
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá trị',
                                },
                            ]}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}

                        >
                            <Input
                                // value={dataEntity?.name}

                                type="text"
                                placeholder='Nhập value'
                                onChange={handleInputChange}
                            />
                        </Form.Item>

                        <div className='flex justify-end mt-10'>

                            <Button key="ok" type="primary" htmlType="submit">
                                Cập Nhật
                            </Button>,
                            <Button key="cancel" className='ml-4' onClick={handleCancel}>
                                Thoát
                            </Button>,
                            <Popconfirm
                                title="Delete the task"
                                description="Bạn Có Chắc Muốn Xóa?"
                                onConfirm={() => handleDelete(dataEntity?.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger  className='ml-4'> <DeleteOutlined /> Xóa</Button>
                            </Popconfirm>
                        </div>

                    </Form>
                </div>

            </Modal>
            <ToastContainer />

        </>
    );
}

export default Material;
