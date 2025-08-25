import React, { useState, useEffect } from 'react'
import axios from '../lib/http'

export default function Withdraw(){
  const [method,setMethod]=useState('UPI') // UPI | BANK
  const [balance, setBalance] = useState(null)
  const [settings, setSettings] = useState({ minWithdrawal: 0, maxWithdrawal: 0, withdrawalFee: 0, usdtPriceINR: 0 })
  const [form,setForm]=useState({ 
    amount:'', 
    network:'TRC20', 
    address:'', 
    upiId:'', 
    bank:{ 
      holderName:'', 
      accountNumber:'', 
      ifsc:'', 
      bankName:'' 
    } 
  })
  const [msg,setMsg]=useState('')
  const [err,setErr]=useState('')
  
  // Load user balance and settings
  useEffect(() => {
    const load = async () => {
      try {
        const [b, s] = await Promise.all([
         axios.get("https://winxwallet.onrender.com/wallet/balance"),
          axios.get("https://winxwallet.onrender.com/settings/withdraw")
        ])
        setBalance({ balance: Number(b.data?.balance||0), inr: Number(b.data?.inr||0) })
        setSettings({ 
          minWithdrawal: Number(s.data?.minWithdrawal||0),
          maxWithdrawal: Number(s.data?.maxWithdrawal||0),
          withdrawalFee: Number(s.data?.withdrawalFee||0),
          usdtPriceINR: Number(s.data?.usdtPriceINR||0)
        })
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    load();
  }, []);
  
  async function submit(e){ 
    e.preventDefault(); 
    setErr(''); 
    setMsg('')
    try{ 
      // Prepare withdrawal data based on method
      let withdrawData = { 
        amount: form.amount,
        method,
        amountType: 'INR' // Explicitly set amount type to INR
      };
      
      // Add method-specific fields
      if (method === 'UPI') {
        withdrawData.upiId = form.upiId;
      } else if (method === 'BANK') {
        withdrawData.bank = form.bank;
      }
      
      await axios.post('/wallet/withdraw', withdrawData); 
      setMsg('Withdrawal request submitted successfully!'); 
      setForm({ 
        amount:'', 
        network:'TRC20', 
        address:'', 
        upiId:'', 
        bank:{ 
          holderName:'', 
          accountNumber:'', 
          ifsc:'', 
          bankName:'' 
        } 
      });
      // Reload balance after successful withdrawal
      const response = await axios.get('/wallet/balance');
      setBalance(response.data);
    }catch(e){ 
      setErr(e.response?.data?.error||e.message) 
    } 
  }
  
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="card p-6 md:p-8 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <div className="text-emerald-100 text-sm font-medium">Withdraw Funds</div>
            <div className="text-3xl md:text-4xl font-extrabold">UPI / Bank Transfer</div>
            {settings.minWithdrawal>0 && (
              <div className="text-xs text-emerald-100/90">Min: {settings.minWithdrawal} USDT • Max: {settings.maxWithdrawal} USDT • Fee: {settings.withdrawalFee}%</div>
            )}
          </div>
          {balance && (
            <div className="text-sm text-emerald-100/90">
              <div><strong>Balance:</strong> {balance.balance.toFixed(2)} USDT</div>
              <div>≈ Rs. {Number(balance.inr||0).toFixed(2)} INR</div>
              <div className="text-xs">Rate: 1 USDT = Rs. {Number(settings.usdtPriceINR||0).toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Amount */}
              <label className="text-sm">
                <div className="mb-1 text-gray-700 font-medium">Amount (INR)</div>
                <input 
                  className="input" 
                  type="number"
                  value={form.amount} 
                  onChange={e=>setForm({...form,amount:e.target.value})} 
                  placeholder="e.g. 50000"
                  min={0}
                  required
                />
                {balance && settings.usdtPriceINR>0 && (
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    <div>≈ {(Number(form.amount||0) / settings.usdtPriceINR).toFixed(2)} USDT</div>
                    {settings.minWithdrawal>0 && ((Number(form.amount||0) / settings.usdtPriceINR) < settings.minWithdrawal) && (
                      <div className="text-red-600">Minimum withdrawal is {settings.minWithdrawal} USDT</div>
                    )}
                    {settings.maxWithdrawal>0 && ((Number(form.amount||0) / settings.usdtPriceINR) > settings.maxWithdrawal) && (
                      <div className="text-red-600">Maximum withdrawal is {settings.maxWithdrawal} USDT</div>
                    )}
                    {settings.withdrawalFee>0 && (
                      <div className="text-gray-600">
                        Fee: {settings.withdrawalFee}% → Net: {(Math.max((Number(form.amount||0) / settings.usdtPriceINR) - ((settings.withdrawalFee/100) * (Number(form.amount||0) / settings.usdtPriceINR)),0)).toFixed(2)} USDT
                      </div>
                    )}
                  </div>
                )}
              </label>

              {/* Method segmented control */}
              <div className="text-sm">
                <div className="mb-1 text-gray-700 font-medium">Method</div>
                <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
                  {['UPI','BANK'].map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={()=>setMethod(m)}
                      className={"px-3 py-2 rounded-md text-center text-sm font-medium transition-colors "+(method===m?"bg-white shadow text-gray-900":"text-gray-600 hover:text-gray-900")}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic fields */}
            {method==='UPI' && (
              <label className="text-sm block mt-5">UPI ID
                <input 
                  className="input mt-1" 
                  value={form.upiId} 
                  onChange={e=>setForm({...form,upiId:e.target.value})} 
                  placeholder="username@bank"
                  required
                />
              </label>
            )}

            {method==='BANK' && (
              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <label className="text-sm">Account Holder Name
                  <input 
                    className="input mt-1" 
                    value={form.bank.holderName} 
                    onChange={e=>setForm({...form,bank:{...form.bank,holderName:e.target.value}})} 
                    required
                  />
                </label>
                <label className="text-sm">Bank Name
                  <input 
                    className="input mt-1" 
                    value={form.bank.bankName} 
                    onChange={e=>setForm({...form,bank:{...form.bank,bankName:e.target.value}})} 
                    required
                  />
                </label>
                <label className="text-sm">Account Number
                  <input 
                    className="input mt-1" 
                    value={form.bank.accountNumber} 
                    onChange={e=>setForm({...form,bank:{...form.bank,accountNumber:e.target.value}})} 
                    required
                  />
                </label>
                <label className="text-sm">IFSC
                  <input 
                    className="input mt-1" 
                    value={form.bank.ifsc} 
                    onChange={e=>setForm({...form,bank:{...form.bank,ifsc:e.target.value}})} 
                    required
                  />
                </label>
              </div>
            )}

            {/* Actions & messages */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <div>
                {err && <div className="text-red-600 text-sm">{err}</div>}
                {msg && <div className="text-green-700 text-sm">{msg}</div>}
              </div>
              <button className="btn btn-primary px-6" type="submit">Submit</button>
            </div>
          </div>
        </div>

        {/* Tips / Help */}
        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="font-semibold text-emerald-800 mb-2">Withdrawal Tips</div>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Ensure your UPI/Bank details are correct</li>
              <li>• Withdraw within the daily limits</li>
              <li>• For large withdrawals, consider multiple requests</li>
            </ul>
          </div>
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="font-semibold text-blue-800 mb-2">Need Help?</div>
            <div className="text-sm text-blue-700">Visit the Help page for Telegram/WhatsApp support.</div>
            <a href="/help" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white text-sm mt-3">Open Help</a>
          </div>
        </div>
      </form>
    </div>
  )
}


