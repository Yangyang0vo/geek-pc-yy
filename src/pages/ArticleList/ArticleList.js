import React, { Component } from 'react'
import styles from './index.module.scss'
import { Card, Breadcrumb, Form, Radio, Button, DatePicker, Table, Tag, Space, Modal, message } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ArticleStatus } from 'api/constants'
import { delArticle, getArticles } from 'api/article'
import defaultImg from 'assets/error.png'
import Channel from 'components/Channel/Channel'
const { RangePicker } = DatePicker
export default class ArticleList extends Component {
  navigate = this.props.navigate
  // 请求参数对象
  reqParams = {
    page: 1,
    per_page: 10
  }
  state = {
    // 频道列表数据

    articles: {}
  }
  componentDidMount() {
    this.getArticles()
  }

  // 获取文章数据
  async getArticles() {
    const res = await getArticles(this.reqParams)
    this.setState({
      articles: res.data
    })
  }

  columns = [
    {
      title: '封面',
      render(data) {
        if (data.cover.type === 0) {
          // 无图片
          return <img src={defaultImg} alt="" style={{ width: 200, height: 150, objectFit: 'cover' }} />
        }
        // 有图片
        return <img src={data.cover.images[0]} alt="" style={{ width: 200, height: 150, objectFit: 'cover' }} />
      }
    },
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(status) {
        const obj = ArticleStatus.find((item) => item.id === status)
        return <Tag color={obj.color}>{obj.name}</Tag>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: (data) => {
        return (
          <Space>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                this.handleEdit(data.id)
              }}
            />
            <Button type="primary" shape="circle" danger icon={<DeleteOutlined />} onClick={() => this.delArticle(data.id)} />
          </Space>
        )
      }
    }
  ]
  render() {
    const { total_count, results, per_page, page } = this.state.articles
    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>文章列表</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form initialValues={{ status: -1 }} onFinish={this.onFinish}>
            <Form.Item label="状态" name="status">
              <Radio.Group>
                {ArticleStatus.map((item) => (
                  <Radio value={item.id} key={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item label="频道" name="channel_id">
              <Channel></Channel>
            </Form.Item>
            <Form.Item label="日期" name="date">
              <RangePicker />
            </Form.Item>

            <Form.Item className="item">
              <Button type="primary" htmlType="submit">
                筛选
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title={`根据筛选条件共查询到${total_count}条结果：`}>
          <Table dataSource={results} columns={this.columns} rowKey="id" pagination={{ position: ['bottomCenter'], total: total_count, pageSize: per_page, current: page, onChange: this.pageChange }} />;
        </Card>
      </div>
    )
  }
  onFinish = ({ status, channel_id, date }) => {
    if (status !== -1) {
      this.reqParams.status = status
    } else {
      delete this.reqParams.status
    }
    if (channel_id !== undefined) {
      this.reqParams.channel_id = channel_id
    } else {
      delete this.reqParams.channel_id
    }
    if (date) {
      this.reqParams.begin_pubdate = date[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.reqParams.end_pubdate = date[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
    } else {
      delete this.reqParams.begin_pubdate
      delete this.reqParams.end_pubdate
    }
    this.reqParams.page = 1
    this.getArticles()
  }
  pageChange = (page, pageSize) => {
    // 改变参数后 重新发送请求
    this.reqParams.page = page
    this.reqParams.per_page = pageSize
    this.getArticles()
  }
  delArticle = (id) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除该文章吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const res = await delArticle(id)
        if (res.message === 'OK') {
          message.success('删除成功', 1)
          this.getArticles()
        }
      }
    })
  }
  handleEdit = (id) => {
    this.navigate(`/home/publish/${id}`)
  }
}
