import { Layout } from 'antd';
import Menu from '~/components/Menu';

const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '#4096ff',
};

const siderStyle = {
  color: '#000000',
  backgroundColor: 'white',
  
};
const footerStyle = {
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '#4096ff',
};
const layoutStyle = {
  overflow: 'hidden',
  width: 'calc(100%)',
  maxWidth: 'calc(100%)',
};
function DefaultLayout({ children }) {
  return (
    <div>
      <Layout style={layoutStyle}>
        <Sider width="15%" style={siderStyle} className='fixed top-0 left-0 '>
          <Menu></Menu>
        </Sider>
        <Layout>
          <Header style={headerStyle}>Header</Header>
          <Content className='bg-zinc-300 px-3.5 pt-5 scroll-auto'>
            {children}
            <Footer style={footerStyle}>Footer</Footer>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default DefaultLayout;