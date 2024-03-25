import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";
import { Link } from "react-router-dom";
import styles from "./footer.module.css"


function Footer() {
    return (
        <>
            <div style={{
                backgroundColor: "#F4EFEC",
                marginTop: "90px",
                color: "#555556",
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <div style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "1200px",
                    padding: "0 15px",
                    fontWeight: 350
                }}>

                    <div style={{
                        paddingTop: "30px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>

                        <div>
                            <p className={styles.networkContainer}>© 2024 LOLITA ALICE
                                <Link style={{
                                    paddingLeft: "5px"
                                }} to={"https://www.facebook.com"}>
                                    <FaFacebookF /> </Link>
                                <Link to={"https://www.instagram.com/"}>
                                    <FaInstagram /> </Link>
                                <Link to={"https://zalo.me/pc"}>
                                    <SiZalo /> </Link>
                            </p>
                        </div>
                        <div className={styles.contactContainer}>
                            <Link to={"/"}>Về chúng tôi</Link>
                            <Link to={"/"}>cửa hàng</Link>
                            <Link to={"/"}>Liên hệ</Link>
                            <Link to={"/"}>Điều kiện và điều khoản</Link>
                            <Link to={"/"}>Tuyển dụng</Link>
                        </div>
                    </div>

                    <div className={styles.infomationContainer}>
                        <div className={styles.row}>
                            <div className={styles.col1}>
                                <p className={styles.footerDes}>CÔNG TY TNHH LOLITA ALICE</p>
                                <p className={styles.footerDes}>GPKD số 0313980043 do Sở Kế hoạch và Đầu tư TP Hồ Chí Minh cấp ngày 25/08/2016</p>
                            </div>
                            <div className={styles.col2}>
                                <Link to={"/"}>
                                    <img src="https://theme.hstatic.net/1000304367/1001071053/14/logo-bct.png?v=1025" alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Footer;
