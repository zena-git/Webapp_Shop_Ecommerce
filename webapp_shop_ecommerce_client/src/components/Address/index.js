import './Address.css';
import React, { useState, useEffect , useContext} from 'react';
import { Button, Modal, Radio, Space } from 'antd';
import axios from "axios";
import DataContext from "~/DataContext";

function Address() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressCustomer, setAddressCustomer] = useState(1);
    const [addressCustomerModal, setAddressCustomerModal] = useState();
    const [lstAddressCustomer, setLstAddressCustomer] = useState([]);
    const {setAddressBillClient } = useContext(DataContext);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v2/address')
            .then(response => {
                console.log(response);
                setLstAddressCustomer(response.data)
                setAddressCustomer(response.data[0])
                setAddressBillClient(response.data[0])
            })
            .catch(error => {
                console.log(error);
            })
    }, [])
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        console.log(addressCustomerModal);
        setAddressCustomer(addressCustomerModal)
        setAddressBillClient(addressCustomerModal)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onChangeAddress = (e) => {
        const selectedAddress = lstAddressCustomer.find(address => address.id === e.target.value);
        // console.log('radio checked', selectedAddress);
        setAddressCustomerModal(selectedAddress)
    }
    return (
        <>
            <div className="box_address">
                <div className='box_address-tile'>
                    <h4>Địa Chỉ Nhận Hàng</h4>
                </div>
                <div className='box_address-body'>

                    <div className='address_body-name'>
                        <span>{addressCustomer.receiverName}</span>
                        <span>({addressCustomer.receiverPhone})</span>
                    </div>

                    <div>
                        <span>{addressCustomer.detail + ' , ' + addressCustomer.commune + ' , ' + addressCustomer.district + ' , ' + addressCustomer.province}
                        </span>
                    </div>
                    <div className='address_body-btn' onClick={showModal}>
                        Thay Đổi
                    </div>
                </div>
            </div>

            <div>

                <Modal width='600px' title="Địa Chỉ Của Tôi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                    <Radio.Group onChange={onChangeAddress} style={{ width: '100%' }} defaultValue={addressCustomer?.id} >
                        {lstAddressCustomer.map((address) => (
                            <Radio key={address.id} value={address.id} className='radio_address'>
                                <div className='radio_address-name'>
                                    <span className='address_name'>{address.receiverName}</span>
                                    <span>{address.receiverPhone}</span>
                                </div>
                                <div className='radio_address-body'>
                                    <p style={{ margin: '0' }}>
                                        {address.detail + ' , ' + address.commune + ' , ' + address.district + ' , ' + address.province}
                                    </p>
                                </div>
                            </Radio>
                        ))}
                    </Radio.Group>
                </Modal>
            </div>
        </>
    );
}

export default Address;