import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminDashboard(){
  const [stats,setStats]=useState({pendingDeposits:0,pendingWithdraws:0,approvedToday:0})
  const [preview,setPreview]=useState([])
  const [showQuickWithdraw,setShowQuickWithdraw]=useState(false)
  const [quickWithdraw,setQuickWithdraw]=useState({userId:'',amount:'',amountType:'INR',method:'CRYPTO'})
  const [users,setUsers]=useState([])
  
  useEffect(()=>{ 
    (async()=>{ 
      const r = await axios.get('/wallet/stats'); 
      setStats(r.data); 
      const p = await axios.get('/wallet/txns/admin',{ params:{ status:'pending' } }); 
      setPreview(p.data.slice(0,5));
      const u = await axios.get('/users/admin');
      setUsers(u.data);
    })() 
  },[])
  
  async function createQuickWithdraw(){
    try {
      await axios.post('/wallet/admin/withdraw', {
        ...quickWithdraw,
        network: 'TRC20',
        address: quickWithdraw.method === 'CRYPTO' ? 'Admin Withdrawal' : undefined
      });
      setShowQuickWithdraw(false);
      setQuickWithdraw({userId:'',amount:'',amountType:'INR',method:'CRYPTO'});
      // Reload stats
      const r = await axios.get('/wallet/stats');
      setStats(r.data);
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating withdrawal');
    }
  }
  
  return (
    <div className="p-3 md:p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="card p-4 md:p-5">
          <div className="text-sm text-gray-500">Pending Deposits</div>
          <div className="text-xl md:text-2xl font-semibold">{stats.pendingDeposits}</div>
        </div>
        <div className="card p-4 md:p-5">
          <div className="text-sm text-gray-500">Pending Withdraws</div>
          <div className="text-xl md:text-2xl font-semibold">{stats.pendingWithdraws}</div>
        </div>
        <div className="card p-4 md:p-5">
          <div className="text-sm text-gray-500">Approved Today</div>
          <div className="text-xl md:text-2xl font-semibold">{stats.approvedToday}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-4 md:p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold">Pending Approvals</div>
            <button 
              className="btn btn-sm" 
              onClick={() => setShowQuickWithdraw(!showQuickWithdraw)}
            >
              {showQuickWithdraw ? 'Hide' : 'Quick Withdraw'}
            </button>
          </div>
          
          {showQuickWithdraw && (
            <div className="mb-4 p-3 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <select 
                  className="input text-sm" 
                  value={quickWithdraw.userId} 
                  onChange={e => setQuickWithdraw({...quickWithdraw, userId: e.target.value})}
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} (Rs. {u.balance || 0} USDT)
                    </option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <input 
                    type="number" 
                    className="input text-sm flex-1" 
                    placeholder="Amount"
                    value={quickWithdraw.amount}
                    onChange={e => setQuickWithdraw({...quickWithdraw, amount: e.target.value})}
                  />
                  <select 
                    className="input text-sm w-16" 
                    value={quickWithdraw.amountType} 
                    onChange={e => setQuickWithdraw({...quickWithdraw, amountType: e.target.value})}
                  >
                    <option value="INR">₹</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
                <button 
                  className="btn btn-sm" 
                  onClick={createQuickWithdraw}
                  disabled={!quickWithdraw.userId || !quickWithdraw.amount}
                >
                  Create
                </button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">User</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Network/Method</th>
                  <th className="p-2">Payment Details</th>
                </tr>
              </thead>
              <tbody>
                {preview.map(t => (
                  <tr key={t._id} className="border-b">
                    <td className="p-2">{t.user?.name||'-'}</td>
                    <td className="p-2">{t.type}</td>
                    <td className="p-2">{t.amount}</td>
                    <td className="p-2">{t.network||t.withdrawMethod||'-'}</td>
                    <td className="p-2 text-xs">
                      {t.type === 'withdraw' ? (
                        t.withdrawMethod === 'UPI' ? `UPI: ${t.upiId || 'N/A'}` :
                        t.withdrawMethod === 'BANK' ? `BANK: ${t.bankDetails?.holderName || 'N/A'}` :
                        `Address: ${t.address || 'N/A'}`
                      ) : (
                        t.network || t.txHash || '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length===0 && <div className="text-sm text-gray-500">No pending items.</div>}
        </div>
        
        <div className="card p-4 md:p-5">
          <div className="font-semibold">Admin Tips</div>
          <ul className="text-sm text-gray-600 mt-2 list-disc pl-5 space-y-1">
            <li>Verify deposit proofs before approval.</li>
            <li>Ensure sufficient hot wallet balance for withdrawals.</li>
            <li>Keep USDT price updated in Settings.</li>
            <li>Use Quick Withdraw for manual withdrawals.</li>
            <li>Check user payment details before processing.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


