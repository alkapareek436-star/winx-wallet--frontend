import React, { useState } from 'react'
import axios from '../../lib/http'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const nav = useNavigate()
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  async function submit(e){ e.preventDefault(); setErr('')
    try{ const r=await axios.post('/auth/login',{ phone, password }); if(r.data.role!=='admin') throw new Error('Admin only'); nav('/admin') }catch(e){ setErr(e.response?.data?.error||e.message) }
  }
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="card p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <input className="input mb-3" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="input mb-4" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  )
}


