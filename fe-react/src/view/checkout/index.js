import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Address from "../../component/Address";
import AddressGress from "../../component/AddressGuest";
import Buy from "../../component/Buy";
function CheckOut() {
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
                <div style={{
                    display: "flex",
                    justifyContent: "Space-between",
                }}>
                    <AddressGress></AddressGress>
                    <Buy></Buy>
                </div>

            </div>
            <Footer />

        </>
    );
}

export default CheckOut;