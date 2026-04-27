import { NextResponse } from 'next/server';
import {
  createAdminToken,
  attachAdminCookie,
  detachAdminCookie,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') ?? '';

  // Logout via classic form post (from the admin sidebar logout button)
  if (
    ct.includes('application/x-www-form-urlencoded') ||
    ct.includes('multipart/form-data')
  ) {
    const form = await req.formData();
    if (form.get('action') === 'logout') {
      // 303 forces the browser to follow with GET on the redirect target.
      const res = NextResponse.redirect(new URL('/admin/login', req.url), 303);
      detachAdminCookie(res);
      return res;
    }
    return NextResponse.json({ error: 'Unsupported form action' }, { status: 400 });
  }

  // JSON-based login
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = String(body?.email ?? '').trim();
  const password = String(body?.password ?? '');

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json(
      {
        error:
          'Admin credentials are not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET in .env, then restart the server.',
      },
      { status: 503 },
    );
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    // Constant-ish delay to slow down brute force attempts
    await new Promise((r) => setTimeout(r, 350));
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = createAdminToken(email);
  const res = NextResponse.json({ ok: true });
  attachAdminCookie(res, token, req.url);
  return res;
}
