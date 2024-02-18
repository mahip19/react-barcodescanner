import React, { useRef, useEffect, useState } from "react";
import Quagga from 'quagga';

// import { useZxing } from "react-zxing";

// import { useMediaDevices, useMediadevices } from "react-media-devices";
// import { getUserMedia } from "quagga";

const BarcodeScanner = ({ onBarcodeScanned }) => {
    const videoRef = useRef();
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');

    useEffect(() => {
      const fetchCameras = async () => {
        try{
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter( device => device.kind === 'videoinput');
            setCameras(videoDevices);
            setSelectedCamera(videoDevices[0]?.deviceId || '');
        }
        catch (err){
            console.error('camera fetching error ', err);
        }
      }
    
      fetchCameras();
    }, [])
    
    console.log(cameras);
    useEffect(() => {

        if (!selectedCamera) return;

      Quagga.init({
        inputStream: {
        name: "Live",
        type: "LiveStream",
        target: videoRef.current,
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment"
        },
      },
      decoder: {
        readers: ["ean_reader"]
      },
    }, function (err) {
        if (err){
            console.error('quagga err ', err)
            return;
        }
        Quagga.start();
    });
    
    Quagga.onDetected( data => {
        onBarcodeScanned(data.codeResult.code);
    });
      return () => {
        Quagga.stop();
      };
    }, [selectedCamera, onBarcodeScanned])

    const handleCamerachange = (e) => {
        setSelectedCamera(e.target.value);
    }

    return (
        <div>
            <span>Available devices: {cameras.length}</span>
            <select value={selectedCamera} onChange={handleCamerachange}>
                {cameras.map(camera => (
                    <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>
                ))}
            </select>
            <video ref={videoRef}/>
        </div>
    )

}

export default BarcodeScanner;
