import { Link, useParams, useNavigate } from "react-router-dom";
import Filter from "../Product/Filter";
import { CiEdit } from "react-icons/ci";
import { PlusOutlined, HomeOutlined, MinusOutlined } from '@ant-design/icons';
import { MdOutlineLocalShipping } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import { LuBadgePercent } from "react-icons/lu";
import styles from "./ProductDetail.module.scss"
import './ProductDetail.scss'
import { useState, useEffect, useRef, useContext } from "react";
import { fixMoney } from "~/extension/fixMoney";
import { Rate, Radio, Tooltip, Button, Image, Breadcrumb, InputNumber } from 'antd'
import { productApis } from "~/apis/Product";
import DataContext from "~/DataContext";

import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import hexToColorName from '~/extension/HexToColorName'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetail() {


    const { id } = useParams();
    const navigate = useNavigate();
    const { data, buyCart, updateData, addGioHang } = useContext(DataContext);


    const [product, setProduct] = useState([])
    const [lstProductDetails, setLstProductDetails] = useState([])
    const [color, setColor] = useState([])
    const [size, setSize] = useState([])
    const [idColor, setIdColor] = useState(null);
    const [idSize, setIdSize] = useState(null);
    const [checkColor, setCheckColor] = useState(null);

    const [dataSlider, setDataSlider] = useState([]);
    const [nameProduct, setNameProduct] = useState("");
    const [quantityStock, setQuantityStock] = useState("1");
    const [priceProduct, setPriceProduct] = useState("0");
    const [priceDiscountProduct, setPriceDiscountProduct] = useState(null);
    const [isDiscountProduct, setIsDiscountProduct] = useState(false);

    const [productDetails, setProductDetails] = useState(null)
    const [quantityProduct, setQuantityProduct] = useState(1);

    async function handleGetProductDetails() {
        const data = await productApis.getProductOne(id);
        console.log(data.data);
        setProduct(data.data);
    }
    useEffect(() => {

        axios.get('http://localhost:8080/api/v2/product/' + id)
            .then(res => {
                console.log(res.data);
                const lstProductDetails = res.data;
                const imageUrl = lstProductDetails.map((img) => {
                    return img.imageUrl.split('|');
                })
                setNameProduct(res.data[0].product.name);
                setDataSlider(imageUrl.flat())
                const totalQuantity = lstProductDetails.reduce((accumulator, productDetail) => {
                    return accumulator + productDetail.quantity;
                }, 0);
                setQuantityStock(totalQuantity);
                const sortedProductDetails = [...lstProductDetails].sort((a, b) => a.price - b.price);
                if (sortedProductDetails[0].price == sortedProductDetails[sortedProductDetails.length - 1].price) {
                    setPriceProduct(fixMoney(sortedProductDetails[0].price))
                } else {
                    setPriceProduct(fixMoney(sortedProductDetails[0].price) + " - " + fixMoney(sortedProductDetails[sortedProductDetails.length - 1].price))
                }

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
                setLstProductDetails(lstProductDetails)

            })
            .catch(err => {
                console.log(err);
            })
    }, [id])



    const handleColorChange = (e) => {
        const selectedValue = e.target.value;
        setIdColor(selectedValue);
        const lstData = lstProductDetails.filter(product => {
            return product.color.id == selectedValue;
        })
        const lstImage = lstData.map(product => {
            return product.imageUrl.split('|');
        })
        setDataSlider(lstImage.flat())
        console.log(lstImage.flat());
        const lstSize = lstData.map(productDetails => {
            return productDetails.size;
        })
        setSize(lstSize);
    };

    const handleSizeChange = (e) => {
        const selectedValue = e.target.value;
        setIdSize(selectedValue);
        const lstData = lstProductDetails.filter(product => {
            return product.size.id == selectedValue;
        })

        const lstColor = lstData.map(productDetails => {
            return productDetails.color;
        })
        setColor(lstColor);
    };

    useEffect(() => {
        getProductDetail(idColor, idSize)

    }, [idColor, idSize])

    function getProductDetail(color, size) {
        if (size !== null && color !== null) {
            console.log(size);
            console.log(color);
            const filteredProductDetails = lstProductDetails.filter(productDetail => (
                productDetail.color.id == color && productDetail.size.id == size
            ))[0];
            console.log(filteredProductDetails);
            if (filteredProductDetails === undefined) {
                //lua 
                setQuantityStock("Sản Phẩm Hết Hàng")
                setProductDetails(null)
                return;
            }
            setProductDetails(filteredProductDetails);
            if (filteredProductDetails.promotionDetailsActive != null) {
                const promotionPrice = filteredProductDetails.price - (filteredProductDetails.price * filteredProductDetails.promotionDetailsActive.promotion.value / 100);
                setPriceProduct(fixMoney(promotionPrice))
            } else {
                setPriceProduct(fixMoney(filteredProductDetails.price))
            }
            if (filteredProductDetails.quantity == 0) {
                setQuantityStock("Sản Phẩm Hết Hàng")
            } else {
                setQuantityStock(filteredProductDetails.quantity)
            }
            setQuantityProduct(1)
        }

    }


    const handleAddGioHang = () => {

        if (productDetails == null) {
            toast.error("Vui lòng chọn sản phẩm")
            return;
        }

        const productCart = data.find(product => {
            return product.productDetails.id === productDetails.id
        })

        if (productCart?.quantity + quantityProduct > productDetails?.quantity) {
            toast.error("Bạn đã có " + productCart?.quantity + " sản phẩm trong giỏ hàng. Không thể thêm số lượng")
            setQuantityProduct(productDetails.quantity - productCart.quantity);
            return;
        }

        const productDetail = {
            productDetails: productDetails,
            quantity: quantityProduct
        }


        addGioHang(productDetail);

    }

    const handleBuyCart = () => {
        console.log(productDetails);

        if (productDetails == null) {
            toast.error("Vui lòng chọn sản phẩm")
            return;
        }
        const productCart = data.find(product => {
            return product.productDetails.id === productDetails.id
        })

        if (productCart) {
            if (productCart?.quantity + quantityProduct > productDetails?.quantity) {
                toast.error("Bạn đã có " + productCart?.quantity + " sản phẩm trong giỏ hàng. Không thể thêm số lượng")
                setQuantityProduct(productDetails.quantity - productCart.quantity);
                return;
            }
        }

        const productDetail = {
            productDetails: productDetails,
            quantity: quantityProduct
        }
        buyCart(productDetail)

    }

    const handleIncrease = () => {
        onChangeQuanTity(quantityProduct + 1); // Tăng giá trị và gọi hàm onChange của parent component
    };

    const handleDecrease = () => {
        if (quantityProduct == 1) {
            return;
        }
        onChangeQuanTity(quantityProduct - 1); // Giảm giá trị và gọi hàm onChange của parent component
    };
    const onChangeQuanTity = (value) => {

        if (productDetails == null) {
            toast.error("Vui lòng chọn sản phẩm")
            return;
        }


        const productCart = data.find(product => {
            return product.productDetails.id === productDetails.id
        })


        if (productCart) {
            if (productCart?.quantity + value > productDetails?.quantity) {
                toast.error("Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này")
                setQuantityProduct(productDetails.quantity - productCart.quantity);
                return;
            }
        }

        setQuantityProduct(value);
        // console.log(value);
    }
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    let sliderRef1 = useRef(null);
    let sliderRef2 = useRef(null);
    const settings1 = {
        asNavFor: sliderRef2.current,
        ref: sliderRef1,

    };
    const settings2 = {
        // Cấu hình cho slider nhỏ
        asNavFor: sliderRef1.current,
        ref: sliderRef2,
        slidesToShow: 4,
        swipeToSlide: true,
        focusOnSelect: true
    };
    return (
        <>
            <div>
                <div className="mb-4">
                    <Breadcrumb
                        items={[
                            {
                                href: '/',
                                title: <HomeOutlined />,
                            },
                            {
                                href: '',
                                title: (
                                    <>
                                        <span>Sản Phẩm</span>
                                    </>
                                ),
                            },

                        ]}
                    />
                </div>
                <div className="bg-white shadow-md p-4 pb-20">
                    <div className="flex mt-4 justify-center	">
                        <div className="w-5/12">
                            <Slider {...settings1}
                                className="slider_first"
                            >
                                {dataSlider.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <Image

                                                src={item} alt="item"
                                            />

                                        </div>
                                    );
                                })}
                            </Slider>
                            <Slider
                                {...settings2}
                                className="slider_second"
                            >
                                {dataSlider.map((item, index) => {
                                    return (
                                        <div key={index} className="slick-item">
                                            <img src={item} alt="" style={{ width: '25%' }} />
                                        </div>)
                                })}
                            </Slider>
                        </div>

                        <div className="ml-20 w-5/12">
                            <div className="">
                                <h3 className="text-4xl font-medium	">{nameProduct}</h3>
                            </div>
                            <div className="mt-2">
                                <Rate value={5} />
                            </div>
                            <div className="mt-4 flex flex-col">
                                {
                                    productDetails?.promotionDetailsActive &&
                                    <div className="flex">
                                        <span className="text-gray-400	text-3xl line-through">{fixMoney(productDetails.price)}</span>
                                        <div className="ml-32 bg-pink-500 py-1 px-2	 text-white text-xl font-medium rounded-md	">Giảm {productDetails?.promotionDetailsActive.promotion.value}% </div>
                                    </div>
                                }
                                <span className="mt-2 text-rose-500 text-4xl font-medium	">{priceProduct}</span>
                            </div>

                            <div>
                                <div className="mt-8 flex items-start	">
                                    <div className="w-2/12 mr-4">
                                        <span>Màu sắc</span>
                                    </div>
                                    <div >
                                        <Radio.Group size="large"
                                            onChange={handleColorChange}
                                        >
                                            {
                                                color.map((item, index) => {
                                                    return (
                                                        <Tooltip placement="top" color={item.name} title={item.name + "-" + hexToColorName(item.name)}>
                                                            <Radio.Button
                                                                style={{
                                                                    borderRadius: '0px',
                                                                    marginLeft: '4px',
                                                                    marginRight: '4px',
                                                                    minHeight: '20px',
                                                                    minWidth: '40px',
                                                                    padding: '2px',
                                                                }}
                                                                key={item.id}
                                                                value={item.id}
                                                            // disabled={productDetails?.color.id != item.id}
                                                            >
                                                                <div style={{
                                                                    backgroundColor: item.name,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                }}>

                                                                </div>

                                                                {/* {item.name} */}

                                                            </Radio.Button>
                                                        </Tooltip>

                                                    )
                                                })
                                            }
                                        </Radio.Group>

                                    </div>
                                </div>


                                <div className="mt-8 flex items-start	">
                                    <div className="w-2/12 mr-4">
                                        <span>Kích Thước</span>
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
                                                                minHeight: '20px',
                                                                minWidth: '40px',
                                                                // padding: '2px',

                                                            }}
                                                            key={item.id}
                                                            value={item.id}
                                                        >   {item.name}

                                                        </Radio.Button>
                                                    )
                                                })
                                            }
                                        </Radio.Group>

                                    </div>
                                </div>

                                <div className="mt-10 flex items-center	">
                                    <div className="w-2/12 mr-4">
                                        <span >Số lượng</span>
                                    </div>
                                    <div className="flex items-center	">
                                        <div className="flex ">
                                            <Button className="rounded-none" onClick={handleDecrease} icon={<MinusOutlined />} />
                                            <InputNumber className="text-center	rounded-none w-[70px]" controls={false} min={1} max={quantityStock} value={quantityProduct} onChange={onChangeQuanTity} />
                                            <Button className="rounded-none" onClick={handleIncrease} icon={<PlusOutlined />} />
                                        </div>


                                        <span className="ml-8">{quantityStock} sản phẩm có sẵn</span>
                                    </div>

                                </div>
                                <div className="mt-10 flex items-center">
                                    <Button className="flex items-center" style={{ fontSize: '16px', padding: '20px 26px' }} size='large' danger onClick={handleAddGioHang} > <PlusOutlined /><span className="ml-2">Thêm vào giỏ</span></Button>
                                    <Button className="flex items-center ml-4" style={{ fontSize: '16px', padding: '20px 26px' }} size='large' type="primary" onClick={handleBuyCart}>Mua Ngay</Button>
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
            </div>
            <ToastContainer />
        </>
    );
}

export default ProductDetail;
