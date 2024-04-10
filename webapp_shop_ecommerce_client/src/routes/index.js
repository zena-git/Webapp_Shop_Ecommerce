import Home from "~/pages/Home";
import Cart from "~/pages/Cart";
import CheckOut from "~/pages/Checkout";
import PaymentIpn from "~/pages/PaymenIpn";
import ProductDetail from "~/pages/ProductDetail";
import Profile from "~/pages/Profile";
import OrderTracking from "~/pages/OrderTracking";
import HistoryOder from "~/pages/HistoryOder";
import HistoryOrderDetail from "~/pages/HistoryOder/detail";
import Address from "~/pages/Address";
const publicRouter = [

];

const privateRouter = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
    { path: '/checkOut', component: CheckOut },
    { path: '/paymentIPN', component: PaymentIpn },
    { path: '/product/:id', component: ProductDetail },
    { path: '/orderTracking', component: OrderTracking },
    { path: '/profile', component: Profile },
    { path: '/historyOrder', component: HistoryOder },
    { path: '/historyOrder/:id', component: HistoryOrderDetail },
    { path: '/address', component: Address },

];

export { publicRouter, privateRouter };