import { useNavigate } from 'react-router-dom'
import axios from 'axios';
function Home() {

    const navigate = useNavigate();
    const handleVNpay = () => {

        axios.post(`http://localhost:8081/api/payment/vnpay`, {
            amount: 10000 * 100,
            orderDescription: 'test description',
            orderType: 'dress'
        })
    }

    return (


        <div onClick={handleVNpay}>

            vnpay
        </div>
    );
}

export default Home;