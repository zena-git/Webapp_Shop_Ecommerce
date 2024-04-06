
import Address from "~/components/Address";
import AddressGress from "~/components/AddressGuest";
import Buy from "~/components/Buy";
import ProductPay from "~/components/ProductPay";
import { useState, useEffect, useContext } from "react";
import DataContext from "~/DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function CheckOut() {
    const { isAccount } = useContext(DataContext);
    return (
        <>
            <div style={{
                marginTop: "99px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "1230px",

            }}>
                <div style={{ display: isAccount ? 'block' : 'none', }}>
                    <Address></Address>
                </div>
                <div>
                    <ProductPay></ProductPay>
                </div>


                <div style={{
                    display: "flex",
                    justifyContent: "Space-between",
                    marginTop: '40px'
                }}>

                    <div style={{ visibility: isAccount ? 'hidden' : 'visible', width: '50%' }} >


                        <AddressGress />
                    </div>
                    <div style={{ width: '40%' }}>

                        <Buy />
                    </div>
                </div>



            </div>
            <ToastContainer />

        </>
    );
}

export default CheckOut;