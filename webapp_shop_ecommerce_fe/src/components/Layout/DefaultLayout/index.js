import { Layout } from 'antd';
import Menu from '~/components/Menu';

const { Header, Footer, Sider, Content } = Layout;



const headerStyle = {
    textAlign: 'center',
    color: '#000000',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
  };
  const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#000000',
    backgroundColor: 'white',
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
    height: 'calc(100vh)',
    maxWidth: 'calc(100%)',
  };
function DefaultLayout({children}) {
    return ( 
        <div>
            <Layout style={layoutStyle}>
        <Sider width="15%" style={siderStyle}>
          <Menu></Menu>
        </Sider>
        <Layout>
          <Header style={headerStyle}>Header</Header>
          <Content style={contentStyle}>
            {children}
          </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
        </div>
     );
}

export default DefaultLayout;