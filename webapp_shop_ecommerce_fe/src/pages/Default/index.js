import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { Image } from 'cloudinary-react';
import Compressor from 'compressorjs';
import useUploadImage from '~/hooks/useUploadImage';
import BarcodeScanner from '~/components/BarcodeScanner';

function Default() {



    const customRequest = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    return (
        <div>
            <h2>Default</h2>
        <BarcodeScanner></BarcodeScanner>
        </div>
    );
}

export default Default;