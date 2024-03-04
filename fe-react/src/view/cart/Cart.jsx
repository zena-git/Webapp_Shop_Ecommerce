import { Link } from "react-router-dom";
import { fixMoney } from "../../extension/fixMoney";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import styles from "./cart.module.css";
import { InputNumber } from 'antd';

function CartItem({ product, onDelete }) {
    const handleDelete = () => {
        onDelete(product.id);
    };

    const onChange = (value) => {
        console.log('changed', value);
    };

    return (
        <div style={{
            paddingBottom: "40px"
        }}>
            



            <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ display: "flex", alignItems: "center" }}>
                    <img src={product.image} alt={product.name} style={{ width: "100px", marginRight: "20px" }} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Link className={styles.nav} to={`/product/${product.id}`}>{product.name}</Link>
                        <p>Giá tiền: {fixMoney(product.price)}</p>
                    </div>
                </td>
                <td style={{ display: "flex", alignItems: "center" }}>
                    <InputNumber value={product.quantity} min={1} max={10} />
                    <span>Thành tiền: {fixMoney(product.price * product.quantity)}</span>
                    <button onClick={handleDelete}>X</button>
                </td>
            </tr>
        </div>
    );
}


function Cart() {

    const cartItems = [
        { id: 1, name: "Product 1", price: 10, quantity: 2, image: "https://product.hstatic.net/1000304367/product/dsc_3682-2_320691ae6ac8452e9c955cb582b247b3_medium.jpg" },
        { id: 2, name: "Product 2", price: 20, quantity: 1, image: "https://product.hstatic.net/1000304367/product/dsc_3682-2_320691ae6ac8452e9c955cb582b247b3_medium.jpg" },
        { id: 2, name: "Product 2", price: 20, quantity: 1, image: "https://product.hstatic.net/1000304367/product/dsc_3682-2_320691ae6ac8452e9c955cb582b247b3_medium.jpg" },

        { id: 2, name: "Product 2", price: 20, quantity: 1, image: "https://product.hstatic.net/1000304367/product/dsc_3682-2_320691ae6ac8452e9c955cb582b247b3_medium.jpg" },
        { id: 2, name: "Product 2", price: 20, quantity: 1, image: "https://product.hstatic.net/1000304367/product/dsc_3682-2_320691ae6ac8452e9c955cb582b247b3_medium.jpg" },

        { id: 3, name: "Product 3", price: 20, quantity: 1, image: "https://product.hstatic.net/1000304367/product/dsc_3682-2_320691ae6ac8452e9c955cb582b247b3_medium.jpg" }

    ];

    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleDeleteItem = (id) => {
        // Logic to delete item with id from cart
        console.log("Delete item with ID:", id);
    };

    return (
        <>
            <div style={{
                position: "relative",

            }}>
                <Header />
                <div style={{
                    marginTop: "99px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "1230px",
                    height: "100vh",
                    paddingBottom: "40px"
                }}>
                    <div style={{
                        marginLeft: "15px",
                        marginRight: "15px",
                        width: "1230px",
                        minHeight: "100%",

                    }}>
                        <div className={styles.title}>
                            <h1>Giỏ hàng của tôi</h1>
                        </div>

                        <div style={{
                            width: "60%",
                            float: "left",
                            padding: "0 15px",
                            display: "flex",
                            justifyContent: "space-between",

                        }}>
                            <div style={{
                                width: "60%",
                                minWidth: "900px"
                            }}>
                                <h2>Thông tin chi tiết sản phẩm</h2>


                                {cartItems.map(item => (
                                    <CartItem key={item.id} product={item} onDelete={handleDeleteItem} />
                                ))}
                            </div>

                            <div style={{
                                width: "40%",
                                float: "left",
                                padding: "0 15px",
                                minWidth: "300px",

                            }}>
                                <div style={{
                                    border: "1px solid",
                                    marginLeft: "-15px",
                                    marginRight: "-15px",

                                }}>
                                    <p>Tổng tiền: {fixMoney(totalPrice)}</p>
                                    <button>Thanh toán</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Cart;