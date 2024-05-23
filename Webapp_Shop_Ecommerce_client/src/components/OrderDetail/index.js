import React, { useState, } from 'react';
import { Table, Carousel, Button, Descriptions, Tag, Tooltip, Modal } from 'antd';
import hexToColorName from "~/ultils/HexToColorName";
import { fixMoney } from '~/ultils/fixMoney';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import { Scrollbar } from 'react-scrollbars-custom';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaBug, FaCheckCircle, FaRegFileAlt } from 'react-icons/fa';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
function OrderDetail({ bill }) {
    const TrangThaiBill = {
        TAT_CA: '',
        TAO_DON_HANG: "-1",
        CHO_XAC_NHAN: "0",
        DA_XAC_NHAN: "1",
        CHO_GIA0: "2",
        DANG_GIAO: "3",
        HOAN_THANH: "4",
        DA_THANH_TOAN: "5",
        HUY: "6",
        TRA_HANG: "10",
        DANG_BAN: "7",
        CHO_THANH_TOAN: "8",
        HOAN_TIEN: "9",
        NEW: "New",
    }

    const [isModalOpenTimelineDetails, setIsModalOpenTimelineDetails] = useState(false);

    return (
        <>
            <div>
                <div className='bg-white px-4 pt-6 pb-5 mt-6 mb-10 shadow-lg h-fit '>
                    <div className='mb-10'>
                        <h4 className='text-2xl'>Lịch Sử Đơn Hàng</h4>
                    </div>

                    <div>
                        <Timeline minEvents={10} placeholder>
                            <Scrollbar style={{ width: '100%', height: 220 }} >
                                <div className='flex'>
                                    {bill?.lstHistoryBill.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map((historyBill, index) => {
                                        return (
                                            <div key={index} style={{
                                                width: '225px',
                                            }}>
                                                <TimelineEvent
                                                    key={index}
                                                    color={historyBill?.type == TrangThaiBill.HOAN_THANH ? "#00c11d" : historyBill?.type == TrangThaiBill.HUY ? "#dc2020" : "#108ee9"}
                                                    icon={historyBill?.type == TrangThaiBill.HOAN_THANH ? FaCheckCircle : historyBill?.type == TrangThaiBill.HUY ? AiOutlineCloseCircle : FaRegFileAlt}
                                                    title=<h4 className='text-2xl	'>{historyBill?.type == "-1" ? "Tạo Đơn Hàng" :
                                                        historyBill?.type == TrangThaiBill.CHO_THANH_TOAN ? "Chờ Thanh Toán" :
                                                            historyBill?.type == TrangThaiBill.CHO_XAC_NHAN ? "Chờ Xác Nhận" :
                                                                historyBill?.type == TrangThaiBill.DA_XAC_NHAN ? "Đã Xác Nhận" :
                                                                    historyBill?.type == TrangThaiBill.CHO_GIA0 ? "Chờ Giao" :
                                                                        historyBill?.type == TrangThaiBill.DANG_GIAO ? "Đang Giao" :
                                                                            historyBill?.type == TrangThaiBill.DA_THANH_TOAN ? "Đã Thanh Toán" :
                                                                                historyBill?.type == TrangThaiBill.HOAN_THANH ? "Hoàn Thành" :
                                                                                    historyBill?.type == TrangThaiBill.HUY ? "Hủy" :
                                                                                        historyBill?.type == TrangThaiBill.HOAN_TIEN ? "Hoàn Tiền" :
                                                                                            historyBill?.type == TrangThaiBill.TRA_HANG ? "Trả Hàng" : "Khác"
                                                    }</h4>

                                                    subtitle=<span className='text-xl font-medium	'>
                                                        {dayjs(historyBill?.createdDate).format('YYYY-MM-DD HH:mm:ss')}
                                                    </span>
                                                />
                                            </div>

                                        );
                                    })}
                                </div>
                            </Scrollbar>

                        </Timeline>
                    </div>




                    <div className='flex justify-end	'>
                        <Modal title="Chi Tiết Lịch Sử Đơn Hàng" width={800} open={isModalOpenTimelineDetails} footer={null} onCancel={() => { setIsModalOpenTimelineDetails(false) }} >
                            <Table
                                pagination={{
                                    pageSize: 5,
                                }}
                                scroll={{
                                    y: 500,
                                }}
                                dataSource={
                                    bill?.lstHistoryBill.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map(history => {
                                        return {
                                            key: history.id,
                                            type: <>{
                                                history?.type == TrangThaiBill.TAO_DON_HANG ? <Tag color="#108ee9">Tạo Đơn Hàng</Tag> :
                                                    history?.type == TrangThaiBill.CHO_THANH_TOAN ? <Tag color="#108ee9">Chờ Thanh Toán</Tag> :
                                                        history?.type == TrangThaiBill.CHO_XAC_NHAN ? <Tag color="#108ee9">Chờ Xác Nhận</Tag> :
                                                            history?.type == TrangThaiBill.DA_XAC_NHAN ? <Tag color="#108ee9">Đã Xác Nhận</Tag> :
                                                                history?.type == TrangThaiBill.CHO_GIA0 ? <Tag color="#108ee9">Chờ Giao</Tag> :
                                                                    history?.type == TrangThaiBill.DANG_GIAO ? <Tag color="#108ee9">Đang Giao</Tag> :
                                                                        history?.type == TrangThaiBill.DA_THANH_TOAN ? <Tag color="#108ee9">Đã Thanh Toán</Tag> :
                                                                            history?.type == TrangThaiBill.HOAN_THANH ? <Tag color="#00c11d">Hoàn Thành</Tag> :
                                                                                history?.type == TrangThaiBill.HUY ? <Tag color="#dc2020">Hủy</Tag> :
                                                                                    history?.type == TrangThaiBill.HOAN_TIEN ? <Tag color="#108ee9">Hoàn Tiền</Tag> :
                                                                                        history?.type == TrangThaiBill.TRA_HANG ? <Tag color="#108ee9">Trả Hàng</Tag> : "Khác"
                                            }</>,
                                            createdDate: dayjs(history?.createdDate).format('YYYY-MM-DD HH:mm:ss'),
                                            createdBy: history.createdBy,
                                            description: history.description
                                        }
                                    })
                                } columns={[
                                    {
                                        title: 'Trạng Thái',
                                        dataIndex: 'type',
                                        key: 'type',
                                    },
                                    {
                                        title: 'Thời Gian',
                                        dataIndex: 'createdDate',
                                        key: 'createdDate',
                                    },
                                    {
                                        title: 'Người Chỉnh Sửa',
                                        dataIndex: 'createdBy',
                                        key: 'createdBy',
                                    },
                                    {
                                        title: 'Mô Tả',
                                        dataIndex: 'description',
                                        key: 'description',
                                    },
                                ]} />
                        </Modal>
                        <Button danger onClick={() => {
                            setIsModalOpenTimelineDetails(true)
                        }}>Chi Tiết</Button>
                    </div>
                </div>

                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
                    <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                        <div>
                            <h4 className='text-2xl'>Thông Tin Đơn Hàng - <span>{bill?.codeBill}</span></h4>
                        </div>

                    </div>

                    <div className='pt-4'>
                        <Descriptions>
                            <Descriptions.Item label={<span className='font-medium text-black'>Tên Người Nhận</span>}>{bill?.receiverName}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Số Điện Thoại</span>}>{bill?.receiverPhone}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Trạng Thái</span>}>
                                {
                                    bill?.status == TrangThaiBill.TAO_DON_HANG ? <Tag color="#108ee9">Tạo Đơn Hàng</Tag> :
                                        bill?.status == TrangThaiBill.CHO_THANH_TOAN ? <Tag color="#108ee9">Chờ Thanh Toán</Tag> :
                                            bill?.status == TrangThaiBill.CHO_XAC_NHAN ? <Tag color="#108ee9">Chờ Xác Nhận</Tag> :
                                                bill?.status == TrangThaiBill.DA_XAC_NHAN ? <Tag color="#108ee9">Đã Xác Nhận</Tag> :
                                                    bill?.status == TrangThaiBill.CHO_GIA0 ? <Tag color="#108ee9">Chờ Giao</Tag> :
                                                        bill?.status == TrangThaiBill.DANG_GIAO ? <Tag color="#108ee9">Đang Giao</Tag> :
                                                            bill?.status == TrangThaiBill.HOAN_THANH ? <Tag color="#00c11d">Hoàn Thành</Tag> :
                                                                bill?.status == TrangThaiBill.HUY ? <Tag color="#dc2020">Hủy</Tag> :
                                                                    bill?.status == TrangThaiBill.TRA_HANG ? <Tag color="#87d068">Trả Hàng</Tag> : "Khác"
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Địa Chỉ</span>}>{bill?.receiverDetails} {bill?.receiverCommune} {bill?.receiverDistrict} {bill?.receiverProvince}</Descriptions.Item>
                            <Descriptions.Item label={<span className='font-medium text-black'>Ghi Chú</span>}>{bill?.description}</Descriptions.Item>

                        </Descriptions>
                    </div>
                </div>
                <div className='bg-white p-4 mt-6 mb-10 shadow-lg '>
                    <div className='flex justify-between pb-4' style={{ borderBottom: '1px solid #cccccc' }}>
                        <div>
                            <h4 className='text-2xl'>Danh Sách Sản Phẩm</h4>
                        </div>


                    </div>

                    <div className='mt-4'>
                        {bill?.lstBillDetails.map((data, index) => (
                            <div key={index} className='flex items-center p-4' style={{
                                borderBottom: '1px solid rgb(225 225 225 / 74%)'
                            }}>

                                <div className='flex flex-start basis-1/2'> {/* Thêm key cho mỗi phần tử được tạo ra trong vòng lặp */}
                                    {data?.productDetails?.imageUrl && (
                                        <div className='relative'>
                                            <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '100px', height: '120px' }}>
                                                {data?.productDetails?.imageUrl.split("|").map((imageUrl, imgIndex) => ( // Thêm tham số imgIndex
                                                    <img src={imageUrl} key={imgIndex} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${imgIndex}`} />
                                                ))}
                                            </Carousel>
                                            {data?.promotionDetailsActive && (
                                                <div className='absolute top-0 right-0 pl-2 pr-2 flex bg-yellow-400'>
                                                    <span className='text-red-600 text-[12px]'>-{data?.promotionDetailsActive.promotion.value}%</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className='ml-4 text-2xl'>
                                        <h4 >{data.productDetails?.product?.name}</h4>
                                        <div className='text-xl flex items-center mt-4 font-medium'>
                                            <span>
                                                Màu Sắc:
                                            </span>
                                            <div className=' ml-2 flex items-center'>
                                                <Tooltip title={hexToColorName(data.productDetails.color?.name) + ' - ' + data.productDetails.color?.name} color={data.productDetails.color?.name} key={data.productDetails.color?.name}>
                                                    <div style={{ width: '20px', height: '20px', backgroundColor: data.productDetails.color?.name, border: '1px solid #ccc' }}></div>
                                                </Tooltip>
                                                <span className='ml-2'>- {hexToColorName(data.productDetails.color?.name)}</span>
                                            </div>
                                        </div>
                                        <div className='text-xl flex items-center mt-4 font-medium'>
                                            <span>
                                                Kích Cỡ:
                                            </span>
                                            <div className=' ml-2 flex items-center'>

                                                <span className='ml-2'>{data?.productDetails.size?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-2xl basis-1/4'>
                                    {
                                        data?.promotionDetailsActive ? (
                                            <div className='flex flex-col	'>
                                                <span className='line-through text-slate-500 text-xl	'>
                                                    {fixMoney(data?.productDetails.price)}
                                                </span>
                                                <span className='text-red-600	'>
                                                    {fixMoney(data.unitPrice)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className='text-red-600	'>
                                                {fixMoney(data.unitPrice)}
                                            </span>)
                                    }
                                </div>
                                <div className='basis-1/4'>
                                    <span className='text-2xl'>
                                        X{data.quantity}
                                    </span>
                                </div>
                                <div className='basis-1/4'>
                                    <span className='text-2xl text-red-600'>
                                        {fixMoney(data.unitPrice * data.quantity)}
                                    </span>
                                </div>
                            </div>

                        ))}
                    </div>

                </div>

                <div className='bg-white p-4 mt-6 mb-20 shadow-lg '>
                    <div className='flex justify-between'>
                        <div className='text-2xl leading-loose w-1/5'>

                        </div>

                        <div className='text-2xl leading-loose w-1/4'>
                            <div className='flex justify-between'>
                                <div>
                                    <div>Tiền Hàng:</div>
                                    <div>Giảm Giá:</div>
                                    <div>Phí Vận Chuyên:</div>
                                    <div>Tổng Tiền:</div>
                                </div>
                                <div className='font-medium text-end'>
                                    <div>{fixMoney(bill?.totalMoney)}</div>
                                    <div>{fixMoney(bill?.voucherMoney)}</div>
                                    <div>{fixMoney(bill?.shipMoney)}</div>
                                    <div className='text-rose-600	'>{fixMoney(bill?.intoMoney)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>);
}

export default OrderDetail;