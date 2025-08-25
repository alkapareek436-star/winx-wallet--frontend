import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../lib/http'
import Logo from '../components/Logo.jsx'

export default function Register(){
  const nav = useNavigate()
  const location = useLocation()
  const [name,setName]=useState('')
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  const [ref,setRef]=useState('')
  const [ok,setOk]=useState('')

  useEffect(()=>{
    const params = new URLSearchParams(location.search)
    const qp = params.get('ref')
    if(qp) setRef(qp.toUpperCase())
  },[location.search])

  async function submit(e){ e.preventDefault(); setErr(''); setOk('')
    try{ await api.post("/auth/register",{ name, phone, password, ref }); setOk('Account created. You can login now.'); setTimeout(()=>nav('/login'),800)}catch(e){ setErr(e.response?.data?.error||e.message) }
  }
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="card p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="h-8"/>
          <div className="text-lg font-semibold">Create account</div>
        </div>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        {ok && <div className="text-green-700 text-sm mb-2">{ok}</div>}
        <input className="input mb-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input mb-3" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="input mb-4" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="mb-4">
          <input className="input w-full" placeholder="Referral Code (optional)" value={ref} onChange={e=>setRef(e.target.value)} />
          {ref && <div className="text-xs text-green-700 mt-1">Referral code applied</div>}
        </div>
        <button className="btn btn-primary w-full">Register</button>
        <p className="text-sm text-gray-500 mt-3">Already have an account? <Link className="underline" to="/login">Login</Link></p>
      </form>
    </div>
  )
}


