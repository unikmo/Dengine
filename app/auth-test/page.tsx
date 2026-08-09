// Auth test page
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthTestPage() {
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(`Sign up error: ${error.message}`)
    } else {
      setMessage('Check your email for confirmation link!')
    }
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(`Sign in error: ${error.message}`)
    } else {
      setMessage('Signed in successfully!')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMessage('Signed out')
  }

  if (loading) return <div>Loading auth...</div>

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
      <div className="mb-4">
        <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
        <p><strong>User:</strong> {user ? user.email : 'None'}</p>
        <p><strong>User ID:</strong> {user?.id || 'None'}</p>
      </div>

      {!user ? (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border"
          />
          <div className="flex gap-2">
            <button onClick={handleSignIn} className="px-4 py-2 bg-blue-500 text-white">
              Sign In
            </button>
            <button onClick={handleSignUp} className="px-4 py-2 bg-green-500 text-white">
              Sign Up
            </button>
          </div>
        </div>
      ) : (
        <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white">
          Sign Out
        </button>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}