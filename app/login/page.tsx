"use client"

import { Suspense } from 'react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/custom'
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName)
        if (error) throw error
        router.push(next)
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        router.push(next)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-navy mb-2">
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        {isSignUp ? 'Sign up to save and manage your blueprints.' : 'Sign in to continue planning.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignUp && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-navy text-white font-bold rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-gray-400 hover:text-navy"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </div>

      <div className="mt-12 text-center text-xs text-gray-400">
        <p>By signing in, you agree to our Terms and Privacy Policy.</p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="max-w-md mx-auto px-6 py-16" />}>
      <LoginForm />
    </Suspense>
  )
}
