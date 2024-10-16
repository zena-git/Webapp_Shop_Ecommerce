import React, { useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';

const QRScanner = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const qrScanner = new QrScanner(videoRef.current, result => {
            console.log('QR code scanned:', result);
            // Xử lý dữ liệu từ mã QR code ở đây
        });

        qrScanner.start();

        return () => {
            qrScanner.stop();
        };
    }, []);

    return (
        <div>
            <h1>QR Code Scanner</h1>
            <video ref={videoRef} width="300" height="200" autoPlay={true}></video>
        </div>
    );
};

export default QRScanner;
