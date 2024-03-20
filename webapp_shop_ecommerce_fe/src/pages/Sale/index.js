import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tabs } from 'antd';
import axios from 'axios';
import SaleProducts from '~/components/SaleProducts';
import AddressGress from '~/components/AddressDelivery';
import SaleCustomer from '~/components/SaleCustomer';
import SaleBuy from '~/components/SaleBuy';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSaleData } from '~/provider/SaleDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
function Sale() {
  const [activeKey, setActiveKeyBill] = useState();
  const [billNews, setBillNews] = useState();
  const newTabIndex = useRef(0);
  //provider
  const { isDelivery, setDataIdBill, lstBill, updateDataLstBill, updateDataProductDetails, customer, updateDataDataCart } = useSaleData();

  const fetchAddBillNew = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/counters');
      console.log(response.data);
      toast.success(response.data.message);
      updateDataLstBill();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  useEffect(() => {
    updateDataProductDetails()
  }, [])


  useEffect(() => {
    const lst = lstBill.map((billNews, index) => {
      return {
        id: billNews.id,
        key: billNews.id,
        label: `Hóa Đơn ${index + 1}`,
      }
    })
    setBillNews(lst);
    if (lst.length > 0) {
      setActiveKeyBill(lst[0].key);
      setDataIdBill(lst[0].key)
    }
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
    axios.delete('http://localhost:8080/api/v1/counters/' + id)
      .then(response => {
        toast.success(response.data.message);
        updateDataLstBill()
        updateDataProductDetails();
        updateDataDataCart();
      })
      .catch(error => {
        toast.error(error.response.data.message);
        console.error(error);
      });

  }

  return (
    <>

      <div className=''>
        <h4>
          Bán Hàng Tại Quầy
        </h4>
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
            <SaleProducts ></SaleProducts>
          </div>
        </div>

        <div>
          <SaleCustomer></SaleCustomer>
        </div>
        <div className='flex justify-between bg-white shadow-lg mt-20 p-4 mb-20 pt-6' style={{
          minHeight: '552px'
        }}>

          <div className='w-1/2' style={{
            visibility: isDelivery && customer !== null ? 'visible' : 'hidden',
          }} >
            <AddressGress></AddressGress>
          </div>
          <div className='w-2/5'>
            <SaleBuy></SaleBuy>
          </div>
        </div>
      </div>
      <ToastContainer />

    </>
  );
}

export default Sale;

