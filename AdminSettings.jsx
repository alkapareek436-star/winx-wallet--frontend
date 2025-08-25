import React, { useEffect, useState } from 'react'
import axios from '../../lib/http'

export default function AdminSettings(){
  const [price,setPrice]=useState('')
  const [erc20,setErc20]=useState('')
  const [trc20,setTrc20]=useState('')
  const [telegram,setTelegram]=useState('')
  const [whatsapp,setWhatsapp]=useState('')
  const [basePct,setBasePct]=useState('1')
  const [tiers,setTiers]=useState([{min:'0',max:'100',pct:'1'}])
  const [msg,setMsg]=useState('')
  useEffect(()=>{ (async()=>{ const r = await axios.get('/settings'); setPrice(String(r.data.usdtPriceINR||'')); setErc20(r.data.erc20Address||''); setTrc20(r.data.trc20Address||''); setTelegram(r.data.supportTelegram||''); setWhatsapp(r.data.supportWhatsApp||''); if(typeof r.data.referralBasePct==='number') setBasePct(String(r.data.referralBasePct)); if(Array.isArray(r.data.referralTiers)) setTiers(r.data.referralTiers.map(t=>({min:String(t.min),max:String(t.max),pct:String(t.pct)}))) })() },[])
  async function save(){ setMsg(''); await axios.put('/settings/price',{ usdtPriceINR:Number(price) }); setMsg('Saved') }
  async function saveAddr(){ setMsg(''); await axios.put('/settings/addresses',{ erc20Address:erc20, trc20Address:trc20 }); setMsg('Saved') }
  async function saveSupport(){ setMsg(''); await axios.put('/settings/support',{ supportTelegram:telegram, supportWhatsApp:whatsapp }); setMsg('Saved') }
  async function saveReferral(){ setMsg(''); await axios.put('/settings/referral',{ referralBasePct:Number(basePct), referralTiers: tiers.map(t=>({ min:Number(t.min), max:Number(t.max), pct:Number(t.pct) })) }); setMsg('Saved') }
  return (
    <div className="p-3 md:p-4 max-w-6xl mx-auto">
      <div className="card p-4 md:p-6">
        <div className="font-semibold mb-2">USDT Price (INR)</div>
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <input className="input flex-1" value={price} onChange={e=>setPrice(e.target.value)} />
          <button className="btn btn-primary" onClick={save}>Save</button>
          {msg && <span className="text-sm text-green-700">{msg}</span>}
        </div>
      </div>
      <div className="card p-4 md:p-6 mt-4">
        <div className="font-semibold mb-2">Receiving Wallet Addresses</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">ERC20 (0x...)
            <input className="input mt-1" value={erc20} onChange={e=>setErc20(e.target.value)} placeholder="0x..."/>
          </label>
          <label className="text-sm">TRC20 (T...)
            <input className="input mt-1" value={trc20} onChange={e=>setTrc20(e.target.value)} placeholder="T..."/>
          </label>
        </div>
        <div className="mt-3"><button className="btn btn-primary" onClick={saveAddr}>Save Addresses</button></div>
      </div>
      <div className="card p-4 md:p-6 mt-4">
        <div className="font-semibold mb-2">Support Contacts</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">Telegram URL
            <input className="input mt-1" value={telegram} onChange={e=>setTelegram(e.target.value)} placeholder="https://t.me/yourhandle"/>
          </label>
          <label className="text-sm">WhatsApp URL
            <input className="input mt-1" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="https://wa.me/91XXXXXXXXXX"/>
          </label>
        </div>
        <div className="mt-3"><button className="btn btn-primary" onClick={saveSupport}>Save Support</button></div>
      </div>
      <div className="card p-4 md:p-6 mt-4">
        <div className="font-semibold mb-2">Referral Program</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="text-sm">Base Percent (%)
            <input className="input mt-1" value={basePct} onChange={e=>setBasePct(e.target.value)} />
          </label>
          <div className="md:col-span-2 text-xs text-gray-500">Base percent applies if no tier matches.</div>
        </div>
        <div className="mt-3 grid gap-2">
          {tiers.map((t,i)=>(
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <input className="input" placeholder="Min" value={t.min} onChange={e=>setTiers(prev=>prev.map((x,ix)=> ix===i?{...x,min:e.target.value}:x))} />
              <input className="input" placeholder="Max" value={t.max} onChange={e=>setTiers(prev=>prev.map((x,ix)=> ix===i?{...x,max:e.target.value}:x))} />
              <input className="input" placeholder="Percent" value={t.pct} onChange={e=>setTiers(prev=>prev.map((x,ix)=> ix===i?{...x,pct:e.target.value}:x))} />
              <button className="btn" onClick={()=>setTiers(prev=>prev.filter((_,ix)=>ix!==i))}>Remove</button>
            </div>
          ))}
          <button className="btn" onClick={()=>setTiers(prev=>[...prev,{min:'0',max:'0',pct:'0'}])}>Add Tier</button>
        </div>
        <div className="mt-3"><button className="btn btn-primary" onClick={saveReferral}>Save Referral</button></div>
      </div>
    </div>
  )
}


