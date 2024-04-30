import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, Tag, Modal, Input, InputNumber, Button, Radio } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
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
function PaymentHistory({ bill, lstPaymentHistory, fetchDataBill }) {
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

  const [dataColumPaymentHistory, setDataColumPaymentHistory] = useState([]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [moneyReturn, setMoneyReturn] = useState(0);
  const [checkMoneyReturn, setCheckMoneyReturn] = useState(0);
  const [isModalOpenPayment, setIsModalOpenPayment] = useState(false);
  const [isModalOpenPaymentReturn, setIsModalOpenPaymentReturn] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState({
    type: "0",
    tradingCode: "",
    paymentAmount: "0",
    paymentMethod: "0",
    description: "",
    status: "0",
    refundsMoney: "0"
  });
  useEffect(() => {
    fillDataColumTable(lstPaymentHistory)
    const filterPayment = lstPaymentHistory?.filter(data => data?.type == "0");
    const filterPaymentReturn = lstPaymentHistory?.filter(data => data?.type == "1") || [];

    setCheckMoneyReturn(filterPaymentReturn?.length || 0)

    var totalPaymentReturn = filterPaymentReturn?.reduce(function (acc, cur) {
      return acc + cur.paymentAmount;
    }, 0);

    var totalPayment = filterPayment?.reduce(function (acc, cur) {
      return acc + cur.paymentAmount;
    }, 0);

    setAmountPaid(totalPayment - totalPaymentReturn)
  }, [lstPaymentHistory])

  useEffect(() => {
    if (bill?.status == TrangThaiBill.HUY) {
      setMoneyReturn(bill?.intoMoney);

    } else {
      setMoneyReturn(amountPaid - bill?.intoMoney);

    }
  }, [amountPaid, lstPaymentHistory])
  const fillDataColumTable = (data) => {
    const dataTable = data?.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).map(data => {
      return {
        key: data?.id,
        id: data?.id,
        index: data?.index,
        tradingCode: data?.tradingCode,
        paymentAmount: <>
          <span className="text-red-600 font-medium">{fixMoney(data.paymentAmount)}</span>
        </>,
        paymentMethod: <>
          <Tag color="#da7493"> {data.paymentMethod == "0" ? "Tiền mặt" : data.paymentMethod == "1" ? "Chuyển Khoản" : "Phương Thức Khác"}</Tag>
        </>,
        paymentDate: dayjs(data?.paymentDate).format('YYYY-MM-DD HH:mm:ss'),
        type: <>
          {data.type == "0" ? <Tag color="#da7493">Thanh Toán</Tag> : <Tag color="#c71010">Hoàn Tiền</Tag>}

        </>,
        description: data.description,
        createdBy: data.createdBy,
      }
    })
    setDataColumPaymentHistory(dataTable)
  }

  const handleConfigPaymentHistory = () => {
    if (paymentHistory?.paymentAmount <= 0) {
      toast.error("Số tiền thanh toán phải lớn hơn 0")
      return;
    }
    axios.post(` http://localhost:8080/api/v1/bill/${bill?.id}/payment`, paymentHistory)
      .then(response => {
        toast.success(response.data.message)
        fetchDataBill();
        setIsModalOpenPayment(false)
        setPaymentHistory({
          type: "0",
          tradingCode: "",
          paymentAmount: "0",
          paymentMethod: "0",
          description: "",
          status: "0",
          refundsMoney: "0"
        })
      })
      .catch(error => {
        toast.error(error.response.data.message)
      })
  }


  const handleConfigPaymentHistoryReturn = () => {
    var dataPayment = {
      ...paymentHistory,
      type: "1",
      paymentAmount: moneyReturn
    }
    if (moneyReturn <= 0) {
      toast.error("Số tiền hoàn tiền phải lớn hơn 0")
      return;
    }

    axios.post(` http://localhost:8080/api/v1/bill/${bill?.id}/payment`, dataPayment)
      .then(response => {
        toast.success(response.data.message)
        fetchDataBill();
        setIsModalOpenPaymentReturn(false)
        setPaymentHistory({
          type: "0",
          tradingCode: "",
          paymentAmount: "0",
          paymentMethod: "0",
          description: "",
          status: "0",
          refundsMoney: "0"
        })
      })
      .catch(error => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <>
      <div className='flex justify-between pb-4'>
        <h4>Lịch Sử Thanh Toán</h4>
        <div>
          <Modal title="Xác Nhận Thanh Toán" width={600} open={isModalOpenPayment} footer={null} onCancel={() => { setIsModalOpenPayment(false) }} >
            <div className='mt-4 mb-4'>
              <div className='flex justify-between mt-4'>
                <p>Số Tiền Cần Thanh Toán</p>
                <span className='text-rose-600	font-medium	'>{fixMoney(bill?.intoMoney - amountPaid)}</span>
              </div>
              <div className='mt-4'>
                <label>Tiền Khách Đưa</label>
                <div>
                  <InputNumber
                    className='mt-2 w-full'
                    min={1}
                    addonAfter="Vnđ"
                    controls={false}
                    // max={bill?.intoMoney - amountPaid}
                    placeholder="Nhập tiền khách trả" value={paymentHistory?.paymentMoney}
                    onChange={(value) => {
                      setPaymentHistory({
                        ...paymentHistory,
                        paymentMoney: value,
                        refundsAmount: value - (bill?.intoMoney - amountPaid),
                        missingAmount: bill?.intoMoney - amountPaid - value,
                        paymentAmount: bill?.intoMoney - amountPaid <= value ? bill?.intoMoney - amountPaid : value
                      })

                    }}
                  />
                </div>
              </div>
              <div className='mt-4'>
                <label>Tiền thừa: </label>
                <span className='text-rose-600	font-medium	'>{fixMoney(paymentHistory?.refundsAmount)}</span>
              </div>
              <div className='mt-4'>
                <label>Số tiền còn thiếu: </label>
                <span className='text-rose-600	font-medium	'>{fixMoney(paymentHistory?.missingAmount <= 0 ? 0 : paymentHistory?.missingAmount)}</span>
              </div>
              <div className='mt-4'>
                <label>Ghi Chú</label>
                <Input.TextArea className='mt-2' rows={5} placeholder='Ghi Chú' value={paymentHistory?.description}
                  onChange={(event) => {
                    setPaymentHistory({
                      ...paymentHistory,
                      description: event.target.value
                    })
                  }}
                />
              </div>
              <div className='mt-4'>
                <div>
                  <div className='mb-4'>Phương Thức Thanh Toán</div>
                  <Radio.Group value={paymentHistory?.paymentMethod} size="large" style={{ width: '100%' }} buttonStyle="solid" radioButtonStyle="none"
                    onChange={(e) => {
                      setPaymentHistory(
                        {
                          ...paymentHistory,
                          paymentMethod: e.target.value
                        }
                      )

                    }}>
                    <div className='flex justify-between'>
                      <Radio.Button className='text-center ' style={{ width: '48%' }} value="0"><FontAwesomeIcon icon={faMoneyBill1}></FontAwesomeIcon> <span className='ml-2'>Tiền Mặt</span> </Radio.Button>
                      <Radio.Button className='text-center' style={{ width: '48%' }} value="1"><FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon> <span className='ml-2'>Chuyển khoản</span> </Radio.Button>
                    </div>
                    {/* <Radio.Button className='text-center mt-4' style={{ width: '100%' }} value="2">Tiền Mặt & Chuyển khoản</Radio.Button> */}
                  </Radio.Group>
                </div>
                <div className='mt-4' style={{ visibility: paymentHistory && paymentHistory?.paymentMethod == "1" ? 'visible' : 'hidden' }}>
                  <Input
                    className='mt-2'
                    placeholder="Nhập Mã Giao Dịch"
                    value={paymentHistory.tradingCode}
                    onChange={(e) => {
                      setPaymentHistory({
                        ...paymentHistory,
                        tradingCode: e.target.value
                      });
                    }}
                  />
                </div>

              </div>
            </div>
            <div className='mt-14'>
              <div className='flex justify-end mt-4 gap-3'>
                <Button type='primary' onClick={handleConfigPaymentHistory} >Xác nhận</Button>
                <Button type='default' onClick={() => { setIsModalOpenPayment(false) }}>Hủy</Button>
              </div>
            </div>
          </Modal>

          {
            bill?.status != TrangThaiBill.CHO_XAC_NHAN && bill?.status != TrangThaiBill.HUY && amountPaid < bill?.intoMoney && <Button danger onClick={() => {
              setIsModalOpenPayment(true)
            }}>Xác Nhận Thanh Toán</Button>

          }
          <div>
            <Modal title="Xác Nhận Hoàn Tiền" width={600} open={isModalOpenPaymentReturn} footer={null} onCancel={() => { setIsModalOpenPaymentReturn(false) }} >
              <div className='mt-4 mb-4'>

                <div className='mt-4'>
                  <label>Số Tiền Hoàn</label>
                  <div>
                    <InputNumber
                      className='mt-2 w-full'
                      min={1}
                      addonAfter="Vnđ"
                      controls={false}
                      max={amountPaid}
                      placeholder="Nhập số tiền hoàn" value={moneyReturn}
                      onChange={(value) => {
                        setMoneyReturn(value);
                      }}
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <label>Ghi Chú</label>
                  <Input.TextArea className='mt-2' rows={5} placeholder='Ghi Chú' value={paymentHistory?.description}
                    onChange={(event) => {
                      setPaymentHistory({
                        ...paymentHistory,
                        description: event.target.value
                      })
                    }}
                  />
                </div>
                <div className='mt-4'>
                  <div>
                    <div className='mb-4'>Phương Thức Thanh Toán</div>
                    <Radio.Group value={paymentHistory?.paymentMethod} size="large" style={{ width: '100%' }} buttonStyle="solid" radioButtonStyle="none"
                      onChange={(e) => {
                        setPaymentHistory(
                          {
                            ...paymentHistory,
                            paymentMethod: e.target.value
                          }
                        )

                      }}>
                      <div className='flex justify-between'>
                        <Radio.Button className='text-center ' style={{ width: '48%' }} value="0"><FontAwesomeIcon icon={faMoneyBill1}></FontAwesomeIcon> <span className='ml-2'>Tiền Mặt</span> </Radio.Button>
                        <Radio.Button className='text-center' style={{ width: '48%' }} value="1"><FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon> <span className='ml-2'>Chuyển khoản</span> </Radio.Button>
                      </div>
                      {/* <Radio.Button className='text-center mt-4' style={{ width: '100%' }} value="2">Tiền Mặt & Chuyển khoản</Radio.Button> */}
                    </Radio.Group>
                  </div>
                  <div className='mt-4' style={{ visibility: paymentHistory && paymentHistory?.paymentMethod == "1" ? 'visible' : 'hidden' }}>
                    <Input
                      className='mt-2'
                      placeholder="Nhập Mã Giao Dịch"
                      value={paymentHistory.tradingCode}
                      onChange={(e) => {
                        setPaymentHistory({
                          ...paymentHistory,
                          tradingCode: e.target.value
                        });
                      }}
                    />
                  </div>

                </div>
              </div>
              <div className='mt-14'>
                <div className='flex justify-end mt-4 gap-3'>
                  <Button type='primary' onClick={handleConfigPaymentHistoryReturn} >Xác nhận</Button>
                  <Button type='default' onClick={() => { setIsModalOpenPaymentReturn(false) }}>Hủy</Button>
                </div>
              </div>
            </Modal>

            {
              bill?.status == TrangThaiBill.HUY && amountPaid >= bill?.intoMoney && <Button danger onClick={() => {
                setIsModalOpenPaymentReturn(true)
              }}>Hoàn Tiền</Button>
            }

            {
              bill?.status != TrangThaiBill.HUY && amountPaid > bill?.intoMoney && <Button danger onClick={() => {
                setIsModalOpenPaymentReturn(true)
              }}>Hoàn Tiền</Button>
            }
          </div>



        </div>



      </div>
      <div>

        <Table dataSource={dataColumPaymentHistory} columns={columns} />
      </div>
      <div className='mt-2 mb-2 flex justify-end	mr-4'>
        Số tiền đã thanh toán: <span className="text-rose-600 font-medium		">{fixMoney(amountPaid)}</span>
      </div>
    </>
  );
}

export default PaymentHistory;