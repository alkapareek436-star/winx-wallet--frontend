import React, { useEffect, useState } from 'react'
import axios from '../lib/http'

export default function Profile(){
  const [user,setUser]=useState(null)
  const [password,setPassword]=useState('')
  const [msg,setMsg]=useState('')
  const refLink = user? `${window.location.origin}/register?ref=${user.referralCode||''}`: ''
  useEffect(()=>{ (async()=>{ const r = await axios.get("https://winxwallet.onrender.com/users/me"); setUser(r.data.user) })() },[])
  async function changePassword(e){ e.preventDefault(); setMsg(''); try{ await axios.post("https://winxwallet.onrender.com/auth/change-password",{ phone:user.phone, password }); setMsg('Password updated (demo).') }catch(e){ setMsg('Failed: '+(e.response?.data?.error||e.message)) } }
  if(!user) return <div className="card p-6">Loading...</div>
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card p-6 md:p-8 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold">
            {user.name?.[0]?.toUpperCase()||'U'}
          </div>
          <div>
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-sm text-white/70">{user.phone}</div>
          </div>
        </div>
      </div>

      {/* Details & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="text-lg font-semibold mb-4">Account Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium">{user.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium">{user.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Role</div>
              <div className="font-medium capitalize">{user.role}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Member Since</div>
              <div className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <form onSubmit={changePassword} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-sm sm:col-span-2">New Password
              <input className="input mt-1" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            </label>
            <div className="flex items-end"><button className="btn btn-primary">Update</button></div>
          </form>
          {msg && <div className="text-sm mt-3">{msg}</div>}
        </div>

        <div className="card p-6">
          <div className="text-lg font-semibold mb-2">Referral</div>
          <div className="text-sm text-gray-600 mb-3">Share this code or link to earn rewards.</div>
          <div className="bg-gray-50 border rounded-lg p-3 mb-3">
            <div className="text-xs text-gray-500">Code</div>
            <div className="font-mono font-semibold text-blue-700">{user.referralCode||'-'}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Link</div>
            <div className="flex gap-2">
              <input className="input text-xs" readOnly value={refLink} />
              <button type="button" className="btn" onClick={()=>navigator.clipboard.writeText(refLink)}>Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


