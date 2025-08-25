import React, { useEffect, useMemo, useState } from 'react'
import axios from '../lib/http'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Dashboard(){
  const [loading,setLoading]=useState(true)
  const [balance,setBalance]=useState({ balance: 0, inr: 0 })
  const [txns,setTxns]=useState([])

  useEffect(()=>{ (async()=>{
    try{
      const [b, t] = await Promise.all([
        axios.get("https://winxwallet.onrender.com/wallet/balance"),
        axios.get("await axios.post('https://winxwallet.onrender.com/auth/login"),
      ])
      const balNum = Number(b.data?.balance||0)
      const inrNum = Number(b.data?.inr||0)
      setBalance({ balance: balNum, inr: inrNum })
      const txList = Array.isArray(t.data) ? t.data : (t.data?.transactions||[])
      setTxns(txList)
    }finally{ setLoading(false) }
  })() },[])

  const { recent, deposits30, withdrawals30, pendingCount, chartData } = useMemo(()=>{
    const now = Date.now()
    const days30 = now - 30*24*3600*1000
    const recentTx = [...txns].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,8)
    let dep=0, wit=0, pending=0
    const byDay = {}
    for(const t of txns){
      const ts = new Date(t.createdAt).getTime()
      if(ts>=days30){ if(t.type==='deposit') dep+=t.amount; if(t.type==='withdraw') wit+=t.amount }
      if(t.status==='pending') pending++
      const key = new Date(t.createdAt).toLocaleDateString()
      byDay[key] ||= { date:key, deposit:0, withdraw:0 }
      if(t.type==='deposit') byDay[key].deposit += t.amount
      else if(t.type==='withdraw') byDay[key].withdraw += t.amount
    }
    const series = Object.values(byDay).sort((a,b)=> new Date(a.date)-new Date(b.date))
    return { recent: recentTx, deposits30: dep, withdrawals30: wit, pendingCount: pending, chartData: series }
  },[txns])

  if(loading){
    return (
      <div className="grid gap-6">
        <div className="card p-6 animate-pulse h-32"/>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-6 h-24 animate-pulse"/>
          <div className="card p-6 h-24 animate-pulse"/>
          <div className="card p-6 h-24 animate-pulse"/>
        </div>
        <div className="card p-6 h-64 animate-pulse"/>
        <div className="card p-6 h-48 animate-pulse"/>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero balance & actions */}
      <div className="card p-6 md:p-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-black text-2xl md:text-3xl font-extrabold tracking-tight">WIN</span>
              <span className="text-red-700 text-4xl md:text-5xl font-extrabold leading-none">X</span>
              <span className="text-black text-2xl md:text-3xl font-extrabold tracking-tight"> Wallet</span>
            </div>
            <div className="text-sm text-blue-100 font-medium">Wallet Balance</div>
            <div className="text-3xl md:text-4xl font-bold">{balance.balance.toFixed(2)} USDT</div>
            <div className="text-sm text-blue-100">≈ Rs. {balance.inr.toFixed(2)} INR</div>
            <div className="text-xs text-blue-200">Rate: 1 USDT = Rs. {((balance.inr||0) / (balance.balance||1)).toFixed(2)}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/recharge" className="btn btn-primary bg-white text-blue-600 hover:bg-gray-50 text-center px-6 py-3 font-medium shadow-lg">
              💰 New Recharge
            </a>
            <a href="/withdraw" className="btn border-white/30 text-white hover:bg-white/10 text-center px-6 py-3 font-medium transition-colors">
              💸 Withdraw
            </a>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-600 font-medium">Deposits (30d)</div>
              <div className="text-2xl font-bold text-green-800 mt-1">{deposits30.toFixed(2)} USDT</div>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">💰</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-red-600 font-medium">Withdrawals (30d)</div>
              <div className="text-2xl font-bold text-red-800 mt-1">{withdrawals30.toFixed(2)} USDT</div>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">💸</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-yellow-600 font-medium">Pending Transactions</div>
              <div className="text-2xl font-bold text-yellow-800 mt-1">{pendingCount}</div>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">Total Transactions</div>
              <div className="text-2xl font-bold text-blue-800 mt-1">{txns.length}</div>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold text-gray-800">30-Day Activity Overview</div>
          <div className="text-sm text-gray-500">Transaction Volume Analysis</div>
        </div>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="dep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="wit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280"/>
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280"/>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area type="monotone" name="Deposits" dataKey="deposit" stroke="#10b981" fillOpacity={1} fill="url(#dep)" strokeWidth={2} />
              <Area type="monotone" name="Withdrawals" dataKey="withdraw" stroke="#ef4444" fillOpacity={1} fill="url(#wit)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold text-gray-800">Recent Transactions</div>
          <a href="/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="p-3 font-medium text-gray-700">Type</th>
                <th className="p-3 font-medium text-gray-700">Amount</th>
                <th className="p-3 font-medium text-gray-700">Network</th>
                <th className="p-3 font-medium text-gray-700">Status</th>
                <th className="p-3 font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(t=>(
                <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {t.type === 'deposit' ? '💰' : '💸'} {t.type}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-900">{t.amount} USDT</td>
                  <td className="p-3 text-gray-600">{t.network}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.status==='approved'?'bg-green-100 text-green-700':
                      t.status==='rejected'?'bg-red-100 text-red-700':
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recent.length===0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">📊</div>
            <div className="text-gray-500">No transactions yet</div>
            <div className="text-sm text-gray-400 mt-1">Start by making your first deposit</div>
          </div>
        )}
      </div>

      {/* Helpful info row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-lg">🚀</span>
            </div>
            <div>
              <div className="font-semibold text-blue-800 mb-2">Getting Started</div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use Recharge to top-up your balance</li>
                <li>• Track all activity in Transactions</li>
                <li>• Update password from Profile</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-lg">🔒</span>
            </div>
            <div>
              <div className="font-semibold text-green-800 mb-2">Security Tips</div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Never share OTP or passwords</li>
                <li>• Verify network before sending</li>
                <li>• Use verified exchanges/wallets</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-lg">💬</span>
            </div>
            <div>
              <div className="font-semibold text-purple-800 mb-2">Need Help?</div>
              <p className="text-sm text-purple-700 mb-3">Visit our Help page for Telegram/WhatsApp support.</p>
              <a href="/help" className="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2">
                Open Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


