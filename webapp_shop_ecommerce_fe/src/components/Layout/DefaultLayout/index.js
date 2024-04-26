import { Layout, theme, Button, Badge, Avatar } from 'antd';
import Menu from '~/components/Menu';
import React, { useState, useContext } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
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
import { useOrderData } from '~/provider/OrderDataProvider';
const { Header, Content, Footer, Sider } = Layout;
const headerStyle = {
  color: 'black',
  backgroundColor: 'white',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  width: '100%',


};

const siderStyle = {

  color: '#000000',
  backgroundColor: 'white',
  // overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: '3',
};
const contentStyle = {
  marginTop: '84px',
  margin: '24px 16px 0',
  position: 'relative',
  minHeight: '80vh',
  maxWidth: 'calc(100vw-220px)'
}
const footerStyle = {
  textAlign: 'center',
  color: 'black',
  backgroundColor: 'white',
};
const layoutStyle = {
  // overflow: 'hidden',
  position: 'relative',
  width: 'calc(100%)',
  marginLeft: 220,
  maxWidth: 'calc(100%)',
  height: 'calc(100%)'
};
function DefaultLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { loadingContent, setDataLoadingContent } = useOrderData();

  return (
    <div >
      <Layout hasSider >
        <Sider style={siderStyle} >
          <div className='flex justify-center content-center	mt-6 mb-6 pt-8 pb-8'>
            <img style={{
              width: '154px',
            }} src='../logo.png'></img>
          </div>
          <Menu style={{ width: '100%' }}></Menu>
        </Sider>
        <Layout style={layoutStyle}>

          <Header style={headerStyle} className='p-0 shadow-lg'>

            <div className='flex items-center	justify-end	mr-6'>
              <div>
                <Badge count={0} showZero>
                  <FontAwesomeIcon className='text-3xl	' icon={faBell}></FontAwesomeIcon>
                </Badge>
              </div>

              <div className='ml-6 flex items-center'>
                <div>
                  <h4> Admin Tạch 2tr3</h4>
                </div>
                <Avatar className='ml-4' size="large" icon={
                  <>
                    <img src="https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/248448036_10223354474742706_6850305084773679859_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGbo6-TAFzmZFrU4oXsYmviQDRCYMjUooVANEJgyNSihZ9anpRPbtWdFXfAXlZr5Y0&_nc_ohc=SPBVtBvef6QAX99j0we&_nc_ht=scontent.fhan3-3.fna&oh=00_AfDaFcUiGMw3e34F3rC0eE6wcdilHsGjdqOlSEtAUTE6yw&oe=65FDE7DD" />
                  </>
                } />
              </div>
            </div>
          </Header>
          <Content style={contentStyle}>
            {children}
            <div >
              {loadingContent && (
                <div
                  style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    bottom: '0',
                    right: '0',
                    backgroundColor: 'rgba(146, 146, 146, 0.33)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                >
                  <div  className='ml-[220px]'>
                    <LoadingOutlined className='text-6xl text-rose-500	' />
                  </div>

                </div>
              )}
            </div>
          </Content>
          <Footer style={footerStyle}>
            <div className='font-medium	'>
              Alice Shop <span>{new Date().getFullYear()}</span> V0.1
            </div>
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default DefaultLayout;



