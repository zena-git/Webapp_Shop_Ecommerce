import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional'
import ListTable from '../../components/customer/listTable'
import ReduxProvider from '../../redux/provider'
import { Link } from 'react-router-dom';
const VoucherPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/voucher`).then(res => {
            setData(res.data);
        })
    }, [])

    return (
        <div className="py-6 flex flex-col gap-3">
            <ListTable data={data} />
        </div>

    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><VoucherPage></VoucherPage></ReduxProvider>
    )
}

export default Layout