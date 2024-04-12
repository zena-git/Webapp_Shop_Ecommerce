/* eslint-disable jsx-a11y/alt-text */
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { fixMoney } from "~/extension/fixMoney";
import { Link } from "react-router-dom";
import { Pagination, Carousel } from 'antd';
import axios from "axios";
import Slider from "react-slick";
function Home() {
    const [lstData, setLstData] = useState([]);
    const [lstProduct, setLstProduct] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/product')
            .then(response => {
                const data = response.data.map(product => {
                    const sortedProductDetails = product.lstProductDetails.sort((a, b) => a.price - b.price);
                    const productPromotionActive = sortedProductDetails.find(product => {
                        return product.promotionDetailsActive != null;
                    });
                    const totalQuantity = sortedProductDetails.reduce((accumulator, productDetail) => {
                        return accumulator + productDetail.quantity;
                    }, 0);
                    return {
                        ...product,
                        promotionDetailsActive: productPromotionActive ? productPromotionActive.promotionDetailsActive : null,
                        price: productPromotionActive ? productPromotionActive.price : sortedProductDetails[0].price,
                        quantity: totalQuantity
                    };
                });
                console.log(data);

                setLstProduct(data)

            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
    };

    return (
        <>
            <div>

                <Carousel autoplay
                    autoplaySpeed={2400}
                    style={{
                        height: 500,
                    }}>
                    <div>
                        <img style={{
                            width: "100%",
                            maxWidth: "100%",
                            height: "500px",
                            objectFit: 'cover'

                        }} src="../slide/slide1.webp"></img>
                    </div>
                    <div>
                        <img style={{
                            width: "100%",
                            maxWidth: "100%",
                            height: "500px",
                            objectFit: 'cover'

                        }} src="../slide/slide2.webp"></img>
                    </div>
                    <div>
                        <img style={{
                            width: "100%",
                            maxWidth: "100%",
                            height: "500px",
                            objectFit: 'cover'

                        }} src="../slide/slide3.webp"></img>
                    </div>

                </Carousel>
                <div >

                    <div className="slider-container">
                        <div className="text-center	">
                            <div className="text-4xl font-bold text-gray-900 mb-4 mt-10">Sản phẩm nổi bật</div>
                        </div>
                        <Slider {...settings}>
                            {
                                lstProduct?.map((product, index) => {
                                    return (
                                        <div key={index} className="pb-8">
                                            <Link to={"/product/" + product.id} style={{
                                                textDecoration: 'none',
                                                color: 'black'
                                            }}>
                                                <div className=" w-[240px] shadow-md rounded-md h-[420px]
                                        hover:shadow-xl hover:bg-gray-100 transition duration-300 ease-in-out hover:scale-125
                                        ">
                                                    <div className="relative">
                                                        <img className="rounded-t-md" src={product.imageUrl} style={{ width: '100%', height: '320px', objectFit: 'cover' }} alt={`Image ${index}`} />

                                                        {
                                                            product?.promotionDetailsActive ? <div className="absolute top-0 right-0">
                                                                <span className="px-4 bg-rose-500 text-white text-2xl">- {product?.promotionDetailsActive?.promotion?.value}%</span>
                                                            </div> : <div></div>
                                                        }

                                                    </div>

                                                    <div className="px-6 py-4">
                                                        <div className="mt-2 h-[50px]">
                                                            <p className="overflow-wrap break-word font-medium	">{product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}</p>
                                                        </div>
                                                        <div className="flex justify-end	">

                                                            {
                                                                product?.promotionDetailsActive ?
                                                                    <div className="flex items-center	">
                                                                        <span className="text-gray-400	text-xl line-through font-medium">{fixMoney(product.price)}</span>
                                                                        <span className="ml-2 text-rose-500 text-2xl font-medium	">{
                                                                            fixMoney(product.price -
                                                                                (product.price * product.promotionDetailsActive.promotion.value / 100))}</span>
                                                                    </div> :
                                                                    <div>
                                                                        <span className="text-rose-500 text-2xl font-medium	">{fixMoney(product.price)}</span>
                                                                    </div>
                                                            }

                                                        </div>

                                                    </div>

                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
