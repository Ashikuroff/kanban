'use client';

import React, { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import { getAuthService } from './authService';

export interface User {
  username: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: number | null;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; rememberMe: boolean } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_SESSION_EXPIRY'; payload: number | null }
  | { type: 'EXTEND_SESSION' };

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sessionExpiresAt: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiresAt: action.payload.rememberMe ? Date.now() + 24 * 60 * 60 * 1000 : null, // 24h if rememberMe
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        sessionExpiresAt: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionExpiresAt: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        sessionExpiresAt: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_SESSION_EXPIRY':
      return {
        ...state,
        sessionExpiresAt: action.payload,
      };
    case 'EXTEND_SESSION':
      return {
        ...state,
        sessionExpiresAt: state.sessionExpiresAt ? Date.now() + 24 * 60 * 60 * 1000 : null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
  requestPasswordReset: (username: string) => Promise<{ success: boolean; message: string }>;
  verifyResetToken: (token: string) => Promise<{ valid: boolean; username?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (currentUsername: string, newUsername: string, currentPassword: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (username: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  getSharedBoards: (username: string) => string[];
  shareBoard: (ownerUsername: string, targetUsername: string) => Promise<{ success: boolean; error?: string }>;
  unshareBoard: (ownerUsername: string, targetUsername: string) => Promise<void>;
  extendSession: () => void;
  clearError: () => void;
} | null>(null);

const AUTH_STORAGE_KEY = 'kanban-auth';
const SESSION_ACTIVITY_KEY = 'kanban-session-activity';
const STORAGE_VERSION_KEY = 'kanban-storage-version';
const CURRENT_VERSION = 2;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  const service = useMemo(() => getAuthService(), []);

  useEffect(() => {
    // Migration: Clear corrupted user data from buggy password hashing (version 1)
    const storedVersion = parseInt(localStorage.getItem(STORAGE_VERSION_KEY) || '0', 10);
    if (storedVersion < CURRENT_VERSION) {
      console.log('Running storage migration: clearing corrupted user data');
      // Clear user credentials (they may be corrupted)
      localStorage.removeItem('kanban-users-v2');
      localStorage.removeItem('kanban-reset-tokens');
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION.toString());
      console.log('Migration complete. Users can re-register or reset passwords.');
    }

    // Handle inactivity tracking
    const updateActivity = () => {
      if (state.sessionExpiresAt) {
        localStorage.setItem(SESSION_ACTIVITY_KEY, Date.now().toString());
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const { user, rememberMe } = JSON.parse(stored);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, rememberMe },
          });
          return;
        }

        const sessionStored = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (sessionStored) {
          const { user } = JSON.parse(sessionStored);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, rememberMe: false },
          });
          return;
        }

        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Auth restoration error:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    // Check if we migrated and inform user (only client-side)
    if (storedVersion < CURRENT_VERSION) {
      // Show a one-time info message about the update
      setTimeout(() => {
        alert('Storage migration: If you had an existing account, please use "Forgot password?" to reset it, or create a new account.');
      }, 500);
    }

    checkAuth();
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  // Session expiration check
  useEffect(() => {
    if (!state.sessionExpiresAt || !state.isAuthenticated) return;

    const checkExpiry = () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentExpiry = state.sessionExpiresAt;
      if (currentExpiry && Date.now() > currentExpiry) {
        service.logout();
        return;
      }

      // Extend session if there's recent activity
      const lastActivity = localStorage.getItem(SESSION_ACTIVITY_KEY);
      if (lastActivity && currentExpiry) {
        const activityTime = parseInt(lastActivity, 10);
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        if (activityTime > oneHourAgo) {
          dispatch({ type: 'EXTEND_SESSION' });
        }
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.sessionExpiresAt, state.isAuthenticated, service, dispatch]);

  const login = useCallback(
    async (username: string, password: string, rememberMe: boolean = true): Promise<boolean> => {
      const result = await service.login(username, password);
      if (result.success && result.user) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: result.user, rememberMe }));
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.user, rememberMe },
        });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: result.error || 'Login failed' });
        return false;
      }
    },
    [service]
  );

  const logout = useCallback(async () => {
    await service.logout();
    localStorage.removeItem(SESSION_ACTIVITY_KEY);
    dispatch({ type: 'LOGOUT' });
  }, [service]);

  const register = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      const result = await service.register(username, password);
      if (result.success && result.user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: result.user, rememberMe: true }));
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: result.user,
        });
        return true;
      } else {
        dispatch({ type: 'REGISTER_FAILURE', payload: result.error || 'Registration failed' });
        return false;
      }
    },
    [service]
  );

  const requestPasswordReset = useCallback(
    async (username: string): Promise<{ success: boolean; message: string }> => {
      const result = await service.requestPasswordReset(username);
      return result;
    },
    [service]
  );

  const verifyResetToken = useCallback(
    async (token: string): Promise<{ valid: boolean; username?: string }> => {
      return await service.verifyResetToken(token);
    },
    [service]
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      return await service.resetPassword(token, newPassword);
    },
    [service]
  );

  const updateProfile = useCallback(
    async (currentUsername: string, newUsername: string, currentPassword: string): Promise<{ success: boolean; error?: string }> => {
      return await service.updateProfile(currentUsername, newUsername, currentPassword);
    },
    [service]
  );

  const changePassword = useCallback(
    async (username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      return await service.changePassword(username, currentPassword, newPassword);
    },
    [service]
  );

  const deleteAccount = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      return await service.deleteAccount(username, password);
    },
    [service]
  );

  const getSharedBoards = useCallback(
    (username: string): string[] => {
      return service.getSharedBoards(username);
    },
    [service]
  );

  const shareBoard = useCallback(
    async (ownerUsername: string, targetUsername: string): Promise<{ success: boolean; error?: string }> => {
      return await service.shareBoard(ownerUsername, targetUsername);
    },
    [service]
  );

  const unshareBoard = useCallback(
    async (ownerUsername: string, targetUsername: string): Promise<void> => {
      await service.unshareBoard(ownerUsername, targetUsername);
    },
    [service]
  );

  const extendSession = useCallback(() => {
    dispatch({ type: 'EXTEND_SESSION' });
    localStorage.setItem(SESSION_ACTIVITY_KEY, Date.now().toString());
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  const contextValue = useMemo(
    () => ({
      state,
      login,
      logout,
      register,
      requestPasswordReset,
      verifyResetToken,
      resetPassword,
      updateProfile,
      changePassword,
      deleteAccount,
      getSharedBoards,
      shareBoard,
      unshareBoard,
      extendSession,
      clearError,
    }),
    [
      state,
      login,
      logout,
      register,
      requestPasswordReset,
      verifyResetToken,
      resetPassword,
      updateProfile,
      changePassword,
      deleteAccount,
      getSharedBoards,
      shareBoard,
      unshareBoard,
      extendSession,
      clearError,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
