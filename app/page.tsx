import Link from 'next/link';
import { ArrowRight, Code2, BrainCircuit, Trophy, ShieldCheck } from 'lucide-react';
import { createServerSupabase } from '@/lib/supabase-server';

export default async function Home() {
  const s = await createServerSupabase();
  const { data: tracksData } = await s
    .from('skill_tracks')
    .select('id,slug,name,description,image_url,courses(id)')
    .eq('published', true)
    .order('sort_order');

  const tracks = tracksData ?? [];

  return (
    <main className="min-h-screen grid-bg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="font-black text-lg">
          <span className="mr-2 inline-grid h-9 w-9 place-items-center rounded-xl bg-flash">ϟ</span>
          FLASHDEV <span className="text-slate-500">TECH ACADEMY</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-ghost">Log in</Link>
          <Link href="/signup" className="btn btn-primary">Start learning <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 text-center">
        <p className="mx-auto w-fit rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">100% FREE • PRACTICAL DIGITAL SKILLS</p>
        <h1 className="mt-7 text-5xl font-black md:text-7xl">Learn. <span className="text-blue-400">Code.</span> Master.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">A practical self-learning academy where students watch lessons, take notes, practice in-browser, pass automated tests and unlock mastery.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup" className="btn btn-primary px-6">Create free account</Link>
          <a href="#tracks" className="btn btn-ghost px-6">Explore skills</a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 md:grid-cols-3">
        <Card icon={<Code2 />} title="Practice" text="Use a browser coding workspace and live preview." />
        <Card icon={<BrainCircuit />} title="Get feedback" text="Automated checks explain what needs fixing." />
        <Card icon={<Trophy />} title="Master" text="Pass the mastery gate before advancing." />
      </section>

      <section id="tracks" className="mx-auto max-w-7xl px-5 py-24">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-400">Career tracks</p>
        <h2 className="mt-2 text-3xl font-black">One academy. Multiple digital skills.</h2>
        <p className="mt-3 max-w-2xl text-slate-500">Explore practical tracks with realistic technology-focused visuals and hands-on learning.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tracks.map((track: any) => (
            <div key={track.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40">
              <div className="relative h-44 overflow-hidden">
                {track.image_url ? (
                  <img src={track.image_url} alt={track.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-950 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/50 text-blue-300 backdrop-blur">
                  {track.name.includes('Cyber') ? <ShieldCheck className="h-5 w-5" /> : <Code2 className="h-5 w-5" />}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold">{track.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-5 text-slate-500">{track.description || 'Practical learning from foundations to projects.'}</p>
                <p className="mt-4 text-xs font-semibold text-blue-400">{track.courses?.length || 0} course{track.courses?.length === 1 ? '' : 's'} • Practical learning</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} FlashDev Tech Academy • Free learning, practical skills.</footer>
    </main>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="glass rounded-2xl p-6"><div className="mb-4 text-blue-400">{icon}</div><h3 className="text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-slate-400">{text}</p></div>;
}
