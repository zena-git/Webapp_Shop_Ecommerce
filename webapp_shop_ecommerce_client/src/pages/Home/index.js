import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { fixMoney } from "~/extension/fixMoney";
import { Link } from "react-router-dom";
import { Pagination } from 'antd';
import HomeProduct from "../Product";

function Home() {
    return (
        <>
            <div>
                <div >
                    <HomeProduct />
                    <div>
                    <div >
                        <h2 style={{
                            color: "#555556",
                            margin: "90px 0",
                            textAlign: "center",
                            fontSize: "37px",
                            fontWeight: 700,
                            lineHeight: 1.4,
                            textTransform: "uppercase"
                        }}>Bộ sưu tập</h2>
                        <div >
                            <div  >
                                <img style={{
                                    width: "100%",
                                    border: "none",
                                    height: "auto",
                                    maxWidth: "100%",
                                    verticalAlign: "middle"
                                }} src="https://theme.hstatic.net/1000304367/1001071053/14/bst_1_1mobile.jpg?v=1088" alt="" />
                                <Link>
                                    <button>XEM THÊM</button></Link>
                            </div>
                            <div >
                                <div>
                                    <img style={{
                                        height: "100%"
                                    }} src="https://theme.hstatic.net/1000304367/1001071053/14/bst_1_2.jpg?v=1088" alt="" />
                                    <Link>
                                        <button>XEM THÊM</button>
                                    </Link>
                                </div>
                                <div >
                                    <img style={{
                                        height: "100%"
                                    }} src="https://theme.hstatic.net/1000304367/1001071053/14/bst_1_3.jpg?v=1088" alt="" />
                                    <Link>
                                        <button>XEM THÊM</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                </div>
            </div>
        </>
    );
}

export default Home;
