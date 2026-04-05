import type { User } from './auth';
import { hashPassword as hashPasswordWithSalt } from './crypto';

export interface AuthService {
  login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }>;
  logout(): Promise<void>;
  register(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }>;
  requestPasswordReset(username: string): Promise<{ success: boolean; message: string }>;
  verifyResetToken(token: string): Promise<{ valid: boolean; username?: string }>;
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }>;
  updateProfile(currentUsername: string, newUsername: string, currentPassword: string): Promise<{ success: boolean; error?: string }>;
  changePassword(username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }>;
  deleteAccount(username: string, password: string): Promise<{ success: boolean; error?: string }>;
  getSharedBoards(username: string): string[];
  shareBoard(ownerUsername: string, targetUsername: string): Promise<{ success: boolean; error?: string }>;
  unshareBoard(ownerUsername: string, targetUsername: string): Promise<void>;
}

const USERS_STORAGE_KEY = 'kanban-users-v2';
const AUTH_STORAGE_KEY = 'kanban-auth';
const RESET_TOKENS_KEY = 'kanban-reset-tokens';
const BOARD_SHARING_KEY = 'board-sharing';

function getUsers(): Map<string, { username: string; passwordHash: string; salt: string }> {
  if (typeof window === 'undefined') return new Map();
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) return new Map();

  try {
    const usersArray = JSON.parse(stored) as Array<{ username: string; passwordHash: string; salt: string }>;
    // Filter out any corrupted entries (missing fields)
    const validUsers = usersArray.filter(
      (u) => u.username && u.passwordHash && u.salt
    );
    return new Map(validUsers.map((u) => [u.username.toLowerCase(), u]));
  } catch {
    // If corrupted, clear storage
    localStorage.removeItem(USERS_STORAGE_KEY);
    return new Map();
  }
}

function saveUsers(usersMap: Map<string, { username: string; passwordHash: string; salt: string }>) {
  if (typeof window !== 'undefined') {
    const usersArray = Array.from(usersMap.values());
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersArray));
  }
}

function getStoredResetTokens(): Map<string, { username: string; expiresAt: number }> {
  if (typeof window === 'undefined') return new Map();
  const stored = localStorage.getItem(RESET_TOKENS_KEY);
  if (!stored) return new Map();

  try {
    const tokensArray = JSON.parse(stored) as Array<{ token: string; username: string; expiresAt: number }>;
    return new Map(tokensArray.map((t) => [t.token, { username: t.username, expiresAt: t.expiresAt }]));
  } catch {
    return new Map();
  }
}

function saveResetTokens(tokensMap: Map<string, { username: string; expiresAt: number }>) {
  if (typeof window !== 'undefined') {
    const tokensArray = Array.from(tokensMap.entries()).map(([token, data]) => ({
      token,
      ...data,
    }));
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokensArray));
  }
}

function getStoredSharings(): Map<string, string[]> {
  if (typeof window === 'undefined') return new Map();
  const stored = localStorage.getItem(BOARD_SHARING_KEY);
  if (!stored) return new Map();

  try {
    const sharingsArray = JSON.parse(stored);
    return new Map(sharingsArray);
  } catch {
    return new Map();
  }
}

function saveSharings(sharingsMap: Map<string, string[]>) {
  if (typeof window !== 'undefined') {
    const sharingsArray = Array.from(sharingsMap.entries());
    localStorage.setItem(BOARD_SHARING_KEY, JSON.stringify(sharingsArray));
  }
}

function userExists(username: string): boolean {
  return getUsers().has(username.toLowerCase());
}

function generateResetToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export class LocalAuthService implements AuthService {
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return { success: false, error: 'Username and password are required' };
    }

    const users = getUsers();
    const userRecord = users.get(trimmedUsername.toLowerCase());

    if (!userRecord) {
      return { success: false, error: 'Invalid username or password' };
    }

    const { hash: inputHash } = await hashPasswordWithSalt(trimmedPassword, userRecord.salt);
    if (inputHash !== userRecord.passwordHash) {
      return { success: false, error: 'Invalid username or password' };
    }

    const user: User = { username: userRecord.username };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
    return { success: true, user };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  async register(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return { success: false, error: 'All fields are required' };
    }

    if (trimmedPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    if (userExists(trimmedUsername)) {
      return { success: false, error: 'Username already exists' };
    }

    const { hash, salt } = await hashPasswordWithSalt(trimmedPassword);
    const users = getUsers();
    users.set(trimmedUsername.toLowerCase(), {
      username: trimmedUsername,
      passwordHash: hash,
      salt,
    });
    saveUsers(users);

    const user: User = { username: trimmedUsername };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));

    return { success: true, user };
  }

  async requestPasswordReset(username: string): Promise<{ success: boolean; message: string }> {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return { success: false, message: 'Username is required' };
    }

    if (!userExists(trimmedUsername)) {
      // For security, always return success even if user doesn't exist
      return { success: true, message: 'If the username exists, a reset code has been sent' };
    }

    const token = generateResetToken();
    const expiresAt = Date.now() + 3600000; // 1 hour

    const tokens = getStoredResetTokens();
    tokens.set(token, { username: trimmedUsername, expiresAt });
    saveResetTokens(tokens);

    // In a real app, this would send an email. Here we return the token for demo.
    return { success: true, message: `Reset code: ${token} (expires in 1 hour)` };
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean; username?: string }> {
    const tokens = getStoredResetTokens();
    const tokenData = tokens.get(token);

    if (!tokenData) {
      return { valid: false };
    }

    if (Date.now() > tokenData.expiresAt) {
      tokens.delete(token);
      saveResetTokens(tokens);
      return { valid: false };
    }

    return { valid: true, username: tokenData.username };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const trimmedPassword = newPassword.trim();
    if (trimmedPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    const verification = await this.verifyResetToken(token);
    if (!verification.valid || !verification.username) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    const users = getUsers();
    const userRecord = users.get(verification.username.toLowerCase());
    if (!userRecord) {
      return { success: false, error: 'User not found' };
    }

    const { hash, salt } = await hashPasswordWithSalt(trimmedPassword);
    userRecord.passwordHash = hash;
    userRecord.salt = salt;
    saveUsers(users);

    // Invalidate the token
    const tokens = getStoredResetTokens();
    tokens.delete(token);
    saveResetTokens(tokens);

    return { success: true };
  }

  async updateProfile(currentUsername: string, newUsername: string, currentPassword: string): Promise<{ success: boolean; error?: string }> {
    const trimmedNewUsername = newUsername.trim();
    const trimmedPassword = currentPassword.trim();

    if (!trimmedNewUsername || !trimmedPassword) {
      return { success: false, error: 'All fields are required' };
    }

    const users = getUsers();
    const userRecord = users.get(currentUsername.toLowerCase());

    if (!userRecord) {
      return { success: false, error: 'User not found' };
    }

    const { hash: inputHash } = await hashPasswordWithSalt(trimmedPassword, userRecord.salt);
    if (inputHash !== userRecord.passwordHash) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (trimmedNewUsername.toLowerCase() !== currentUsername.toLowerCase() && userExists(trimmedNewUsername)) {
      return { success: false, error: 'Username already taken' };
    }

    // Update username
    const oldKey = currentUsername.toLowerCase();
    const newKey = trimmedNewUsername.toLowerCase();

    if (oldKey !== newKey) {
      users.delete(oldKey);
      userRecord.username = trimmedNewUsername;
      users.set(newKey, userRecord);
      saveUsers(users);

      // Update stored auth session if exists
      const authStored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (authStored) {
        try {
          const { user } = JSON.parse(authStored);
          if (user.username.toLowerCase() === currentUsername.toLowerCase()) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: { username: trimmedNewUsername } }));
          }
        } catch {
          // ignore
        }
      }
    }

    return { success: true };
  }

  async changePassword(username: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const users = getUsers();
    const userRecord = users.get(username.toLowerCase());

    if (!userRecord) {
      return { success: false, error: 'User not found' };
    }

    const { hash: currentHash } = await hashPasswordWithSalt(currentPassword, userRecord.salt);
    if (currentHash !== userRecord.passwordHash) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (newPassword.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters' };
    }

    const { hash, salt } = await hashPasswordWithSalt(newPassword);
    userRecord.passwordHash = hash;
    userRecord.salt = salt;
    saveUsers(users);

    return { success: true };
  }

  async deleteAccount(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      return { success: false, error: 'Password is required' };
    }

    const users = getUsers();
    const userRecord = users.get(username.toLowerCase());

    if (!userRecord) {
      return { success: false, error: 'User not found' };
    }

    const { hash: inputHash } = await hashPasswordWithSalt(trimmedPassword, userRecord.salt);
    if (inputHash !== userRecord.passwordHash) {
      return { success: false, error: 'Incorrect password' };
    }

    users.delete(username.toLowerCase());
    saveUsers(users);

    // Remove auth session
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    // Remove user's board data (specifically for this username)
    const boardKey = `kanban-board-${username}`;
    localStorage.removeItem(boardKey);

    // Remove any board sharing references to this user
    const sharings = getStoredSharings();
    sharings.delete(username);
    for (const [owner, sharedUsers] of sharings) {
      const filtered = sharedUsers.filter((u) => u.toLowerCase() !== username.toLowerCase());
      if (filtered.length !== sharedUsers.length) {
        sharings.set(owner, filtered);
      }
    }
    saveSharings(sharings);

    return { success: true };
  }

  async shareBoard(ownerUsername: string, targetUsername: string): Promise<{ success: boolean; error?: string }> {
    const trimmedTarget = targetUsername.trim().toLowerCase();
    const trimmedOwner = ownerUsername.trim();

    if (!trimmedTarget) {
      return { success: false, error: 'Username is required' };
    }

    if (trimmedTarget === trimmedOwner.toLowerCase()) {
      return { success: false, error: 'Cannot share with yourself' };
    }

    if (!userExists(trimmedTarget)) {
      return { success: false, error: 'User does not exist' };
    }

    const sharings = getStoredSharings();
    const currentShared = sharings.get(trimmedOwner) || [];
    if (currentShared.includes(trimmedTarget)) {
      return { success: false, error: 'Board already shared with this user' };
    }

    sharings.set(trimmedOwner, [...currentShared, trimmedTarget]);
    saveSharings(sharings);

    return { success: true };
  }

  async unshareBoard(ownerUsername: string, targetUsername: string): Promise<void> {
    const trimmedTarget = targetUsername.trim().toLowerCase();
    const trimmedOwner = ownerUsername.trim();

    const sharings = getStoredSharings();
    const currentShared = sharings.get(trimmedOwner) || [];
    const filtered = currentShared.filter((u) => u !== trimmedTarget);
    sharings.set(trimmedOwner, filtered);
    saveSharings(sharings);
  }

  getSharedBoards(username: string): string[] {
    const sharings = getStoredSharings();
    const sharedWithUser: string[] = [];

    for (const [owner, sharedUsers] of sharings) {
      if (sharedUsers.some((u) => u.toLowerCase() === username.toLowerCase())) {
        sharedWithUser.push(owner);
      }
    }

    return sharedWithUser;
  }
}

let authServiceInstance: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new LocalAuthService();
  }
  return authServiceInstance;
}
