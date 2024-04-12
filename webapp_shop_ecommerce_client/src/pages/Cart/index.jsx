
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { Checkbox, Col, Tooltip, Avatar, Button, Empty, Carousel } from 'antd';
import InputNumber from '~/components/InputNumber';
import axios from "axios";
import hexToColorName from '~/ultils/HexToColorName';
import { fixMoney } from '~/ultils/fixMoney';
import { DeleteOutlined } from '@ant-design/icons';
import DataContext from "~/DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.scss'
const CheckboxGroup = Checkbox.Group;
function Cart() {
    const navigate = useNavigate();
    const [lstCart, setLstCart] = useState([]);
    const [historyLstCart, setHistotyLstCart] = useState([]);
    const [cartItems, setCartItems] = useState("cảttttt");
    const { data, checkedList, setDataCheckedList, moneyQuantity, updateData, deleteData, setLstDataCheckout, totalPrice, setTotalPaymentMoney } = useContext(DataContext);
    // useEffect(() => {
    //     axios.get('http://localhost:8080/api/v2/cart')
    //         .then(res => {
    //             setLstCart(res.data.lstCartDetails);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // }, [historyLstCart])

    useEffect(() => {
        setDataCheckedList([])
    }, [])
    const checkAll = data.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < data.length;
    const onChange = (list) => {
        setDataCheckedList(list);
        console.log(list);
        setTotalPaymentMoney(list);

    };
    const onCheckAllChange = (e) => {
        const lst = data.map(pro => {
            return pro.id;
        })
        setDataCheckedList(e.target.checked ? lst : []);
        setTotalPaymentMoney(e.target.checked ? lst : []);


    };
    const handleQuantityCart = (value, idCartdetail) => {
        // setTotalPaymentMoney(checkedList)
        moneyQuantity(value, idCartdetail);
    }
    const handleDeleteCart = async (itemId) => {
        // Call the deleteData function to mark the item as selected and send delete request
        deleteData(itemId);
        updateData();
        const dataCheck = checkedList.filter(item => item != itemId);
        setDataCheckedList(dataCheck)
    };
    const handleCheckOut = () => {
        if (checkedList.length <= 0) {
            toast.error("Vui lòng chọn sản phẩm để mua hàng");
            return;
        }
        console.log(checkedList);
        setLstDataCheckout(checkedList);
        navigate('/checkout');
    };
    return (
        <>
            <div>
                <div>
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
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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


                                }}
                                className='shadow-md font-medium	'
                            >
                                <div style={{ flex: '0.1', marginLeft: '10px' }}>
                                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                    </Checkbox>
                                </div>
                                <div style={{ flex: '1', justifyContent: 'center' }}>Tên Sản Phẩm</div>
                                <div style={{ flex: '0.4', justifyContent: 'center' }}>Đơn Giá</div>
                                <div style={{ flex: '0.4', justifyContent: 'center' }}>Số Lượng</div>
                                <div style={{ flex: '0.4', justifyContent: 'center' }}>Thành Tiền</div>
                                <div style={{ flex: '0.2', justifyContent: 'center' }}>Thao Tác</div>
                            </div>
                            <div className='shadow-md' style={{
                                backgroundColor: 'white',
                                width: '100%',
                            }}>

                                <Checkbox.Group onChange={onChange} value={checkedList} style={{
                                    width: '100%',
                                    fontSize: '16px'

                                }}>
                                    {data.map((cartDetail) => (
                                        <div key={cartDetail?.id} style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderBottom: '1px solid rgb(223 223 223)',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                        }}>
                                            <div style={{ flex: '0.1', marginLeft: '10px' }}>
                                                <Checkbox value={cartDetail.id}>
                                                </Checkbox>
                                            </div>
                                            <div style={{ flex: '1', display: 'flex', alignItems: 'start' }}>
                                                <div>

                                                    <Carousel dots={false} autoplay className='flex justify-center' autoplaySpeed={2000} style={{ width: '100px', height: '140px' }}>
                                                        {cartDetail?.productDetails.imageUrl.split("|").map((imageUrl, index) => (
                                                            <img src={imageUrl} key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Image ${index}`} />
                                                        ))}
                                                    </Carousel>

                                                </div>
                                                <div style={{
                                                    marginLeft: '10px'
                                                }}>
                                                    <h3 className='font-semibold m-0'> {cartDetail.productDetails.product.name}
                                                    </h3>
                                                    <div className='text-xl flex items-center mt-4 font-medium'>
                                                        <span>
                                                            Màu Sắc:
                                                        </span>
                                                        <div className=' ml-2 flex items-center'>
                                                            <Tooltip title={hexToColorName(cartDetail?.productDetails?.color?.name) + ' - ' + cartDetail?.productDetails?.color?.name} color={cartDetail?.productDetails?.color?.name} key={cartDetail?.productDetails?.color?.name}>
                                                                <div style={{ width: '20px', height: '20px', backgroundColor: cartDetail.productDetails.color?.name, border: '1px solid #ccc' }}></div>
                                                            </Tooltip>
                                                            <span className='ml-2'>- {hexToColorName(cartDetail?.productDetails?.color?.name)}</span>
                                                        </div>
                                                    </div>
                                                    <div className='text-xl flex items-center mt-4 font-medium'>
                                                        <span>
                                                            Kích Cỡ:
                                                        </span>
                                                        <div className=' ml-2 flex items-center'>

                                                            <span className='ml-2'>{cartDetail?.productDetails?.size?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div style={{ flex: '0.4', justifyContent: 'center' }}>
                                                {
                                                    cartDetail?.productDetails?.promotionDetailsActive ?
                                                        <div className="flex items-center	">
                                                            <span className="text-gray-400	text-xl line-through font-medium">{fixMoney(cartDetail.productDetails.price)}</span>
                                                            <span className="ml-2 text-rose-500 text-2xl font-medium	">{
                                                                fixMoney(cartDetail.productDetails.price -
                                                                    (cartDetail.productDetails.price * cartDetail.productDetails.promotionDetailsActive.promotion.value / 100))}</span>
                                                        </div> :
                                                        <div>
                                                            <span className="text-rose-500 text-2xl font-medium	">{fixMoney(cartDetail.productDetails.price)}</span>
                                                        </div>
                                                }

                                            </div>
                                            <div style={{ flex: '0.4', justifyContent: 'center' }}>
                                                <span >
                                                    <InputNumber
                                                        style={{
                                                            paddingLeft: '6px',
                                                            paddingRight: '6px',
                                                        }}
                                                        min={1} max={cartDetail.productDetails.quantity} value={cartDetail.quantity} onChange={(value) => handleQuantityCart(value, cartDetail.id)} />
                                                </span>
                                            </div>
                                            <div style={{ flex: '0.4', justifyContent: 'center' }}>

                                                <span className="text-rose-500 text-2xl font-medium	">{fixMoney(cartDetail.price * cartDetail.quantity)}</span>
                                            </div>
                                            <div style={{ flex: '0.2', justifyContent: 'center' }}>
                                                <Button onClick={() => { handleDeleteCart(cartDetail.id) }}>
                                                    <DeleteOutlined />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </Checkbox.Group>
                            </div>

                            <div className='cart_box-btn shadow-md'>
                                <div>
                                    <label>
                                        Tổng thanh toán: <span className='text-rose-500 text-3xl font-medium'>{fixMoney(totalPrice)}</span>
                                    </label>
                                </div>
                                <div className='ml-4'>
                                    <Button type='primary' onClick={handleCheckOut}>Mua Ngay</Button>

                                </div>
                            </div>
                        </div>

                    )}


                </div>
            </div>


            <ToastContainer />

        </>
    );
}

export default Cart;
