import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional'
import ListTable from '~/components/voucher/listTable'
import ReduxProvider from '../../redux/provider'
import { Link } from 'react-router-dom';

const VoucherPage = () => {

    return (
        <div className="py-6">
            <p className='text-xl font-bold'>Sự kiện giảm giá</p>
            <div className='px-3 py-2 w-fit my-3 bg-slate-200 rounded-lg'>
                <div className='px-2 py-1 w-fit'>
                    <Link to={'/discount/voucher/add'} className='text-lg font-semibold'>
                        Thêm phiếu giảm giá mới
                    </Link>
                </div>
            </div>
            <div>
                <div className='mt-5 bg-slate-50 p-2 rounded-lg'>
                    <ListTable />
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