import './layoutprofile.css';
import React, { useEffect, useContext } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { Link ,useNavigate} from 'react-router-dom';
import DataContext from '~/DataContext';
function LayoutProfile({ children }) {
    const { customer } = useContext(DataContext);
    const navigate = useNavigate();

    return (
        <>
            <div className='mt-8'>
                <div style={{
                    minHeight: '460px',
                }}>
                    <div className="box_layout">
                        <div className='box_layout-menu' >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                            }}>

                                <Avatar style={{
                                    marginRight: '20px'
                                }} size={54} icon={<UserOutlined />} />
                                <h4>{customer?.fullName}</h4>
                            </div>
                            <div className='layout_menu mt-4'>
                                <ul>
                                    <Link to="/profile"><li>Thông Tin Cá Nhân</li></Link>
                                    <Link to="/address"><li>Địa Chỉ</li></Link>
                                    <Link to="/historyOrder"><li>Đơn Mua</li></Link>
                                    <a onClick={() => {
                                        localStorage.removeItem("token")
                                        localStorage.removeItem("customer")
                                        navigate("/login")
                                    }}>
                                       <li>Đăng Xuất</li> 
                                    </a>
                                </ul>
                            </div>
                        </div>

                        <div className='box_layout-conten'>
                            {children}
                        </div>


                    </div>
                </div>

            </div>
        </>
    );
}

export default LayoutProfile;