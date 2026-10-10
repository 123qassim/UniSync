import { supabase } from './supabaseClient.ts';

export async function requestSignInCode(email: string, redirectTo = window.location.origin) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${redirectTo}/auth/callback` },
  });

  if (error) throw error;
}

export async function requestSignUpCode(
  email: string,
  metadata: { displayName: string; universityId: string; programmeId: string },
  redirectTo = window.location.origin,
) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${redirectTo}/auth/callback`,
      data: metadata,
    },
  });

  if (error) throw error;
}
