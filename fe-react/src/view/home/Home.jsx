import Header from "../layout/Header";
import HomeProduct from "../product/HomeProduct";
import CaroselOwl from "./CaroselOwl";

function Home() {
    return (
        <>
            <Header />
            <div style={{
                marginTop: "94px"
            }}>
                <CaroselOwl />
                <div style={
                    {
                        margin: "0 105px",
                    }
                }>
                    <HomeProduct />
                </div>
            </div>
        </>
    );
}

export default Home;
