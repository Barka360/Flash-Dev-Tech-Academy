'use client';

import Link from 'next/link';
import { useState } from 'react';

const fields = [
  ['full_name','Full name','text'],['email','Email address','email'],['phone','Phone number','tel'],
  ['date_of_birth','Date of birth','date'],['state','State','text'],['education','Education / qualification','text'],
];

export default function ApplyPage() {
  const [form, setForm] = useState<Record<string,string>>({});
  const [track, setTrack] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(''); setMsg('');
    const res = await fetch('/api/applications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form, requested_track:track, experience, motivation}) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || 'Application failed.');
    setMsg('Application submitted successfully. The FlashDev Academy team will review your application. If approved, you will receive an email with your account invitation and next steps.');
    setForm({}); setTrack(''); setExperience(''); setMotivation('');
  }

  return <main className="grid-bg min-h-screen px-5 py-10"><div className="mx-auto max-w-2xl">
    <Link href="/" className="font-black">ϟ FLASHDEV TECH ACADEMY</Link>
    <div className="glass mt-8 rounded-3xl p-7 md:p-10">
      <p className="text-xs uppercase tracking-widest text-blue-400">Admissions</p>
      <h1 className="mt-2 text-3xl font-black">Apply to join the Academy</h1>
      <p className="mt-3 text-sm leading-6 text-slate-400">Learning is completely free. Submit your application and an authorized FlashDev team member will review it before your student account is activated.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        {fields.map(([key,label,type])=><label key={key} className="block text-sm">{label}<input required={['full_name','email','phone'].includes(key)} type={type} className="input mt-2" value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}
        <label className="block text-sm">Preferred skill track<select required className="input mt-2" value={track} onChange={e=>setTrack(e.target.value)}><option value="">Select a track</option><option>Web Development</option><option>Python Programming</option><option>Data Analysis</option><option>AI & Machine Learning</option><option>Cybersecurity</option><option>Cloud Computing & DevOps</option><option>Mobile App Development</option><option>UI/UX Design</option><option>Blockchain & Web3</option><option>Database & SQL</option><option>Software Testing & QA</option><option>Programming Fundamentals</option><option>Digital Productivity</option><option>Digital Marketing</option></select></label>
        <label className="block text-sm">Previous technology experience<textarea className="input mt-2 min-h-24" value={experience} onChange={e=>setExperience(e.target.value)}/></label>
        <label className="block text-sm">Why do you want to join?<textarea required className="input mt-2 min-h-28" value={motivation} onChange={e=>setMotivation(e.target.value)}/></label>
        {error&&<p className="text-sm text-red-300">{error}</p>}{msg&&<p className="text-sm text-emerald-300">{msg}</p>}
        <button disabled={loading} className="btn btn-primary w-full">{loading?'Submitting…':'Submit application'}</button>
      </form>
    </div>
  </div></main>;
}
