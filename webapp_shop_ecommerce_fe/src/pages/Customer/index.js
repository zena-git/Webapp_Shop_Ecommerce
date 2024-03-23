import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional'
import ListTable from '../../components/voucher/listCustomer'
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
        <div className="py-6">
            <Link to={'/user/customer/add'} className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg my-3'>Thêm khách hàng mới</Link>
            <div>
                <div className='mt-5'>
                    <ListTable data={data} />
                </div>
            </div>
        </div>

    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><VoucherPage></VoucherPage></ReduxProvider>
    )
}

export default Layout