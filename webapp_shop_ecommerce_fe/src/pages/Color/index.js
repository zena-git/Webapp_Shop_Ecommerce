import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Modal, Popconfirm, ColorPicker } from 'antd';
import axios from 'axios';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hexToColorName from "~/ultils/HexToColorName";

function Color() {
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
            render: (text, record, index) => (
                <React.Fragment key={index}>
                    <div className='flex items-center justify-center'>
                        <div style={{ width: '25px', height: '25px', backgroundColor: record.name, border: '1px solid #ccc' }}>
                        </div>
                        <div className='ml-2'>
                        <span className='ml-2'>{record.name} - {hexToColorName(record.name)}</span>
                        </div>
                    </div>
                </React.Fragment>
            ),
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            align: 'center',
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
    const [valueInputAdd, setValueInputAdd] = useState('#1677ff');
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/color');
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
        axios.put('http://localhost:8080/api/v1/color/' + dataEntity.id, dataEntity)
            .then(response => {

                console.log('Update data:', dataEntity);
                toast.success("Cập Nhật Thành Công");
                fetchData();
                setOpen(false);

            })
            .catch(err => {
                toast.error(err.response.data.message);
                console.error(err)
            });

    };

    const handleDelete = (id) => {
        axios.delete('http://localhost:8080/api/v1/color/' + dataEntity.id)
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
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleInputChange = (e) => {
        // Update the dataEntity state when input changes
        setDataEntity({
            ...dataEntity,
            name: e.toHexString(),
        });
    };


    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };
    const handleOkAdd = () => {

        axios.post('http://localhost:8080/api/v1/color', {
            name: valueInputAdd
        })
            .then(response => {
                console.log('Thêm Mới Thành Công');
                toast.success(response.data.message);
                setValueInputAdd(null)
                fetchData();

            })
            .catch(err => {
                toast.error(err.response.data.message);
                console.error(err)
            });
        console.log(valueInputAdd);
        setIsModalOpenAdd(false);
    };
    const handleCancelAdd = () => {
        setValueInputAdd(null)
        setIsModalOpenAdd(false);
    };
    const filteredData = dataColum.filter(item => item && item.name && item.name.toLowerCase().includes(searchTerm.trim().toLowerCase()));

    return (
        <>
            <h3>Quản Lý Màu Sắc</h3>
            <div className='bg-white p-4 mt-4'>
                <label>Tìm Kiếm</label>

                <Input className='mt-4 mb-4' type="text" placeholder='Nhập value cần tìm' onChange={(e) => handleSearch(e.target.value)} />
            </div>
            <div className='bg-white p-4 mt-6'>
                <div>
                    <h3>Danh Sách Màu Sắc</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button type="primary" onClick={showModalAdd}>
                        Thêm Mới
                    </Button>
                    <Modal title="Thêm Mới" open={isModalOpenAdd} onOk={handleOkAdd} onCancel={handleCancelAdd}>
                        <div>
                            <div>
                                <label>Màu Sắc</label>
                                <br ></br>
                                <div className='flex items-center'>
                                    <ColorPicker className='mt-4 mb-4' showText value={valueInputAdd}
                                        onChange={(e) => setValueInputAdd(e.toHexString())}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    <span className='ml-2'> - {hexToColorName(valueInputAdd)}</span>
                                </div>

                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
            <Table pagination={{
                pageSize: 5,
            }} dataSource={filteredData} columns={columns} />

            <Modal
                open={open}
                title="Sửa Màu Sắc"
                onOk={handleUpDate}
                onCancel={handleCancel}
                footer={[
                    <Button key="ok" type="primary" onClick={handleUpDate}>
                        Cập Nhật
                    </Button>,
                    <Button key="cancel" onClick={handleCancel}>
                        Thoát
                    </Button>,
                    <Popconfirm
                        title="Delete the task"
                        description="Bạn Có Chắc Muốn Xóa?"
                        onConfirm={() => handleDelete(dataEntity?.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger> <DeleteOutlined /> Xóa</Button>
                    </Popconfirm>
                    ,
                ]}
            >
                <div>
                    <label>Mày Sắc</label>
                    <br></br>
                    <div className='flex items-center'>

                        <ColorPicker className='mt-4 mb-4' showText value={dataEntity?.name}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                        <span className='ml-2'> - {hexToColorName(dataEntity?.name)}</span>
                    </div>

                </div>
            </Modal>
            <ToastContainer />

        </>
    );
}

export default Color;
