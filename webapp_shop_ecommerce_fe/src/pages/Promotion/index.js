import { useEffect, useState } from 'react';
import ListTable from '~/components/promotion/listTable'
import ReduxProvider from '~/redux/provider'
import { redirect, Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/storage';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { baseUrl, baseUrlV3 } from '~/lib/functional'
import ListDeleted from '~/components/promotion/listDeleted'
import { Button, Modal } from 'antd';
const PromotionPage = () => {
    return (

        <div className="px-6 py-3 bg-white rounded-md shadow-lg flex flex-col gap-3">
            <div className='flex justify-between items-center bg-slate-50'>
                <p className='text-xl font-bold'>Sự kiện giảm giá</p>
                <div className='flex gap-5 items-center'>
                    <Link to={'/discount/promotion/add'} className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-sm my-3'>
                        Thêm đợt giảm giá mới
                    </Link>
                    <Recover />
                </div>
            </div>
            <div className='relative after:w-full after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-slate-600'></div>
            <ListTable />
        </div>

    )
}

const Recover = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const promises = listPromotionDeleteSelected.map(slt => {
            return axios.get(`${baseUrlV3}/promotion/recover?id=${slt.id}`)
        })
        Promise.all(promises).then(() => {
            navigate(0);
            setIsModalOpen(false);
        })

    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const listPromotionDeleteSelected = useAppSelector(state => state.promotionDeletedReducer.value.selected)

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Chương trình giảm giá đã xóa
            </Button>
            <Modal className='min-w-[60vw]' title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ListDeleted />
            </Modal>
        </>
    );
}

const Layout = (props) => {
    return (
        <ReduxProvider>
            <PromotionPage></PromotionPage>
        </ReduxProvider>
    )
}

export default Layout