import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import type { NextResponse } from 'next/server';

const COOKIE_NAME = 'delphine-admin';
const SESSION_DURATION_SEC = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'insecure-dev-secret-change-me';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createAdminToken(email: string): string {
  const payload = `${email}.${Date.now()}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): string | null {
  if (!token) return null;
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;
  let payload: string;
  try {
    payload = Buffer.from(b64, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expected = sign(payload);
  if (
    expected.length !== sig.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return null;
  }
  const lastDot = payload.lastIndexOf('.');
  if (lastDot < 0) return null;
  const email = payload.slice(0, lastDot);
  const tsRaw = payload.slice(lastDot + 1);
  const ts = Number(tsRaw);
  if (!Number.isFinite(ts)) return null;
  if (Date.now() - ts > SESSION_DURATION_SEC * 1000) return null;
  return email;
}

/**
 * Reads the admin email from the incoming request's cookies.
 * Safe to call from Server Components and Route Handlers.
 */
export function getAdminEmail(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

/**
 * Attach the admin session cookie to a NextResponse. Using the response
 * object directly is the most reliable cookie-setting pattern in Next 14
 * Route Handlers — `cookies().set()` from `next/headers` sometimes does
 * not propagate to a JSON response.
 */
export function attachAdminCookie(res: NextResponse, token: string, requestUrl: string) {
  const isHttps = requestUrl.startsWith('https://');
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    // Only set Secure on real HTTPS requests so localhost (http) works.
    secure: isHttps,
    path: '/',
    maxAge: SESSION_DURATION_SEC,
  });
}

export function detachAdminCookie(res: NextResponse) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
