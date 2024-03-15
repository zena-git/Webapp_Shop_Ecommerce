import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Tabs } from 'antd';
import axios from 'axios';
import SaleProducts from '~/components/SaleProducts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Sale() {
  const [activeKey, setActiveKeyBill] = useState();
  const [billNews, setBillNews] = useState();
  const newTabIndex = useRef(0);

  const fetchDataBillNew = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/counters');
      console.log(response.data);
      const lstBill = response.data.map((billNews, index) => {
        return {
          id: billNews.id,
          key: billNews.id,
          label: `HD ${billNews.id}`,
          children: <SaleProducts data={billNews}></SaleProducts>,
        }
      })

      setBillNews(lstBill);
      if (lstBill.length > 0) {
        setActiveKeyBill(lstBill[0].key);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const fetchAddBillNew = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/counters');
      console.log(response.data);
      toast.success(response.data.message);
      fetchDataBillNew();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };



  useEffect(() => {
    fetchDataBillNew();
  }, []);


  const onChange = (key) => {
    setActiveKeyBill(key);
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
      </div>
      <ToastContainer />

    </>
  );
}

export default Sale;

