import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Sprout, CheckCircle2, UserCheck, ShieldCheck, Database } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchDemoRole } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Warangal');
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email);
      onClose();
    } else if (mode === 'register') {
      await register(name, email, phone, state, district);
      onClose();
    } else {
      setMsg(`Password reset link sent to ${email}. Check your SMS/email.`);
      setTimeout(() => {
        setMode('login');
        setMsg(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 leading-tight">
              {mode === 'login' ? 'Farmer & User Login' : mode === 'register' ? 'Register New Farmer Account' : 'Reset Password'}
            </h2>
            <span className="text-[11px] text-stone-500">AgriPrice AI Secure Access Portal</span>
          </div>
        </div>

        {/* Quick Demo Role Logins */}
        {mode === 'login' && (
          <div className="mb-5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              One-Click Evaluator Demo Logins
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { switchDemoRole('farmer'); onClose(); }}
                className="p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-600 text-left text-[11px] transition-colors"
              >
                <div className="font-bold text-stone-800">Farmer</div>
                <div className="text-stone-400 truncate">Deepika</div>
              </button>
              <button
                type="button"
                onClick={() => { switchDemoRole('admin'); onClose(); }}
                className="p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-600 text-left text-[11px] transition-colors"
              >
                <div className="font-bold text-stone-800">Admin</div>
                <div className="text-stone-400 truncate">Dr. Ananya</div>
              </button>
              <button
                type="button"
                onClick={() => { switchDemoRole('data_manager'); onClose(); }}
                className="p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-600 text-left text-[11px] transition-colors"
              >
                <div className="font-bold text-stone-800">Data Mgr</div>
                <div className="text-stone-400 truncate">Rajesh P.</div>
              </button>
            </div>
          </div>
        )}

        {msg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email or Mobile Number</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ramesh.farmer@agriprice.in or 9848023456"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone (for Mandi SMS)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98480 12345"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            {mode === 'login' ? 'Sign In to Dashboard' : mode === 'register' ? 'Create Farmer Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          {mode === 'login' ? (
            <p>
              New farmer?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-emerald-800 hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-800 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
