// @ts-nocheck
import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthRoute from './components/AuthRoute/AuthRoute'
const Login = React.lazy(() => import('pages/Login/Login'))
const LayoutCompoent = React.lazy(() => import('pages/Layout/Layout'))
function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
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
    </Suspense>
  )
}

export default App
