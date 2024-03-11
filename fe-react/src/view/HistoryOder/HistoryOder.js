
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import LayoutProfile from "../../component/LayoutProfile";
import { Tabs, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from "axios";


const columns = [
    {
        title: 'Mã Đơn Hàng',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Ngày Đặt',
        dataIndex: 'bookingDate',
        key: 'bookingDate',
    },
    {
        title: 'Thành Tiền',
        dataIndex: 'totalMoney',
        key: 'totalMoney',
    },
    {
        title: 'Trạng Thái',
        dataIndex: 'status',
        key: 'status',
    }, 
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
    },
];
function HistoryOder() {
    const [oderAll, setOderAll] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/bill')
            .then(response => {
                const lstBill = response.data.map(bill => {
                    return {
                        key: bill.id,
                        code: bill.code,
                        totalMoney: bill.totalMoney,
                        status: bill.status,
                        action: 'chi tiết | delete',
                    }
                })
                setOderAll(lstBill)
            })
            .catch(err => {

            })
    }, [])
    const onChange = (key) => {
        console.log(key);
    };
    const items = [
        {
            key: '1',
            label: 'Tất Cả',
            children: <Table dataSource={oderAll} columns={columns} />,
        },
        {
            key: '2',
            label: 'Đang Xử Lý',
            children: 'Content of Tab Pane 2',
        },
        {
            key: '3',
            label: 'Đang Vận Truyển',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '4',
            label: 'Hoàn Thành',
            children: 'Content of Tab Pane 4',
        },
        {
            key: '5',
            label: 'Đã Hủy',
            children: 'Content of Tab Pane 5',
        },
    ];
    return (<>

        <LayoutProfile>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </LayoutProfile>

    </>
    );
}

export default HistoryOder;