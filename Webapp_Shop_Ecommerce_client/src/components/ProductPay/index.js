import './ProductPay.css';
import React, { useState, useEffect, useContext } from 'react';
import { Button, Tooltip, Carousel, Space, Input, Select, ColorPicker } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fixMoney } from '~/ultils/fixMoney';
import hexToColorName from '~/ultils/HexToColorName';
import DataContext from "../../DataContext";

function ProductPay() {
    const navigate = useNavigate();
    const { data, dataLength, updateData, deleteData, dataCheckout, totalPrice } = useContext(DataContext);
    // useEffect(() => {
    //     if (dataCheckout.length == 0) {
    //         navigate('/cart');
    //     }
    // }, [dataCheckout])

    return (<>
    
        <div>
                <div >
                    <div
                        style={{
                            width: '100%',
                            backgroundColor: '#ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            fontSize: '16px',
                            paddingTop: '10px',
                            paddingBottom: '10px',


                        }}
                        className='shadow-md font-medium pl-4'
                    >
                        <div style={{ flex: '0.8', justifyContent: 'center' }}>Tên Sản Phẩm</div>
                        <div className='flex' style={{ flex: '0.35', justifyContent: 'center' }}>Đơn Giá</div>
                        <div className='flex' style={{ flex: '0.35', justifyContent: 'center' }}>Số Lượng</div>
                        <div className='flex' style={{ flex: '0.35', justifyContent: 'center' }}>Thành Tiền</div>
                    </div>
                    <div className='shadow-md' style={{
                        backgroundColor: 'white',
                        width: '100%',
                    }}>

                        {dataCheckout?.map((cartDetail) => (
                            <div key={cartDetail?.id} style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid rgb(223 223 223)',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                            }}>

                                <div style={{ flex: '0.8', display: 'flex', alignItems: 'start' }}>
                                    <div className='ml-10'>
                                        <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '100px', height: '140px' }}>
                                            {cartDetail?.productDetails?.imageUrl.split("|").map((imageUrl, index) => (
                                                <img src={imageUrl} key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${index}`} />
                                            ))}
                                        </Carousel>
                                    </div>
                                    <div className='ml-8'>
                                        <h4 style={{
                                            margin: '0px'
                                        }}> {cartDetail?.productDetails?.product.name}
                                        </h4>
                                        <div className=''>
                                            <div className='text-xl flex items-center mt-4 font-medium'>
                                                <span>
                                                    Màu Sắc:
                                                </span>
                                                <div className=' ml-2 flex items-center'>
                                                    <Tooltip title={hexToColorName(cartDetail?.productDetails?.color?.name) + ' - ' + cartDetail?.productDetails?.color?.name} color={cartDetail?.productDetails?.color?.name} key={cartDetail?.productDetails?.color?.name}>
                                                        <div style={{ width: '20px', height: '20px', backgroundColor: cartDetail?.productDetails.color?.name, border: '1px solid #ccc' }}></div>
                                                    </Tooltip>
                                                    <span className='ml-2'>- {hexToColorName(cartDetail?.productDetails?.color?.name)}</span>
                                                </div>
                                            </div>
                                            <div className='text-xl flex items-center mt-4 font-medium'>
                                                <span>
                                                    Kích Cỡ:
                                                </span>
                                                <div className=' ml-2 flex items-center'>

                                                    <span className='ml-2'>{cartDetail?.productDetails?.size?.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex' style={{ flex: '0.35', justifyContent: 'center' }}>
                                    <span>
                                        {
                                            cartDetail?.productDetails?.promotionDetailsActive ?
                                                <div className="flex items-center	">
                                                    <span className="text-gray-400	text-xl line-through font-medium">{fixMoney(cartDetail?.productDetails?.price)}</span>
                                                    <span className="ml-2 text-rose-500 text-2xl font-medium	">{
                                                        fixMoney(cartDetail?.productDetails.price -
                                                            (cartDetail?.productDetails?.price * cartDetail?.productDetails?.promotionDetailsActive?.promotion?.value / 100))}</span>
                                                </div> :
                                                <div>
                                                    <span className="text-rose-500 text-2xl font-medium	">{fixMoney(cartDetail.productDetails.price)}</span>
                                                </div>
                                        }
                                    </span>
                                </div>
                                <div className='flex' style={{ flex: '0.35', justifyContent: 'center' }}>
                                    <span className="text-2xl font-medium	">
                                        {cartDetail?.quantity}
                                    </span>
                                </div>
                                <div className='flex' style={{ flex: '0.35', justifyContent: 'center' }}>
                                    <span className="text-rose-500 text-2xl font-medium	">
                                        {fixMoney(cartDetail?.quantity*cartDetail?.price)}
                                    </span>
                                </div>
                            </div>
                        ))}


                    </div>
                    <div className='shadow-md flex justify-end	bg-white	p-4'>
                        <div>
                            Tổng số tiền
                            <span className='text-2xl'> ({dataCheckout.length} sản Phẩm): </span>
                            <span className="text-rose-500 text-3xl font-medium">{fixMoney(totalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>

    </>);
}

export default ProductPay;