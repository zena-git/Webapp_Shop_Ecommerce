import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import { useParams } from 'react-router-dom';
import ListDetailPromotion from '../../components/promotion/listDetailPromotion'
import ReduxProvider from '../../redux/provider'
import { Input, Tag } from 'antd/lib';
function Detail() {

    const [targetPromotion, setTargetPromotion] = useState()

    const path = useParams()
    useEffect(() => {
        if (path && path.id) {
            axios.get(`${baseUrl}/promotion/data?id=${path.id}`).then(res => {
                setTargetPromotion(res.data)
            });
        }
    }, [path])

    return (
        <div className='p-4 flex flex-col gap-2'>
            <p className='text-3xl font-semibold'>Phiếu giảm giá {targetPromotion?.code}</p>
            <div className='bg-white p-6 rounded-md shadow-lg'>
                <div className='mb-3'>
                    <div className='grid grid-cols-2 grid-rows-2 grid-flow-row gap-2'>
                        <p className='text-lg font-semibold text-slate-800'>Tên chương trình:</p>
                        <p className='text-lg font-semibold text-slate-800'>{targetPromotion?.name}</p>
                        <p className='text-lg font-semibold text-slate-800'>Mã chương trình giảm giá: </p>
                        <p className='text-lg font-semibold text-slate-800'>{targetPromotion?.code_promotion}</p>
                        <p className='text-lg font-semibold text-slate-800'>Trạng thái:</p>
                        {targetPromotion && <p><Tag color='blue' className='font-semibold text-lg'>{targetPromotion?.status == 0 ? 'Sắp diễn ra' : targetPromotion.status == 1 ? 'Đang diễn ra' : 'Đã kết thúc'}</Tag></p>}
                        <p className='text-lg font-semibold text-slate-800'>Ngày hoạt động:</p>
                        <p className='text-lg font-semibold text-slate-800'>{targetPromotion?.start_date.split("T")[1] + ":" + targetPromotion?.start_date.split("T")[0] + " đến " + targetPromotion?.end_date.split("T")[1] + ":" + targetPromotion?.end_date.split("T")[0]}</p>
                    </div>
                </div>
                <p className='text-lg font-semibold text-slate-800 mb-1'>Mô tả:</p>
                <Input.TextArea value={targetPromotion?.description} />
            </div>
            <div className='bg-white p-6 rounded-md shadow-lg'>
                {targetPromotion && <ListDetailPromotion data={targetPromotion.PromotionDetails} />}
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