
import HomeProduct from "../Product";
// import CaroselOwl from "./CaroselOwl";

function Home() {
    return (
        <>
            <div style={{
                marginTop: "94px",
            }}>
                {/* <CaroselOwl /> */}
                <div style={
                    {
                        margin: "0 auto",
                        width: "1230px",
                    }
                }>
                    <HomeProduct />
                </div>
            </div>
        </>
    );
}

export default Home;
