import React, { useEffect, useState } from 'react'
import Quagga from 'quagga'
import { Button,Modal } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const BarcodeScanner = ({ idBill, handleAddProductDetailsQrCode }) => {
  const [cameraOpen, setCameraOpen] = useState(true)
  const [valueScan, setValueScan] = useState(null);
  const [isOpenModalQrcode, setIsOpenModalQrcode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpenModalQrcode && !initialized) {
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
            // 'x-small': Kích thước mảnh rất nhỏ.
            // 'small': Kích thước mảnh nhỏ.
            // 'medium': Kích thước mảnh trung bình.
            // 'large': Kích thước mảnh lớn.
            // 'x-large': Kích thước mảnh rất lớn
            patchSize: 'x-large',
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
          numOfWorkers: 10,
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
          console.log("mở cam");
          Quagga.start()
        },
      )
      Quagga.onProcessed(result => {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              Number(drawingCanvas.getAttribute("width")),
              Number(drawingCanvas.getAttribute("height"))
            );
            result.boxes
              .filter(function (box) {
                return box !== result.box;
              })
              .forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: "green",
                  lineWidth: 2
                });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: "#00F",
              lineWidth: 2
            });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingCtx,
              { color: "red", lineWidth: 3 }
            );
          }
        }
      });
      Quagga.onDetected(_onDetected)
      setInitialized(true);
    }

    if (!isOpenModalQrcode && initialized) {
      console.log("đóng cam");
      Quagga.stop();
      setValueScan(null);
      setInitialized(false);
    }
    return () => {
      Quagga.offDetected(_onDetected)
    }
  }, [isOpenModalQrcode])

  const _onDetected = (result) => {
    console.log(result.codeResult.code);
    if (valueScan == result.codeResult.code) {
      return;
    }
    setValueScan(result.codeResult.code);

  }
  useEffect(() => {
    if (valueScan !== null) {
      handleAddProductDetailsQrCode(valueScan);
      setTimeout(() => {
        setValueScan(null);
      }, 2000);
    }
   
  }, [valueScan]);

  return (
    <div>
    <Button className='ml-4' onClick={() => {
      setIsOpenModalQrcode(true);
    }}>QR Code</Button>
    <>
      <Modal width={700} title="Quét Barcode" open={isOpenModalQrcode} footer={null} onCancel={() => {
        setIsOpenModalQrcode(false);
      }}>

        <div >
          <div>
            <div style={{
              width: '640px',
              height: '320px',
              backgroundColor: 'black',
              cursor: 'pointer',
              position: 'relative',
             
            }}>
              {isOpenModalQrcode && <div id="interactive" className="viewport" />}

            </div>
            <div className='flex justify-end	mt-6'>
              <Button className='ml-4' onClick={() => {
                setValueScan(null);
                setIsOpenModalQrcode(false)
              }}>
                Thoát
              </Button>
            </div>
          </div>
        </div>

      </Modal>
    </>

  </div>
  )
}

export default BarcodeScanner;
