import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional'
import ListTable from '../../components/voucher/listCustomer'
import ReduxProvider from '../../redux/provider'

const VoucherPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/voucher`).then(res => {
            setData(res.data);
        })
    }, [])

    return (
        <div className="py-6">
            <p className='text-xl font-bold'>Khách hàng</p>
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