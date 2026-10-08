import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UNIVERSITIES } from '../data/mockData';
import { UniversityId } from '../types';
import { ShieldCheck, Store, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'vendor';
  onNavigate: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onNavigate
}) => {
  const { login, register, signInWithGoogleAccount, authLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(
    initialMode === 'vendor' ? 'register' : initialMode
  );

  // Form states
  const [role, setRole] = useState<'student' | 'vendor'>(
    initialMode === 'vendor' ? 'vendor' : 'student'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityId, setUniversityId] = useState<UniversityId>('knust');
  const [hall, setHall] = useState('Unity Hall (Conti)');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const selectedUni = UNIVERSITIES.find(u => u.id === universityId) || UNIVERSITIES[0];

  const handleGoogleAuth = async () => {
    setAuthError(null);
    try {
      const profile = await signInWithGoogleAccount(role, universityId, hall);
      onNavigate(profile.role === 'vendor' ? 'vendor-dashboard' : 'student-dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign in popup was closed. Please try again.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setAuthError(err?.message || 'Google authentication failed. Please try again.');
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    onNavigate(role === 'vendor' ? 'vendor-dashboard' : 'student-dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, role, universityId, hall);
    onNavigate(role === 'vendor' ? 'vendor-dashboard' : 'student-dashboard');
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm transition-colors">
        
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 font-bold text-zinc-950 dark:text-white font-brand text-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>CampusBuy</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {mode === 'login' && 'Sign in to access your campus orders and storefront'}
            {mode === 'register' && 'Join the largest Ghanaian university student marketplace'}
            {mode === 'forgot' && 'Reset your campus marketplace password'}
          </p>
        </div>

        {/* Error notification */}
        {authError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Authentication Note: </span>
              {authError}
            </div>
            <button
              onClick={() => setAuthError(null)}
              className="text-red-400 hover:text-red-700 font-bold ml-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Mode Selector Tabs */}
        {mode !== 'forgot' && (
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 mb-6 text-xs font-semibold">
            <button
              onClick={() => { setMode('login'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'register'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Role switch */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Sign in as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    role === 'student'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-orange-500" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    role === 'vendor'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Store className="w-4 h-4 text-orange-500" />
                  <span>Campus Vendor</span>
                </button>
              </div>
            </div>

            {/* Google Sign In Option */}
            <div className="space-y-2 pt-1">
              <GoogleSignInButton
                onClick={handleGoogleAuth}
                loading={authLoading}
                text={`Sign in with Google`}
              />
              <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400">
                Supports student Gmails or institutional (@st.*) accounts
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Institutional or Personal Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. kwame@st.knust.edu.gh' : 'e.g. campustech@knust.store.gh'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                Sign In to {role === 'vendor' ? 'Vendor Dashboard' : 'Student Account'}
              </button>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl text-[11px] text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Demo mode active: Sign in with any password or use Google.</span>
              </div>
            </form>
          </div>
        )}

        {/* REGISTRATION FORM */}
        {mode === 'register' && (
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Role switch */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">I want to register as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    role === 'student'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-orange-500" />
                  <span>Student Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    role === 'vendor'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Store className="w-4 h-4 text-orange-500" />
                  <span>Campus Vendor</span>
                </button>
              </div>
            </div>

            {/* Campus selection for rapid profile configuration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">University</label>
                <select
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value as UniversityId)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  {UNIVERSITIES.map(u => (
                    <option key={u.id} value={u.id}>{u.shortName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Hall / Area</label>
                <select
                  value={hall}
                  onChange={(e) => setHall(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  {selectedUni.popularHalls.map((h, i) => (
                    <option key={i} value={h}>{h}</option>
                  ))}
                  <option value="Off-Campus Hostel">Off-Campus Hostel</option>
                </select>
              </div>
            </div>

            {/* Google Fast Sign Up Option */}
            <div className="space-y-2 pt-1">
              <GoogleSignInButton
                onClick={handleGoogleAuth}
                loading={authLoading}
                text={`Sign up with Google as ${role === 'vendor' ? 'Vendor' : 'Student'}`}
              />
              <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400">
                One-click setup with your Google identity & verified email
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider">
                  Or register with email
                </span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  {role === 'student' ? 'Full Name' : 'Business / Store Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'student' ? 'Kwame Mensah' : 'Legon Prints & Gear'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                Create {role === 'vendor' ? 'Vendor Account' : 'Student Account'}
              </button>
            </form>
          </div>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div className="space-y-4 text-xs sm:text-sm">
            {forgotSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-base">Check Your Inbox</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Password reset link has been dispatched to your email.
                </p>
                <button
                  onClick={() => { setMode('login'); setForgotSuccess(false); }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Enter Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kwame@st.knust.edu.gh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md"
                >
                  Send Reset Link
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Remember your password? Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
