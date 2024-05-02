import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, Input, Table, InputNumber, Select, Slider, Carousel, Space, Tag, Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { Empty } from 'antd';
import hexToColorName from '~/ultils/HexToColorName';
import { PlusOutlined, DeleteOutlined, RollbackOutlined, LoadingOutlined } from '@ant-design/icons';
import { fixMoney } from '~/ultils/fixMoney';


const columnsTable = [

    {
        title: '#',
        dataIndex: 'index', // Change 'index' to 'key'
        key: 'index',
        width: 50,
        render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
        title: 'Thông Tin Sản Phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 550,
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
        title: 'Mô Tả',
        dataIndex: 'description',
        key: 'description',
    },

];

function BillProductsBack({ bill,lstBillDetailsReturn }) {
    const [dataColumTable, setDataColumTable] = useState([]);

    useEffect(() => {
        console.log(lstBillDetailsReturn);
        fillDataColumTable(lstBillDetailsReturn)
    }, [bill,lstBillDetailsReturn])
    const fillDataColumTable = (data) => {
        console.log(data);
        const dataTable = data.map((data) => {
            return {
                key: data.id,
                id: data.id,
                code: data.productDetails.code,
                barcode: data.productDetails.barcode,
                imageUrl: data.productDetails.imageUrl,
                name: <>
                    <div className='flex items-start'>
                        <div className='mr-6'>
                        {data?.productDetails.imageUrl && (
                                <div className='relative'>

                                    <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '140px', height: '180px' }}>
                                        {data.productDetails.imageUrl.split("|").map((imageUrl, index) => (
                                            <img src={imageUrl} key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${index}`} />
                                        ))}
                                    </Carousel>
                                    {
                                        data?.promotionDetailsActive &&
                                        <div className='absolute top-0 right-0 pl-2 pr-2 flex  bg-yellow-400	'>
                                            <span className='text-red-600 text-[12px]'>-{data?.promotionDetailsActive?.promotion.value}%</span>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                        <div className='leading-10	'>
                            <div className='flex text-[16px]'>
                                <h4>{data.productDetails.product.name}</h4>
                                <div className='ml-2 font-medium'>
                                    [{hexToColorName(data.productDetails.color?.name)} - {data.productDetails.size.name}]
                                </div>
                            </div>
                            <div className='flex flex-col font-medium'>
                                {
                                    data?.promotionDetailsActive ? (
                                        <div className='flex flex-col'>
                                            <span className='text-red-600 text-[15px] '>
                                                {fixMoney(data.unitPrice)}

                                            </span>
                                            <span className='text-gray-400 line-through text-[13px] '>
                                                {fixMoney(data.productDetails.price)}

                                            </span>
                                        </div>
                                    ) : (
                                        <span className='text-red-600 text-[15px] '>
                                            {fixMoney(data.unitPrice)}
                                        </span>)
                                }

                            </div>
                            <div className='flex text-[14px] font-medium'>
                                x<span> {data.quantity}</span>
                            </div>
                        </div>
                    </div>
                </>,
                color: data.productDetails.color,
                size: data.productDetails.size,
                quantity: <span>{data.quantity}</span>,
                unitPrice: data.unitPrice,
                status: data.status,
                totalMoney: <>
                    <span className='text-red-600  font-medium'>{fixMoney(data.quantity * data.unitPrice)}</span>
                </>,
                description: data.description
            }
        })

        setDataColumTable(dataTable);

    }
    return (
        <>
            <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                <h4>Danh Sách Sản Phẩm Trả Hàng</h4>
            </div>
            <div>
                <Table
                    pagination={{
                        pageSize: 10,
                    }}
                    scroll={{
                        y: 500,
                    }}
                    dataSource={dataColumTable}
                    columns={columnsTable} />
            </div>
        </>
    );
}

export default BillProductsBack;