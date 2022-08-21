// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
// 导入antd的全局样式
//esl int-disable-next-
import 'antd/dist/antd.min.css'
import './index.css'
import App from './App'
import { ConfigProvider } from 'antd'
// 导入中文包
import 'moment/locale/zh-cn'
import locale from 'antd/es/locale/zh_CN'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Router>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </Router>
)
