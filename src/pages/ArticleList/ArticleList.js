import React, { Component } from 'react'
import styles from './index.module.scss'
import { Card, Breadcrumb, Form, Radio, Button, Select, DatePicker, Table } from 'antd'
import { Link } from 'react-router-dom'
import { ArticleStatus } from 'api/constants'
import { getChannels } from 'api/channel'
import { getArticles } from 'api/article'
import defaultImg from 'assets/error.png'
const { RangePicker } = DatePicker
const { Option } = Select
export default class ArticleList extends Component {
  state = {
    // 频道列表数据
    channels: [],
    articles: {}
  }
  componentDidMount() {
    this.getChannelList()
    this.getArticles()
  }
  // 获取频道列表
  async getChannelList() {
    const res = await getChannels()
    this.setState({
      channels: res.data.channels
    })
  }
  // 获取文章数据
  async getArticles() {
    const res = await getArticles()
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
      dataIndex: 'status'
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
      title: '操作'
    }
  ]
  render() {
    const { total_count, results } = this.state.articles
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
              <Select
                style={{
                  width: 200
                }}
                placeholder="请选择文章频道"
              >
                {this.state.channels.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
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
          <Table dataSource={results} columns={this.columns} rowKey="id" />;
        </Card>
      </div>
    )
  }
  onFinish = (values) => {
    console.log(values)
  }
}
