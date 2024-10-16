import React, { useState, useEffect } from "react";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd'
import './InputNumber.scss';
function InputNumber({ value = 1, onChange, min = 0, max = 0, ...props }) {
    const [inputValue, setInputValue] = useState(value);
    const [invalidInput, setInvalidInput] = useState(false);
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && newValue !== '') {
            const parsedValue = parseFloat(newValue);
            if (parsedValue >= min && parsedValue <= max) {
                setInputValue(parsedValue);
                onChange(parsedValue);
            } else if (parsedValue < min) {
                setInputValue(min);
                onChange(min);
            } else if (parsedValue > max) {
                setInputValue(max);
                onChange(max);
            }
        } else {
            setInputValue(min); // Hoặc có thể truyền giá trị mặc định tùy theo yêu cầu
        }
    };

    const handleIncrease = () => {
        const newValue = parseFloat(inputValue) + 1;
        if (newValue <= max) {
            setInputValue(newValue);
            onChange(newValue);
        }
    };

    const handleDecrease = () => {
        const newValue = parseFloat(inputValue) - 1;
        if (newValue >= min) {
            setInputValue(newValue);
            onChange(newValue);
        }
    };

    return (
        <>
            <div className="flex">
                <Button className="input_number_btn" onClick={handleDecrease} {...props} ><MinusOutlined /></Button>
                <input type="text" value={inputValue} onChange={handleChange} {...props} className="input_number" />
                {/* <InputNumber className="text-center	rounded-none w-[40px]" controls={false} min={min} max={max} value={inputValue} onChange={handleChange} /> */}
                <Button className="input_number_btn" onClick={handleIncrease}{...props}><PlusOutlined /></Button>
            </div>
        </>
    );
}

export default InputNumber;
