import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, nextUrl } from '~/lib/functional'
import ListTable from '~/components/voucher/listTable'
import ListDeleted from '~/components/voucher/listDeleted'
import ReduxProvider from '../../redux/provider'
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { useAppSelector } from '../../redux/storage';
import { useNavigate } from "react-router-dom";

const VoucherPage = () => {

    return (
        <div className="py-6 p-6 bg-white rounded-md shadow-lg flex flex-col gap-1">
            <p className='text-xl font-bold'>Phiếu giảm giá</p>
            <div className='flex gap-5 items-center'>
                <Link to={'/discount/voucher/add'} className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg my-3'>
                    Thêm phiếu giảm giá mới
                </Link>
                <Recover />
            </div>
            <div>
                <div className='mt-3 rounded-lg'>
                    <ListTable />
                </div>
            </div>
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
            return axios.get(`${nextUrl}/voucher/recover?id=${slt.id}`)
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
            <Modal title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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