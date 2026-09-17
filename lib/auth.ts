'use client';

export interface DemoUser {
  id: string;
  username: string;
  email: string;
  country: string;
  phone: string;
  loginTime: string;
}

const STORAGE_KEY = 'zarif_demo_user';
const COOKIE_NAME = 'zarif_demo_auth';

export function saveDemoUser(user: DemoUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  document.cookie = `${COOKIE_NAME}=true; path=/; max-age=86400`;
}

export function getDemoUser(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function clearDemoUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function isDemoLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(STORAGE_KEY);
}

export function demoLogin(
  identifier: string,
  password: string
): { success: boolean; user?: DemoUser; error?: string } {
  if (!identifier.trim() || !password) {
    return { success: false, error: 'invalid' };
  }

  if (password.length < 6) {
    return { success: false, error: 'short' };
  }

  const isEmail = identifier.includes('@');

  const user: DemoUser = {
    id: `demo_${Date.now()}`,
    username: isEmail ? identifier.split('@')[0] : identifier,
    email: isEmail ? identifier : `${identifier}@demo.local`,
    country: '+880',
    phone: '+880 1788-766735',
    loginTime: new Date().toISOString(),
  };

  saveDemoUser(user);
  return { success: true, user };
}

export function demoRegister(data: {
  username: string;
  email: string;
  country: string;
  phone: string;
  password: string;
}): { success: boolean; user?: DemoUser; error?: string } {
  const user: DemoUser = {
    id: `demo_${Date.now()}`,
    username: data.username,
    email: data.email,
    country: data.country,
    phone: data.phone,
    loginTime: new Date().toISOString(),
  };

  saveDemoUser(user);
  return { success: true, user };
}