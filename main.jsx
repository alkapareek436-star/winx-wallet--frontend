import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'
import AppShell from './shell/AppShell.jsx'
import AdminShell from './shell/AdminShell.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Recharge from './pages/Recharge.jsx'
import Withdraw from './pages/Withdraw.jsx'
import Transactions from './pages/Transactions.jsx'
import Profile from './pages/Profile.jsx'
import Referral from './pages/Referral.jsx'
import Help from './pages/Help.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminTxns from './pages/admin/AdminTxns.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

function Root(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route element={<AppShell/>}>
          <Route path="/" element={<Navigate to="/dashboard" replace/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/recharge" element={<Recharge/>} />
          <Route path="/withdraw" element={<Withdraw/>} />
          <Route path="/transactions" element={<Transactions/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/referral" element={<Referral/>} />
          <Route path="/help" element={<Help/>} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route element={<AdminShell/>}>
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/users" element={<AdminUsers/>} />
          <Route path="/admin/txns" element={<AdminTxns/>} />
          <Route path="/admin/settings" element={<AdminSettings/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<Root/>)


