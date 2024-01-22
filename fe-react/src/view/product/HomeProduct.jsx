import { Col, Row } from "antd";
import Filter from "./Filter";
import { useState } from "react";
import { dataMock } from "../../extension/mock";
import { fixMoney } from "../../extension/fixMoney";

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
                    {data && data.map((item) => {
                        return <Col span={6} style={{
                            padding: "0 15px",
                            marginBottom: "12px"
                        }}>
                            <img style={{
                                width: "100%"
                            }} src={item.img1} alt="ss" />
                            <p>{item.name}</p>
                            <p> {fixMoney(item.price)}</p>
                        </Col>
                    })}
                </Row>


            </div>
        </>
    );
}

export default HomeProduct;
