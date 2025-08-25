import React from 'react'
import axios from '../lib/http'

function normalizeSupportLink(v){
  let s = String(v||'').trim();
  if(!s) return '';
  if(s.startsWith('@')) return 'https://t.me/'+s.slice(1);
  if(/^https?:\/\/(t\.me\/|wa\.me\/)/i.test(s)) return s;
  if(/^t\.me\//i.test(s)) return 'https://'+s;
  if(/^wa\.me\//i.test(s)) return 'https://'+s;
  if(/^\+?\d{8,15}$/i.test(s)) return 'https://wa.me/'+s.replace(/\D/g,'');
  return '';
}

export default function Help(){
  const [telegram,setTelegram]=React.useState('')
  const [whatsapp,setWhatsapp]=React.useState('')
  React.useEffect(()=>{ (async()=>{ try{ const r = await axios.get('https://winxwallet.onrender.com/support'); setTelegram(normalizeSupportLink(r.data.supportTelegram)); setWhatsapp(normalizeSupportLink(r.data.supportWhatsApp)) }catch{} })() },[])
  const hasAny = telegram || whatsapp
  return (
    <div className="grid gap-4 md:gap-6">
      <div className="card p-4 md:p-6">
        <div className="text-lg md:text-xl font-semibold">Need Help?</div>
        <p className="text-sm text-gray-500">Choose a support channel below.</p>
      </div>
      {hasAny ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {telegram && <SupportCard
            title="Telegram"
            link={telegram}
            svg={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="w-8 h-8 md:w-10 md:h-10 fill-[#229ED9]"><path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm58.5 78.3-19.9 94.1c-1.5 6.5-5.4 8.1-10.9 5l-30.1-22.2-14.5 14c-1.6 1.6-3 3-6.1 3l2.2-31.2 56.7-51.2c2.5-2.2-.5-3.5-3.9-1.3l-70.1 44.1-30.2-9.4c-6.6-2.1-6.7-6.6 1.4-9.8l118-45.5c5.5-2 10.3 1.3 8.5 9.7z"/></svg>}
          />}
          {whatsapp && <SupportCard
            title="WhatsApp"
            link={whatsapp}
            svg={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 md:w-10 md:h-10 fill-[#25D366]"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm6.9 18.6c-.3.8-1.8 1.6-2.5 1.7-.7.1-1.5.1-2.4-.2-.6-.2-1.3-.4-2.2-.8-3.8-1.7-6.3-5.5-6.5-5.8-.2-.3-1.6-2.1-1.6-4s1-2.8 1.3-3.2c.3-.4.7-.5 1-.5h.7c.2 0 .5 0 .7.6.3.7 1 2.5 1.1 2.7.1.2.1.4 0 .6-.1.3-.2.5-.4.7l-.6.7c-.2.2-.4.4-.2.8.2.4 1 1.7 2.2 2.8 1.5 1.3 2.8 1.7 3.2 1.8.3.1.6.1.8-.1l1.2-1.6c.2-.2.5-.3.8-.2.3.1 2 .9 2.3 1 .3.1.5.2.6.3.1.1.1.8-.2 1.6z"/></svg>}
          />}
        </div>
      ) : (
        <div className="card p-4 md:p-6 text-sm text-gray-500">No support links configured. Please contact admin.</div>
      )}
    </div>
  )
}

function SupportCard({ title, link, svg }){
  return (
    <div className="card p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {svg}
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-gray-500 break-all">{link}</div>
        </div>
      </div>
      <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto text-center">Open</a>
    </div>
  )
}


