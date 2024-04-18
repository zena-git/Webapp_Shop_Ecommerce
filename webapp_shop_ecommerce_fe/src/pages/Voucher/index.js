import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, baseUrlV3 } from '~/lib/functional'
import ListTable from '~/components/voucher/listTable'
import ListDeleted from '~/components/voucher/listDeleted'
import ReduxProvider from '../../redux/provider'
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { useAppSelector } from '../../redux/storage';
import { useNavigate } from "react-router-dom";

const VoucherPage = () => {

    const navigate = useNavigate();

    return (
        <div className="w-full rounded-md bg-white p-6 flex flex-col gap-3">
            <div className='flex justify-between items-center'>
                <p className='text-xl font-bold'>Phiếu giảm giá</p>
                <div className='flex gap-5 items-center'>
                    <Button onClick={() => { navigate('/discount/voucher/add') }} variant="outline" className="bg-blue-500 text-white hover:bg-blue-300 hover:text-white">Thêm nhân viên</Button>
                    <Recover />
                </div>
            </div>
            <div className='relative after:w-full after:h-[3px] after:absolute after:bottom-0 after:left-0 after:bg-slate-600'></div>
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
        const promises = listVoucherDeleteSelected.map(slt => {
            return axios.put(`${baseUrlV3}/voucher/recover?id=${slt.id}`)
        })
        Promise.all(promises).then(() => {
            navigate(0);
            setIsModalOpen(false);
        })

    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const listVoucherDeleteSelected = useAppSelector(state => state.voucherDeletedReducer.value.selected)

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Phiếu giảm giá đã xóa
            </Button>
            <Modal className='min-w-[60vw]' title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ListDeleted />
            </Modal>
        </>
    );
}

const Layout = (props) => {
    return (
        <ReduxProvider><VoucherPage></VoucherPage></ReduxProvider>
    )
}

export default Layout