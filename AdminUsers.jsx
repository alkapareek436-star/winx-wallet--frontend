import React, { useEffect, useState } from 'react'
import axios from '../../lib/http'

export default function AdminUsers(){
  const [list,setList]=useState([])
  const [q,setQ]=useState('')
  const [form,setForm]=useState({ name:'', phone:'', password:'' })
  const [loading,setLoading]=useState(false)
  
  async function load(){ 
    setLoading(true)
    try {
      const r = await axios.get('/users',{ params:{ q } }); 
      const users = Array.isArray(r.data) ? r.data : (r.data?.users || [])
      setList(users) 
    } catch (error) {
      console.error('Failed to load users:', error)
      setList([])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(()=>{ load() },[q])
  
  async function add(e){ 
    e.preventDefault(); 
    try {
      await axios.post('/users/admin/add-client', form); 
      setForm({ name:'', phone:'', password:'' }); 
      load() 
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create user')
    }
  }
  
  async function generateReferralCode(userId) {
    try {
      const response = await axios.post('/auth/admin/generate-refcode', { userId });
      alert(`Referral code generated: ${response.data.referralCode}`);
      load(); // Reload to show the new code
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate referral code');
    }
  }
  
  return (
    <div className="p-4 max-w-7xl mx-auto grid gap-4">
      <div className="card p-5">
        <div className="font-semibold mb-3">Add Client</div>
        <form onSubmit={add} className="grid md:grid-cols-4 gap-3">
          <input 
            className="input" 
            placeholder="Name" 
            value={form.name} 
            onChange={e=>setForm({...form,name:e.target.value})}
            required
          />
          <input 
            className="input" 
            placeholder="Phone" 
            value={form.phone} 
            onChange={e=>setForm({...form,phone:e.target.value})}
            required
          />
          <input 
            className="input" 
            placeholder="Temp Password" 
            value={form.password} 
            onChange={e=>setForm({...form,password:e.target.value})}
            required
          />
          <button className="btn btn-primary" type="submit">Create</button>
        </form>
      </div>
      
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Users</div>
          <div className="flex gap-2">
            <input 
              className="input" 
              placeholder="Search phone" 
              value={q} 
              onChange={e=>setQ(e.target.value)}
            />
            <button className="btn" onClick={load}>Search</button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Balance (USDT)</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Referral Code</th>
                  <th className="p-2">People Referred</th>
                  <th className="p-2">Referral Earnings (USDT)</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(u => (
                  <tr key={u._id} className="border-b">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.phone}</td>
                    <td className="p-2">Rs. {u.balance || 0} USDT</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-2">
                      {u.referralCode ? (
                        <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {u.referralCode}
                        </span>
                      ) : (
                        <span className="text-gray-400">No code</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        {u.referralCount || 0}
                      </span>
                    </td>
                    <td className="p-2">Rs. {u.referralEarnings || 0} USDT</td>
                    <td className="p-2 space-x-2">
                      {!u.referralCode && (
                        <button 
                          onClick={() => generateReferralCode(u._id)}
                          className="btn btn-sm"
                          title="Generate referral code"
                        >
                          Generate Code
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {list.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  )
}


