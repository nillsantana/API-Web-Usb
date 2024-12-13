const { useState } = React;

const WebUSBConnector = () => {
  const [device, setDevice] = useState(null);
  const [message, setMessage] = useState('');

  const handleConnect = async () => {
    try {
      const selectedDevice = await navigator.usb.requestDevice({ filters: [{}] });
      await selectedDevice.open(); // Abre a conexão com o dispositivo
      setDevice(selectedDevice);
      setMessage(`Device connected: ${selectedDevice.productName}`);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  const handleSendData = async () => {
    if (!device) {
      setMessage('No device connected!');
      return;
    }
    try {
      await device.selectConfiguration(1); // Configuração padrão
      await device.claimInterface(0); // Interface padrão
      const encoder = new TextEncoder();
      const data = encoder.encode('Hello USB!');
      await device.transferOut(1, data); // Envia dados ao endpoint 1
      setMessage('Data sent to device!');
    } catch (error) {
      setMessage(`Error sending data: ${error}`);
    }
  };

  return (
    <div>
      <button onClick={handleConnect}>Connect to USB Device</button>
      <button onClick={handleSendData} disabled={!device}>Send Data to Device</button>
      <p>{message}</p>
      {device && <p>Device Info: {device.productName}</p>}
    </div>
  );
};

const App = () => (
  <div>
    <h1>WEB USB</h1>
    <WebUSBConnector />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
