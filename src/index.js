import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

// 导入全局样式
import './index.css';


// 创建React根节点
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);