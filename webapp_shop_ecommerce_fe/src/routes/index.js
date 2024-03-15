import Product from '~/pages/Product';
import ProductAdd from '~/pages/Product/add';
import ProductUpdate from '~/pages/Product/update';
import ProductDetail from '~/pages/Product/detail';
import Order from '~/pages/Order';
import Sale from '~/pages/Sale';
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
import Default from '~/pages/Default';
const publicRouter = [

];

const privateRouter = [
    { path: '/', component: Home },
    { path: '/product', component: Product },
    { path: '/product/:id', component: ProductDetail },
    { path: '/product/add', component: ProductAdd },
    { path: '/product/update/:id', component: ProductUpdate },
    { path: '/product/brand', component: Brand },
    { path: '/product/material', component: Material },
    { path: '/product/style', component: Style },
    { path: '/product/size', component: Size },
    { path: '/product/color', component: Color },
    { path: '/product/category', component: Category },
    { path: '/order', component: Order },
    { path: '/sale', component: Sale },
    { path: '/discount/voucher', component: Voucher },
    { path: '/discount/promotion', component: Promotion },
    { path: '/user/staff', component: User },
    { path: '/user/customer', component: Customer },
    { path: '/*', component: Default },
];

export { publicRouter, privateRouter };