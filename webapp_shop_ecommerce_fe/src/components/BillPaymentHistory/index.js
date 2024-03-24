import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Descriptions, Tag, Slider, Select, Tooltip, Space, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import hexToColorName from "~/ultils/HexToColorName";
import { useDebounce } from '~/hooks';
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
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Số Tiền',
    dataIndex: 'money',
    key: 'money',
  },


  {
    title: 'Thời Gian',
    dataIndex: 'time',
    key: 'time',
  },

  {
    title: 'Loại Giao Dịch',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Nhân Viên Xác Nhận',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'Ghi Chú',
    dataIndex: 'description',
    key: 'description',
  },
];
function PaymentHistory() {
  const [dataColumPaymentHistory, setDataColumPaymentHistory] = useState([]);


  return (
    <>
      <Table dataSource={dataColumPaymentHistory} columns={columns} />
    </>
  );
}

export default PaymentHistory;