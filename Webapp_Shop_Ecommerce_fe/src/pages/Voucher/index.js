import ListTable from '~/components/voucher/listTable'
import ReduxProvider from '../../redux/provider'

const VoucherPage = () => {

    return (
        <div className="w-full rounded-md bg-white p-6 flex flex-col gap-3">
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-bold'>Voucher</p>
            </div>
            <div className='h-[2px] bg-slate-600'></div>
            <ListTable />
        </div>

    )
}
 


const Layout = (props) => {
    return (
        <ReduxProvider><VoucherPage></VoucherPage></ReduxProvider>
    )
}

export default Layout
