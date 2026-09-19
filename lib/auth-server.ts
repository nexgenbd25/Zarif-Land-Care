// lib/auth-server.ts
// Server-side auth helpers ONLY
// ⚠️ শুধু Server Components, Server Actions এ use করুন
// Client Components এ lib/auth.ts অথবা lib/auth-client.ts use করুন

import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// ============================================
// Types
// ============================================
export type ServerUserRole = 'user' | 'admin';

export interface ServerAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: ServerUserRole;
}

// ============================================
// Get Current User (Server-side)
// ============================================
export async function getServerUser(): Promise<ServerAuthUser | null> {
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
    role: (profile.role as ServerUserRole) || 'user',
  };
}

// ============================================
// Get User Role (Server-side)
// ============================================
export async function getServerUserRole(): Promise<ServerUserRole | null> {
  const user = await getServerUser();
  return user?.role || null;
}

// ============================================
// Check if Admin (Server-side)
// ============================================
export async function isServerAdmin(): Promise<boolean> {
  const role = await getServerUserRole();
  return role === 'admin';
}

// ============================================
// Require Auth (redirect if not logged in)
// ============================================
export async function requireServerAuth(locale: string = 'bn') {
  const user = await getServerUser();
  if (!user) {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    redirect(`${prefix}/login`);
  }
  return user;
}

// ============================================
// Require Admin (redirect if not admin)
// ============================================
export async function requireServerAdmin(locale: string = 'bn') {
  const user = await getServerUser();

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
export async function signOutServer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
