import React, { useState, useEffect } from 'react'
import { Card, Button, Checkbox, Form, Input, message } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.scss'
// react 中不能直接导入本地的图片 不会被webpack去进行解析
// 需要导入一个动态的
import logo from 'assets/logo.png'
import { login } from 'api/user'
import { hasToken, setToken } from 'utils/storage'

export default function Login() {
  const location = useLocation()
  // 解构回调页面
  const { state } = location
  // 传入一个状态isloading和一个更改loding的状态的方法 默认loading是false
  const [isloading, setLoading] = useState(false)
  // 编程式导航  Navigate
  const navigate = useNavigate()
  // 判断是否是从home因为授权重定向到此处的 如果是 给予提示框 如果否 return
  useEffect(() => {
    // if (!state.from) return
    // if (state.msg && state.msg === 401) return message.warning('登录信息过期，请重新登录', 0.4)
    if (hasToken()) return
    message.info('您没有登录，请登录后在进入', 0.9)
    // 传入第二个参数 state 当state的值发生变化时该函数才会执行
  }, [])
  // 登录按钮调用该方法
  const onFinish = async ({ mobile, code }) => {
    try {
      //点击按钮之后设置loading为true
      setLoading(true)
      const res = await login(mobile, code)
      message.success('登录成功', 1, () => {
        // 登录成功
        // 1.保存token
        setToken(res.data.token)
        // 2.跳转 如果有from  跳转到from  没有则跳到首页
        console.log(state)
        if (state && state.from) {
          navigate(state.from, { replace: true })
        } else {
          navigate('/home', { replace: true })
        }
        //请求结束之后loading为false
        setLoading(false)
      })
    } catch (error) {
      message.warning(error.response.data.message, 1, () => {
        // 登录出错之后loading也要为false
        setLoading(false)
      })
    }
  }

  return (
    <div className={styles.login}>
      <Card className="login-container">
        <img src={logo} alt="" className="login-logo" />
        {/* 表单 */}
        <Form autoComplete="off" size="large" validateTrigger={['onChange', 'onBlur']} onFinish={onFinish} initialValues={{ mobile: '13911111111', code: '246810', agree: true }}>
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: '手机号不能为空'
              },
              {
                pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                message: '手机号格式错误'
              }
            ]}
          >
            <Input placeholder="请输入您的手机号" autoComplete="off" />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: '验证码不能为空'
              },
              {
                pattern: /^\d{6}$/,
                message: '验证码格式错误'
              }
            ]}
          >
            <Input placeholder="请输入验证码" autoComplete="off" />
          </Form.Item>

          <Form.Item
            valuePropName="checked"
            name="agree"
            rules={[
              {
                // 自定义校验规则
                // validator: (rule, value) => {
                //   if (value) {
                //     return Promise.resolve()
                //   } else {
                //     return Promise.reject(new Error('请阅读并同意用户协议'))
                //   }
                // },
                validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议'))),
                message: '请阅读并同意隐私条款和用户协议'
              }
            ]}
          >
            <Checkbox>我已阅读并同意[隐私条款]和[用户协议]</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isloading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
