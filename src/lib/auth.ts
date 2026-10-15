import { supabase } from './supabaseClient.ts';

const getAuthRedirectOrigin = () =>
  import.meta.env.VITE_PUBLIC_APP_URL?.replace(/\/+$/, '') || window.location.origin;

export async function requestSignInCode(email: string, redirectTo = getAuthRedirectOrigin()) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${redirectTo}/auth/callback` },
  });

  if (error) throw error;
}

export async function requestSignUpCode(
  email: string,
  metadata: { displayName: string; universityId: string; programmeId: string },
  redirectTo = getAuthRedirectOrigin(),
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
