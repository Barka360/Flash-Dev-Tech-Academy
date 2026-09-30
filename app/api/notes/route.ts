import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const s = await createServerSupabase();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { lesson_id, content } = await req.json();
  const { error } = await s.from('notes').upsert(
    { user_id: user.id, lesson_id, content, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,lesson_id' }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
