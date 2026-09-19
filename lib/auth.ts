// lib/auth.ts
// Server-side auth helpers ONLY
// ⚠️ শুধু Server Components, Server Actions এ use করুন
// Client Components এ lib/auth-client.ts use করুন

import 'server-only'; // ⚠️ এই file শুধু server-side
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// ============================================
// Types
// ============================================
export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
}

// ============================================
// Get Current User (Server-side)
// ============================================
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name, username, role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return {
      id: user.id,
      email: user.email || '',
      firstName: '',
      lastName: '',
      username: user.email?.split('@')[0] || '',
      role: 'user',
    };
  }

  return {
    id: user.id,
    email: user.email || '',
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    username: profile.username || '',
    role: (profile.role as UserRole) || 'user',
  };
}

// ============================================
// Get User Role (Server-side)
// ============================================
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

// ============================================
// Check if Admin (Server-side)
// ============================================
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin';
}

// ============================================
// Require Auth (redirect if not logged in)
// ============================================
export async function requireAuth(locale: string = 'bn') {
  const user = await getCurrentUser();
  if (!user) {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    redirect(`${prefix}/login`);
  }
  return user;
}

// ============================================
// Require Admin (redirect if not admin)
// ============================================
export async function requireAdmin(locale: string = 'bn') {
  const user = await getCurrentUser();

  if (!user) {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    redirect(`${prefix}/login?error=login-required`);
  }

  if (user.role !== 'admin') {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    redirect(`${prefix}/user/dashboard?error=admin-only`);
  }

  return user;
}

// ============================================
// Sign Out (Server-side)
// ============================================
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
