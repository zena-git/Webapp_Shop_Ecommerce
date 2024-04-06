import React, { useState, useEffect,useContext } from 'react';
import { Button, Modal, Radio, Space, Input, Select } from 'antd';
import axios from "axios";
import './AddressGress.css';
import DataContext from "~/DataContext";
function AddressGress() {
    const {setAddressBillClient } = useContext(DataContext);



    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);


    const [valueProvince, setValueProvince] = useState(null);
    const [valueDistrict, setValueDistrict] = useState(null);
    const [valueWard, setValueWard] = useState(null);


    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [details, setDetails] = useState('');
    const [labelProvince, setLabelProvince] = useState(null);
    const [labelDistrict, setLabelDistrict] = useState(null);
    const [labelWard, setLabelWard] = useState(null);

    useEffect(() =>{
        const address = {
            receiverName: fullName,
            email: email,
            receiverPhone: phone,
            receiverDetails: details,
            receiverCommune: labelWard,
            receiverDistrict: labelDistrict,
            receiverProvince: labelProvince,
        }
        setAddressBillClient(address)
    },[fullName, email, phone, details, labelProvince , labelDistrict, labelDistrict, labelWard])

    //lấy province
    useEffect(() => {
        axios.get('https://vapi.vnappmob.com/api/province')
            .then((response) => {
                const lstProvince = response.data.results.map((result) => {
                    return {
                        value: result.province_id,
                        label: result.province_name
                    }
                })
                setDataProvince(lstProvince)
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }, [])

    //lấy district
    useEffect(() => {
        if (valueProvince != null) {
            axios.get('https://vapi.vnappmob.com/api/province/district/' + valueProvince)
                .then((response) => {
                    const lstDistrict = response.data.results.map((result) => {
                        return {
                            value: result.district_id,
                            label: result.district_name
                        }
                    })
                    setDataDistrict(lstDistrict)
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueProvince])
    
    //lấy ward
    useEffect(() => {
        if (valueDistrict != null) {
            axios.get('https://vapi.vnappmob.com/api/province/ward/' + valueDistrict)
                .then((response) => {
                    const lstWard = response.data.results.map((result) => {
                        return {
                            value: result.ward_id,
                            label: result.ward_name
                        }
                    })
                    setDataWard(lstWard)
                })
                .catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [valueDistrict])

    const handleChangeProvince = (value) => {
        if (value) {
            const selectedOption = dataProvince.find(option => option.value === value);
            setValueProvince(selectedOption.value)
            setLabelProvince(selectedOption.label)
            setValueDistrict(null)
            setValueWard(null)
        }

    };

    const handleChangeDistrict = (value) => {
        if (value) {
            const selectedOption = dataDistrict.find(option => option.value === value);
            setValueDistrict(selectedOption.value)
            setLabelDistrict(selectedOption.label)
            setValueWard(null)
        }

    };
    const handleChangeWard = (value) => {
        if (value) {
            const selectedOption = dataWard.find(option => option.value === value);
            setValueWard(selectedOption.value)
            setLabelWard(selectedOption.label)
        }

    };


    return (<>
        <div className="box_addressGress">
            <div className='box_addressGress-tile'>
                <h4>Thông tin giao hàng</h4>
            </div>
            <div className='box_addressGress-body'>
                <div>
                    <label>Họ Và Tên</label>
                    <Input style={{marginTop: '2px'}}  placeholder="Họ Và Tên"  onChange={(e)=>{setFullName(e.target.value)}} />
                </div>
                <div className='addressGress_body-emailphone'>
                    <div style={{ flex: '0.9' }}>
                        <label>Email</label>
                        <Input style={{marginTop: '2px'}} type="email" placeholder="Email"  onChange={(e)=>{setEmail(e.target.value)}}  />
                    </div>
                    <div >
                        <label>Số Điện Thoại</label>
                        <Input style={{marginTop: '2px'}}  placeholder="Số Điện Thoại"  onChange={(e)=>{setPhone(e.target.value)}}  />
                    </div>
                </div>


                <div>
                    <label>Địa Chỉ</label>
                    <Input style={{marginTop: '2px'}} placeholder="Địa Chỉ"  onChange={(e)=>{setDetails(e.target.value)}}  />
                </div>

                <div className='addressGress_body-address'>
                    <div>
                        <label>Tỉnh/Thành</label>
                        <Select
                             style={{marginTop: '2px'}} 
                            placeholder="Tỉnh/Thành"
                            options={dataProvince}
                            value={valueProvince}
                            onChange={handleChangeProvince}
                        />
                    </div>

                    <div>
                        <label>Quận/Huyện</label>
                        <Select
                            style={{marginTop: '2px'}} 
                            placeholder="Quận/Huyện"
                            options={dataDistrict}
                            value={valueDistrict}
                            onChange={handleChangeDistrict}
                        />
                    </div>
                    <div>
                        <label>Phường/Xã</label>
                        <Select
                            style={{marginTop: '2px'}} 
                            placeholder="Phường/Xã"
                            options={dataWard}
                            value={valueWard}
                            onChange={handleChangeWard}
                        />
                    </div>
                </div>


            </div>
        </div>
    </>);
}

export default AddressGress;