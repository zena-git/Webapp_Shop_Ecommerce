import { Col, Row } from "antd";
import Filter from "./Filter";
import { useEffect, useState } from "react";
// import { dataMock } from "../../extension/mock";
import { fixMoney } from "../../extension/fixMoney";
import { Link } from "react-router-dom";
import { productApis } from "../../apis/Product";
import { Pagination } from 'antd';
import styles from "./homeproduct.module.css"

function HomeProduct() {
    const [data, setData] = useState(undefined)
    const [size, setSize] = useState(12)
    const [page, setPage] = useState(1)
    // const [content, setContent] = useState("FPT Polytechnic - 2024 - AHIHI")
    async function handleGetProduct() {
        const data1 = await productApis.getProduct(page ? page - 1 : -1, size ? size : -1);
        setData(data1.data);
    }

    useEffect(() => {
        handleGetProduct();
    }, [size, page]);

    const onShowSizeChange = (current, pageSize) => {
        setPage(current)
    };

    // useEffect(() => {
    //     const i = setInterval(() => {
    //         setContent(content.substring(1, content.length) + content[0])
    //     }, 1000)
    //     return () => {
    //         clearInterval(i)
    //     }
    // }, [content])
    return (
        <>
            <div>
                <Filter />
            </div>
            <div style={{
            }}>
                <Row style={{
                    marginTop: "12px"
                }}>
                    {data && data.map((item, index) => {
                        const sortedProductDetails =item.lstProductDetails.sort((a, b) => a.price - b.price);
                        return <Col key={index} span={6} style={{
                            padding: "0 15px",
                            marginBottom: "24px",
                        }}>
                            <Link to={"/product/" + item.id}>
                                <img style={{
                                    width: "100%",
                                    minHeight: '380px',
                                    
                                }} src={item.imageUrl}  alt={item.name}/>
                                <div style={{
                                    marginTop: "0px"
                                }}>
                                    <h3 style={{
                                        textAlign: "center",
                                        fontWeight: 600,
                                        letterSpacing: "1px",
                                        fontSize: "100%",
                                        color: "#555556"
                                    }}>

                                        {item.name}</h3>
                                    <div>
                                        <p style={{
                                            textAlign: "center",
                                            letterSpacing: "1px",
                                            fontSize: "100%",
                                            color: "#555556"
                                        }}>{fixMoney(sortedProductDetails[0].price) + " - " + fixMoney(sortedProductDetails[sortedProductDetails.length - 1].price)}</p>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    })}
                </Row>
                <Pagination style={{
                    display: "flex",
                    justifyContent: "center"
                }}
                    onChange={onShowSizeChange}
                    defaultCurrent={1}
                    total={20}
                />
                <div>
                    <div className={styles.container}>
                        <h2 style={{
                            color: "#555556",
                            margin: "90px 0",
                            textAlign: "center",
                            fontSize: "37px",
                            fontWeight: 700,
                            lineHeight: 1.4,
                            textTransform: "uppercase"
                        }}>Bộ sưu tập</h2>
                        <div className={styles.clearFixRow}>
                            <div className={styles.checkout1} >
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
                            <div className={styles.checkout2}>
                                <div className={styles.collection}>
                                    <img style={{
                                        height: "100%"
                                    }} src="https://theme.hstatic.net/1000304367/1001071053/14/bst_1_2.jpg?v=1088" alt="" />
                                    <Link>
                                        <button>XEM THÊM</button>
                                    </Link>
                                </div>
                                <div className={styles.collection}>
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
                {/* <div style={{
                    backgroundColor: "red",
                    height: "40px",
                    width: "100%",
                    color: "#ffffff"
                }}>{content}</div> */}
            </div>
        </>
    );
}

export default HomeProduct;
