import React, { Component } from 'react'
import { Select } from 'antd'
import { getChannels } from 'api/channel'
const { Option } = Select

export default class Channel extends Component {
  state = {
    // 频道列表数据
    channels: []
  }
  componentDidMount() {
    this.getChannelList()
  }
  // 获取频道列表
  async getChannelList() {
    const res = await getChannels()
    this.setState({
      channels: res.data.channels
    })
  }
  render() {
    return (
      <Select
        style={{
          width: 200
        }}
        placeholder="请选择文章频道"
        value={this.props.value}
        onChange={this.props.onChange}
      >
        {this.state.channels.map((item) => (
          <Option value={item.id} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    )
  }
}
