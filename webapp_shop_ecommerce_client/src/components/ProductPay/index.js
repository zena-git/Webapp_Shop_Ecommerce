import './ProductPay.css';
import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select ,ColorPicker} from 'antd';
import axios from "axios";
import DataContext from "../../DataContext";

function ProductPay() {

    const { data, dataLength, updateData, deleteData, dataCheckout } = useContext(DataContext);


    return (<>
        <div>
            <div >
                <div 
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '16px',
                        paddingTop: '10px',
                        backgroundColor: '#ccc',
                        paddingBottom: '10px',
                        marginTop: `20px`,

                    }}>

                    <div style={{ flex: '1', }}>Tên Sản Phẩm</div>
                    <div style={{ flex: '0.2',justifyContent: 'center' }}>Đơn Giá</div>
                    <div style={{ flex: '0.2',justifyContent: 'center' }}>Số Lượng</div>
                    <div style={{ flex: '0.2',justifyContent: 'center' }}>Thành Tiền</div>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    width: '100%',
                }}>

                    {dataCheckout.map((cartDetail) => (
                        <div key={cartDetail.id} style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #ccc',
                            paddingTop: '4px',
                        }}>

                            <div style={{ flex: '1', display: 'flex', alignItems: 'start' }}>
                                <div>
                                    <img
                                        style={{
                                            width: '100px',
                                            height: '100px'
                                        }}
                                        src="https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/212869555_903187000546897_616635507650364142_n.jpg?stp=dst-jpg_p320x320&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHUtaFAQzZIuqBM3YYvro7jpMC7lk7KZ2ykwLuWTspnbCAaW_NKg-IMain8k07U_ys&_nc_ohc=vyrY0myh2f4AX_0b_xe&_nc_ht=scontent-hkg4-1.xx&oh=00_AfDplaPAhr9NgzTwlsIBmcx0e4aSDoKZyOSrV2vG4QvYsA&oe=65ED0660">

                                    </img>
                                </div>
                                <div style={{
                                    marginLeft: '10px'

                                }}>
                                    <h4 style={{
                                        margin: '0px'
                                    }}> {cartDetail.productDetails.product.name}
                                    </h4>
                                    <span style={{display: 'flex', alignItems: 'center'}}>
                                        Phân loại: <ColorPicker style={{marginLeft: '10px', marginRight: '10px'}} disabled defaultValue={cartDetail.productDetails.color.name}/> - {cartDetail.productDetails.size.name}
                                    </span>
                                </div>

                            </div>
                            <div style={{ flex: '0.2',justifyContent: 'center' }}>
                                <span>
                                    {cartDetail.productDetails.price}
                                </span>
                            </div>
                            <div style={{ flex: '0.2',justifyContent: 'center' }}>
                                <span>
                                {cartDetail.quantity}
                                </span>
                            </div>
                            <div style={{ flex: '0.2',justifyContent: 'center' }}>
                                <span>
                                    {cartDetail.productDetails.price * cartDetail.quantity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </>);
}

export default ProductPay;