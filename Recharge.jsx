import React, { useEffect, useMemo, useState } from 'react'
import axios from '../lib/http'

export default function Recharge(){
  const [price,setPrice]=useState(0)
  const [addresses,setAddresses]=useState({ erc20Address:'', trc20Address:'' })
  const [limits,setLimits]=useState({ minDeposit: 0, maxDeposit: 0 })
  const [form,setForm]=useState({ amount:'', network:'ERC20', screenshot:null })
  const [msg,setMsg]=useState('')
  const [err,setErr]=useState('')

  useEffect(()=>{ (async()=>{ 
    const r = await axios.get("https://winxwallet.onrender.com/wallet/price"); 
    setPrice(r.data.usdtPriceINR||0); 
    setAddresses({ erc20Address:r.data.erc20Address||'', trc20Address:r.data.trc20Address||'' })
    setLimits({ minDeposit: Number(r.data.minDeposit||0), maxDeposit: Number(r.data.maxDeposit||0) })
  })() },[])

  const inr = useMemo(()=> Number(form.amount||0)*Number(price||0), [form.amount, price])
  const receiveAddress = useMemo(()=> form.network==='ERC20' ? addresses.erc20Address : addresses.trc20Address, [form.network, addresses])

  async function submit(e){ 
    e.preventDefault(); setErr(''); setMsg('')
    try{
      const fd=new FormData(); 
      fd.append('amount',form.amount); 
      fd.append('network',form.network); 
      if(form.screenshot) fd.append('screenshot',form.screenshot)
      await axios.post('/wallet/deposit', fd, { headers:{'Content-Type':'multipart/form-data'} })
      setMsg('Recharge request submitted successfully.')
      setForm({ amount:'', network:'ERC20', screenshot:null })
    }catch(e){ setErr(e.response?.data?.error||e.message) }
  }

  function copyAddress(){ if(receiveAddress){ navigator.clipboard.writeText(receiveAddress) } }

  const networkOptions = [
    { key:'ERC20', label:'ERC20 (Ethereum)' },
    { key:'TRC20', label:'TRC20 (Tron)' }
  ]

  return (
    <div className="space-y-6">
      {/* Hero / Price */}
      <div className="card p-6 md:p-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <div className="text-blue-100 text-sm font-medium">USDT Price (INR)</div>
            <div className="text-3xl md:text-4xl font-extrabold">Rs. {Number(price||0).toFixed(2)} INR</div>
            {limits.minDeposit>0 && (
              <div className="text-xs text-blue-100/90">Min: {limits.minDeposit} USDT • Max: {limits.maxDeposit} USDT</div>
            )}
          </div>
          <div className="text-sm text-blue-100/90">
            Funds are credited after on-chain confirmation and admin approval.
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Amount */}
              <label className="text-sm">
                <div className="mb-1 text-gray-700 font-medium">Amount (USDT)</div>
                <input 
                  className="input" 
                  value={form.amount} 
                  onChange={e=>setForm({...form,amount:e.target.value})} 
                  placeholder="e.g. 100"
                  type="number"
                  min={limits.minDeposit||0}
                  max={limits.maxDeposit||undefined}
                  step="0.01"
                  required
                />
                <div className="mt-1 text-xs text-gray-500">Approx INR: <b>Rs. {isNaN(inr)?'0.00':inr.toFixed(2)} INR</b></div>
                {limits.minDeposit>0 && Number(form.amount||0) < limits.minDeposit && (
                  <div className="mt-1 text-xs text-red-600">Minimum deposit is {limits.minDeposit} USDT</div>
                )}
                {limits.maxDeposit>0 && Number(form.amount||0) > limits.maxDeposit && (
                  <div className="mt-1 text-xs text-red-600">Maximum deposit is {limits.maxDeposit} USDT</div>
                )}
              </label>

              {/* Network segmented control */}
              <div className="text-sm">
                <div className="mb-1 text-gray-700 font-medium">Network</div>
                <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
                  {networkOptions.map(n => (
                    <button
                      type="button"
                      key={n.key}
                      onClick={()=>setForm({...form, network:n.key})}
                      className={"px-3 py-2 rounded-md text-center text-sm font-medium transition-colors "+(form.network===n.key?"bg-white shadow text-gray-900":"text-gray-600 hover:text-gray-900")}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Receive address card */}
            {receiveAddress && (
              <div className="mt-5 bg-gray-50 border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-700">Send USDT to this address ({form.network}):</div>
                    <div className="mt-1 font-mono break-all text-gray-900">{receiveAddress}</div>
                  </div>
                  <button type="button" className="btn" onClick={copyAddress}>Copy</button>
                </div>
              </div>
            )}

            {/* Upload proof */}
            <label className="text-sm block mt-5">
              <div className="mb-1 text-gray-700 font-medium">Upload Proof (optional)</div>
              <input className="input" type="file" onChange={e=>setForm({...form,screenshot:e.target.files?.[0]||null})}/>
            </label>

            {/* Actions & messages */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <div>
                {err && <div className="text-red-600 text-sm">{err}</div>}
                {msg && <div className="text-green-700 text-sm">{msg}</div>}
              </div>
              <button className="btn btn-primary px-6">Submit</button>
            </div>
          </div>
        </div>

        {/* Tips / Help */}
        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="font-semibold text-blue-800 mb-2">Recharge Tips</div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Double-check network before sending (ERC20/TRC20)</li>
              <li>• Send exact amount to speed up approval</li>
              <li>• Upload a clear proof screenshot (optional)</li>
            </ul>
          </div>
          <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="font-semibold text-green-800 mb-2">Need Help?</div>
            <div className="text-sm text-green-700">Visit the Help page for Telegram/WhatsApp support.</div>
            <a href="/help" className="btn btn-primary bg-green-600 hover:bg-green-700 text-white text-sm mt-3">Open Help</a>
          </div>
        </div>
      </form>
    </div>
  )
}


