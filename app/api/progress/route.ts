import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const s = await createServerSupabase();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { error } = await s.from('lesson_progress').upsert(
    {
      user_id: user.id,
      lesson_id: body.lessonId,
      current_stage: body.stage || 'practice',
      practice_completed: !!body.practiceCompleted,
    },
    { onConflict: 'user_id,lesson_id' }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
