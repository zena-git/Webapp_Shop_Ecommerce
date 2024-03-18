import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tabs } from 'antd';
import axios from 'axios';
import SaleProducts from '~/components/SaleProducts';
import AddressGress from '~/components/AddressGress';
import SaleCustomer from '~/components/SaleCustomer';
import SaleBuy from '~/components/SaleBuy';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSaleData } from '~/provider/SaleDataProvider';

function Sale() {
  const [activeKey, setActiveKeyBill] = useState();
  const [billNews, setBillNews] = useState();
  const newTabIndex = useRef(0);
  //provider
  const { isDelivery, setDataIdBill, lstBill, updateDataLstBill,updateDataProductDetails } = useSaleData();

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

  useEffect(() =>{
    updateDataProductDetails()
  },[])


  useEffect(() => {
    const lst = lstBill.map((billNews, index) => {
      return {
        id: billNews.id,
        key: billNews.id,
        label: `HD ${billNews.id}`,
      }
    })
    setBillNews(lst);
    if (lst.length > 0) {
      setActiveKeyBill(lst[0].key);
      setDataIdBill(lst[0].key)
    }
  }, [lstBill]);


  const onChange = (key) => {
    // console.log(key);
    setActiveKeyBill(key);
    setDataIdBill(key);
  };
  const add = () => {
    fetchAddBillNew()
  };
  const remove = (targetKey) => {
    const targetIndex = billNews.findIndex((pane) => pane.key === targetKey);
    const newPanes = billNews.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKeyBill(key);
    }
    setBillNews(newPanes);
  };
  const onEdit = (targetKey, action, event) => {
    console.log(event);
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };


  return (
    <>

      <div className='bg-white p-4'>
        <h4>
          Bán Hàng Tại Quầy
        </h4>
        <div>
          <div>
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={add}>ADD</Button>
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
        <div>
          <SaleCustomer></SaleCustomer>
        </div>
        <div className='flex justify-between'>

          <div className='w-1/2' style={{
            visibility: isDelivery ? 'visible' : 'hidden',
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

