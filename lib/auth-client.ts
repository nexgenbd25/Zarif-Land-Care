// lib/auth-client.ts
// Client-side auth helpers (browser only)
// ⚠️ শুধু Client Components এ use করুন

'use client';

import { createClient } from '@/lib/supabase/client';

// ============================================
// Types
// ============================================
export type ClientUserRole = 'user' | 'admin';

export interface ClientAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: ClientUserRole;
}

// ============================================
// Get Current User (Client-side)
// ============================================
export async function getClientUser(): Promise<ClientAuthUser | null> {
  const supabase = createClient();

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
    role: (profile.role as ClientUserRole) || 'user',
  };
}

// ============================================
// Sign Out (Client-side)
// ============================================
export async function signOutClient() {
  const supabase = createClient();
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// ============================================
// Sign In (Client-side)
// ============================================
export async function signInClient(email: string, password: string) {
  const supabase = createClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// ============================================
// Sign Up (Client-side)
// ============================================
export async function signUpClient(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  countryCode?: string;
  mobile?: string;
}) {
  const supabase = createClient();
  return await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        first_name: params.firstName,
        last_name: params.lastName,
        username: params.username,
        country_code: params.countryCode || '+880',
        mobile: params.mobile || '',
      },
    },
  });
}

// ============================================
// Get Session (Client-side)
// ============================================
export async function getClientSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// ============================================
// Reset Password (Client-side)
// ============================================
export async function resetPasswordClient(email: string) {
  const supabase = createClient();
  return await supabase.auth.resetPasswordForEmail(email);
}

// ============================================
// Update Password (Client-side)
// ============================================
export async function updatePasswordClient(newPassword: string) {
  const supabase = createClient();
  return await supabase.auth.updateUser({
    password: newPassword,
  });
}
