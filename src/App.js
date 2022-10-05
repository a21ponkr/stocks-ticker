import { useEffect, useState } from 'react';
import protobuf from 'protobufjs';
const { Buffer } = require('buffer/');

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function App() {

  const [stock, setStock] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');
    protobuf.load('./PricingData.proto', (error, root) => {
      if(error) {
        return console.log(error);
      }
      const Ticker = root.lookupType('ticker');
      ws.onopen = function open() {
        console.log('connected');
        ws.send(JSON.stringify({
          subscribe: ['AMD']
        }));
      };
      
      ws.onclose = function close() {
        console.log('disconnected');
      };
      
      ws.onmessage = function incoming(message) {
        const next = Ticker.decode(new Buffer(message.data, 'base64'));
        setStock(next);
      };
    
    });
  }, []);

  return (
    <div className="App">
      <h1>AMD STOCK PRICE</h1>
      {stock && <h2>{formatPrice(stock.price)} USD</h2>}
    </div>
  );
}

export default App;