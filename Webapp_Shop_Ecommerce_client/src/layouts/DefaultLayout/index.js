import { Layout, Button, Badge, Avatar } from 'antd';
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import Footer from './Footer';
import Header from './Header';
import Content from './Content';
function DefaultLayout({ children }) {
  return (
    <div>
      <Header></Header>
      <Content>
        {children}
      </Content>
      <Footer>
      </Footer>
    </div>
  );
}

export default DefaultLayout;



