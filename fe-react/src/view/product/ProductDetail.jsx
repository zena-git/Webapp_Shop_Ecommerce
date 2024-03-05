import { Link, useParams ,useNavigate  } from "react-router-dom";
import Header from "../layout/Header";
import SyncSlider from "./SyncSlider";
import Filter from "./Filter";
import { CiEdit } from "react-icons/ci";
import { MdOutlineLocalShipping } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import { LuBadgePercent } from "react-icons/lu";
import styles from "./productdetail.module.css"
import { useState, useEffect } from "react";
import { fixMoney } from "../../extension/fixMoney";
import Footer from "../layout/Footer";
import { Rate, Radio, ColorPicker, InputNumber } from 'antd'
import { productApis } from "../../apis/Product";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState([])
    const [lstProductDetails, setLstProductDetails] = useState([])
    const [color, setColor] = useState([])
    const [size, setSize] = useState([])
    const [idColor, setIdColor] = useState(null);
    const [idSize, setIdSize] = useState(null);

    const [dataSlider, setDataSlider] = useState([]);
    const [nameProduct, setNameProduct] = useState("");
    const [quantityStock, setQuantityStock] = useState("1000000");
    const [pirceProduct, setPirceProduct] = useState("12132132312");

    const [productDetails, setProductDetails] = useState(null)
    const [quantityProduct, setQuantityProduct] = useState(1);

    async function handleGetProductDetails() {
        const data = await productApis.getProductOne(id);
        console.log(data.data);
        setProduct(data.data);
    }
    useEffect(() => {
        setDataSlider([
            {
                link: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/278750421_520083449794154_9054594305555576755_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=dd5e9f&_nc_eui2=AeGposli1yNK4cYkcrrQmIkjfdyIAQLZ0kx93IgBAtnSTPhSFrQ4u6FZoFzV6QGHFOw&_nc_ohc=qc64NkRD4yMAX_4wrjS&_nc_ht=scontent-hkg4-1.xx&oh=00_AfByTwiv0bx05Kof4jxQVfp1TW6tX652UV8O84zj5SjqEA&oe=65ECD683"
            },
            {
                link: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/212869555_903187000546897_616635507650364142_n.jpg?stp=dst-jpg_p320x320&_nc_cat=108&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeHUtaFAQzZIuqBM3YYvro7jpMC7lk7KZ2ykwLuWTspnbCAaW_NKg-IMain8k07U_ys&_nc_ohc=mYgv5QzMtA4AX_aFNpY&_nc_ht=scontent-hkg4-1.xx&oh=00_AfCJLZvmXl9xa1GDbsFmQyi01iSr3cdIWYQ3uLgoLLJDRg&oe=65ED0660"
            },

            {
                link: "https://product.hstatic.net/1000304367/product/7687-2_35cca76f7bfa4a1bbc5b6db896af177a_master.jpg"
            },
            {
                link: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/212869555_903187000546897_616635507650364142_n.jpg?stp=dst-jpg_p320x320&_nc_cat=108&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeHUtaFAQzZIuqBM3YYvro7jpMC7lk7KZ2ykwLuWTspnbCAaW_NKg-IMain8k07U_ys&_nc_ohc=mYgv5QzMtA4AX_aFNpY&_nc_ht=scontent-hkg4-1.xx&oh=00_AfCJLZvmXl9xa1GDbsFmQyi01iSr3cdIWYQ3uLgoLLJDRg&oe=65ED0660"
            }
        ])
        axios.get('http://localhost:8080/api/v2/product/' + id)
            .then(res => {
                setNameProduct(res.data.name);
                setPirceProduct(res.data.price);
                // fixMoney(1000000) 
                const lstProductDetails = res.data.lstProductDetails;
                setLstProductDetails(lstProductDetails)
                // console.log(lstProductDetails);

                const totalQuantity = lstProductDetails.reduce((accumulator, productDetail) => {
                    return accumulator + productDetail.quantity;
                }, 0);
                setQuantityStock(totalQuantity);

                const sortedProductDetails = [...lstProductDetails].sort((a, b) => a.price - b.price);
                setPirceProduct(fixMoney(sortedProductDetails[0].price) + " - " + fixMoney(sortedProductDetails[sortedProductDetails.length - 1].price))

                const img = lstProductDetails.map(product => {
                    return product.imageUrl;
                })

                const lstColor = lstProductDetails.map(product => product.color);
                const lstSize = lstProductDetails.map(product => product.size);
                const lstIdColor = lstProductDetails.map(product => product.color.id);
                const lstIdSize = lstProductDetails.map(product => product.size.id);

                // Loại bỏ giá trị trùng lặp từ mảng color
                const uniqueColors = [...new Set(lstIdColor)];
                const uniqueSizes = [...new Set(lstIdSize)];

                // Loại bỏ giá trị trùng lặp từ mảng lstColor
                const uniqueLstColor = uniqueColors.map(c => {
                    return lstColor.filter(cl => cl.id === c)[0]; // Sử dụng filter và lấy phần tử đầu tiên
                });
                const uniqueLstSize = uniqueSizes.map(c => {
                    return lstSize.filter(cl => cl.id === c)[0]; // Sử dụng filter và lấy phần tử đầu tiên
                });

                setColor(uniqueLstColor);
                setSize(uniqueLstSize);
            })
            .catch(err => {
                console.log(err);
            })




    }, [])



    const handleColorChange = (e) => {
        const selectedValue = e.target.value;
        setIdColor(selectedValue);
        // console.log(e.target.value);
    };

    const handleSizeChange = (e) => {
        const selectedValue = e.target.value;
        setIdSize(selectedValue);
        // console.log(e.target.value);
    };

    useEffect(() => {
        getProductDetail(idColor, idSize)

    }, [idColor, idSize])

    function getProductDetail(color, size) {
        if (idSize !== null && idColor !== null) {
            const filteredProductDetails = lstProductDetails.filter(productDetail => (
                productDetail.color.id == idColor && productDetail.size.id == idSize
            ))[0];
            console.log(filteredProductDetails);
            setProductDetails(filteredProductDetails);
            setPirceProduct(filteredProductDetails.price)
            setQuantityStock(filteredProductDetails.quantity)
            setQuantityProduct(1)
        }

    }


    const handleAddGioHang = () => {
        console.log(productDetails);
        const productDetail = {
            productDetail: productDetails.id,
            quantity: quantityProduct
        }
        axios.post('http://localhost:8080/api/v2/cart', productDetail)
            .then(res => {
                console.log(res.data);
                toast.success(res.data.message)
            })
            .catch(err => {
                console.log(err);
                toast.success(err.message)

            })

    }

    const handleBuyCart = () => {
        console.log(productDetails);

        if(productDetails == null){
            toast.error("Vui lòng chọn sản phẩm")
            return;
        }
        const productDetail = {
            productDetail: productDetails.id,
            quantity: quantityProduct
        }
        axios.post('http://localhost:8080/api/v2/cart', productDetail)
            .then(res => {
                console.log(res.data);
                navigate('/cart');
            })
            .catch(err => {
                console.log(err);
                toast.success(err.message)

            })

    }
    const onChangeQuanTity = (value) => {
        setQuantityProduct(value);
        console.log(value);
    }


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
                        <SyncSlider data={dataSlider} />
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
                            }}>{nameProduct}</h1>
                        </div>
                        <div style={{
                            marginTop: "10px",

                        }}>

                            <Rate value={5} />
                        </div>
                        <div style={{
                            fontSize: "25px",
                            margin: "8px 0"
                        }}>
                            <span style={{
                                color: "#555",
                                fontSize: "100%",
                                fontFamily: "sans-serif",
                            }}>Giá: {pirceProduct} </span>
                        </div>
                        <div>
                            <label>Số Lượng Tồn: {quantityStock}</label>
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
                                <div >
                                    <Radio.Group size="large"
                                        onChange={handleColorChange}
                                    >
                                        {
                                            color.map((item, index) => {
                                                return (
                                                    <Radio.Button
                                                        style={{
                                                            borderRadius: '0px',
                                                            marginLeft: '4px',
                                                            marginRight: '4px',
                                                        }}
                                                        key={item.id}
                                                        value={item.id}

                                                    >
                                                        {item.name}
                                                        {/* <ColorPicker disabled defaultValue={item.name} /> */}
                                                    </Radio.Button>
                                                )
                                            })
                                        }
                                    </Radio.Group>

                                </div>
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
                                    }}>Kích Thước</span>
                                </div>
                                <div >
                                    <Radio.Group size="large"
                                        onChange={handleSizeChange}
                                    >
                                        {
                                            size.map((item, index) => {
                                                return (
                                                    <Radio.Button
                                                        style={{
                                                            borderRadius: '0px',
                                                            marginLeft: '4px',
                                                            marginRight: '4px',
                                                        }}
                                                        key={item.id}
                                                        value={item.id}

                                                    >
                                                        {item.name}
                                                        {/* <ColorPicker disabled defaultValue={item.name} /> */}
                                                    </Radio.Button>
                                                )
                                            })
                                        }
                                    </Radio.Group>

                                </div>
                            </div>

                            <div className={styles.colorPicker}>
                                <div style={{
                                    marginBottom: "7px",
                                    display: 'flex',
                                    alignItems: "center",
                                }}>
                                    <span style={{
                                        fontSize: "14px",
                                        letterSpacing: "0.02em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        marginRight: "20px"
                                    }}>Số lượng</span>
                                    <InputNumber min={1} max={quantityStock} value={quantityProduct} onChange={onChangeQuanTity} />
                                </div>

                            </div>
                            <div style={{
                                display: "block",
                                justifyContent: "space-between",
                                alignItems: "center",

                            }}>
                                <button onClick={handleAddGioHang} style={{
                                    marginTop: "20px",
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
                                    fontFamily: "sans-serif",
                                    cursor: 'pointer',
                                }}>Thêm vào giỏ</button>

                                <button onClick={handleBuyCart} style={{
                                    marginTop: "20px",
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
                                    fontFamily: "sans-serif",
                                    cursor: 'pointer',
                                    marginLeft: "20px",
                                }}>Mua Ngay</button>
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
            <ToastContainer />
            <Footer />
        </>
    );
}

export default ProductDetail;
