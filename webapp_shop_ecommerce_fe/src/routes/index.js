import Product from '~/pages/Product';
import ProductAdd from '~/pages/Product/add';
import ProductUpdate from '~/pages/Product/update';
import ProductDetail from '~/pages/Product/detail';
import Order from '~/pages/Order';
import Sale from '~/pages/Sale';

import Category from '~/pages/Category'
import Style from '~/pages/Style'
import Brand from '~/pages/Brand'
import Material from '~/pages/Material'
import Size from '~/pages/Size'
import Color from '~/pages/Color'

import Customer from '~/pages/Customer'
import CustomerDetail from '~/pages/Customer/detail'
import CustomerAdd from '~/pages/Customer/add'
import CustomerUpdate from '~/pages/Customer/update'
import User from '~/pages/User'
import Home from '~/pages/Home';
import Default from '~/pages/Default';

import Promotion from '~/pages/Promotion'
import PromotionUpdate from '~/pages/Promotion/update'
import PromotionAdd from '~/pages/Promotion/add'
import PromotionDetail from '~/pages/Promotion/detail'

import Voucher from '~/pages/Voucher'
import VoucherAdd from '~/pages/Voucher/add'
import VoucherDetail from '~/pages/Voucher/detail'
import VoucherUpdate from '~/pages/Voucher/update'
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
    { path: '/discount/voucher/update/:id', component: VoucherUpdate },
    { path: '/discount/voucher/add', component: VoucherAdd },
    { path: '/discount/voucher/detail/:id', component: VoucherDetail },

    { path: '/discount/promotion', component: Promotion },
    { path: '/discount/promotion/update/:id', component: PromotionUpdate },
    { path: '/discount/promotion/add', component: PromotionAdd },
    { path: '/discount/promotion/detail/:id', component: PromotionDetail },

    { path: '/user/staff', component: User },
    { path: '/user/customer', component: Customer },
    { path: '/user/customer/add', component: CustomerAdd },
    { path: '/user/customer/detail/:id', component: CustomerDetail },
    { path: '/user/customer/update/:id', component: CustomerUpdate },
    
    { path: '/*', component: Default },
];

export { publicRouter, privateRouter };