import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tabs } from 'antd';
import OrderProducts from '~/components/OrderProducts';
import AddressGress from '~/components/AddressDelivery';
import OrderCustomer from '~/components/OrderCustomer';
import OrderBuy from '~/components/OrderBuy';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOrderData } from '~/provider/OrderDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import AxiosIns from '../../lib/auth'

function Order() {
  const [activeKey, setActiveKeyBill] = useState();
  const [billNews, setBillNews] = useState();
  const [checkBill, setCheckBill] = useState(false);
  const newTabIndex = useRef(0);
  //provider
  const { isDelivery, setDataIdBill, lstBill, updateDataLstBill, updateDataProductDetails, customer, updateDataDataCart } = useOrderData();

  const fetchAddBillNew = async () => {
    try {
      const response = await AxiosIns.post('v1/counters');
      console.log(response.data);
      toast.success(response.data.message);
      updateDataLstBill();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  useEffect(() => {
    updateDataLstBill()
    updateDataProductDetails()
    updateDataDataCart();
    
  }, [])

  useEffect(() => {
      if (lstBill.length == 0 && checkBill) {
          fetchAddBillNew()
          setCheckBill(false)
      }else{
        setCheckBill(true)
      }
  }, [lstBill])
  useEffect(() => {

    const lst = lstBill.map((billNews, index) => {
      return {
        id: billNews.id,
        key: billNews.id,
        label: `Hóa Đơn ${index + 1}`,
      }
    })
    if (lst.length > 0) {
      setActiveKeyBill(lst[0].key);
      setDataIdBill(lst[0].key)
    }else{
      setDataIdBill(null)
      setActiveKeyBill(null);
      
    }
    setBillNews(lst);
   
  }, [lstBill]);

  const onChange = (key, label) => {
    console.log(label);
    setActiveKeyBill(key);
    setDataIdBill(key);
  };
  const add = () => {
    fetchAddBillNew()
  };
  const onEdit = (targetKey, action, event) => {
    console.log(event);
    console.log(action);
    if (action === 'add') {
      add();
    }
    if (action === 'remove') {
      handleDeleteBill(targetKey)
      console.log(targetKey);
    }
  };


  const handleDeleteBill = (id) => {



    AxiosIns.delete('v1/counters/' + id)
      .then(response => {
        toast.success(response.data.message);
        updateDataLstBill()
        updateDataProductDetails();
        // updateDataDataCart();

        // if (lstBill.length == 1) {
        //   fetchAddBillNew();
        // }
      })
      .catch(error => {
        toast.error(error.response.data.message);
        console.error(error);
      })


  }

  return (
    <>

      <div className=''>
        <h3>
          Bán Hàng Tại Quầy
        </h3>
        <div className='mt-6 bg-white p-4 shadow-lg'>
          <div >
            <div>
              <div className='mb-4'>
                <Button type='primary' onClick={add}><FontAwesomeIcon icon={faPlus} /> <span className='ml-2'>Tạo Hóa Đơn</span> </Button>
              </div>
              <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={billNews}
              >

              </Tabs>
            </div>
          </div>
          <div>
            <OrderProducts ></OrderProducts>
          </div>
        </div>

        <div>
          <OrderCustomer></OrderCustomer>
        </div>
        <div className='flex justify-between bg-white shadow-lg mt-20 p-4 mb-20 pt-6' style={{
          minHeight: '580px'
        }}>

          <div className='w-1/2' style={{
            visibility: isDelivery && customer !== null ? 'visible' : 'hidden',
          }} >
            <AddressGress></AddressGress>
          </div>
          <div className='w-2/5'>
            <OrderBuy fetchAddBillNew={fetchAddBillNew}></OrderBuy>
          </div>
        </div>
      </div>
      <ToastContainer />

    </>
  );
}

export default Order;

