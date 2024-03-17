import { Layout, theme, Button } from 'antd';
import Menu from '~/components/Menu';
import React from 'react';
const { Header, Content, Footer, Sider } = Layout;
const headerStyle = {
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '#4096ff',
};

const siderStyle = {
  color: '#000000',
  backgroundColor: 'white',
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,

};
const contentStyle = {
  margin: '24px 16px 0',
  overflow: 'initial',
  position: 'relative',

}
const footerStyle = {
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '#4096ff',
};
const layoutStyle = {
  overflow: 'hidden',
  width: 'calc(100%)',
  marginLeft: 200,
  maxWidth: 'calc(100%)',
};
function DefaultLayout({ children }) {


  return (
    <div>
      <Layout hasSider>
        <Sider style={siderStyle} >
        <div className="demo-logo-vertical" />
          <Menu></Menu>
        </Sider>
        <Layout style={layoutStyle}>

          <Header style={headerStyle}>
          
          Header</Header>
          <Content style={contentStyle}>
            {children}
            <Footer style={footerStyle}>
              Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default DefaultLayout;



