import OrderDetail from "~/components/OrderDetail";
import LayoutProfile from "~/components/LayoutProfile";
import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Tabs, Button, Tag } from 'antd';
import { Link, useParams, useNavigate } from "react-router-dom";
function HistoryOrderDetail() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);

    const fetchDataBill = async () => {
        if (id == null) {
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/v2/bill/codeBill/' + id);
            setBill(response.data);
            console.log(response.data);
            console.log(response.data.lstBillDetails);
        } catch (error) {
            setBill(null)
            console.error(error);
        }
    }
    useEffect(() => {
        fetchDataBill();
    }, [id]);

    return (
        <>
            <LayoutProfile>
                <div className="mt-4 mb-4">
                    <Link to="/historyOrder">
                        <Button> Trở Lại</Button>
                    </Link>
                </div>
                <div >
                    <OrderDetail bill={bill}>

                    </OrderDetail>
                </div>


            </LayoutProfile>
        </>
    );
}

export default HistoryOrderDetail;