
import { Link } from "react-router-dom";
import styles from "./header.module.css"
import { FaUser } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbSearch } from "react-icons/tb";
import { Badge, Drawer } from "antd";
import { useState, useContext } from "react";
import { Button, Dropdown, Space, Input } from 'antd';
import DataContext from "../../DataContext";
import { AudioOutlined } from '@ant-design/icons';
const { Search } = Input;
function Header() {
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1677ff',
            }}
        />
    );
    const [openSearch, setOpenSearch] = useState(false)
    const { data, dataLength, isAccount } = useContext(DataContext);
    const items = [
        {
            key: '1',
            label: (<Link to="/profile">Thông Tin Cá Nhân</Link>),
        },
        {
            key: '2',
            label: (
                <Link to="/oder">Quản Lý Đơn Hàng</Link>),
        },
        {
            key: '3',
            label: (
                <Link to="/logout">Đăng Xuất</Link>
            ),
        },
    ];
    return (
        <>
            <Drawer style={{
                width: "1000px",
                height:"auto",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                boxShadow: "none"
            }}
                title={
                    <div style={{
                        borderBottom: "none"
                    }}>
                        <img src="/logoLolita.png" alt="Logo Lolita" style={{ width: "30%", height: "30%" }} />

                    </div>
                }
                placement={"top"}
                onClose={() => {
                    setOpenSearch(false)
                }}
                open={openSearch}
            >
                <Search
                    placeholder=" Bạn đang tìm kiếm sản phẩm nào?"
                    allowClear
                    onSearch={onSearch}
                    style={{
                        width: "95%",
                        height: "30px",
                        
                    }}
                />
            </Drawer>

            <div style={{
                height: "94px",
                position: "fixed",
                width: "100vw",
                top: 0,
                zIndex: "5",
                backgroundColor: "#ffffff",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"
            }}>
                <div style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "1200px",
                    padding: "0 15px",
                }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "94px",
                            justifyContent: "space-between"
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <div style={{
                                float: "left"

                            }}>
                                <a href="">
                                    <img style={{
                                        width: "103px",
                                        height: "64px"
                                    }} src="/logo.jpg" alt="logo" />
                                </a>
                            </div>
                            <div style={{

                            }}>
                                <ul style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    listStyle: "none"
                                }}>
                                    <li className={styles.navContainer} style={{
                                        marginLeft: "100px"
                                    }}>
                                        <Link to={"/"} >Trang chủ</Link>
                                    </li>
                                    <li className={styles.navContainer}>
                                        <Link to={"/catalog"}>Danh mục</Link>
                                    </li>
                                    <li className={styles.navContainer}>
                                        <Link to={"/catalog"}>Chính sách thành viên</Link>
                                    </li>
                                    <li className={styles.navContainer}>
                                        <Link to={"/catalog"}>Cửa hàng</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "0 15px"
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                marginRight: "28px"
                            }}>

                                {isAccount ? <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}
                                >
                                    <span style={{
                                        letterSpacing: "0.5px",
                                        fontWeight: 500,
                                        lineHeight: "16px",
                                        marginLeft: "6px",
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        color: "#555556"
                                    }}><FaUser style={{
                                        marginRight: "5px"
                                    }} /> Xin chào ? </span>
                                </Dropdown> :
                                    <Link to={"/profile"}>
                                        <span style={{
                                            letterSpacing: "0.5px",
                                            fontWeight: 500,
                                            lineHeight: "16px",
                                            marginLeft: "6px",
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}>Đăng nhập</span>
                                    </Link>
                                }


                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                marginRight: "28px"
                            }}>

                                <span onClick={() => {
                                    setOpenSearch(true)
                                }} style={{
                                    fontSize: "20px",
                                    letterSpacing: "0.5px",
                                    fontWeight: 700,
                                    lineHeight: "16px",
                                    marginLeft: "6px",
                                    marginTop: "5px",
                                    color: "#555556"
                                }}><TbSearch /></span>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "5px"

                            }}>
                                <Badge count={dataLength}>
                                    <span style={{
                                        fontSize: "20px",
                                        letterSpacing: "0.5px",
                                        fontWeight: 700,
                                        lineHeight: "16px",
                                        marginLeft: "6px",
                                    }}><Link to={"/cart"} style={{
                                        color: "#555556"
                                    }}>
                                            <AiOutlineShoppingCart /></Link></span>
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Header;
