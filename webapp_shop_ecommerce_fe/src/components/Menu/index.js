import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  TruckOutlined,
  ShoppingCartOutlined,
  LinkOutlined,
  MailOutlined,
  TeamOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Menu, Switch } from 'antd';

function getItem(label, key, icon, children, theme) {
  return {
    key,
    icon,
    children,
    label,
    theme
  };
}


const items = [
  getItem(<Link to="/">Thống Kê</Link>, '1', <MailOutlined />),
  getItem(<Link to="/sale">Quản Lý Bán Hàng</Link>, '2', <ShoppingCartOutlined />),
  getItem(<Link to="/order">Đơn Hàng</Link>, '15', <ShoppingCartOutlined />),
  getItem('Quản Lý Sản Phẩm', 'sub1', <AppstoreOutlined />, [
    getItem(<Link to="/product">Sản Phẩm</Link>, '3'),
    getItem('Thuộc Tính', 'sub1-2', null,
      [
        getItem(<Link to="/product/category">Loại</Link>, '4'),
        getItem(<Link to="/product/color">Màu Sắc</Link>, '5'),
        getItem(<Link to="/product/size">Kích Cỡ</Link>, '6'),
        getItem(<Link to="/product/material">Chất Liệu</Link>, '7'),
        getItem(<Link to="/product/style">Phong cách</Link>, '8'),
        getItem(<Link to="/product/brand">Thương Hiệu</Link>, '9'),
      ]),]),
  getItem('Quản Lý Tài Khoản', 'sub2', <TeamOutlined />, [
    getItem(<Link to="/user/staff">Nhân Viên</Link>, '10'),
    getItem(<Link to="/user/customer">Khách Hàng</Link>, '11')
  ]),
  getItem('Quản Lý Giảm Giá', 'sub2-3', <GiftOutlined />, [
    getItem(<Link to="/discount/voucher">Khuyến Mãi</Link>, '12'),
    getItem(<Link to="/discount/promotion">Khuyến Mại</Link>, '13')
  ]),
  getItem(<Link to="/">Trả Hàng</Link>, '14', <TruckOutlined />),
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
  return (<>
    {/* <Switch
      onChange={changeMode}
    /> */}
    <Menu

      defaultSelectedKeys={['1']}
      theme="light"
      mode="inline"
      items={items}
    >
    </Menu>
  </>);
}

export default MenuCustomer;