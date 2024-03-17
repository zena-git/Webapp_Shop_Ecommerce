import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import ListTable from '~/components/promotion/listTable'
import ReduxProvider from '~/redux/provider'
import { redirect, Link } from 'react-router-dom';

const PromotionPage = () => {
    const [data, setData] = useState([]);


    useEffect(() => {
        axios.get(`${baseUrl}/promotion`).then(res => {
            setData(res.data);
            // dispatch(set({value: {selected: }}))
            console.log(res.data.lstPromotionDetails)
        })
    }, [])



    return (

        <div className="p-6">
            <p>Sự kiện giảm giá</p>
            <Link to={'/discount/promotion/add'} className={`px-3 py-3 text-sm font-semibold bg-slate-100 `}>
                Thêm đợt giảm giá mới
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
        <ReduxProvider><PromotionPage></PromotionPage></ReduxProvider>
    )
}

export default Layout