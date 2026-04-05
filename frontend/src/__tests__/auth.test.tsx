import { authReducer, initialState } from '../lib/auth';

describe('authReducer', () => {
  it('handles LOGIN_SUCCESS with rememberMe flag', () => {
    const state = authReducer(initialState, {
      type: 'LOGIN_SUCCESS',
      payload: { user: { username: 'testuser' }, rememberMe: true },
    });

    expect(state.user).toEqual({ username: 'testuser' });
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.sessionExpiresAt).not.toBeNull();
  });

  it('handles LOGIN_SUCCESS without rememberMe (session only)', () => {
    const state = authReducer(initialState, {
      type: 'LOGIN_SUCCESS',
      payload: { user: { username: 'testuser' }, rememberMe: false },
    });

    expect(state.user).toEqual({ username: 'testuser' });
    expect(state.isAuthenticated).toBe(true);
    expect(state.sessionExpiresAt).toBeNull();
  });

  it('handles LOGIN_FAILURE', () => {
    const state = authReducer(initialState, {
      type: 'LOGIN_FAILURE',
      payload: 'Invalid credentials',
    });

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Invalid credentials');
    expect(state.sessionExpiresAt).toBeNull();
  });

  it('handles LOGOUT', () => {
    const loggedInState = {
      user: { username: 'testuser' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      sessionExpiresAt: Date.now() + 86400000,
    };

    const state = authReducer(loggedInState, {
      type: 'LOGOUT',
    });

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.sessionExpiresAt).toBeNull();
  });

  it('handles SET_LOADING', () => {
    const state = authReducer(initialState, {
      type: 'SET_LOADING',
      payload: true,
    });

    expect(state.isLoading).toBe(true);

    const nextState = authReducer(state, {
      type: 'SET_LOADING',
      payload: false,
    });

    expect(nextState.isLoading).toBe(false);
  });

  it('handles REGISTER_SUCCESS', () => {
    const state = authReducer(initialState, {
      type: 'REGISTER_SUCCESS',
      payload: { username: 'newuser' },
    });

    expect(state.user).toEqual({ username: 'newuser' });
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.sessionExpiresAt).not.toBeNull();
  });

  it('handles REGISTER_FAILURE', () => {
    const state = authReducer(initialState, {
      type: 'REGISTER_FAILURE',
      payload: 'Username already exists',
    });

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Username already exists');
    expect(state.sessionExpiresAt).toBeNull();
  });

  it('handles CLEAR_ERROR', () => {
    const errorState = {
      ...initialState,
      error: 'Some error',
    };

    const state = authReducer(errorState, {
      type: 'CLEAR_ERROR',
    });

    expect(state.error).toBeNull();
  });

  it('handles EXTEND_SESSION', () => {
    const stateWithExpiry = {
      ...initialState,
      sessionExpiresAt: Date.now() + 86400000,
    };

    const state = authReducer(stateWithExpiry, {
      type: 'EXTEND_SESSION',
    });

    // Should set expiry to now + 24 hours
    expect(state.sessionExpiresAt).toBeGreaterThanOrEqual(Date.now() + 86300000); // within 1 hour
    expect(state.sessionExpiresAt).toBeLessThanOrEqual(Date.now() + 86500000); // within 24h + 1min
  });

  it('handles SET_SESSION_EXPIRY', () => {
    const newExpiry = Date.now() + 86400000;
    const state = authReducer(initialState, {
      type: 'SET_SESSION_EXPIRY',
      payload: newExpiry,
    });

    expect(state.sessionExpiresAt).toBe(newExpiry);
  });

  it('returns same state for unknown action', () => {
    const state = authReducer(initialState, { type: 'UNKNOWN' as never });
    expect(state).toEqual(initialState);
  });
});
