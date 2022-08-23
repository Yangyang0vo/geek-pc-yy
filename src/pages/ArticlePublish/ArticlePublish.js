import React, { Component } from 'react'
import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Space, Input, Radio, Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Channel from 'components/Channel/Channel'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { baseURL } from 'utils/request'
import { addArticle, getArticleById } from 'api/article'
export default class ArticlePubulish extends Component {
  state = {
    // 文章的封面类型
    type: 1,
    // 用于控制上传的图片 以及图片的显示
    fileList: [],
    previewVisible: false,
    previewImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    id: this.props.id
  }
  async componentDidMount() {
    if (this.state.id) {
      // 有id的情况
      const res = await getArticleById(this.state.id)
      console.log(res)
      this.setState({
        ...res.data
      })
    }
  }
  formRef = React.createRef()
  render() {
    const { type, fileList, previewVisible, previewImage, id } = this.state
    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{id ? '编辑文章' : '发布文章'}</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form ref={this.formRef} labelCol={{ span: 4 }} size="large" onFinish={this.onFinish} validateTrigger={['onBlur', 'onChange']} initialValues={{ content: '11', type: type }}>
            <Form.Item
              label="频道"
              name="title"
              rules={[
                {
                  required: true,
                  message: '文章标题不能为空'
                }
              ]}
            >
              <Input style={{ width: 400 }} placeholder="请输入文章的标题"></Input>
            </Form.Item>
            <Form.Item
              label="标题"
              name="channel_id"
              rules={[
                {
                  required: true,
                  message: '请选择频道'
                }
              ]}
            >
              <Channel></Channel>
            </Form.Item>
            <Form.Item label="封面" name={'type'}>
              <Radio.Group onChange={this.changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              {/* 上传组件 */}
              {type !== 0 && (
                <Upload listType="picture-card" fileList={this.state.fileList} action={`${baseURL}/upload`} name="image" onChange={this.uploadImage} onPreview={this.handlePreview} beforeUpload={this.beforeUpload}>
                  {/* 控制上传图片的数量 */}
                  {fileList.length < type && <PlusOutlined />}
                </Upload>
              )}
            </Form.Item>

            <Form.Item label="内容" name={'content'} rules={[{ required: true, message: '请输入文章内容' }]}>
              <ReactQuill theme="snow" placeholder="请输入文章的内容"></ReactQuill>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button htmlType="submit" size="large">
                  {id ? '编辑文章' : '发布文章'}
                </Button>
                <Button type="primary" size="large" onClick={this.addDraft}>
                  存入草稿
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
        {/* 弹窗 */}
        <Modal visible={previewVisible} title={'图片预览'} footer={null} onCancel={this.handleCancel}>
          <img
            alt="example"
            style={{
              width: '100%'
            }}
            src={previewImage}
          />
        </Modal>
      </div>
    )
  }
  // 发布
  save = async (values, draft) => {
    const { fileList, type } = this.state
    if (fileList.length !== type) {
      return message.warning('上传的图片数量不正确')
    }
    const images = fileList.map((item) => {
      return item.url || item.response.data.url
    })
    const res = await addArticle(
      {
        ...values,
        cover: {
          type,
          images
        }
      },
      draft
    )
    if (res.message === 'OK') {
      message.success('添加成功', 1, () => {
        this.props.navigate('/home/list')
      })
    }
  }
  onFinish = async (values) => {
    this.save(values, false)
  }
  addDraft = async () => {
    const values = await this.formRef.current.validateFields()
    this.save(values, true)
  }
  changeType = (e) => {
    this.setState({
      type: e.target.value,
      fileList: []
    })
  }
  uploadImage = ({ fileList }) => {
    // 把上传的图片放到fileList中
    this.setState({
      fileList
    })
  }
  handlePreview = (file) => {
    const url = file.url || file.response.data.url
    this.setState({
      previewVisible: true,
      previewImage: url
    })
  }
  handleCancel = () => {
    this.setState({
      previewVisible: false,
      previewImage: ''
    })
  }
  // 上传前的校验
  beforeUpload = (file) => {
    // const isJPG = file.type === 'image/jpeg'
    // if (!isJPG) {
    //   message.error('只能上传JPG格式的图片')
    //   return Upload.LIST_IGNORE
    // }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过2MB')
      return Upload.LIST_IGNORE
    }
    return true
  }
}
