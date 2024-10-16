import React, { useState } from 'react';
import Compressor from 'compressorjs';
import axios from 'axios';

const useUploadImage = () => {
    const [images, setImages] = useState([]);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'aliceshop');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dgxbxvkso/image/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setImages(prevImages => [...prevImages, data.secure_url]);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleUpload = (fileList) => {
        fileList.forEach(file => {
            new Compressor(file.originFileObj, {
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 600,
                success(result) {
                    uploadImage(result);
                },
                error(error) {
                    console.error('Error compressing image:', error);
                },
            });
        });
    };

    return { images, handleUpload };
};

export default useUploadImage;
