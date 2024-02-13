import { Col, Row } from "antd";
import Filter from "./Filter";
import { useEffect, useState } from "react";
// import { dataMock } from "../../extension/mock";
import { fixMoney } from "../../extension/fixMoney";
import { Link } from "react-router-dom";
import { productApis } from "../../apis/Product";
import { Pagination } from 'antd';

function HomeProduct() {
    const [data, setData] = useState(undefined)
    const [size, setSize] = useState(12)
    const [page, setPage] = useState(1)

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
                        return <Col key={index} span={6} style={{
                            padding: "0 15px",
                            marginBottom: "24px",
                        }}>
                            <Link to={"/product/" + item.id}>
                                <img style={{
                                    width: "100%"
                                }} src={item.imageUrl} alt="" />
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
                                        }}>{fixMoney(item.price)}</p>
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

            </div>
        </>
    );
}

export default HomeProduct;
