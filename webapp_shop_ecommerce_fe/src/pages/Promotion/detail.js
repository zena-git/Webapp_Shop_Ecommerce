import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import { useParams } from 'react-router-dom';

export default function Detail() {

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
            <div className='grid grid-cols-2 gap-2'>
                <p className='text-lg font-semibold'>Tên chương trình: {targetPromotion?.name}</p>
                <p className='text-lg font-semibold'>Mã chương trình giảm giá: {targetPromotion?.code}</p>
                <p className='text-lg font-semibold'>Trạng thái: {targetPromotion?.status}</p>
                <p className='text-lg font-semibold'>Mô tả: {targetPromotion?.description}</p>
            </div>
            <p className='text-lg font-semibold'>Ngày hoạt động: {targetPromotion?.startDate + " - " + targetPromotion?.endDate}</p>

            <div>

            </div>
        </div>
    )
}