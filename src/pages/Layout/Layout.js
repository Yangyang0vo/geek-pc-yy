import React, { useLayoutEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom'
import { Layout, Menu, message, Popconfirm } from 'antd'
import { LogoutOutlined, HomeOutlined, DiffOutlined, EditOutlined } from '@ant-design/icons'
import { getUserProfile } from 'api/user'
import { removeToken } from 'utils/storage'
import styles from './index.module.scss'
const ArticlePubulish = React.lazy(() => import('pages/ArticlePublish/ArticlePublish'))
const Home = React.lazy(() => import('pages/Home/Home'))
const ArticleList = React.lazy(() => import('pages/ArticleList/ArticleList'))
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
  const params = useParams()
  const [profile, setProfile] = useState({})
  const [selectedKey, setSelectedKey] = useState(location.pathname)
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

  useLayoutEffect(() => {
    const getU = async () => {
      const res = await getUserProfile()
      if (!res && !res.data) return
      return setProfile(res.data)
    }
    getU()
  }, [])
  useLayoutEffect(() => {
    if (location.pathname.startsWith('/home/publish')) {
      return setSelectedKey('/home/publish')
    }
    setSelectedKey(location.pathname)
  }, [location.pathname])

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
              selectedKeys={selectedKey}
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
                <Route path="/list" element={<ArticleList navigate={navigate} />}></Route>
                <Route path="/publish" element={<ArticlePubulish navigate={navigate} key="add" />}></Route>
                <Route path="/publish/:id" element={<ArticlePubulish navigate={navigate} id={params['*'].split('/')[1]} key="edit" />} key={params}></Route>
                <Route path="*" element={<Navigate to={'/home'} />}></Route>
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}
