import request from 'utils/reequest'
/**
 * 登录请求 用于用户登录
 * @param {string} mobile 手机号
 * @param {string} code 验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    method: 'post',
    url: 'authorizations',
    data: {
      mobile,
      code
    }
  })
}
