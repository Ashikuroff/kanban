'use client';

import { useAuth } from '../lib/auth';
import { useEffect, useState, useCallback, useMemo } from 'react';

interface BoardInfo {
  owner: string;
  label: string;
  isOwn: boolean;
}

export function useActiveBoard() {
  const { state: authState, getSharedBoards } = useAuth();
  const user = authState.user;
  const [activeOwner, setActiveOwner] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`kanban-active-board-${user.username}`);
      // Setting state directly in effect is safe here - we're initializing from storage
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveOwner(stored);
    } else {
      setActiveOwner(null);
    }
  }, [user]);

  const setActiveBoardOwner = useCallback((owner: string | null) => {
    if (!user) return;
    if (owner) {
      localStorage.setItem(`kanban-active-board-${user.username}`, owner);
    } else {
      localStorage.removeItem(`kanban-active-board-${user.username}`);
    }
    setActiveOwner(owner);
  }, [user]);

  const availableBoards = useMemo<BoardInfo[]>(() => {
    if (!user) return [];
    const own = [{ owner: user.username, label: 'My Board', isOwn: true }];
    const sharedOwners = getSharedBoards(user.username);
    const shared = sharedOwners.map((owner: string) => ({
      owner,
      label: `${owner}'s Board`,
      isOwn: false,
    }));
    return own.concat(shared);
  }, [user, getSharedBoards]);

  return {
    activeOwner,
    setActiveBoardOwner,
    availableBoards,
  };
}
