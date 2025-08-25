import React, { useEffect, useState } from 'react'
import axios from '../lib/http'

export default function Transactions(){
  const [list,setList]=useState([])
  const [loading,setLoading]=useState(true)
  const [page,setPage]=useState(1)
  const [pagination,setPagination]=useState({ page:1, limit:20, total:0, pages:1 })
  const [filters,setFilters]=useState({ type:'', status:'' })

  async function load(p=1){
    setLoading(true)
    try{
      const r = await axios.get("https://winxwallet.onrender.com/transactions",{ params:{ page:p, limit:20, type:filters.type||undefined, status:filters.status||undefined } })
      const items = Array.isArray(r.data)? r.data : (r.data?.transactions||[])
      const pg = r.data?.pagination || { page:p, limit:20, total:items.length, pages:1 }
      setList(items)
      setPagination(pg)
      setPage(pg.page)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ load(1) },[])

  function statusBadge(s){
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '
    if(s==='approved') return base+'bg-green-100 text-green-700'
    if(s==='rejected') return base+'bg-red-100 text-red-700'
    return base+'bg-yellow-100 text-yellow-700'
  }

  function typeBadge(t){
    const base='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '
    return base + (t==='deposit'?'bg-blue-100 text-blue-700':'bg-purple-100 text-purple-700')
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-gray-800">Transactions</div>
            <div className="text-xs text-gray-500">Total: {pagination.total} • Page {pagination.page} of {pagination.pages}</div>
          </div>
          <div className="flex gap-2">
            <select className="input" value={filters.type} onChange={e=>setFilters({...filters,type:e.target.value})}>
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
            <select className="input" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn" onClick={()=>load(1)}>Filter</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="p-3 font-medium text-gray-700">Type</th>
                    <th className="p-3 font-medium text-gray-700">Amount (USDT)</th>
                    <th className="p-3 font-medium text-gray-700">Network / Method</th>
                    <th className="p-3 font-medium text-gray-700">Status</th>
                    <th className="p-3 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(t=> (
                    <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3"><span className={typeBadge(t.type)}>{t.type==='deposit'?'💰 Deposit':'💸 Withdraw'}</span></td>
                      <td className="p-3 font-medium text-gray-900">{t.amount}</td>
                      <td className="p-3 text-gray-600">{t.type==='withdraw' ? (t.withdrawMethod || t.network) : t.network}</td>
                      <td className="p-3"><span className={statusBadge(t.status)}>{t.status}</span></td>
                      <td className="p-3 text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {list.length===0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">📭</div>
                <div className="text-gray-500">No transactions found</div>
              </div>
            )}
            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <button className="btn" disabled={page<=1} onClick={()=>load(page-1)}>Previous</button>
              <div className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</div>
              <button className="btn" disabled={page>=pagination.pages} onClick={()=>load(page+1)}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


