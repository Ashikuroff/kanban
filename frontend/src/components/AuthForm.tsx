'use client';

import { useState, useRef } from 'react';
import { useAuth } from '../lib/auth';

export function AuthForm() {
  const { state, login, register, requestPasswordReset, resetPassword, clearError } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [resetStep, setResetStep] = useState<'idle' | 'request' | 'verify'>('idle');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetCodeMessage, setResetCodeMessage] = useState<string>('');
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setLocalError('Please enter both username and password');
      return;
    }

    if (!isLoginMode) {
      if (trimmedPassword.length < 4) {
        setLocalError('Password must be at least 4 characters');
        return;
      }
      if (trimmedPassword !== trimmedConfirm) {
        setLocalError('Passwords do not match');
        return;
      }
    }

    if (isLoginMode) {
      await login(trimmedUsername, trimmedPassword, rememberMe);
    } else {
      await register(trimmedUsername, trimmedPassword);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setResetCodeMessage('');

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setLocalError('Please enter your username');
      return;
    }

    const result = await requestPasswordReset(trimmedUsername);
    if (result.success) {
      setResetCodeMessage(result.message); // Show the reset code
      setResetStep('verify');
    } else {
      setLocalError(result.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    const trimmedToken = resetToken.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirm = confirmNewPassword.trim();

    if (!trimmedToken || !trimmedNewPassword || !trimmedConfirm) {
      setLocalError('All fields are required');
      return;
    }

    if (trimmedNewPassword.length < 4) {
      setLocalError('Password must be at least 4 characters');
      return;
    }

    if (trimmedNewPassword !== trimmedConfirm) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await resetPassword(trimmedToken, trimmedNewPassword);
    if (result.success) {
      setResetStep('idle');
      setResetToken('');
      setNewPassword('');
      setConfirmNewPassword('');
      setLocalError(null);
      setLocalSuccess('Password reset successful! You can now log in with your new password.');
      setIsLoginMode(true);
    } else {
      setLocalError(result.error || 'Reset failed');
    }
  };

  const toggleMode = () => {
    clearError();
    setLocalError(null);
    setResetStep('idle');
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetCodeMessage('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setIsLoginMode(!isLoginMode);
  };

  const cancelReset = () => {
    setResetStep('idle');
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetCodeMessage('');
    clearError();
    setLocalError(null);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(236,173,10,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(32,157,215,0.18),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#edf2f8_100%)]">
        <div className="text-[#032147] text-lg">Loading...</div>
      </div>
    );
  }

  const errorToShow = localError || state.error;
  const successToShow = localSuccess || undefined;

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-medium text-[#032147]">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
          autoComplete="username"
          disabled={state.isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#032147]">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
            autoComplete="current-password"
            disabled={state.isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888888] hover:text-[#032147] transition focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[#d7dfeb] text-[#753991] focus:ring-[#753991]"
          />
          <span className="text-sm text-[#032147]">Remember me</span>
        </label>
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-xs text-[#209dd7] hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={state.isLoading}
        className="w-full rounded-2xl bg-[#753991] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state.isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-medium text-[#032147]">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
          autoComplete="username"
          disabled={state.isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#032147]">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
            autoComplete="new-password"
            disabled={state.isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888888] hover:text-[#032147] transition focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#032147]">
          Confirm Password
        </label>
        <input
          ref={confirmPasswordRef}
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
          autoComplete="new-password"
          disabled={state.isLoading}
          required
        />
      </div>

      <button
        type="submit"
        disabled={state.isLoading}
        className="w-full rounded-2xl bg-[#753991] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state.isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );

  const renderResetRequest = () => (
    <form onSubmit={handleForgotPassword} className="space-y-5">
      <div>
        <label htmlFor="reset-username" className="mb-2 block text-sm font-medium text-[#032147]">
          Username
        </label>
        <input
          id="reset-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
          disabled={state.isLoading}
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={cancelReset}
          className="flex-1 rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm font-medium text-[#032147] transition hover:border-[#209dd7] hover:bg-[#eef8ff]"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={state.isLoading}
          className="flex-1 rounded-2xl bg-[#753991] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.isLoading ? 'Sending...' : 'Send Reset Code'}
        </button>
      </div>
    </form>
  );

  const renderResetVerify = () => (
    <form onSubmit={handleResetPassword} className="space-y-5">
      {resetCodeMessage && (
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
          <strong>Reset code:</strong> {resetCodeMessage.replace('Reset code: ', '').replace(' (expires in 1 hour)', '')}
        </div>
      )}

      <div>
        <label htmlFor="reset-token" className="mb-2 block text-sm font-medium text-[#032147]">
          Reset Code
        </label>
        <input
          id="reset-token"
          type="text"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          placeholder="Enter reset code from email"
          className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
          disabled={state.isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-[#032147]">
          New Password
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
            disabled={state.isLoading}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirm-new-password" className="mb-2 block text-sm font-medium text-[#032147]">
          Confirm New Password
        </label>
        <input
          id="confirm-new-password"
          type={showPassword ? 'text' : 'password'}
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20"
          disabled={state.isLoading}
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={cancelReset}
          className="flex-1 rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm font-medium text-[#032147] transition hover:border-[#209dd7] hover:bg-[#eef8ff]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={state.isLoading}
          className="flex-1 rounded-2xl bg-[#753991] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(236,173,10,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(32,157,215,0.18),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#edf2f8_100%)] py-6 sm:py-8">
      <main className="w-full max-w-md px-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/78 p-8 shadow-[0_22px_55px_rgba(3,33,71,0.14)] backdrop-blur">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#ecad0a]">Kanban Board MVP</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#032147]">
              {resetStep !== 'idle'
                ? 'Reset Password'
                : isLoginMode
                ? 'Welcome Back'
                : 'Create Account'}
            </h1>
            <p className="mt-4 text-sm text-[#888888]">
              {resetStep === 'request'
                ? 'Enter your username to receive a reset code'
                : resetStep === 'verify'
                ? 'Enter the reset code and your new password'
                : isLoginMode
                ? 'Sign in to access your kanban board'
                : 'Register to start organizing your work'}
            </p>
          </div>

          {errorToShow && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200 animate-fade-in">
              {errorToShow}
            </div>
          )}

          {successToShow && (
            <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600 border border-green-200 animate-fade-in">
              {successToShow}
            </div>
          )}

          {resetStep === 'request' ? (
            renderResetRequest()
          ) : resetStep === 'verify' ? (
            renderResetVerify()
          ) : isLoginMode ? (
            renderLoginForm()
          ) : (
            renderRegisterForm()
          )}

          {resetStep === 'idle' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-[#888888]">
                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-[#209dd7] hover:underline focus:outline-none"
                >
                  {isLoginMode ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}

          {resetStep === 'idle' && isLoginMode && (
            <div className="mt-6 text-center text-xs text-[#888888] border-t border-[#d7dfeb]/50 pt-4">
              <p>Demo: register a new account or use existing credentials</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
