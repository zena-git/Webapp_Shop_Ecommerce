import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Link, useNavigate } from 'react-router-dom';

import { useEffect, useState, useContext } from "react";
import { Checkbox, Col, Row, Avatar, Button, InputNumber, Flex, ColorPicker } from 'antd';
import axios from "axios";
import { DeleteOutlined } from '@ant-design/icons';
import DataContext from "../../DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CheckboxGroup = Checkbox.Group;
function Cart() {
    const navigate = useNavigate();
    const [lstCart, setLstCart] = useState([]);
    const [historyLstCart, setHistotyLstCart] = useState([]);
    const [cartItems, setCartItems] = useState("cảttttt");
    const { data, moneyQuantity, updateData, deleteData, setLstDataCheckout, totalPayment, setTotalPaymentMoney } = useContext(DataContext);
    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/cart')
            .then(res => {
                setLstCart(res.data.lstCartDetails);
            })
            .catch(err => {
                console.log(err);
            })
    }, [historyLstCart])


    const [checkedList, setCheckedList] = useState([]);
    const checkAll = data.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < data.length;
    const onChange = (list) => {
        setCheckedList(list);
        // console.log(list);
        setTotalPaymentMoney(list);

    };
    const onCheckAllChange = (e) => {
        const lst = data.map(pro => {
            return pro.id;
        })
        setCheckedList(e.target.checked ? lst : []);
        console.log(lst);
        setTotalPaymentMoney(e.target.checked ? lst : []);

    };
    const handleQuantityCart = (value, idCartdetail) => {
        moneyQuantity(value, idCartdetail);
    }
    const handleDeleteCart = async (itemId) => {
        // Call the deleteData function to mark the item as selected and send delete request
        deleteData(itemId);
        updateData();

    };
    const handleCheckOut = () => {
        if (checkedList.length <= 0) {
            toast.error("Vui lòng chọn sản phẩm để mua hàng");
            return;
        }
        setLstDataCheckout(checkedList);
        navigate('/checkout');
    };
    return (
        <>
            <Header />
            <div style={{
                marginTop: "99px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "1230px",

            }}>
                <div style={{
                    marginLeft: "15px",
                    marginRight: "15px",
                }}>
                    <h1 style={{
                        textAlign: "center",
                        color: "#555556",
                        textTransform: "uppercase",
                        fontSize: "30px",
                        lineHeight: "50px",
                        fontFamily: "sans-serif"
                    }}>Giỏ hàng của tôi</h1>
                </div>


                <div>

                    {data.length === 0 ? (
                        <p>Giỏ hàng trống rỗng</p>
                    ) : (
                        <div >
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: '#ccc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                    fontSize: '16px',
                                    paddingTop: '10px',
                                    paddingBottom: '10px',

                                }}>
                                <div style={{ flex: '0.1', marginLeft: '10px' }}>
                                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                    </Checkbox>
                                </div>
                                <div style={{ flex: '1', }}>Tên Sản Phẩm</div>
                                <div style={{ flex: '0.3', }}>Đơn Giá</div>
                                <div style={{ flex: '0.3', }}>Số Lượng</div>
                                <div style={{ flex: '0.3', }}>Thành Tiền</div>
                                <div style={{ flex: '0.2', }}>Thao Tác</div>
                            </div>
                            <div style={{
                                backgroundColor: 'white',
                                width: '100%',
                            }}>

                                <Checkbox.Group onChange={onChange} value={checkedList} style={{
                                    width: '100%',
                                    fontSize: '16px'

                                }}>
                                    {data.map((cartDetail) => (
                                        <div key={cartDetail.id} style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderBottom: '1px solid #ccc',
                                            paddingTop: '4px',
                                        }}>
                                            <div style={{ flex: '0.1', marginLeft: '10px' }}>
                                                <Checkbox value={cartDetail.id}>
                                                </Checkbox>
                                            </div>
                                            <div style={{ flex: '1', display: 'flex', alignItems: 'start' }}>
                                                <div>
                                                    <img
                                                        style={{
                                                            width: '100px',
                                                            height: '100px'
                                                        }}
                                                        src="https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-1/212869555_903187000546897_616635507650364142_n.jpg?stp=dst-jpg_p320x320&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHUtaFAQzZIuqBM3YYvro7jpMC7lk7KZ2ykwLuWTspnbCAaW_NKg-IMain8k07U_ys&_nc_ohc=vyrY0myh2f4AX_0b_xe&_nc_ht=scontent-hkg4-1.xx&oh=00_AfDplaPAhr9NgzTwlsIBmcx0e4aSDoKZyOSrV2vG4QvYsA&oe=65ED0660">

                                                    </img>
                                                </div>
                                                <div style={{
                                                    marginLeft: '10px'
                                                }}>
                                                    <h4 style={{
                                                        margin: '0px'
                                                    }}> {cartDetail.productDetails.product.name}
                                                    </h4>
                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                        Phân loại: <div style={{
                                                            backgroundColor: cartDetail.productDetails.color.name,
                                                            width: '24px',
                                                            height: '24px',
                                                            marginLeft: '10px',
                                                            marginRight: '10px'
                                                        }}>

                                                        </div> - {cartDetail.productDetails.size.name}
                                                    </span>
                                                </div>

                                            </div>
                                            <div style={{ flex: '0.3', }}>
                                                <span>
                                                    {cartDetail.productDetails.price}
                                                </span>
                                            </div>
                                            <div style={{ flex: '0.3', }}>
                                                <span>
                                                    <InputNumber min={1} max={cartDetail.productDetails.quantity} defaultValue={cartDetail.quantity} onChange={(value) => handleQuantityCart(value, cartDetail.id)} />
                                                </span>
                                            </div>
                                            <div style={{ flex: '0.3', }}>
                                                <span>
                                                    {cartDetail.productDetails.price * cartDetail.quantity}
                                                </span>
                                            </div>
                                            <div style={{ flex: '0.2', }}>
                                                <Button onClick={() => { handleDeleteCart(cartDetail.id) }}>
                                                    <DeleteOutlined />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </Checkbox.Group>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'end',
                                marginTop: '20px',
                                alignItems: 'center',
                            }}>
                                <div>
                                    <label>
                                        Tổng thanh toán: <span>{totalPayment}</span>
                                    </label>
                                </div>
                                <div style={{
                                    marginLeft: '10px'
                                }}>
                                    <Button style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        textDecoration: 'none',
                                        color: 'white',
                                        backgroundColor: '#ff00a3',
                                    }} onClick={handleCheckOut}>Mua Ngay</Button>

                                </div>
                            </div>
                        </div>

                    )}


                </div>
            </div>


            <Footer />
            <ToastContainer />

        </>
    );
}

export default Cart;
