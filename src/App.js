import React, { useState, useEffect } from 'react';
import ClientList from './components/ClientList';
import ShapePanel from './components/ShapePanel';
import axios from 'axios';

function App() {
  let [isConnect, setIsConnect] = useState(false);
  const [mode, setMode] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [shapes, setShapes] = useState([]);
  const [messages, setMessages] = useState(new Set());
  const [serverInfo, setServerInfo] = useState('');

  const serverUrl = `http://${ip}:${port}`;

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
  };

  const fetchShapes = async () => {
    try {
      const response = await axios.get(`http://localhost:5180/Shape/shapes`);
      setShapes(response.data);
    } catch (error) {
      console.error('Error fetching shapes:', error);
    }
  };

  useEffect(() => {
    if (mode === 'server') {
      console.log("server mode acik")
      fetchShapes();
    }
  }, [mode, serverUrl]);

  const handleConnect = () => {
    if (mode === 'client') {
      const ws = new WebSocket(`ws://${ip}:${port}`);
      ws.onopen = () => {
        console.log('Connected to server');
        setServerInfo(`Connected to server at ws://${ip}:${port}`);
        ws.send('Hello, server!');
        fetchShapes();

      };
      ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
        setMessages((prevMessages) => new Set(prevMessages).add(event.data));
      };
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setServerInfo('Disconnected from server');
        setIsConnect(false);
      };
    } else {
      console.log('Running in server mode');
    }
  };

  return (
    <div>
      <h1>Shape App</h1>
      {!mode && (
        <div>
          <button onClick={() => handleModeSelection('server')}>Server Mode</button>
          <button onClick={() => handleModeSelection('client')}>Client Mode</button>
        </div>
      )}
      {mode === 'client' && (
        <div>
          <input 
            type="text" 
            placeholder="Server IP" 
            value={ip} 
            onChange={(e) => setIp(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Server Port" 
            value={port} 
            onChange={(e) => setPort(e.target.value)} 
          />
          <button onClick={handleConnect}>Connect</button>
          <div>
            <h2>Server Info</h2>
            <p>{serverInfo}</p>
            <h2>Incoming Messages</h2>
            <ul>
              {[...messages].map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
            <div>
              <h2>Shapes</h2>
              <div className="shape-container" style={{ width: '800px', height: '600px', position: 'relative' }}>
                {shapes.map((shape) => {
                  const { id, type, x, y, width, height, radius, color } = shape;
                  const style = {
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    backgroundColor: color,
                    width: width,
                    height: height,
                  };
                  switch (type.toLowerCase()) {
                    case 'circle':
                      return (
                        <div
                          key={id}
                          style={{
                            ...style,
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)', // Center the circle at x, y
                          }}
                        />
                      );
                    case 'square':
                      return (
                        <div
                          key={id}
                          style={{
                            ...style,
                          }}
                        />
                      );
                    case 'rectangle':
                      return (
                        <div
                          key={id}
                          style={{
                            ...style,
                          }}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {mode === 'server' && (
        <div>
          <ShapePanel serverUrl={serverUrl} fetchShapes={fetchShapes} />
          <div>
            <h2>Shapes</h2>
            <div className="shape-container" style={{ width: '800px', height: '600px', position: 'absolute' }}>
              {shapes.map((shape) => {
                const { id, type, x, y, width, height, radius, color } = shape;
                const style = {
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  backgroundColor: color,
                  width: width,
                  height: height,
                };
                switch (type.toLowerCase()) {
                  case 'circle':
                    return (
                      <div
                        key={id}
                        style={{
                          ...style,
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)', // Center the circle at x, y
                        }}
                      />
                    );
                  case 'square':
                    return (
                      <div
                        key={id}
                        style={{
                          ...style,
                        }}
                      />
                    );
                  case 'rectangle':
                    return (
                      <div
                        key={id}
                        style={{
                          ...style,
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      )}
      {mode === 'server' && <ClientList />} {/* Sunucu modundayken ClientList bileşenini gösterir */}
    </div>
  );
}

export default App;
