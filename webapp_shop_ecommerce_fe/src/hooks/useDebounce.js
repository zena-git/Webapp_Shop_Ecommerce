import { useState, useEffect } from "react";


function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(()=>{
        const handler = setTimeout(() => {
            setDebouncedValue(value.trim());
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    })


    return debouncedValue;
}

export default useDebounce;
