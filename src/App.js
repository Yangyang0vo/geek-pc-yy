// @ts-nocheck
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from 'pages/Login/Login'
import AuthRoute from './components/AuthRoute/AuthRoute'
import LayoutCompoent from 'pages/Layout/Layout'
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route
        path="/home/*"
        element={
          <AuthRoute>
            <LayoutCompoent />
          </AuthRoute>
        }
      ></Route>
      <Route path="*" element={<Navigate to={'/home'} />}></Route>
    </Routes>
  )
}

export default App
