// DataProvider.js
import React, { useEffect, useState, useCallback } from 'react';
import DataContext from '../DataContext';
import axios from "axios";

const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [dataCheckout, setDataCheckout] = useState([]);

    useEffect(() => {
        const fetchDataAndSetState = async () => {
            axios.get('http://localhost:8080/api/v2/cart')
                .then(res => {

                    setData(res.data.lstCartDetails.sort((a, b) => a.id - b.id));
                })
                .catch(err => {
                    console.log(err);
                })
        };

        fetchDataAndSetState();
    }, []); // Chỉ gọi API khi component được tạo
    const updateData = useCallback(async () => {
        axios.get('http://localhost:8080/api/v2/cart')
            .then(res => {
                setData(res.data.lstCartDetails.sort((a, b) => a.id - b.id));
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const deleteData = useCallback(async (itemId) => {
        axios.delete('http://localhost:8080/api/v2/cartDetails/' + itemId)
            .then(res => {
                updateData()
            })
            .catch(err => {
                console.log(err);
            })
    }, []);
    const setLstDataCheckout = (newData) => {
        // console.log(newData);
        const lstCartDetail = newData.map((idData)=>{
            return data.find(cartDetail => cartDetail.id === idData);
        }) 
        console.log(lstCartDetail);
        setDataCheckout(lstCartDetail)
    };


    const dataContextValue = {
        data,
        dataLength: data.length,
        dataCheckout,
        updateData, // Include the updateData function in the context
        deleteData,
        setLstDataCheckout,
    };

    return (
        <DataContext.Provider value={dataContextValue}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
