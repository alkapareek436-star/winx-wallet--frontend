import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../lib/http'
import Logo from '../components/Logo.jsx'

export default function Login(){
  const nav = useNavigate()
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  async function submit(e){ e.preventDefault(); setErr('')
    try{ await axios.post("https://winxwallet.onrender.com/auth/login",{ phone, password }); nav('/dashboard') }catch(e){ setErr(e.response?.data?.error||e.message) }
  }
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="card p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <Logo withText={false} size="h-8"/>
          <div className="text-lg font-semibold">Login</div>
        </div>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <input className="input mb-3" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="input mb-4" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full">Login</button>
        <p className="text-sm text-gray-500 mt-3">No account? <Link className="underline" to="/register">Register</Link></p>
      </form>
    </div>
  )
}


