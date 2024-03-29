import { useEffect, useState } from 'react';
import ListTable from '~/components/promotion/listTable'
import ReduxProvider from '~/redux/provider'
import { redirect, Link } from 'react-router-dom';

const PromotionPage = () => {
    return (

        <div className="p-6 bg-white rounded-md shadow-lg flex flex-col gap-3">
            <p className='text-xl font-bold my-3'>Sự kiện giảm giá</p>
            <div>
                <Link to={'/discount/promotion/add'} className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg my-3'>
                    Thêm đợt giảm giá mới
                </Link>
            </div>
            <div>
                <div className='mt-5 rounded-lg'>
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