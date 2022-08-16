import React, { Component } from 'react'
import { Card } from 'antd'
import './index.css'
// react 中不能直接导入本地的图片 不会被webpack去进行解析
// 需要导入一个动态的
import logo from '../../assets/logo.png'
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <Card className="login-container">
          <img src={logo} alt="" className="login-logo" />
        </Card>
      </div>
    )
  }
}
