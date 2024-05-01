import { Pagination, Slider, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { fixMoney } from "~/extension/fixMoney";
import { Link } from "react-router-dom";
import { productApis } from "~/apis/Product";
import axios from "axios";
import { FilterOutlined } from '@ant-design/icons';
function HomeProduct() {

    const [page, setPage] = useState(1)
    const [lstData, setLstData] = useState([]);
    const [lstProduct, setLstProduct] = useState([]);
    const [lstCategory, setLstCategory] = useState([]);
    const [lstBrand, setLstBrand] = useState([]);
    const [lstMaterial, setLstMaterial] = useState([]);
    const [lstStyle, setLstStyle] = useState([]);

    const [valueCategory, setValueCategory] = useState([]);
    const [valueBrand, setValueBrand] = useState([]);
    const [valueMaterial, setValueMaterial] = useState([]);
    const [valueStyle, setValueStyle] = useState([]);

    const [inputValueMin, setInputValueMin] = useState(0);
    const [inputValueMax, setInputValueMax] = useState(10000000);
    const [priceRange, setPriceRange] = useState([0, inputValueMax]);

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
                setLstData(data)
                // const lstCategory = response.data.

            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/category')
            .then(response => {
                setLstCategory(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/brand')
            .then(response => {
                setLstBrand(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/material')
            .then(response => {
                setLstMaterial(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/style')
            .then(response => {
                setLstStyle(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (lstData.length > 0) {
            const highestPriceProduct = lstData.reduce((maxPriceProduct, currentProduct) => {
                return currentProduct.price > maxPriceProduct.price ? currentProduct : maxPriceProduct;
            }, lstData[0]);
            console.log(highestPriceProduct.price);
            setInputValueMax(highestPriceProduct.price);
        }
    }, [lstData])

    const filterProduct = () => {
        const filteredProducts = lstData.filter((product) => {

            if (valueCategory.length > 0 && !valueCategory.includes(product.category.id)) {
                return false;
            }

            if (valueBrand.length > 0 && !valueBrand.includes(product.category.id)) {
                return false;
            }

            if (valueMaterial.length > 0 && !valueMaterial.includes(product.category.id)) {
                return false;
            }
            if (valueStyle.length > 0 && !valueStyle.includes(product.category.id)) {
                return false;
            }

            // Lọc theo phạm vi giá
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }
            return true;
        });
        setLstProduct(filteredProducts)
    }

    useEffect(() => {
        filterProduct()
    }, [valueCategory, valueStyle, valueBrand, valueMaterial, priceRange])

    const onChangeCategory = (value) => {
        setValueCategory(value);
    };
    const [current, setCurrent] = useState(1);

    const onChange = (page) => {
        setCurrent(page);
    };

    const itemsPerPage = 2;

    // Lấy dữ liệu cho trang hiện tại
    const start = (current - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentProductList = lstProduct.slice(start, end);

    return (
        <>
            <div className="flex">
                <div className="w-2/12 p-4 mr-8">
                    <div>
                        <h3 className="font-normal	"><FilterOutlined className="mr-2"></FilterOutlined>Bộ lọc</h3>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-normal text-2xl	">Loại</h4>
                        <div>
                            <Checkbox.Group
                                style={{
                                    width: '100%',
                                }}
                                className="flex flex-col mt-2"
                                onChange={onChangeCategory}
                            >   {
                                    lstCategory?.map((category, index) => {
                                        return <Checkbox key={index} className="mt-1" value={category?.id}><span>{category?.name}</span></Checkbox>
                                    })
                                }

                            </Checkbox.Group>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-normal text-2xl	">Thương Hiệu</h4>
                        <div>
                            <Checkbox.Group
                                style={{
                                    width: '100%',
                                }}
                                className="flex flex-col mt-2"
                                onChange={(value) => {
                                    setValueBrand(value)
                                }}
                            >   {
                                    lstBrand?.map((entity, index) => {
                                        return <Checkbox key={index} className="mt-1" value={entity?.id}><span>{entity?.name}</span></Checkbox>
                                    })
                                }

                            </Checkbox.Group>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-normal text-2xl	">Chất Liệu</h4>
                        <div>
                            <Checkbox.Group
                                style={{
                                    width: '100%',
                                }}
                                className="flex flex-col mt-2"
                                onChange={(value) => {
                                    setValueMaterial(value)
                                }}
                            >   {
                                    lstMaterial?.map((entity, index) => {
                                        return <Checkbox key={index} className="mt-1" value={entity?.id}><span>{entity?.name}</span></Checkbox>
                                    })
                                }

                            </Checkbox.Group>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-normal text-2xl	">Phong Cách</h4>
                        <div>
                            <Checkbox.Group
                                style={{
                                    width: '100%',
                                }}
                                className="flex flex-col mt-2"
                                onChange={(value) => {
                                    setValueStyle(value)
                                }}
                            >   {
                                    lstStyle?.map((entity, index) => {
                                        return <Checkbox key={index} className="mt-1" value={entity?.id}><span>{entity?.name}</span></Checkbox>
                                    })
                                }

                            </Checkbox.Group>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-normal text-2xl	">Khoảng Giá</h4>
                        <div>
                            <Slider
                                className="w-full mt-4"
                                range
                                max={inputValueMax}
                                defaultValue={[inputValueMin, inputValueMax]} // Đặt giá trị mặc định
                                value={priceRange}
                                onChange={(value) => {
                                    setPriceRange(value)
                                }}
                            />
                        </div>
                    </div>

                </div>
                <div className="w-10/12">

                    <div className="w-12/12	grid grid-cols-4 gap-4">
                        {
                            currentProductList?.map((product, index) => {
                                return (
                                    <div key={index} className="ml-2 mr-2 mt-12">
                                        <Link to={"/product/" + product.id} style={{
                                            textDecoration: 'none',
                                            color: 'black'
                                        }}>
                                            <div className=" w-[240px] shadow-md rounded-md h-[420px]
                                        hover:shadow-2xl hover:bg-gray-100 transition duration-300 ease-in-out hover:scale-125
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
                    <div className="flex mt-20 justify-center">
                        <Pagination current={current} pageSize={itemsPerPage} onChange={onChange} total={lstProduct?.length} />
                    </div>
                </div>

            </div>

        </>
    );
}

export default HomeProduct;
