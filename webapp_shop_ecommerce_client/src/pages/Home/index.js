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
    const [lstTopSale, setLstTopSale] = useState([]);

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
                const currentDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                const startDateISO = startDate.toISOString();
                const endDateISO = currentDate.toISOString();
                axios.get(`http://localhost:8080/api/v1/statistical/top?startdate=${startDateISO}&enddate=${endDateISO}`).then(res => {
                    let t = [];
                    res.data.map(q => {
                        const x = data.find(pro => pro.id == q.id);
                        t.push(x);
                    })
                    setLstTopSale(t);
                })
                setLstProduct(data);
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
        pauseOnHover: true,
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
                            <div className="text-6xl font-sans font-bold text-gray-900 my-10">Sản phẩm nổi bật</div>
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
                    <div className="slider-container">
                        <div className="text-center	">
                            <div className="text-6xl font-sans font-bold text-gray-900 my-10">Sản phẩm bán chạy</div>
                        </div>
                        <div className="w-full flex justify-between	">
                            {
                                lstTopSale?.map((product, index) => {
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
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6 my-[8%]">
                <div></div>
                <div className="flex flex-col gap-4 text-center mr-8">
                    <img className="min-h-[240px] aspect-auto" src="/Layer 1.png" />
                    <p className="uppercase text-[25px] text-red-600 font-bold">Hotline hỗ trợ</p>
                    <p className="font-semibold text-[15px] text-slate-600">Liên hệ hotline: để nhận được tư vấn và hỗ trợ</p>
                </div>
                <div className="flex flex-col gap-4 text-center ml-8">
                    <img className="min-h-[240px] aspect-auto" src="/Layer 12.png" />
                    <p className="uppercase text-[25px] text-red-600 font-bold">Dễ dàng thanh toán</p>
                    <p className="font-semibold text-[15px] text-slate-600">Thanh toán tiền mặt khi nhận hàng, chuyển khoản VNPay,...</p>
                </div>
                <div></div>
            </div>
            <div className="text-center px-14 mt-[8%]">
                <p className="text-6xl font-sans font-bold text-slate-700 my-10 italic">Bộ sưu tập</p>
                <p className="font-sans text-slate-600 text-[18px] font-semibold">Lolita Alice luôn hướng đến xây dựng một hệ sinh thái thời trang có tính ứng dụng cao với đa dạng mẫu mã sản phẩm. Với mục tiêu ấy, Lolita Alice phát triển và cho ra mắt các bộ sưu tập với các màu sắc, kiểu dáng phù hợp với mọi phong cách, giúp chị em dễ dàng trong việc mix & match và tự tạo nên các phong cách thời trang riêng biệt, ấn tượng cho riêng mình.</p>

                <div className="w-full flex mt-[5%]">
                    <div className="w-2/3 px-10">
                        <img src="/sale.png" className="w-full" />
                    </div>
                    <div className="w-1/3 px-10 flex flex-col justify-between">
                        <img src="/sale.png" className="w-full" />
                        <img src="/sale.png" className="w-full" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
