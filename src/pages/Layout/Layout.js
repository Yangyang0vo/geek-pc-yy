import React, { useLayoutEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import styles from './index.module.scss'
import { Layout, Menu, message, Popconfirm } from 'antd'
import { LogoutOutlined, HomeOutlined, DiffOutlined, EditOutlined } from '@ant-design/icons'
import { removeToken } from 'utils/storage'
import ArticleList from 'pages/ArticleList/ArticleList'
import ArticlePubulish from 'pages/ArticlePublish/ArticlePublish'
import Home from 'pages/Home/Home'
import { getUserProfile } from 'api/user'
const { Header, Content, Sider } = Layout
function getItem(label, key, icon) {
  return {
    key,
    icon,
    label
  }
}
const items = [getItem('数据概览', '/home', <HomeOutlined />), getItem('内容管理', '/home/list', <DiffOutlined />), getItem('发布文章', '/home/publish', <EditOutlined />)]

export default function LayoutCompoent() {
  // 退出系统
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState({})
  const onConfirm = () => {
    // 移除token
    removeToken()
    //跳转到登录页
    navigate('/login', { replace: true })
    message.success('退出成功')
  }
  const menuclick = (item) => {
    if (item.key === '/home') {
      navigate('/home')
    } else if (item.key === '/home/list') {
      navigate('/home/list')
    } else {
      navigate('/home/publish')
    }
  }

  // useEffect(() => {
  //   const path = location.pathname
  //   if (path === '/home') {
  //     setSelectedKey('1')
  //   } else if (path === '/home/list') {
  //     setSelectedKey('2')
  //   } else if (path === '/home/publish') {
  //     setSelectedKey('3')
  //   } else {
  //     setSelectedKey('1')
  //   }
  // }, [location.pathname])
  useLayoutEffect(() => {
    const getU = async () => {
      const res = await getUserProfile()
      if (!res && !res.data) return
      return setProfile(res.data)
    }
    getU()
  }, [])

  return (
    <div className={styles.layout}>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <div className="profile">
            <span>{profile ? profile.name : 'xxxx'}</span>
            <span>
              <Popconfirm title="您确定退出本系统吗？" okText="确定" cancelText="取消" onConfirm={onConfirm}>
                <LogoutOutlined /> {'  '}退出
              </Popconfirm>
            </span>
          </div>
        </Header>
        <Layout>
          <Sider width={200}>
            <Menu
              items={items}
              theme="dark"
              mode="inline"
              style={{
                height: '100%',
                borderRight: 0
              }}
              defaultSelectedKeys={location.pathname}
              onClick={menuclick}
            ></Menu>
          </Sider>
          <Layout
            style={{
              padding: '24px',
              overflow: 'auto'
            }}
          >
            <Content className="site-layout-background">
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/list" element={<ArticleList />}></Route>
                <Route path="/publish" element={<ArticlePubulish />}></Route>
                <Route path="*" element={<Navigate to={'/home'} />}></Route>
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}
