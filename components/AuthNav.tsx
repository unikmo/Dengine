'use client'

import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function AuthNav() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-8 text-sm text-gray-500">
        <span className="text-gray-400">Loading...</span>
        <Link href="/browse" className="bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-xs">
          Get started free
        </Link>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-8 text-sm text-gray-500">
        <span className="text-gray-700">Hi, {user.email?.split('@')[0]}</span>
        <button
          onClick={() => signOut()}
          className="text-gray-400 hover:text-navy transition-colors"
        >
          Sign out
        </button>
        <Link href="/custom" className="bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-xs">
          Create blueprint
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-8 text-sm text-gray-500">
      <Link href="/login" className="hover:text-navy transition-colors">Sign In</Link>
      <Link href="/browse" className="bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-xs">
        Get started free
      </Link>
    </div>
  )
}