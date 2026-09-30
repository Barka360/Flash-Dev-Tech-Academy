import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const full_name = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    if (!full_name || !email) return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 });

    const admin = createAdminClient();
    const { data: existing } = await admin.from('academy_applications').select('id,status').eq('email', email).in('status', ['pending','more_information','approved']).limit(1).maybeSingle();
    if (existing) return NextResponse.json({ error: 'An application for this email is already on record.' }, { status: 409 });

    const { error } = await admin.from('academy_applications').insert({
      full_name, email,
      phone: body.phone || null,
      date_of_birth: body.date_of_birth || null,
      state: body.state || null,
      country: body.country || 'Nigeria',
      education: body.education || null,
      experience: body.experience || null,
      requested_track: body.requested_track || null,
      motivation: body.motivation || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to submit application.' }, { status: 500 });
  }
}

async function authorize() {
  const s = await createServerSupabase();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return { user: null, admin: null };
  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const allowed = profile?.role === 'admin' || (process.env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).includes((user.email || '').toLowerCase());
  return { user, admin: allowed ? admin : null };
}

export async function GET() {
  const { admin } = await authorize();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { data, error } = await admin.from('academy_applications').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data || [] });
}

export async function PATCH(req: Request) {
  const { user, admin } = await authorize();
  if (!admin || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const body = await req.json();
  const id = String(body.id || '');
  const status = String(body.status || '');
  if (!id || !['approved','rejected','more_information'].includes(status)) return NextResponse.json({ error: 'Invalid application action.' }, { status: 400 });

  const { data: application, error: fetchError } = await admin.from('academy_applications').select('*').eq('id', id).single();
  if (fetchError || !application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });

  let invitationSent = false;
  if (status === 'approved') {
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(application.email, {
      data: { full_name: application.full_name, application_id: application.id },
    });
    if (inviteError && !inviteError.message.toLowerCase().includes('already registered')) {
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }
    invitationSent = !inviteError;
    if (invited?.user) {
      await admin.from('profiles').update({ full_name: application.full_name, role: 'student' }).eq('id', invited.user.id);
    }
  }

  const { error } = await admin.from('academy_applications').update({
    status,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
    review_note: body.review_note || null,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, invitationSent });
}
