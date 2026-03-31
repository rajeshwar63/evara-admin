import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-slate-900">
            <span className="text-brand-500">Evara</span> Admin
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to access the dashboard</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(response) => {
                if (response.credential) {
                  login(response.credential)
                    .then(() => navigate('/'))
                    .catch((err) => setError(err instanceof Error ? err.message : 'Login failed'))
                }
              }}
              onError={() => setError('Google login failed')}
              theme="outline"
              size="large"
              width="300"
            />
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
