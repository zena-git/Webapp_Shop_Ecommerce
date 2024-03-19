import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import { useParams } from 'react-router-dom';
import ListDetailPromotion from '../../components/promotion/listDetailPromotion'
import ReduxProvider from '../../redux/provider'
function Detail() {

    const [targetPromotion, setTargetPromotion] = useState()

    const path = useParams()
    useEffect(() => {
        if (path && path.id) {
            axios.get(`${baseUrl}/promotion/${path.id}`).then(res => {
                setTargetPromotion(res.data)
            });
        }
    }, [path])

    return (
        <div className='p-4 flex flex-col gap-2'>
            <div className='grid grid-cols-2 gap-2 mb-3'>
                <p className='text-lg font-semibold text-slate-800'>Tên chương trình: {targetPromotion?.name}</p>
                <p className='text-lg font-semibold text-slate-800'>Mã chương trình giảm giá: {targetPromotion?.code}</p>
                <p className='text-lg font-semibold text-slate-800'>Trạng thái: {targetPromotion?.status}</p>
                <p className='text-lg font-semibold text-slate-800'>Mô tả: {targetPromotion?.description}</p>
            </div>
            <p className='text-lg font-semibold text-slate-800 mb-3'>Ngày hoạt động: {targetPromotion?.startDate + " - " + targetPromotion?.endDate}</p>

            <div>
                {targetPromotion && <ListDetailPromotion data={targetPromotion.lstPromotionDetails}/>}
            </div>
        </div>
    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><Detail></Detail></ReduxProvider>
    )
}

export default Layout