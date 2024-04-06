import './layoutprofile.css';
import Footer from '../../view/layout/Footer';
import Header from "../../view/layout/Header";
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { Link } from 'react-router-dom';
function LayoutProfile({ children }) {
    return (
        <>  <Header />
            <div style={{
                marginTop: "99px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "1230px",
            }
            }>
                <div style={{
                    minHeight: '460px',
                    paddingTop: '10px'

                }}>
                    <div className="box_layout">
                        <div className='box_layout-menu'>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                            }}>

                                <Avatar style={{
                                    marginRight: '20px'
                                }} size={54} icon={<UserOutlined />} />
                                <h4>Name Profile</h4>
                            </div>
                            <div className='layout_menu'>
                                <ul>
                                    <li><Link to="/profile">Thông Tin Cá Nhân</Link></li>
                                    <li><Link to="/address">Địa Chỉ</Link></li>
                                    <li><Link to="/oder">Quản Lý Đơn Hàng</Link></li>
                                    <li><Link to="/logout">Đăng Xuất</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className='box_layout-conten'>
                                {children}
                        </div>
                

                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}

export default LayoutProfile;