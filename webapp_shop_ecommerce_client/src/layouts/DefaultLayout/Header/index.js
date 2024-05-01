
import { Link } from "react-router-dom";
import styles from "./header.module.css"
import { FaUser } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbSearch } from "react-icons/tb";
import { Badge, Drawer } from "antd";
import { useState, useContext, useCallback, useEffect } from "react";
import { Button, Dropdown, Space, Input } from 'antd';
import DataContext from "~/DataContext";
import { AudioOutlined } from '@ant-design/icons';
import axios from "axios";
import { fixMoney } from "~/extension/fixMoney";

const { Search } = Input;

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

function Header() {

    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const onSearch = (value, _e, info) => {
        console.log(value)
        setSearchValue(value);
    }

    const debouncedSearchValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (debouncedSearchValue.trim().length > 0) {
            axios.get(`http://localhost:8080/api/v3/search?keyword=${debouncedSearchValue}`)
                .then(res => {
                    setSearchResult(res.data);
                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            setSearchResult([])
        }
    }, [debouncedSearchValue]);

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
                <Link to="/historyOrder">Quản Lý Đơn Hàng</Link>),
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
                height: "auto",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                boxShadow: "none"
            }}
                title={
                    <div style={{
                        borderBottom: "none"
                    }}>
                        <img src="/logo.png" alt="Logo Lolita" style={{ width: "30%", height: "30%" }} />

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
                <div className="flex gap-4 mt-12 w-full overflow-x-auto">
                    {searchResult.map((product, index) => {
                        return <div key={index} className="pb-8">
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
                    })}
                </div>
            </Drawer>

            <div className="shadow-lg" style={{
                height: "94px",
                position: 'sticky',
                top: 0,
                zIndex: "5",
                backgroundColor: "#ffffff",
            }}>

                <div style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "1200px",
                    padding: "0 15px",
                }}>

                    <div className="flex justify-end pt-4">
                        <Link to="/orderTracking" className="no-underline text-black font-medium inline-block group">
                            <div className="text-2xl flex items-center group-hover:underline">
                                <TbSearch /><span className="ml-2">Tra Cứu Đơn Hàng</span>
                            </div>
                        </Link>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "60px",
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
                                        width: "140px",
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
                                        marginLeft: "100px"
                                    }}>
                                        <Link to={"/"} >Trang chủ</Link>
                                    </li>
                                    <li className={styles.navContainer}>
                                        <Link to={"/product"}>Sản Phẩm</Link>
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
                                    <Link style={{
                                        textDecoration: "none",
                                    }} to={"/login"}>
                                        <span style={{
                                            letterSpacing: "0.5px",
                                            fontWeight: 500,
                                            marginLeft: "6px",
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: "#555556",
                                            paddingTop: "10px",
                                            fontSize: "16px"

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
            </div>
        </>
    );
}

export default Header;
