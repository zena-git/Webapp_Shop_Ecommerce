import ListTable from '~/components/promotion/listTable'
import ReduxProvider from '~/redux/provider'

const PromotionPage = () => {

    return (
        <div className="w-full rounded-md bg-white p-6 flex flex-col gap-3">
            <div className='flex justify-between items-center'>
                <p className='text-xl font-bold'>Sự kiện giảm giá</p>
            </div>
            <div className='h-[2px] bg-slate-600'></div>
            <ListTable />
        </div>

    )
}


const Layout = (props) => {
    return (
        <ReduxProvider>
            <PromotionPage></PromotionPage>
        </ReduxProvider>
    )
}

export default Layout
