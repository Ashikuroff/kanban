'use client';

import { useState } from 'react';
import { useAuth } from '../lib/auth';

interface ProfileModalProps {
  onClose: () => void;
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { state: authState, updateProfile, changePassword, deleteAccount } = useAuth();
  const user = authState.user;

  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    const result = await updateProfile(user!.username, username.trim(), currentPassword);
    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Password must be at least 4 characters' });
      return;
    }

    setIsLoading(true);
    const result = await changePassword(user!.username, currentPassword, newPassword);
    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to change password' });
    }
  };

  const handleDeleteAccount = async () => {
    setMessage(null);
    setIsLoading(true);
    const result = await deleteAccount(user!.username, deletePassword);
    setIsLoading(false);

    if (result.success) {
      onClose();
      // User will be logged out automatically by deleteAccount
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete account' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-[2rem] border border-white/70 bg-white/95 p-8 shadow-[0_22px_55px_rgba(3,33,71,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#032147]">My Profile</h2>
          <button onClick={onClose} className="text-[#888888] hover:text-[#032147]">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {message && (
          <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-lg font-medium text-[#032147]">Update Username</h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#032147]">New Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#032147]">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#753991] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Username'}
            </button>
          </form>

          <form onSubmit={handleChangePassword} className="space-y-4 border-t border-[#d7dfeb]/50 pt-6">
            <h3 className="text-lg font-medium text-[#032147]">Change Password</h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#032147]">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#032147]">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#032147]">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#753991] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>

          <div className="border-t border-[#d7dfeb]/50 pt-6">
            <h3 className="mb-4 text-lg font-medium text-[#032147]">Danger Zone</h3>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full rounded-2xl border-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4 rounded-2xl border-2 border-red-500 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  This will permanently delete your account and all data. This action cannot be undone.
                </p>
                <div>
                  <label className="mb-2 block text-sm font-medium text-red-700">Enter your password to confirm</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full rounded-xl border border-red-300 bg-white px-3 py-2 text-sm text-[#032147] focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Password"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading || !deletePassword}
                    className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                      setMessage(null);
                    }}
                    className="flex-1 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onClose} className="text-sm text-[#888888] hover:text-[#032147]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
