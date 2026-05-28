'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'kitchen' | 'guest';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// ─── Mock user database ───────────────────────────────────────────────────────
// In a real app this lives in a backend. For demo we keep it in memory + localStorage.
const SEED_USERS: (AuthUser & { password: string })[] = [
  {
    id: 'usr_admin_001',
    name: 'Hari Prasad Sharma',
    email: 'admin@motimahal.com',
    password: 'admin1234',
    role: 'admin',
  },
  {
    id: 'usr_kitchen_001',
    name: 'Ram Bahadur Magar',
    email: 'kitchen@motimahal.com',
    password: 'kitchen1234',
    role: 'kitchen',
  },
  {
    id: 'usr_guest_001',
    name: 'Anil Gurung',
    email: 'guest@demo.com',
    password: 'guest1234',
    role: 'guest',
  },
];

const STORAGE_KEY_USER     = 'motimahal_auth_user';
const STORAGE_KEY_REGISTRY = 'motimahal_registered_guests';

function loadRegistry(): (AuthUser & { password: string })[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegistry(users: (AuthUser & { password: string })[]) {
  try {
    localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(users));
  } catch {}
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Combine seed + registered guests
    const registry = loadRegistry();
    const allUsers = [...SEED_USERS, ...registry];

    const match = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (!match) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { password: _pw, ...authUser } = match;
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const registry = loadRegistry();
    const allUsers = [...SEED_USERS, ...registry];

    if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: AuthUser & { password: string } = {
      id: `usr_guest_${Date.now()}`,
      name,
      email,
      password,
      role: 'guest',
    };

    saveRegistry([...registry, newUser]);

    const { password: _pw, ...authUser } = newUser;
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
