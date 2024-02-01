import { Link, useParams } from "react-router-dom";
import Header from "../layout/Header";
import SyncSlider from "./SyncSlider";
import Filter from "./Filter";
import { CiEdit } from "react-icons/ci";
import { MdOutlineLocalShipping } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import { LuBadgePercent } from "react-icons/lu";
import styles from "./productdetail.module.css"
import { useState } from "react";
import { fixMoney } from "../../extension/fixMoney";
import Footer from "../layout/Footer";

function ProductDetail() {
    const { id } = useParams();
    const [thuocTinh, setThuocTinh] = useState([
        {
            id: 1,
            css: "",
            maMau: "xanh"
        },
        {
            id: 2,
            css: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/455762/chip/goods_47_455762_chip.jpg",
            maMau: "đỏ"
        },
    ])

    const [size, setSize] = useState([
        {
            id: 1,
            sizeName: "XS"
        },
        {
            id: 2,
            sizeName: "S"
        },
    ])
    return (
        <>
            <Header />
            <div style={{
                marginTop: "99px",
                marginLeft: "auto",
                marginRight: "auto",
                paddingLeft: "115px",
                width: "1230px"
            }}>
                <div style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "1130px",
                    padding: "0 15px",
                    fontSize: "100%"
                }}>
                    <Filter />
                </div>
                <div style={{
                    padding: "40px 0 0",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "1130px",
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div style={{
                        width: "50%",
                        fontSize: "100%",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}>
                        <SyncSlider data={[
                            {
                                link: "https://product.hstatic.net/1000304367/product/7687-2_35cca76f7bfa4a1bbc5b6db896af177a_master.jpg"
                            },
                            {
                                link: "https://product.hstatic.net/1000304367/product/7687-2_35cca76f7bfa4a1bbc5b6db896af177a_master.jpg"
                            },
                            {
                                link: "https://product.hstatic.net/1000304367/product/7687-2_35cca76f7bfa4a1bbc5b6db896af177a_master.jpg"
                            },
                            {
                                link: "https://product.hstatic.net/1000304367/product/7687-2_35cca76f7bfa4a1bbc5b6db896af177a_master.jpg"
                            },
                            {
                                link: "https://product.hstatic.net/1000304367/product/7687-2_35cca76f7bfa4a1bbc5b6db896af177a_master.jpg"
                            },
                            {
                                link: "https://product.hstatic.net/1000304367/product/7687-2_35cca76f7bfa4a1bbc5b6db896af177a_master.jpg"
                            },
                        ]} />
                    </div>
                    <div style={{
                        width: "41%",
                        padding: "10px",
                    }}>
                        <div>
                            <h1 style={{
                                margin: 0,
                                color: "#555",
                                fontSize: "30px",
                                fontWeight: "initial"
                            }}>Lina Black Dress</h1>
                        </div>
                        <div style={{
                            fontSize: "25px",
                            margin: "8px 0"
                        }}>
                            <span style={{
                                color: "#555",
                                fontSize: "100%",
                                fontFamily: "sans-serif",
                            }}>{fixMoney(1000000)}</span>
                        </div>
                        <div style={{
                            fontSize: "100%"
                        }}>

                            <div style={{
                                fontFamily: "inherit",
                                fontSize: "17px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                color: "#555",
                                boxSizing: "border-box"


                            }}>
                                <div style={{
                                    fontSize: "100%",
                                    marginBottom: "10px"
                                }}>
                                    <span >Trả sau
                                        <span style={{
                                            background: "-webkit-linear-gradient(#06DECD, #744DEF)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}> {fixMoney(100000)} </span>x3 kỳ với ...<Link to="/">
                                            <img src="https://assets.fundiin.vn/merchant/logo_transparent.png" />
                                        </Link>
                                    </span>
                                </div>
                            </div>
                            <div className={styles.discountContainer} style={{
                                background: "linear-gradient(to right, #06DECD, #744DEF)",
                                padding: "3px 8px",
                                width: "370px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                fontSize: "17px",
                                color: "#ffffff"
                            }}>
                                <div style={{
                                    fontSize: "36px",
                                    marginRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    fontWeight: 500,
                                    lineHeight: "24px",
                                    WebkitTextSizeAdjust: "none",
                                    WebkitTapHighlightColor: "rgba(0,0,0,0)",
                                    fontFamily: "sans-serif"
                                }}><LuBadgePercent /></div>
                                <span>Giảm giá đến <strong style={{
                                    fontWeight: 600,
                                    color: "#FFFDC3"
                                }}>50%</strong> khi thanh toán qua Fudiin.
                                    <Link className={styles.hoverLink} style={{
                                        marginLeft: "7px",
                                    }} to={"/"}>xem thêm</Link></span>
                            </div>

                            <div className={styles.colorPicker}>
                                <div style={{
                                    marginBottom: "7px"
                                }}>
                                    <span style={{
                                        fontSize: "14px",
                                        letterSpacing: "0.02em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                    }}>Màu sắc</span>
                                </div>
                                <div className={styles.colorContainer}>
                                    {
                                        thuocTinh.map((item) => {
                                            return <>
                                                <div style={{
                                                    
                                                }} className={styles.colorBtn +" "+ styles.red}></div>
                                            </>
                                        })
                                    }
                                </div>
                            </div>


                            <div className={styles.sizePicker}>
                                <div style={{
                                    marginBottom: "7px"
                                }}>
                                    <span style={{
                                        fontSize: "14px",
                                        letterSpacing: "0.02em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                    }}>Kích thước</span>
                                </div>
                                <div style={{
                                    fontSize: "15px",
                                    fontWeight: 500,

                                }} className={styles.sizeContainer}>
                                    {
                                        size.map((item) => {
                                            return <>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }} className={styles.sizeBtn}>
                                                    {item.sizeName}
                                                </div>
                                            </>
                                        })
                                    }
                                </div>
                            </div>

                            <div style={{
                                display: "block",
                                justifyContent: "space-between",
                                alignItems: "center",

                            }}>
                                <button style={{
                                    border: "1px solid #4a4a4a",
                                    fontSize: "16px",
                                    fontWeight: "normal",
                                    boxShadow: "none",
                                    padding: "12px 30px",
                                    lineHeight: "22px",
                                    background: "#4a4a4a",
                                    color: "#fff",
                                    minWidth: "150px",
                                    letterSpacing: "1px",
                                    fontFamily: "sans-serif"
                                }}>Thêm vào giỏ</button>
                            </div>
                        </div>

                        <div>
                            <div className={styles.nav} style={{
                                display: "flex",
                                flexDirection: "row",
                                borderBottom: "none",
                                flexWrap: "nowrap",
                                whiteSpace: "nowrap",
                                overflow: "auto",
                                listStyle: "none",
                                margin: "20px 0"
                            }}>
                                <Link to={"/"}>dịch vụ</Link>
                                <Link to={"/"}>sản phẩm</Link>
                                <Link to={"/"}>bảo quản</Link>
                            </div>
                            <p style={{
                                marginBottom: "10px",
                                lineHeight: "15px",
                                color: "#555556",
                                fontSize: "100%",
                                WebkitTapHighlightColor: "rgba(0,0,0,0)",
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <div style={{
                                    marginRight: "5px"
                                }}>
                                    <MdOutlineLocalShipping />
                                </div>
                                <strong>Giao hàng trên toàn quốc</strong>
                            </p>
                            <p style={{
                                color: "#555556"
                            }}>
                                -<strong>
                                    <a style={{
                                        color: "#333333",
                                        textDecoration: "none",
                                        textTransform: "uppercase"
                                    }} href="/">
                                        <span> Miễn phí giao hàng </span>
                                    </a>
                                </strong>
                                cho đơn hàng từ {fixMoney(10000)}
                            </p>
                            <p style={{
                                color: "#555556"
                            }}>
                                - Áp dụng cho mọi đơn hàng tại <strong style={{
                                    fontWeight: "bold",
                                    color: "#555556"
                                }}>
                                    website ALICE.VN
                                </strong>
                            </p>
                            <p style={{
                                marginBottom: "10px",
                                lineHeight: "15px",
                                color: "#555556",
                                fontSize: "100%",
                                WebkitTapHighlightColor: "rgba(0,0,0,0)",
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <div style={{
                                    marginRight: "5px"
                                }}>
                                    <RiRefund2Line />
                                </div>
                                <strong>Đổi/Trả dễ dàng trong 3 ngày</strong>
                            </p>
                            <p style={{
                                color: "#555556"
                            }}>
                                Xem thêm tại <strong>
                                    <a style={{
                                        color: "#333333",
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        textTransform: "uppercase"
                                    }} href="/">
                                        <span>chính sách đổi trả</span>
                                    </a>
                                </strong>
                            </p>

                            <p style={{
                                marginBottom: "10px",
                                lineHeight: "15px",
                                color: "#555556",
                                fontSize: "100%",
                                WebkitTapHighlightColor: "rgba(0,0,0,0)",
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <div style={{
                                    marginRight: "5px"
                                }}>
                                    <CiEdit />
                                </div>

                                <strong>Muốn chỉnh sửa sản phẩm cho phù hợp sở thích của bạn?</strong>

                            </p>
                            <p>Xem thêm tại <a style={{
                                color: "#333333",
                                textDecoration: "none",
                                fontWeight: "bold",
                                textTransform: "uppercase"
                            }} href="/">
                                <span>dịch vụ chỉnh sửa quần áo</span>
                            </a> của OLV nhé!</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProductDetail;
