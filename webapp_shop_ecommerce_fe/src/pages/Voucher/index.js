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
        <div className="py-6">
            <p className='text-xl font-bold'>Sự kiện giảm giá</p>
            <div className='px-3 py-2 w-fit my-3 bg-slate-200 rounded-lg'>
                <div className='px-3 py-2 w-fit'>
                    <Link to={'/discount/voucher/add'}>
                        Thêm phiếu giảm giá mới
                    </Link>
                </div>
            </div>
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