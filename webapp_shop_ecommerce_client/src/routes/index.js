import Home from "~/pages/Home";
import Cart from "~/pages/Cart";
import CheckOut from "~/pages/Checkout";
import ProductDetail from "~/pages/Product/ProductDetail";
const publicRouter = [

];

const privateRouter = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
    { path: '/checkOut', component: CheckOut },
    { path: '/checkOut', component: CheckOut },
    { path: '/product/:id', component: ProductDetail },

];

export { publicRouter, privateRouter };