import Footer from "../layout/Footer";
import Header from "../layout/Header";
import HomeProduct from "../Product";
import CaroselOwl from "./CaroselOwl";

function Home() {
    return (
        <>
            <Header />
            <div style={{
                marginTop: "94px",
            }}>
                <CaroselOwl />
                <div style={
                    {
                        margin: "0 auto",
                        width: "1230px",
                    }
                }>
                    <HomeProduct />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home;
