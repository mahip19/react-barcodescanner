import React, { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';

function App() {

    const [scannedBarcode, setScannedBarcode] = useState(null);

    const handleOnBarcodeScanned = (barcode) => {
        setScannedBarcode(barcode);
    }
    
    return (
        <div className="App">
            <h1>Barcode scanner</h1>

            <BarcodeScanner onBarcodeScanned={handleOnBarcodeScanned}/>

            <div className='container'>
                Scanned barcode: {scannedBarcode ? <p>{scannedBarcode}</p> : <p>No barcode found</p>}
            </div>

        </div>
    );
}

export default App;
