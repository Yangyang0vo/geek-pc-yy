import React from 'react'
import { hasToken } from 'utils/storage'
import { Navigate, useLocation } from 'react-router-dom'
export default function AuthRoute({ children }) {
  // const Navigate = useNavigate()
  const location = useLocation()
  const render = () => {
    // 判断是否有token 有就放行  没有导航到登录
    if (hasToken()) {
      return children
    } else {
      return (
        <Navigate
          to={'/login'}
          state={{
            from: location.pathname
          }}
        ></Navigate>
      )
    }
  }

  return render()
}
