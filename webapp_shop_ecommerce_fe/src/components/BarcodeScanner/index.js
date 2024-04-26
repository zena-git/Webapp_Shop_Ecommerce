import React, { useEffect, useState } from 'react'
import Quagga from 'quagga'
import { Button, } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const BarcodeScanner = ({ isOpenModalQrcode, idBill, setIsOpenModalQrcode, handleAddProductDetailsQrCode }) => {
  const [cameraOpen, setCameraOpen] = useState(true)
  const [valueScan, setValueScan] = useState(null);

  useEffect(() => {
    if (isOpenModalQrcode) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 640,
              height: 320,
              facingMode: 'environment',
            },
          },
          locator: {
            halfSample: true,
            patchSize: 'large',
            debug: {
              showCanvas: true,
              showPatches: false,
              showFoundPatches: false,
              showSkeleton: false,
              showLabels: false,
              showPatchLabels: false,
              showRemainingPatchLabels: false,
              boxFromPatches: {
                showTransformed: true,
                showTransformedBox: true,
                showBB: true,
              },
            },
          },
          numOfWorkers: 4,
          decoder: {
            readers: ['code_128_reader'
              // , "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader", "2of5_reader", "code_93_reader"
            ],
            debug: {
              drawBoundingBox: true,
              showFrequency: true,
              drawScanline: true,
              showPattern: true,
            },
          },
          locate: true,
        },
        function (err) {
          if (err) {
            return console.log(err)
          }
          Quagga.start()
        },
      )
      Quagga.onDetected(_onDetected)
    } else {
      Quagga.stop()
    }
    return () => {
      Quagga.offDetected(_onDetected)
    }
  }, [setIsOpenModalQrcode])

  const toggleCamera = () => {
    setCameraOpen(!cameraOpen)
  }

  const _onDetected = (result) => {
    console.log(result.codeResult.code);
    if (valueScan == result.codeResult.code) {
      return;
    }
    setValueScan(result.codeResult.code);
    setTimeout(() => {
      setValueScan(null);
    }, 2000);
  }
  useEffect(() => {
    if (valueScan !== null) {
      handleAddProductDetailsQrCode(valueScan);
    }
  }, [valueScan]);

  return (
    <div>
      <div style={{
        width: '640px',
        height: '320px',
        backgroundColor: 'black'
      }}>
        {cameraOpen && <div id="interactive" className="viewport" />}
      </div>

      <div className='flex justify-end	mt-6'>
        <Button className='ml-4' onClick={() => {
          toggleCamera()
          setIsOpenModalQrcode(false)
        }}>
          Thoát
        </Button>
      </div>
    </div>
  )
}

export default BarcodeScanner;
