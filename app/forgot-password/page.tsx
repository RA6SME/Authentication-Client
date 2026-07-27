'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    const res = await forgotPassword(email);
    if (res.success) {
      setMsg(res.message || 'Password reset instructions have been sent to your email.');
    } else if (res.message) {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="flex flex-1 flex-col justify-between items-center px-4 sm:px-12 lg:px-20 py-8">
        <div className="w-full max-w-sm my-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-xs leading-relaxed mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {msg && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
              {msg}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@email.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition text-gray-800 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1B2A37] text-white text-sm font-semibold rounded-xl hover:bg-[#111c26] transition duration-200 shadow-sm mt-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Remembered your password?{' '}
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <footer className="text-center text-[10px] text-gray-400 font-medium tracking-wider uppercase">
          © 2026 ALL RIGHTS RESERVED
        </footer>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative rounded-3xl overflow-hidden min-h-[90vh]">
        <Image src="/hero.jpg" alt="Artwork" fill priority className="object-cover" />
      </div>
    </div>
  );
}