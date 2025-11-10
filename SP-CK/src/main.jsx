// src/main.jsx (Đã bỏ StrictMode)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode> đã được tạm thời comment lại để tránh render 2 lần
    // trong môi trường phát triển, giúp ổn định WebSocket.
    // Khi build sản phẩm, bạn có thể bật lại nếu muốn.
    <App />
);