import { Col, Row } from "antd";
import Filter from "./Filter";
import { useState } from "react";
import { dataMock } from "../../extension/mock";
import { fixMoney } from "../../extension/fixMoney";
import { Link } from "react-router-dom";

function HomeProduct() {
    const [data, setData] = useState(dataMock())
    return (
        <>
            <div>
                <Filter />
            </div>
            <div style={{
                height: "200vh"
            }}>
                <Row style={{
                    marginTop: "12px"
                }}>
                    {data && data.map((item,index) => {
                        return <Col key={index} span={6} style={{
                            padding: "0 15px",
                            marginBottom: "24px",
                        }}>
                            <Link to={"/product/" + item.id}>
                                <img style={{
                                    width: "100%"
                                }} src={item.img1} alt="ss" />
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

            </div>
        </>
    );
}

export default HomeProduct;
