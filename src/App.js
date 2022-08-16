// @ts-nocheck
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Layout from './pages/Layout/Layout'
function App() {
  return (
    <Router>
      <div className="App">App根组件</div>

      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/layout" element={<Layout />}></Route>
        <Route path="*" element={<Navigate to={'/login'} />}></Route>
      </Routes>
    </Router>
  )
}

export default App
