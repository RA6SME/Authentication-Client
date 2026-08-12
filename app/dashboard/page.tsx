'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, token, logout, changePassword, mfaEnroll, mfaVerify } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'mfa' | 'security'>('profile');

  // User Profile State
  const [profileData, setProfileData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // MFA State
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [mfaSuccess, setMfaSuccess] = useState('');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Fetch /me profile details
  const fetchUserProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const res = await fetch('http://localhost:7766/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setProfileData(result.user || result.data || result);
      } else {
        setProfileData(user);
      }
    } catch {
      setProfileData(user);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Handler: MFA Enrollment
  const handleMfaEnroll = async () => {
    setMfaError('');
    setMfaSuccess('');
    setMfaLoading(true);

    try {
      const res = await mfaEnroll();
      
      if (res && res.success) {
        const data = res.data || res;
        setMfaSecret(data.secret || data.mfaSecret || null);
        setMfaQrCode(data.qrCode || data.qrCodeUrl || null);
        setMfaSuccess('MFA secret generated! Scan the QR code or enter key into your authenticator app.');
      } else {
        setMfaError(res?.message || 'Failed to initiate MFA enrollment.');
      }
    } catch (err: any) {
      setMfaError(err.message || 'Error communicating with backend server.');
    } finally {
      setMfaLoading(false);
    }
  };

  // Handler: MFA Verification
  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError('');
    setMfaSuccess('');

    if (mfaCode.length !== 6) {
      setMfaError('Code must be exactly 6 digits.');
      return;
    }

    setMfaLoading(true);

    try {
      const res = await mfaVerify(mfaCode);

      if (res && res.success) {
        setMfaSuccess('MFA successfully activated!');
        setMfaCode('');
        setMfaSecret(null); // Clear temporary setup secret
        setMfaQrCode(null);
        await fetchUserProfile(); // Instantly update status to ENABLED
      } else {
        setMfaError(res?.message || 'Invalid verification code.');
      }
    } catch (err: any) {
      setMfaError(err.message || 'Error verifying MFA code.');
    } finally {
      setMfaLoading(false);
    }
  };

  // Handler: Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters.');
      return;
    }

    setPassLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setPassLoading(false);

    if (res.success) {
      setPassSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassError(res.message || 'Failed to update password.');
    }
  };

  // Safely extract user object
  const currentUser = profileData?.user || profileData || user;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-mono selection:bg-white selection:text-black flex flex-col">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 bg-black sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-white text-black font-bold flex items-center justify-center text-xs tracking-tighter">
              AP
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              AuthPortal <span className="text-zinc-500 font-normal">/ Account Management</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>{currentUser?.email || 'Authenticated'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1 text-xs border border-zinc-700 hover:border-white text-zinc-300 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        
        {/* HEADER */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Account Control Panel</h1>
            <p className="text-xs text-zinc-500 mt-1">Manage user identity, active session, and security credentials.</p>
          </div>
          <div className="text-xs border border-zinc-800 p-2 text-zinc-400 bg-black">
            <p className="text-white font-semibold">REST API Server</p>
            <p className="text-zinc-500">http://localhost:7766/api/v1/auth</p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="border-b border-zinc-800 flex space-x-8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'profile' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            User Profile (/me)
            {activeTab === 'profile' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
          </button>

          <button
            onClick={() => setActiveTab('mfa')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'mfa' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            MFA Setup
            {activeTab === 'mfa' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'security' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Change Password
            {activeTab === 'security' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>}
          </button>
        </div>

        {/* TAB 1: USER PROFILE (/me) */}
        {activeTab === 'profile' && (
          <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Identity Details (GET /auth/me)</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Authenticated session data retrieved from database.</p>
              </div>
              <button
                onClick={fetchUserProfile}
                className="px-2.5 py-1 text-[11px] border border-zinc-700 hover:border-white text-zinc-300 transition-colors"
              >
                {profileLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* EMAIL */}
              <div className="border border-zinc-800 bg-black p-3 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">Email Address</span>
                <p className="text-white font-mono">{currentUser?.email || '—'}</p>
              </div>

              {/* USER ID */}
              <div className="border border-zinc-800 bg-black p-3 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">User ID</span>
                <p className="text-white font-mono break-all">{currentUser?.id || '—'}</p>
              </div>

              {/* ACCOUNT ROLE */}
              <div className="border border-zinc-800 bg-black p-3 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">Account Role</span>
                <p className="text-white font-mono uppercase">{currentUser?.role || 'USER'}</p>
              </div>

              {/* MFA STATUS */}
              <div className="border border-zinc-800 bg-black p-3 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">MFA Status</span>
                <p className={`font-mono ${currentUser?.mfaEnabled ? 'text-green-400 font-bold' : 'text-zinc-400'}`}>
                  {currentUser?.mfaEnabled ? '● ENABLED' : '○ DISABLED'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MFA SETUP */}
        {activeTab === 'mfa' && (
          <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-6">
            {currentUser?.mfaEnabled ? (
              /* ACTIVE STATE: ONE-TIME ACTIVATION COMPLETE */
              <div className="border border-green-900/60 bg-green-950/20 p-6 rounded space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                  <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                    Multi-Factor Authentication (MFA) Enabled
                  </h2>
                </div>
                <p className="text-xs text-zinc-400">
                  Your account is secured with TOTP authenticator verification. MFA setup can only be performed once per active configuration.
                </p>
              </div>
            ) : (
              /* UNREGISTERED STATE: ONE-TIME SETUP FLOW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Enrollment */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">1. Setup MFA</h2>
                    <p className="text-xs text-zinc-500 mt-1">Generate TOTP secret key for Google Authenticator.</p>
                  </div>

                  <button
                    onClick={handleMfaEnroll}
                    disabled={mfaLoading}
                    className="w-full py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors disabled:opacity-50"
                  >
                    {mfaLoading ? 'Generating...' : 'Enroll in MFA'}
                  </button>

                  {mfaSecret && (
                    <div className="border border-zinc-800 bg-black p-4 space-y-3 text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">SECRET KEY</span>
                        <p className="p-2 border border-zinc-800 bg-zinc-950 text-white font-mono text-center tracking-widest mt-1 break-all max-w-full">
                          {mfaSecret}
                        </p>
                      </div>
                      {mfaQrCode && (
                        <div className="flex flex-col items-center pt-2">
                          <img src={mfaQrCode} alt="MFA QR Code" className="w-32 h-32 border border-white p-1 bg-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 2: Verification */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">2. Activate MFA</h2>
                    <p className="text-xs text-zinc-500 mt-1">Enter code generated by your authenticator app.</p>
                  </div>

                  {mfaError && (
                    <div className="p-3 border border-red-900 bg-red-950/30 text-red-400 text-xs">
                      {mfaError}
                    </div>
                  )}

                  {mfaSuccess && (
                    <div className="p-3 border border-zinc-700 bg-zinc-900 text-white text-xs">
                      {mfaSuccess}
                    </div>
                  )}

                  <form onSubmit={handleMfaVerify} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-400">6-Digit Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-white transition-colors"
                        placeholder="123456"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={mfaLoading || mfaCode.length !== 6}
                      className="w-full py-2 border border-zinc-700 hover:border-white bg-black text-white font-bold transition-colors disabled:opacity-50"
                    >
                      {mfaLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CHANGE PASSWORD */}
        {activeTab === 'security' && (
          <div className="max-w-md mx-auto border border-zinc-800 bg-zinc-950 p-6 space-y-6">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Change Password</h2>
              <p className="text-xs text-zinc-500 mt-1">Update account password using <code className="text-zinc-300">POST /password/change</code></p>
            </div>

            {passError && (
              <div className="p-3 border border-red-900 bg-red-950/30 text-red-400 text-xs">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="p-3 border border-zinc-700 bg-zinc-900 text-white text-xs">
                {passSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-2 bg-white hover:bg-zinc-200 text-black font-bold transition-colors disabled:opacity-50 mt-2"
              >
                {passLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}