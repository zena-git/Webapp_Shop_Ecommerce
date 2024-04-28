import ListTable from '../../components/customer/listTable'
import ReduxProvider from '../../redux/provider';
const VoucherPage = () => {

    return (
        <div className="flex flex-col gap-3">
            <ListTable />
        </div>
    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><VoucherPage></VoucherPage></ReduxProvider>
    )
}

export default Layout
