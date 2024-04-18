import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, baseUrlV3 } from '~/lib/functional';
import { Link, useParams } from 'react-router-dom';
import ListDetailPromotion from '../../components/promotion/listDetailPromotion'
import ReduxProvider from '../../redux/provider'
import { Input, Tag } from 'antd/lib';
function Detail() {

    const [targetPromotion, setTargetPromotion] = useState()

    const path = useParams()
    useEffect(() => {
        if (path && path.id) {
            axios.get(`${baseUrlV3}/promotion/data?id=${path.id}`).then(res => {
                setTargetPromotion(res.data)
            });
        }
    }, [path])

    return (
        <div className='p-4 flex flex-col gap-2 bg-white'>
            <div className='bg-slate-50 p-6 rounded-md shadow-lg'>
                <div className='flex justify-between items-center'>
                    <p className='text-lg font-semibold'>Phiếu giảm giá {targetPromotion?.code}</p>
                    <Link to={`/discount/promotion/edit/${targetPromotion?.id}`} className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-sm my-3'>Chỉnh sửa</Link>
                </div>
                <div className='relative after:w-full after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-slate-600'></div>
                <div className='my-3'>
                    <div className='grid grid-cols-2 grid-rows-2 grid-flow-row gap-2'>
                        <p className='text-lg font-semibold text-slate-800'>Tên chương trình:</p>
                        <p className='text-lg font-semibold text-slate-800'>{targetPromotion?.name}</p>
                        <p className='text-lg font-semibold text-slate-800'>Mã chương trình giảm giá: </p>
                        <p className='text-lg font-semibold text-slate-800'>{targetPromotion?.code}</p>
                        <p className='text-lg font-semibold text-slate-800'>Trạng thái:</p>
                        {targetPromotion && <p><Tag color='blue' className='font-semibold text-lg'>{targetPromotion?.status == 0 ? 'Sắp diễn ra' : targetPromotion.status == 1 ? 'Đang diễn ra' : 'Đã kết thúc'}</Tag></p>}
                        <p className='text-lg font-semibold text-slate-800'>Ngày hoạt động:</p>
                        <p className='text-lg font-semibold text-slate-800'>{targetPromotion?.startDate.split("T")[1] + ":" + targetPromotion?.startDate.split("T")[0] + " đến " + targetPromotion?.endDate.split("T")[1] + ":" + targetPromotion?.endDate.split("T")[0]}</p>
                    </div>
                </div>
                <p className='text-lg font-semibold text-slate-800 mb-1'>Mô tả:</p>
                <Input.TextArea value={targetPromotion?.description} />
            </div>
            <div className='bg-slate-50 p-6 rounded-md shadow-lg'>
                {targetPromotion && <ListDetailPromotion data={targetPromotion.lstPromotionDetails} value={targetPromotion?.value}/>}
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