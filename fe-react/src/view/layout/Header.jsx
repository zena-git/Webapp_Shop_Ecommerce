
import { Link } from "react-router-dom";
import styles from "./header.module.css"
import { FaUser } from "react-icons/fa6";
function Header() {
    return (
        <>
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
                    margin: "0px 105px",
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
                            <div>
                                <img style={{
                                    width: "103px",
                                    height: "64px"
                                }} src="https://theme.hstatic.net/1000304367/1001071053/14/logo.png?v=952" alt="logo" />
                            </div>
                            <div>
                                <ul style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    listStyle: "none"
                                }}>
                                    <li className="">
                                        <Link to={"/user"}>Trang chủ</Link>
                                    </li>
                                    <li>
                                        <Link to={"/catalog"}>Danh mục</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row"
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <FaUser />
                                <span style={{
                                    letterSpacing: "0.5px",
                                    fontWeight: 700,
                                    lineHeight: "16px",
                                    marginLeft: "6px"
                                }}>Người dùng</span>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <FaUser />
                                <span style={{
                                    letterSpacing: "0.5px",
                                    fontWeight: 700,
                                    lineHeight: "16px",
                                    marginLeft: "6px"
                                }}>Người dùng</span>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <FaUser />
                                <span style={{
                                    letterSpacing: "0.5px",
                                    fontWeight: 700,
                                    lineHeight: "16px",
                                    marginLeft: "6px"
                                }}>Người dùng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Header;
