'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push(from)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-navy mb-1" htmlFor="username">
          Usuario
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-navy placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                     font-sans text-sm"
          placeholder="tu usuario"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-1" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-navy placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                     font-sans text-sm"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-teal text-white font-bold font-sans text-sm tracking-wide
                   hover:bg-teal/90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo-manfred.svg"
              alt="Manfred"
              width={140}
              height={40}
              priority
            />
          </div>
          <p className="font-display text-4xl font-black text-navy tracking-tight leading-none">
            ATS<span className="text-teal">Killer</span>
          </p>
          <p className="mt-2 text-sm text-navy/60 font-sans">
            Acceso restringido — introduce tus credenciales
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
