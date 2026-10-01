import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import SignOut from '@/components/SignOut';

export default async function Dashboard() {
  const s = await createServerSupabase();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await s.from('profiles').select('*').eq('id', user.id).maybeSingle();
  const { data: coursesData } = await s
    .from('courses')
    .select('id,slug,title,description,level,estimated_hours,skill_tracks(name,image_url)')
    .eq('published', true)
    .order('created_at');

  const courses = coursesData ?? [];

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-7xl justify-between px-5 py-5">
          <Link href="/" className="font-black">ϟ FLASHDEV <span className="text-slate-500">ACADEMY</span></Link>
          <div className="flex items-center gap-5"><span className="text-sm text-slate-400">{profile?.full_name || user.email}</span><SignOut /></div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-blue-400">Student ID</p>
          <p className="mt-1 text-2xl font-black">{profile?.student_id || 'Generating…'}</p>
          <p className="mt-2 text-sm text-slate-500">XP: {profile?.xp || 0} • Streak: {profile?.streak_days || 0} days</p>
        </div>
        <h1 className="mt-12 text-3xl font-black">Explore your learning tracks</h1>
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c: any) => (
            <Link key={c.id} href={'/learn/' + c.slug} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 transition hover:border-blue-500/40">
              <div className="relative h-40 overflow-hidden">
                {c.skill_tracks?.image_url ? (
                  <img src={c.skill_tracks.image_url} alt={c.skill_tracks?.name || c.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-950 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-5 text-xs font-bold uppercase tracking-wider text-blue-300">{c.skill_tracks?.name || 'Digital Skills'}</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-black">{c.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{c.description}</p>
                <p className="mt-5 text-xs text-slate-500">{c.level} • {c.estimated_hours || 0} hours</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
