// lib/supabase/mfa.ts
// Supabase MFA (TOTP) helper functions

'use client';

import { createClient } from '@/lib/supabase/client';

// ============================================
// Enroll TOTP Factor
// ============================================
export async function enrollTOTP() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Authenticator App',
  });

  if (error) {
    console.error('Enroll error:', error);
    return { success: false, error: error.message };
  }

  return {
    success: true,
    factorId: data.id,
    qrCode: data.totp.qr_code, // SVG data
    secret: data.totp.secret, // Manual entry
    uri: data.totp.uri,
  };
}

// ============================================
// Challenge Factor (create challenge)
// ============================================
export async function challengeFactor(factorId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.mfa.challenge({
    factorId,
  });

  if (error) {
    console.error('Challenge error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, challengeId: data.id };
}

// ============================================
// Verify Factor (complete enrollment/verification)
// ============================================
export async function verifyFactor(
  factorId: string,
  challengeId: string,
  code: string
) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code,
  });

  if (error) {
    console.error('Verify error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// ============================================
// List Enrolled Factors
// ============================================
export async function listFactors() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    console.error('List factors error:', error);
    return { success: false, error: error.message, factors: [] };
  }

  return {
    success: true,
    factors: data.all || [],
    totp: data.totp || [],
  };
}

// ============================================
// Unenroll Factor (disable 2FA)
// ============================================
export async function unenrollFactor(factorId: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.mfa.unenroll({
    factorId,
  });

  if (error) {
    console.error('Unenroll error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// Get Authenticator Assurance Level
// ============================================
export async function getAAL() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error) {
    console.error('AAL error:', error);
    return { success: false, error: error.message };
  }

  return {
    success: true,
    currentLevel: data.currentLevel, // aal1 or aal2
    nextLevel: data.nextLevel,
    currentAuthenticationMethods: data.currentAuthenticationMethods,
  };
}

// ============================================
// Challenge and Verify Flow (helper)
// ============================================
export async function challengeAndVerify(
  factorId: string,
  code: string
) {
  // Create challenge
  const challengeResult = await challengeFactor(factorId);
  if (!challengeResult.success || !challengeResult.challengeId) {
    return {
      success: false,
      error: challengeResult.error || 'Failed to create challenge',
    };
  }

  // Verify
  const verifyResult = await verifyFactor(
    factorId,
    challengeResult.challengeId,
    code
  );

  return verifyResult;
}
