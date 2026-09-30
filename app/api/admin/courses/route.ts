import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const s = await createServerSupabase();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((x) => x.trim().toLowerCase())
    .includes((user.email || '').toLowerCase());
  if (!allowed) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const body = await req.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from('courses').insert({
    track_id: body.track_id,
    title: body.title,
    slug: body.slug,
    description: body.description,
    level: body.level || 'beginner',
    published: false,
    estimated_hours: body.estimated_hours || 1,
    created_by: user.id,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ course: data });
}
