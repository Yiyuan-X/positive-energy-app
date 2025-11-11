import React from 'react';
import ReactDOM from 'react-dom/client';

// 导入全局样式
import './index.css';

// 导入主组件
import App from './App';

// 创建React根节点
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);