import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import axios from '../lib/http'

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function NavItem({to, label, color='gray'}){
  const { pathname } = useLocation()
  const active = pathname === to
  const colorBase = {
    blue: 'bg-blue-300',
    green: 'bg-green-300',
    red: 'bg-red-300',
    purple: 'bg-purple-300',
    teal: 'bg-teal-300',
    amber: 'bg-amber-300',
    gray: 'bg-gray-300'
  }[color] || 'bg-gray-300'
  const colorActive = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
    amber: 'bg-amber-500',
    gray: 'bg-gray-500'
  }[color] || 'bg-gray-500'
  return (
    <Link to={to} className={'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 '+(active?'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25':'hover:bg-gray-50 hover:text-blue-600 text-gray-700')}>
      <span className={'w-5 h-5 rounded '+(active? colorActive: colorBase)}/>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

export default function AppShell(){
  const nav = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(()=>{ (async()=>{
    try{
      const r = await axios.get('/auth/me')
      if(!r.data?.user){ nav('/login', { replace:true }) }
    }catch{
      nav('/login', { replace:true })
    }finally{ setAuthLoading(false) }
  })() },[])
  
  async function logout(){ 
    await axios.post('/auth/logout'); 
    nav('/login') 
  }
  
  if(authLoading){
    return (
      <div className="min-h-screen grid place-items-center text-sm text-gray-500">Checking session…</div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm md:hidden">
        <div className="px-4 py-4 flex items-center justify-between">
          <Logo/>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="px-4 pb-6 border-t border-gray-200 bg-white">
            <div className="grid gap-2 pt-4">
              <NavItem to="/dashboard" label="Dashboard" color="blue"/>
              <NavItem to="/recharge" label="Recharge" color="green"/>
              <NavItem to="/withdraw" label="Withdraw" color="red"/>
              <NavItem to="/transactions" label="Transactions" color="purple"/>
              <NavItem to="/profile" label="Profile" color="teal"/>
              <NavItem to="/referral" label="Referral" color="amber"/>
              <button onClick={logout} className="text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors">
                <span className="w-5 h-5 rounded bg-red-300"/>
                <span className="text-sm font-medium">Logout</span>
              </button>
              <Link to="/help" className="text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-gray-700 transition-colors">
                <span className="w-5 h-5 rounded bg-blue-300"/>
                <span className="text-sm font-medium">Help</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Layout */}
      <div className="grid md:grid-cols-[280px_1fr]">
        <aside className="hidden md:block p-6 border-r border-gray-200 bg-white shadow-lg">
          <div className="mb-8">
            <Logo/>
          </div>
          
          {/* Navigation Section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Main Menu</div>
            <NavItem to="/dashboard" label="Dashboard" color="blue"/>
            <NavItem to="/recharge" label="Recharge" color="green"/>
            <NavItem to="/withdraw" label="Withdraw" color="red"/>
            <NavItem to="/transactions" label="Transactions" color="purple"/>
          </div>
          
          {/* Account Section */}
          <div className="space-y-2 mt-8">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Account</div>
            <NavItem to="/profile" label="Profile" color="teal"/>
            <NavItem to="/referral" label="Referral" color="amber"/>
            <Link to="/help" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-gray-700 transition-colors">
              <span className="w-5 h-5 rounded bg-blue-300"/>
              <span className="text-sm font-medium">Help & Support</span>
            </Link>
          </div>
          
          {/* Logout Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors">
              <span className="w-5 h-5 rounded bg-red-300"/>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
          
          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <div className="font-medium text-gray-600 mb-1">WINX Wallet</div>
              <div>Secure • Fast • Reliable</div>
            </div>
          </div>
        </aside>
        
        <div className="min-h-screen">
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            <Outlet/>
          </main>
        </div>
      </div>
    </div>
  )
}

function normalizeSupportLink(v){
  let s = String(v||'').trim();
  if(!s) return '';
  if(s.startsWith('@')) return 'https://t.me/'+s.slice(1);
  if(/^https?:\/\/(t\.me\/|wa\.me\/)/i.test(s)) return s;
  if(/^t\.me\//i.test(s)) return 'https://'+s;
  if(/^wa\.me\//i.test(s)) return 'https://'+s;
  if(/^\+?\d{8,15}$/i.test(s)) return 'https://wa.me/'+s.replace(/\D/g,'');
  // Unknown pattern → treat as invalid
  return '';
}


