// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
// 导入antd的全局样式
//esl int-disable-next-
import 'antd/dist/antd.min.css'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Router>
    <App />
  </Router>
)
