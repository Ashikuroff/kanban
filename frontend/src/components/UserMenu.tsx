'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useActiveBoard } from '../hooks/useActiveBoard';
import { ProfileModal } from './ProfileModal';
import { Modal } from './Modal';

interface ConfirmDialog {
  message: string;
  onConfirm: () => void;
}

export function UserMenu() {
  const { state: authState, logout, shareBoard, unshareBoard } = useAuth();
  const { activeOwner, setActiveBoardOwner, availableBoards } = useActiveBoard();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // showShare not used separately, we just inline the share UI
  const [shareUsername, setShareUsername] = useState('');
  const [shareError, setShareError] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);

  const user = authState.user;
  const isBoardShared = activeOwner && activeOwner !== user?.username;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setShareError('');
    setShareSuccess('');

    if (!shareUsername.trim()) {
      setShareError('Username is required');
      return;
    }

    if (!user) return;

    const result = await shareBoard(user.username, shareUsername.trim());
    if (result.success) {
      setShareSuccess(`Board shared with ${shareUsername.trim()}`);
      setShareUsername('');
    } else {
      setShareError(result.error || 'Failed to share board');
    }
  };

  const handleUnshare = async (owner: string) => {
    if (!user) return;
    await unshareBoard(owner, user.username);
    // No state to update; will reflect next time menu opens
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <span className="font-medium">{user.username}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur z-50">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#032147]">Current Board</h3>
            <p className="text-xs text-[#888888]">
              {isBoardShared ? `Viewing ${activeOwner}'s board` : 'Your personal board'}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-[#032147]">Switch Board</h3>
            <div className="space-y-1">
              {availableBoards.map((board) => (
                <button
                  key={board.owner}
                  onClick={() => setActiveBoardOwner(board.isOwn ? null : board.owner)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    activeOwner === board.owner || (board.isOwn && !activeOwner)
                      ? 'bg-[#209dd7]/10 text-[#032147] font-medium'
                      : 'text-[#032147]/70 hover:bg-[#ecad0a]/10 hover:text-[#032147]'
                  }`}
                >
                  <span>{board.label}</span>
                  {board.isOwn ? (
                    <span className="text-xs text-[#888888]">You</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDialog({
                          message: `Stop sharing with ${board.owner}?`,
                          onConfirm: () => handleUnshare(board.owner),
                        });
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Unshare
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 border-t border-[#d7dfeb]/50 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-[#032147]">Share Board</h3>
            {shareSuccess ? (
              <p className="text-sm text-green-600">{shareSuccess}</p>
            ) : (
              <form onSubmit={handleShare} className="flex gap-2">
                <input
                  ref={shareInputRef}
                  type="text"
                  value={shareUsername}
                  onChange={(e) => setShareUsername(e.target.value)}
                  placeholder="Enter username"
                  className="flex-1 rounded-xl border border-[#d7dfeb] bg-white px-3 py-2 text-sm text-[#032147] outline-none focus:border-[#209dd7]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#753991] px-3 py-2 text-sm text-white hover:opacity-90"
                >
                  Share
                </button>
              </form>
            )}
            {shareError && <p className="mt-2 text-sm text-red-600">{shareError}</p>}
          </div>

          <div className="flex items-center justify-between border-t border-[#d7dfeb]/50 pt-4">
            <button
              onClick={() => {
                setShowProfile(true);
                setIsOpen(false);
              }}
              className="text-sm text-[#209dd7] hover:underline"
            >
              My Profile
            </button>
            <button
              onClick={() => {
                setConfirmDialog({
                  message: 'Are you sure you want to logout?',
                  onConfirm: () => {
                    logout();
                    setIsOpen(false);
                  },
                });
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}

      {confirmDialog && (
        <Modal isOpen={!!confirmDialog} onClose={() => setConfirmDialog(null)} title="Confirm">
          <p className="mb-6 text-sm text-gray-600">{confirmDialog.message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmDialog(null)}
              className="rounded-xl border border-[#d7dfeb] px-4 py-2 text-sm text-[#032147]/70 hover:bg-[#d7dfeb]/20"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog(null);
              }}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
