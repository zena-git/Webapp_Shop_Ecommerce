import Product from '~/pages/Product';
import Oder from '~/pages/Oder';
import Voucher from '~/pages/Voucher'
import Category from '~/pages/Category'
import Style from '~/pages/Style'
import Brand from '~/pages/Brand'
import Material from '~/pages/Material'
import Size from '~/pages/Size'
import Color from '~/pages/Color'
import Promotion from '~/pages/Promotion'
import Customer from '~/pages/Customer'
import User from '~/pages/User'
import Home from '~/pages/Home';
const publicRouter = [

];

const privateRouter = [
    { path: '/', component: Home },
    { path: '/product', component: Product },
    { path: '/product/category', component: Category },
    { path: '/product/brand', component: Brand },
    { path: '/product/material', component: Material },
    { path: '/product/style', component: Style },
    { path: '/product/size', component: Size },
    { path: '/product/color', component: Color },
    { path: '/oder', component: Oder },
    { path: '/discount/voucher', component: Voucher },
    { path: '/discount/promotion', component: Promotion },
    { path: '/user/staff', component: User },
    { path: '/user/customer', component: Customer },
];

export { publicRouter, privateRouter };