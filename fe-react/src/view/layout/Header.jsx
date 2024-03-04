
import { Link } from "react-router-dom";
import styles from "./header.module.css"
import { FaUser } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbSearch } from "react-icons/tb";
import { Badge, Drawer } from "antd";
import { useState } from "react";

function Header() {
    const [openSearch, setOpenSearch] = useState(false)
    return (
        <>
            <Drawer
                title="Drawer with extra actions"
                placement={"top"}
                onClose={() => {
                    setOpenSearch(false)
                }}
                open={openSearch}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
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
                                    }} src="/logo.png" alt="logo" />
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
                                        marginLeft: "94px"
                                    }}>
                                        <Link to={"/"} >Trang chủ</Link>
                                    </li>
                                    <li className={styles.navContainer}>
                                        <Link to={"/catalog"}>Danh mục</Link>
                                    </li>
                                    <li className={styles.navContainer}>
                                        <Link to={"/catalog"}>Chính sách</Link>
                                    </li>
                                    <li className={styles.navContainer}>
                                        <Link to={"/catalog"}>Thành viên</Link>
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
                                <FaUser />
                                <span style={{
                                    letterSpacing: "0.5px",
                                    fontWeight: 500,
                                    lineHeight: "16px",
                                    marginLeft: "6px"
                                }}>Người dùng</span>
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
                                    marginLeft: "6px"
                                }}><TbSearch /></span>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <Badge count={5}>
                                    <span style={{
                                        fontSize: "20px",
                                        letterSpacing: "0.5px",
                                        fontWeight: 700,
                                        lineHeight: "16px",
                                        marginLeft: "6px"
                                    }}><Link to={"/cart"}>
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
