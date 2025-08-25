import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from '../lib/http'
import Logo from '../components/Logo.jsx'

function NavItem({to,label,color='gray'}){
  const { pathname } = useLocation()
  const active = pathname === to
  const colorBase = {
    blue:'bg-blue-300',
    green:'bg-green-300',
    purple:'bg-purple-300',
    amber:'bg-amber-300',
    red:'bg-red-300',
    gray:'bg-gray-300'
  }[color] || 'bg-gray-300'
  const colorActive = {
    blue:'bg-blue-500',
    green:'bg-green-500',
    purple:'bg-purple-500',
    amber:'bg-amber-500',
    red:'bg-red-500',
    gray:'bg-gray-500'
  }[color] || 'bg-gray-500'
  return (
    <Link to={to} className={'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 '+(active?'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25':'hover:bg-gray-50 hover:text-purple-600 text-gray-700')}>
      <span className={'w-5 h-5 rounded '+(active?colorActive:colorBase)}/>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

export default function AdminShell(){
  const nav = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authLoading,setAuthLoading] = useState(true)
  
  useEffect(()=>{ (async()=>{
    try{
      const r = await axios.get('/auth/me')
      if(!r.data?.user || r.data?.user?.role !== 'admin'){ nav('/admin/login', { replace:true }) }
    }catch{
      nav('/admin/login', { replace:true })
    }finally{ setAuthLoading(false) }
  })() },[])
  
  async function logout(){ await axios.post('/auth/logout'); nav('/admin/login') }
  
  if(authLoading){
    return <div className="min-h-screen grid place-items-center text-sm text-gray-500">Checking session…</div>
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
              <NavItem to="/admin" label="Dashboard" color="blue"/>
              <NavItem to="/admin/users" label="User Management" color="green"/>
              <NavItem to="/admin/txns" label="Transactions" color="purple"/>
              <NavItem to="/admin/settings" label="System Settings" color="amber"/>
              <button onClick={logout} className="text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors">
                <span className="w-5 h-5 rounded bg-red-300"/>
                <span className="text-sm font-medium">Logout</span>
              </button>
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
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Admin Panel</div>
            <NavItem to="/admin" label="Dashboard" color="blue"/>
            <NavItem to="/admin/users" label="User Management" color="green"/>
            <NavItem to="/admin/txns" label="Transactions" color="purple"/>
            <NavItem to="/admin/settings" label="System Settings" color="amber"/>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors">
              <span className="w-5 h-5 rounded bg-red-300"/>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </aside>
        <div className="min-h-screen">
          <main className="p-4 md:p-6">
            <Outlet/>
          </main>
        </div>
      </div>
    </div>
  )
}

function HelpButton(){
  const [tg,setTg]=React.useState('')
  const [wa,setWa]=React.useState('')
  const [showHelp,setShowHelp]=React.useState(false)
  
  React.useEffect(()=>{
    (async()=>{
      try{
        const res = await axios.get('/settings')
        setTg(res.data.telegram || '')
        setWa(res.data.whatsapp || '')
      }catch(e){}
    })()
  },[])
  
  if(!tg && !wa) return null
  
  return (
    <div className="relative">
      <button 
        onClick={()=>setShowHelp(!showHelp)}
        className="text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-gray-700 transition-colors"
      >
        <span className="w-5 h-5 rounded bg-blue-300"/>
        <span className="text-sm font-medium">Help</span>
      </button>
      
      {showHelp && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="text-sm font-medium text-gray-800 mb-3">Need Help?</div>
          {tg && (
            <a href={tg} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-700 mb-2">
              📱 Telegram Support
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-green-600 hover:text-green-700">
              💬 WhatsApp Support
            </a>
          )}
        </div>
      )}
    </div>
  )
}


