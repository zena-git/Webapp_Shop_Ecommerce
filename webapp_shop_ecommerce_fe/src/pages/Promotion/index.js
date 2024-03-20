import { useEffect, useState } from 'react';
import ListTable from '~/components/promotion/listTable'
import ReduxProvider from '~/redux/provider'
import { redirect, Link } from 'react-router-dom';

const PromotionPage = () => {
    return (

        <div className="p-6">
            <p className='text-xl font-bold'>Sự kiện giảm giá</p>
            <div className='px-3 py-2 w-fit my-3 bg-slate-200 rounded-lg'>
                <div className='px-2 py-1 w-fit'>
                    <Link to={'/discount/promotion/add'} className='text-lg font-semibold'>
                        Thêm đợt giảm giá mới
                    </Link>
                </div>
            </div>
            <div>
                <div className='mt-5 p-2 bg-slate-50 rounded-lg'>
                    <ListTable />
                </div>
            </div>
        </div>

    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><PromotionPage></PromotionPage></ReduxProvider>
    )
}

export default Layout