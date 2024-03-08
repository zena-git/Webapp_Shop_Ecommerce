import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Address from "../../component/Address";
import AddressGress from "../../component/AddressGuest";
import Buy from "../../component/Buy";
import ProductPay from "../../component/ProductPay";
import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function CheckOut() {
    const [isAddressGressVisible, setIsAddressGressVisible] = useState(false);

    return (
        <>
            <Header />
            <div style={{
                marginTop: "99px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "1230px",

            }}>
                <Address></Address>
                <div>
                    <ProductPay></ProductPay>
                </div>


                <div style={{
                    display: "flex",
                    justifyContent: "Space-between",
                    marginTop: '40px'
                }}>

                    <div style={{ visibility: isAddressGressVisible ? 'visible' : 'hidden' , width: '50%'}} >
                        <AddressGress />
                    </div>
                    <div style={{ width: '40%'}}>
                        <Buy />
                    </div>
                </div>



            </div>
            <Footer />
            <ToastContainer />

        </>
    );
}

export default CheckOut;