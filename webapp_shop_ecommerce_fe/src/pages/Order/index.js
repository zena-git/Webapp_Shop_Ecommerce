import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tabs, Table } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const tabItems = [
  {
    key: '-1',
    label: 'Tất Cả',
  },
  {
    key: '0',
    label: 'Chờ Xác Nhận',
  },
  {
    key: '1',
    label: 'Đã Xác Nhân',
  },
  {
    key: '2',
    label: 'Chờ Giao Hàng',
  },
  {
    key: '3',
    label: 'Đang Giao',
  },
  {
    key: '4',
    label: 'Đã Giao Hàng',
  },
  {
    key: '5',
    label: 'Hoàn Thành',
  },
  {
    key: '6',
    label: 'Hủy',
  },

];

const columnsTable = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    render: (text, record, index) => (
      <React.Fragment key={index}>
          <span>{index + 1}</span>
      </React.Fragment>
  ),
  },
  {
    title: 'Mã',
    dataIndex: 'codeBill',
    key: 'codeBill',
  },
  {
    title: 'Khách Hàng',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Số Điện Thoại',
    dataIndex: 'receiverPhone',
    key: 'receiverPhone',
  },

  {
    title: 'Tổng Tiền',
    dataIndex: 'intoMoney',
    key: 'intoMoney',
  },

  {
    title: 'Loại Đơn Hàng',
    dataIndex: 'billType',
    key: 'billType',
  },

  {
    title: 'Ngày Tạo',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },

  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];
function Order() {

  const [lstBill, setLstBill,customer] = useState([]);
  const [dataColumBill, setDataColumBill] = useState([]);
  const [status, setStatus] = useState('');

  const fetchDataBill = async () => {

    try {
      const response = await axios.get('http://localhost:8080/api/v1/bill',{
        params:{
          status:status
        }
      });
      console.log(response.data);
      setLstBill(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchDataBill()
  }, [status]);

  useEffect(() => {
    fillDataColumBill(lstBill);
  }, [lstBill]);
  const fillDataColumBill = (data) => {
    const dataTable = data.map(data => {
      return {
        codeBill: data.codeBill,
        customer: data.customer == null ? "Khách Lẻ" : data.customer.fullName,
        receiverPhone: data.receiverPhone,
        intoMoney: data.intoMoney,
        billType: data.billType,
        createdDate: data.createdDate,
        action: <Button>action</Button>,
      }
    });
    console.log(data);
    setDataColumBill(dataTable)

  }

  const onChange = (key) => {
    if (key == -1) {
      setStatus('')
    }else{
      setStatus(key);
    }
  };
  return (
    <>
      <div className='bg-white p-4'>
        <div>
          <h4>
            Danh Sách Hóa Đơn
          </h4>
        </div>
        <div>
          <Tabs defaultActiveKey="-1" items={tabItems} onChange={onChange} />
        </div>
        <div>
          <Table dataSource={dataColumBill} columns={columnsTable} />;
        </div>
      </div>
    </>
  );
}

export default Order;

