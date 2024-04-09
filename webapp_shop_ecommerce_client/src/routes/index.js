import Home from "~/pages/Home";
import Cart from "~/pages/Cart";
import CheckOut from "~/pages/Checkout";
import PaymentIpn from "~/pages/PaymenIpn";
import ProductDetail from "~/pages/ProductDetail";
const publicRouter = [

];

const privateRouter = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
    { path: '/checkOut', component: CheckOut },
    { path: '/paymentIPN', component: PaymentIpn },
    { path: '/product/:id', component: ProductDetail },

];

export { publicRouter, privateRouter };