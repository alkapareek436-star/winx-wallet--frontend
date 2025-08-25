import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminTxns(){
  const [list,setList]=useState([])
  const [users,setUsers]=useState([])
  const [filter,setFilter]=useState({ type:'', status:'' })
  const [showWithdrawForm,setShowWithdrawForm]=useState(false)
  const [withdrawForm,setWithdrawForm]=useState({
    userId: '',
    amount: '',
    amountType: 'INR',
    network: 'TRC20',
    address: '',
    method: 'CRYPTO',
    upiId: '',
    bank: { holderName: '', accountNumber: '', ifsc: '', bankName: '' }
  })

  async function load(){ 
    const r = await axios.get('/wallet/txns/admin',{ params: filter }); 
    const items = Array.isArray(r.data) ? r.data : (r.data?.transactions||[])
    setList(items) 
  }
  
  async function loadUsers(){
    const r = await axios.get('/users/admin');
    setUsers(r.data);
  }

  useEffect(()=>{ 
    load(); 
    loadUsers();
  },[])

  async function approve(id){ 
    await axios.post(`/wallet/approve/${id}`); 
    load() 
  }
  
  async function reject(id){ 
    await axios.post(`/wallet/reject/${id}`); 
    load() 
  }

  async function createWithdraw(){
    try {
      const response = await axios.post('/wallet/admin/withdraw', withdrawForm);
      alert(response.data.message || 'Withdrawal created successfully');
      setShowWithdrawForm(false);
      setWithdrawForm({
        userId: '',
        amount: '',
        amountType: 'INR',
        network: 'TRC20',
        address: '',
        method: 'CRYPTO',
        upiId: '',
        bank: { holderName: '', accountNumber: '', ifsc: '', bankName: '' }
      });
      load();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating withdrawal');
    }
  }

  function getPaymentDetails(txn) {
    if (txn.type === 'withdraw') {
      if (txn.withdrawMethod === 'UPI') {
        return `UPI: ${txn.upiId || 'N/A'}`;
      } else if (txn.withdrawMethod === 'BANK') {
        return `BANK: ${txn.bankDetails?.holderName || 'N/A'} - ${txn.bankDetails?.accountNumber || 'N/A'}`;
      } else {
        return `Address: ${txn.address || 'N/A'}`;
      }
    }
    return txn.address || '-';
  }

  function getUserPaymentInfo(user) {
    const details = [];
    if (user.upiId) details.push(`UPI: ${user.upiId}`);
    if (user.bankAccountNumber) details.push(`BANK: ${user.bankHolderName} - ${user.bankAccountNumber} (${user.bankName})`);
    return details.length > 0 ? details.join(', ') : 'No payment details';
  }

  return (
    <div className="p-4 max-w-7xl mx-auto grid gap-4">
      {/* Withdrawal Creation Form */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Admin Withdrawal</h2>
          <button 
            className="btn" 
            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
          >
            {showWithdrawForm ? 'Hide Form' : 'Create Withdrawal'}
          </button>
        </div>
        
        {showWithdrawForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="md:col-span-2 lg:col-span-3 mb-2">
              <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                <strong>Note:</strong> When selecting INR, the system will automatically convert to USDT using current rates. 
                User balance is checked in USDT. For UPI/BANK withdrawals, you can specify the INR amount directly.
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">User</label>
              <select 
                className="input w-full" 
                value={withdrawForm.userId} 
                onChange={e => setWithdrawForm({...withdrawForm, userId: e.target.value})}
              >
                <option value="">Select User</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.phone}) - Balance: {u.balance || 0} USDT
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className="input flex-1" 
                  placeholder="Amount"
                  value={withdrawForm.amount}
                  onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                />
                <select 
                  className="input w-24" 
                  value={withdrawForm.amountType} 
                  onChange={e => setWithdrawForm({...withdrawForm, amountType: e.target.value})}
                >
                  <option value="INR">₹</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Withdrawal Method</label>
              <select 
                className="input w-full" 
                value={withdrawForm.method} 
                onChange={e => setWithdrawForm({...withdrawForm, method: e.target.value})}
              >
                <option value="CRYPTO">Crypto</option>
                <option value="UPI">UPI</option>
                <option value="BANK">Bank Transfer</option>
              </select>
            </div>
            
            {withdrawForm.method === 'CRYPTO' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Network</label>
                  <select 
                    className="input w-full" 
                    value={withdrawForm.network} 
                    onChange={e => setWithdrawForm({...withdrawForm, network: e.target.value})}
                  >
                    <option value="TRC20">TRC20</option>
                    <option value="ERC20">ERC20</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="Wallet Address"
                    value={withdrawForm.address}
                    onChange={e => setWithdrawForm({...withdrawForm, address: e.target.value})}
                  />
                </div>
              </>
            )}
            
            {withdrawForm.method === 'UPI' && (
              <div>
                <label className="block text-sm font-medium mb-1">UPI ID</label>
                <input 
                  type="text" 
                  className="input w-full" 
                  placeholder="UPI ID"
                  value={withdrawForm.upiId}
                  onChange={e => setWithdrawForm({...withdrawForm, upiId: e.target.value})}
                />
              </div>
            )}
            
            {withdrawForm.method === 'BANK' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Holder</label>
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="Account Holder Name"
                    value={withdrawForm.bank.holderName}
                    onChange={e => setWithdrawForm({
                      ...withdrawForm, 
                      bank: {...withdrawForm.bank, holderName: e.target.value}
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Account Number</label>
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="Account Number"
                    value={withdrawForm.bank.accountNumber}
                    onChange={e => setWithdrawForm({
                      ...withdrawForm, 
                      bank: {...withdrawForm.bank, accountNumber: e.target.value}
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">IFSC Code</label>
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="IFSC Code"
                    value={withdrawForm.bank.ifsc}
                    onChange={e => setWithdrawForm({
                      ...withdrawForm, 
                      bank: {...withdrawForm.bank, ifsc: e.target.value}
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="Bank Name"
                    value={withdrawForm.bank.bankName}
                    onChange={e => setWithdrawForm({
                      ...withdrawForm, 
                      bank: {...withdrawForm.bank, bankName: e.target.value}
                    })}
                  />
                </div>
              </>
            )}
            
            <div className="md:col-span-2 lg:col-span-3">
              <button 
                className="btn w-full" 
                onClick={createWithdraw}
                disabled={!withdrawForm.userId || !withdrawForm.amount}
              >
                Create Withdrawal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="flex gap-3">
          <select className="input" value={filter.type} onChange={e=>setFilter({...filter,type:e.target.value})}>
            <option value="">All Types</option>
            <option>deposit</option>
            <option>withdraw</option>
          </select>
          <select className="input" value={filter.status} onChange={e=>setFilter({...filter,status:e.target.value})}>
            <option value="">All Status</option>
            <option>pending</option>
            <option>approved</option>
            <option>rejected</option>
          </select>
          <button className="btn" onClick={load}>Filter</button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card p-5">
        <div className="font-semibold mb-3">Transactions</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">User</th>
                <th className="p-2">Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Network</th>
                <th className="p-2">Status</th>
                <th className="p-2">Payment Details</th>
                <th className="p-2">User Payment Info</th>
                <th className="p-2">Admin Notes</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t._id} className="border-b">
            <td className="p-2">{t.user?.name} ({t.user?.phone})</td>
            <td className="p-2">{t.type}</td>
                  <td className="p-2">
                    {t.amount} USDT
                    {t.originalAmount && t.originalAmountType && (
                      <div className="text-xs text-gray-500">
                        ({t.originalAmountType} {t.originalAmount})
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    {t.type === 'withdraw' && t.withdrawMethod !== 'CRYPTO' ? (
                      <span className="text-xs text-gray-500">{t.network}</span>
                    ) : (
                      t.network
                    )}
                  </td>
                  <td className="p-2">
                    <span className={"px-2 py-1 rounded-full text-xs "+(t.status==='approved'?'bg-green-100 text-green-700':t.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700')}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-2 text-xs">{getPaymentDetails(t)}</td>
                  <td className="p-2 text-xs">{getUserPaymentInfo(t.user)}</td>
                  <td className="p-2 text-xs text-gray-600 max-w-32 truncate" title={t.adminNotes}>
                    {t.adminNotes || '-'}
                  </td>
            <td className="p-2 space-x-2">
                    {t.status==='pending' && (
                      <>
                        <button onClick={()=>approve(t._id)} className="btn btn-sm">Approve</button>
                        <button onClick={()=>reject(t._id)} className="btn btn-sm">Reject</button>
                      </>
                    )}
            </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <div className="text-sm text-gray-500 text-center py-4">No transactions found.</div>}
      </div>
    </div>
  )
}


