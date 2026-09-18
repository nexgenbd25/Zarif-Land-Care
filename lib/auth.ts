'use client';

export interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  phone: string;
  address?: string;
  state?: string;
  city?: string;
  zipCode?: string;
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
    const parsed = JSON.parse(raw) as DemoUser;

    if (!parsed.firstName || !parsed.lastName) {
      const nameParts = (parsed.username || 'User').split(' ');
      parsed.firstName = parsed.firstName || nameParts[0] || 'User';
      parsed.lastName =
        parsed.lastName || nameParts.slice(1).join(' ') || '';
    }

    // 🎯 Email lowercase force
    if (parsed.email) {
      parsed.email = parsed.email.toLowerCase();
    }

    // 🎯 Username lowercase (jodi capital thake)
    if (parsed.username) {
      parsed.username = parsed.username.toLowerCase();
    }

    return parsed;
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

export function getFullName(user: DemoUser): string {
  const first = user.firstName?.trim() || '';
  const last = user.lastName?.trim() || '';
  const full = `${first} ${last}`.trim();
  return full || user.username || 'User';
}

/**
 * Demo login — username generate from identifier
 */
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
  const baseName = isEmail ? identifier.split('@')[0] : identifier;

  // 🎯 Username = baseName (lowercase, space chara)
  const username = baseName.toLowerCase().replace(/\s+/g, '');

  // 🎯 First Name + Last Name from baseName
  const nameParts = baseName
    .split(/[._\-\s]+/)
    .filter((p) => p.length > 0);

  const firstName = nameParts[0]
    ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase()
    : 'User';
  const lastName = nameParts[1]
    ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1).toLowerCase()
    : '';

  // 🎯 Email lowercase
  const email = isEmail
    ? identifier.toLowerCase()
    : `${username}@demo.local`;

  const user: DemoUser = {
    id: `demo_${Date.now()}`,
    firstName,
    lastName,
    username,
    email,
    country: '+880',
    phone: '+880 1788-766735',
    loginTime: new Date().toISOString(),
  };

  saveDemoUser(user);
  return { success: true, user };
}

/**
 * Demo register — username as it is, email lowercase
 */
export function demoRegister(data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  address?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}): { success: boolean; user?: DemoUser; error?: string } {
  // 🎯 Username trim + lowercase (jodi capital thake)
  const username = data.username.trim().toLowerCase();

  // 🎯 Email trim + lowercase
  const email = data.email.trim().toLowerCase();

  const user: DemoUser = {
    id: `demo_${Date.now()}`,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    username,
    email,
    country: data.country,
    phone: data.phone.trim(),
    address: data.address?.trim() || '',
    state: data.state?.trim() || '',
    city: data.city?.trim() || '',
    zipCode: data.zipCode?.trim() || '',
    loginTime: new Date().toISOString(),
  };

  saveDemoUser(user);
  return { success: true, user };
}
