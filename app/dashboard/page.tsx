'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, changePassword, logout } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } else if (res.message) {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        
        {/* Success Banner */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Login Successful!</h1>
          <p className="text-xs text-gray-500">
            Welcome to your dashboard.
          </p>
          {user?.email && (
            <p className="text-xs font-mono bg-slate-100 p-2 rounded-lg mt-2 text-gray-700">
              User: {user.email}
            </p>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* Change Password Form (Inside Site) */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-1">Change Password</h2>
          <p className="text-xs text-gray-500 mb-4">Update your account password below.</p>

          {msg && (
            <div className="mb-3 p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
              {msg}
            </div>
          )}

          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <hr className="border-slate-100" />

        <button
          onClick={handleLogout}
          className="w-full py-2.5 border border-slate-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}