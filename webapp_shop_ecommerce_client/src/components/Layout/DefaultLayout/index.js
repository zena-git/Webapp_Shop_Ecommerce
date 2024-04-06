import { Layout, theme, Button, Badge, Avatar } from 'antd';
import Menu from '~/components/Menu';
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
function DefaultLayout({ children }) {
  return (
    <div >
      <Header></Header>
      {children}
      <Footer>
      </Footer>
    </div>
  );
}

export default DefaultLayout;



