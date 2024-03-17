import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional'
import ListTable from '~/components/voucher/listTable'
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
        <div className="p-6">
            <p>Sự kiện giảm giá</p>
            <Link to={'/discount/voucher/add'} className={`px-3 py-3 text-sm font-semibold bg-slate-100 `}>
                Thêm phiếu giảm giá mới
            </Link>
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