import React, { useState, useEffect } from 'react'
import axios from '../lib/http'

export default function Referral() {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [userRes, settingsRes] = await Promise.all([
  axios.get("https://winxwallet.onrender.com/users/me"),
  axios.get("https://winxwallet.onrender.com/referral")
]);

        setUser(userRes.data.user)
        setSettings(settingsRes.data)
      } catch (e) {
        console.error('Failed to fetch data:', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  if (!user || !settings) return <div className="text-center p-8 text-red-600">Failed to load data</div>

  const baseUrl = import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin
  const refLink = `${baseUrl}/register?ref=${user.referralCode || ''}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(refLink)
  }

  return (
    <div className="space-y-6">
      <div className="card p-4 md:p-6">
        <div className="font-semibold text-lg mb-4">Referral Program</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Your Referral Code</div>
            <div className="text-xl md:text-2xl font-bold text-blue-600 bg-blue-50 p-3 rounded-lg text-center">
              {user.referralCode || 'N/A'}
            </div>
            {!user.referralCode && (
              <div className="text-xs text-red-500 mt-1 text-center">
                Contact admin to generate code
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Total Referral Earnings</div>
            <div className="text-xl md:text-2xl font-bold text-green-600 bg-green-50 p-3 rounded-lg text-center">
              {user.referralEarnings ? `${user.referralEarnings.toFixed(2)} USDT` : '0.00 USDT'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Referral Status</div>
            <div className="text-xl md:text-2xl font-bold text-purple-600 bg-purple-50 p-3 rounded-lg text-center">
              {user.referredBy ? 'Referred User' : 'Independent User'}
            </div>
            {user.referredBy && (
              <div className="text-xs text-purple-500 mt-1 text-center">
                You were referred by someone
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4 md:p-6">
        <div className="font-semibold text-lg mb-4">Current Referral Rates</div>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 md:p-4 rounded-lg">
            <div className="text-sm opacity-90">Base Referral Rate</div>
            <div className="text-2xl md:text-3xl font-bold">{settings.referralBasePct || 0}%</div>
            <div className="text-sm opacity-90">on all deposits</div>
          </div>
          
          {settings.referralTiers && settings.referralTiers.length > 0 && (
            <div>
              <div className="font-medium text-gray-700 mb-3">Premium Tiers:</div>
              <div className="grid gap-3">
                {settings.referralTiers.map((tier, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 md:p-4 rounded-lg">
                    <div className="text-sm opacity-90">Deposits ${tier.min} - ${tier.max}</div>
                    <div className="text-xl md:text-2xl font-bold">{tier.pct}%</div>
                    <div className="text-sm opacity-90">referral reward</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card p-4 md:p-6">
        <div className="font-semibold mb-4">Share Your Referral Link</div>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">Share this link with friends to earn rewards when they make deposits:</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              value={refLink} 
              readOnly 
              className="input flex-1 text-sm"
            />
            <button 
              onClick={copyToClipboard}
              className="btn btn-primary px-4 text-center"
            >
              Copy
            </button>
          </div>
          <div className="text-xs">
            <a href={refLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Open referral link</a>
          </div>
        </div>
      </div>

      <div className="card p-4 md:p-6">
        <div className="font-semibold mb-4">How It Works</div>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold mt-0.5">1</div>
            <div>Share your referral link with friends and family</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold mt-0.5">2</div>
            <div>When they register using your link, they become your referral</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold mt-0.5">3</div>
            <div>Earn a percentage of their deposits as referral rewards</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold mt-0.5">4</div>
            <div>Rewards are automatically credited to your account</div>
          </div>
        </div>
      </div>

      <div className="card p-4 md:p-6">
        <div className="font-semibold mb-4">Referral Rewards</div>
        <div className="text-sm text-gray-600">
          <p className="mb-2">Referral rewards are calculated based on deposit amounts:</p>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-medium text-blue-800">Base Reward</div>
              <div className="text-lg font-bold text-blue-600">{settings.referralBasePct || 0}% of deposit amount</div>
            </div>
            
            {settings.referralTiers && settings.referralTiers.length > 0 && (
              <div>
                <div className="font-medium text-gray-700 mb-2">Tiered Rewards:</div>
                <div className="space-y-2">
                  {settings.referralTiers.map((tier, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-800">
                        Rs. {tier.min} - Rs. {tier.max} INR
                      </div>
                      <div className="text-lg font-bold text-green-600">{tier.pct}% reward</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-3 text-xs text-gray-500">
              <ul className="list-disc list-inside space-y-1">
                <li>Rewards are paid in USDT</li>
                <li>All rewards are automatically processed</li>
                <li>Higher deposits may qualify for increased reward percentages</li>
                <li>Rewards are credited when deposits are approved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 md:p-6">
        <div className="font-semibold mb-4">Referral Earnings History</div>
        <div className="text-sm text-gray-600">
          {user.referralEarnings > 0 ? (
            <div className="space-y-2">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-800">Total Earned</div>
                <div className="text-lg font-bold text-green-600">{user.referralEarnings.toFixed(2)} USDT</div>
              </div>
              <p className="text-xs text-gray-500">
                Your referral earnings are automatically added to your balance when your referrals make deposits.
              </p>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No referral earnings yet.</p>
              <p className="text-xs mt-1">Start referring friends to earn rewards!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
