import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, Tag, } from 'antd';

import { fixMoney } from '~/ultils/fixMoney';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const columns = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, index) => <span>{index + 1}</span>,
    with: '50px'
  },
  {
    title: 'Mã Giao Dịch',
    dataIndex: 'tradingCode',
    key: 'tradingCode',
  },
  {
    title: 'Số Tiền',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
  },


  {
    title: 'Thời Gian',
    dataIndex: 'paymentDate',
    key: 'paymentDate',
  },
  {
    title: 'Loại Giao Dịch',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Hình Thức',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  },
  {
    title: 'Nhân Viên Xác Nhận',
    dataIndex: 'createdBy',
    key: 'createdBy',
  },
  {
    title: 'Ghi Chú',
    dataIndex: 'description',
    key: 'description',
  },
];
function PaymentHistory({ bill, lstPaymentHistory }) {
  const [dataColumPaymentHistory, setDataColumPaymentHistory] = useState([]);
  useEffect(() => {
    fillDataColumTable(lstPaymentHistory)
  }, [lstPaymentHistory])
  const fillDataColumTable = (data) => {
    const dataTable = data?.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map(data => {
      return {
        key: data?.id,
        id: data?.id,
        index: data?.index,
        tradingCode: data?.tradingCode,
        paymentAmount: <>
          <span class="text-red-600">{fixMoney(data.paymentAmount)}</span>
        </>,
        paymentMethod: <>
          <Tag color="#da7493"> {data.paymentMethod == "0" ? "Tiền mặt" : data.paymentMethod == "1" ? "Chuyển Khoản" : "Phương Thức Khác"}</Tag>
        </>,
        paymentDate: dayjs(data?.paymentDate).format('YYYY-MM-DD HH:mm:ss'),
        type: <>
          <Tag color="#da7493"> {data.type == "0" ? "Thanh Toán" : "Hoàn Tiền"}</Tag>

        </>,
        description: data.description,
        createdBy: data.createdBy,
      }
    })
    setDataColumPaymentHistory(dataTable)
  }
  return (
    <>
      <Table dataSource={dataColumPaymentHistory} columns={columns} />
    </>
  );
}

export default PaymentHistory;