import ListUser from '../../components/user/ListTable';
import ReduxProvider from '../../redux/provider'
function User() {
    return (
        <ListUser />
    );
}
const Layout = (props) => {
    return (
        <ReduxProvider><User></User></ReduxProvider>
    )
}

export default Layout