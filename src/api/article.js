// 封装和文章相关的接口
import request from 'utils/request'

/**
 *
 * 获取文章列表
 *
 */
export const getArticles = (params) => {
  return request({
    url: '/mp/articles',
    method: 'get',
    params
  })
}
