import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tabs, Table, DatePicker, Radio, Input, Tag, Badge } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { useDebounce } from '~/hooks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fixMoney } from '~/ultils/fixMoney';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const TrangThaiBill = {
  TAT_CA: '',
  TAO_DON_HANG: "-1",
  CHO_XAC_NHAN: "0",
  DA_XAC_NHAN: "1",
  CHO_GIA0: "2",
  DANG_GIAO: "3",
  HOAN_THANH: "4",
  DA_THANH_TOAN: "5",
  HUY: "6",
  TRA_HANG: "10",
  DANG_BAN: "7",
  CHO_THANH_TOAN: "8",
  HOAN_TIEN: "9",
  NEW: "New",
}



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
function Bill() {

  const [lstBill, setLstBill] = useState([]);

  const [dataColumBill, setDataColumBill] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [billType, setBillType] = useState('');
  const [startDate, setStartDate] = useState('-1');
  const [endDate, setEndDate] = useState('-1');

  const debounceSearch = useDebounce(search.trim(), 500)
  const tabItems = [
    {
      key: '-1',
      label: <Badge count={lstBill?.length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Tất Cả</span>
      </Badge>,
    },
    {
      key: TrangThaiBill.CHO_XAC_NHAN,
      label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.CHO_XAC_NHAN).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Chờ Xác Nhận</span>
      </Badge>,
    },
    {
      key: TrangThaiBill.DA_XAC_NHAN,
      label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.DA_XAC_NHAN).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Đã Xác Nhận</span>
      </Badge>,
    },
    {
      key: TrangThaiBill.CHO_GIA0,
      label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.CHO_GIA0).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Chờ Giao</span>
      </Badge>,
    },
    {
      key: TrangThaiBill.DANG_GIAO,
      label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.DANG_GIAO).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Đang Giao</span>
      </Badge>,
    },
    // {
    //   key: '3',
    //   label: 'Đã Thanh Toán',
    // },
    {
      key: TrangThaiBill.HOAN_THANH,
      label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.HOAN_THANH).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Hoàn Thành</span>
      </Badge>,
    },
    {
      key: TrangThaiBill.HUY,
      label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.HUY).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Hủy</span>
      </Badge>,
    },
    {
      key: TrangThaiBill.CHO_THANH_TOAN,
      label: <Badge count={lstBill?.filter(bill => bill?.status == TrangThaiBill.CHO_THANH_TOAN).length} style={{ marginTop: '-4px', marginRight: '-4px' }}>
        <span>Chờ Thanh Toán</span>
      </Badge>,
    },


  ];


  const fetchDataBill = async () => {

    try {
      const response = await axios.get('http://localhost:8080/api/v1/bill'
        // , {
        //   params: {
        //     status: '',
        //     search: search,
        //     billType: billType,
        //     startDate: startDate,
        //     endDate: endDate,
        //   }
        // }
      );
      console.log(response.data);
      setLstBill(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("goi api bill");
      fetchDataBill();
    }, 30000); // 60000 milliseconds = 1 phút

    // Cleanup để tránh leak memory khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchDataBill();
  }, [status, billType, startDate, endDate, debounceSearch])

  useEffect(() => {
    const dataTable = lstBill?.filter(bill => {
      // Lọc theo tên ,phone
      if (debounceSearch &&
        !(bill?.codeBill?.toLowerCase().includes(debounceSearch.toLowerCase()) ||
          bill?.receiverPhone?.toLowerCase().includes(debounceSearch.toLowerCase()) ||
          bill?.customer?.fullName?.toLowerCase().includes(debounceSearch.toLowerCase())
        )) {
        return false;
      }

      if (status &&
        !(bill?.status?.toLowerCase().includes(status.toLowerCase()))) {
        return false;
      }

      if (billType &&
        !(bill?.billType?.toLowerCase().includes(billType.toLowerCase()))) {
        return false;
      }

      if (startDate != '-1' && endDate != '-1') {
        const billDate = new Date(bill?.createdDate); // Đảm bảo rằng thuộc tính 'createdDate' của bill là kiểu Date hoặc có thể chuyển đổi thành kiểu Date
        if (!(billDate >= startDate && billDate <= endDate)) {
          return false;
        }
      }

      return true;
    })

    fillDataColumBill(dataTable);
  }, [lstBill]);
  const fillDataColumBill = (data) => {
    const dataTable = data.map((data, index) => {
      return {
        key: index,
        codeBill: data.codeBill,
        customer: data.customer == null ? "Khách Lẻ" : data.customer.fullName,
        receiverPhone: data.receiverPhone,
        intoMoney: fixMoney(data.intoMoney),
        billType: <>
          {data.billType == "0" ? <Tag color="#2db7f5">Online</Tag> : <Tag color="#108ee9">Offline</Tag>}
        </>,
        createdDate: dayjs(data.createdDate).format('YYYY-MM-DD HH:mm:ss'),
        action: <Link to={`/bill/bill-detail/${data.id}`}> <span className='text-3xl '><FontAwesomeIcon icon={faEye}></FontAwesomeIcon> </span></Link>,
      }
    });
    // console.log(data);
    setDataColumBill(dataTable)
  }

  const onChange = (key) => {
    if (key == -1) {
      setStatus('')
    } else {
      setStatus(key);
    }
  };


  const rangePresets = [
    {
      label: 'Last 7 Days',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: 'Last 14 Days',
      value: [dayjs().add(-14, 'd'), dayjs()],
    },
    {
      label: 'Last 30 Days',
      value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
      label: 'Last 90 Days',
      value: [dayjs().add(-90, 'd'), dayjs()],
    },
  ];

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      // setStartDate(dates[0])
      // setEndDate(dates[1])
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

      const startOfDay = dayjs(dates[0]).startOf('day');
      const endOfDay = dayjs(dates[1]).endOf('day');
      setStartDate(startOfDay.toDate());
      setEndDate(endOfDay.toDate());
      console.log('From: ', startOfDay.format('YYYY-MM-DD HH:mm:ss'), ', to: ', endOfDay.format('YYYY-MM-DD HH:mm:ss'));
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      setStartDate("-1")
      setEndDate("-1")
      console.log('Clear');
    }
  };

  const handleRadioChange = (e) => {
    console.log(e.target.value);
    setBillType(e.target.value);
  }

  const handleInputSearch = (e) => {
    console.log(e.target.value);
    setSearch(e.target.value);
  }

  return (
    <>
      <div >
        <div>
          <h3>
            Quản Lý Đơn Hàng
          </h3>
        </div>
        <div className='bg-white p-4 mt-6 mb-10 shadow-lg pb-10'>
          <div className='mb-2'>
            <h4>
              Bộ Lọc
            </h4>
          </div>
          <div className='flex'>
            <div className='w-1/2 pl-10 pr-10 '>
              <div className='flex flex-col mt-4'>
                <Input placeholder="Nhập mã hóa đơn hoặc số điện thoại" prefix={<SearchOutlined />} value={search} onChange={handleInputSearch} />
              </div>
              <div className='flex flex-col mt-4'>
                <label>Ngày Tạo</label>
                <RangePicker className='mt-2' presets={rangePresets} onChange={onRangeChange} />
              </div>
            </div>
            <div className='w-1/2 pl-10 pr-10 grid grid-cols-1 content-between'>
              <div className=' mt-4 '>
                <Button>Export Excel</Button>
              </div>
              <div className=' mt-4 ml-4'>
                <label>Loại</label>
                <div className='mt-2'>
                  <Radio.Group defaultValue={""} onChange={handleRadioChange}>
                    <Radio value={""}>Tất Cả</Radio>
                    <Radio value={"0"}>Online</Radio>
                    <Radio value={"1"}>Offline</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>
          <div>

          </div>
        </div>

        <div className='bg-white p-4 mt-4 mb-20 shadow-lg'>
          <div className='mb-2'>
            <h4>
              Danh Sách Hóa Đơn
            </h4>
          </div>
          <div>
            <Tabs defaultActiveKey="-1" items={tabItems} onChange={onChange} />
          </div>
          <div>
            <Table dataSource={dataColumBill} columns={columnsTable} />
          </div>
        </div>

        <ToastContainer />
      </div>

    </>
  );
}

export default Bill;

