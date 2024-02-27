import React, { useState } from 'react';
import {
  AppstoreOutlined,
  TruckOutlined,
  ShoppingCartOutlined,
  LinkOutlined,
  MailOutlined,
  TeamOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Divider, Menu, Switch } from 'antd';

function getItem(label, key, icon, children,theme) {
    return {
      key,
      icon,
      children,
      label,
      theme
    };
  }


  const items = [
    getItem('Thống Kê', '1', <MailOutlined />),
    getItem('Quản Lý Bán Hàng', '2',<ShoppingCartOutlined />),
    getItem('Quản Lý Sản Phẩm', 'sub1', <AppstoreOutlined />, [
      getItem('Sản Phẩm', '3'),
      getItem('Thuộc Tính', 'sub1-2', null, 
      [
        getItem('Loại', '4'), 
        getItem('Màu Sắc', '5'), 
        getItem('Kích Cỡ', '6'), 
        getItem('Chất Liệu', '7'), 
        getItem('Phong cách', '8'), 
        getItem('Thương Hiệu', '9'), 
      ]),]),
    getItem('Quản Lý Tài Khoản', 'sub2', <TeamOutlined />, [
      getItem('Nhân Viên', '10'),
      getItem('Khách Hàng', '11')
    ]),
    getItem('Quản Lý Giảm Giá', 'sub2-3', <GiftOutlined />, [
      getItem('Khuyến Mãi', '12'),
      getItem('Khuyến Mại', '13')
    ]),
    getItem('Trả Hàng', '14', <TruckOutlined />),
    getItem(
      <a href="/ant.design" target="_blank" rel="noopener noreferrer">
       Đăng Xuất
      </a>,
      'link',
      <LinkOutlined />,
    ),
  ];
  
function MenuCustomer() {

    const [mode, setMode] = useState('inline');
    const [theme, setTheme] = useState('light');
    const changeMode = (value) => {
      setMode(value ? 'vertical' : 'inline');
    };
    const changeTheme = (value) => {
      setTheme(value ? 'dark' : 'light');
    };
    return ( <>
    <Switch
        onChange={changeMode}
      />
      <Menu
        
        defaultSelectedKeys={['1']}
        mode={mode}
        theme={theme}
        items={items}
      >
      </Menu>
    </>);
}

export default MenuCustomer;