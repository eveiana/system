import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SignInViewProps {
  onSignIn: (name?: string, email?: string) => void;
}

export function SignInView({ onSignIn }: SignInViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'google' | 'email' | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingType('email');

    // Simulate standard API delay
    setTimeout(() => {
      setLoading(false);
      setLoadingType(null);
      if (isSignUp) {
        onSignIn(name || 'New Member', email || 'guest@creativesgarage.org');
      } else {
        onSignIn(undefined, email || 'evalineatieno857@gmail.com');
      }
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setLoadingType('google');
    
    // Simulate beautiful OAuth popup or redirect experience
    setTimeout(() => {
      setLoading(false);
      setLoadingType(null);
      onSignIn(); // Default to Evaline Atieno
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-center items-center px-6 relative overflow-hidden select-none">
      {/* Dynamic ambient grid background & subtle orange/indigo glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Logo Icon / Brand Label */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xl shadow-orange-600/25">
            CG
          </div>
          <span className="font-extrabold text-lg tracking-wider text-zinc-100">
            CREATIVES GARAGE
          </span>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              {isSignUp ? 'Create account' : 'Sign in'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5 font-medium">
              {isSignUp 
                ? 'Join the Creatives Garage operations system' 
                : 'Access the operations dashboard'}
            </p>
          </div>

          {/* Social Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading && loadingType === 'google' ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.61 0 3.09.55 4.22 1.62l3.15-3.15C17.43 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.3 7.64 8.92 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.47-1.11 2.72-2.36 3.56l3.67 2.85c2.15-1.98 3.38-4.89 3.38-8.56z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9c-.83 1.66-1.3 3.52-1.3 5.5s.47 3.84 1.3 5.5l3.86-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.67-2.85c-1.02.68-2.33 1.09-3.95 1.09-3.08 0-5.7-2.6-6.64-5.46L1.5 15.73C3.4 19.58 7.35 23 12 23z"
                />
              </svg>
            )}
            <span className="text-zinc-200">
              {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
            </span>
          </button>

          {/* Divider with lines */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-[10px] font-extrabold text-zinc-500 tracking-widest">
              OR
            </span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Evaline Atieno"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl text-sm font-medium outline-none transition-all text-white placeholder-zinc-700"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl text-sm font-medium outline-none transition-all text-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Forgot password helper: Check your simulation environment!')}
                    className="text-[11px] text-zinc-500 hover:text-orange-500 font-bold transition-colors cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl text-sm font-medium outline-none transition-all text-white"
              />
            </div>

            {/* Primary Orange Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 bg-[#ff7a22] hover:bg-orange-500 active:bg-orange-600 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-600 rounded-xl font-extrabold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10"
            >
              {loading && loadingType === 'email' ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-zinc-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Workspace...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Sign up' : 'Sign in'}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-950" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher footer link */}
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              {isSignUp ? (
                <span>
                  Already have an account? <span className="text-white hover:text-orange-500 font-bold ml-1">Sign in</span>
                </span>
              ) : (
                <span>
                  Need an account? <span className="text-white hover:text-orange-500 font-bold ml-1">Sign up</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Decorative environment credits */}
      <div className="absolute bottom-6 left-6 text-[10px] font-bold text-zinc-700 tracking-wider flex items-center gap-2">
        <span>CG SECURE GATEWAY</span>
        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-normal text-zinc-800">V2.6.4</span>
      </div>
    </div>
  );
}
