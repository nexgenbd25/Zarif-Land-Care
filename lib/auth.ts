'use client';

export interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
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
    const parsed = JSON.parse(raw) as DemoUser;

    // Backward compatibility — purono user jodi firstName/lastName na thake
    if (!parsed.firstName || !parsed.lastName) {
      const nameParts = (parsed.username || 'User').split(' ');
      parsed.firstName = parsed.firstName || nameParts[0] || 'User';
      parsed.lastName =
        parsed.lastName || nameParts.slice(1).join(' ') || '';
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

/**
 * Get full name from user object
 */
export function getFullName(user: DemoUser): string {
  const first = user.firstName?.trim() || '';
  const last = user.lastName?.trim() || '';
  const full = `${first} ${last}`.trim();
  return full || user.username || 'User';
}

/**
 * Demo login — full name auto-generate from username
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

  // Extract name from identifier
  const baseName = isEmail ? identifier.split('@')[0] : identifier;

  // Split baseName by common separators (dot, underscore, dash, space)
  const nameParts = baseName
    .split(/[._\-\s]+/)
    .filter((p) => p.length > 0);

  const firstName = nameParts[0]
    ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
    : 'User';
  const lastName = nameParts[1]
    ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
    : '';

  const user: DemoUser = {
    id: `demo_${Date.now()}`,
    firstName,
    lastName,
    username: firstName, // Username = First Name (display)
    email: isEmail ? identifier : `${identifier}@demo.local`,
    country: '+880',
    phone: '+880 1788-766735',
    loginTime: new Date().toISOString(),
  };

  saveDemoUser(user);
  return { success: true, user };
}

/**
 * Demo register — full name save korbe
 */
export function demoRegister(data: {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  country: string;
  phone: string;
  password: string;
}): { success: boolean; user?: DemoUser; error?: string } {
  // First Name + Last Name handle
  let firstName = data.firstName?.trim() || '';
  let lastName = data.lastName?.trim() || '';

  // Jodi firstName na thake — username theke generate
  if (!firstName) {
    const nameParts = data.username.split(/[._\-\s]+/).filter(Boolean);
    firstName = nameParts[0]
      ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
      : 'User';
    lastName = nameParts[1]
      ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
      : lastName;
  }

  const user: DemoUser = {
    id: `demo_${Date.now()}`,
    firstName,
    lastName,
    username: firstName, // Username = firstName (display)
    email: data.email,
    country: data.country,
    phone: data.phone,
    loginTime: new Date().toISOString(),
  };

  saveDemoUser(user);
  return { success: true, user };
}