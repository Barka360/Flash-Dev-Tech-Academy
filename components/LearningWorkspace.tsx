'use client';

import { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';

export default function LearningWorkspace({ lesson }: { lesson: any }) {
  const [tab, setTab] = useState<'html' | 'css' | 'javascript'>('html');
  const [html, setHtml] = useState(
    lesson.starter_code ||
      '<!doctype html>\n<html>\n<body>\n<h1>Hello FlashDev</h1>\n<p>My first page.</p>\n</body>\n</html>'
  );
  const [css, setCss] = useState(
    'body{font-family:system-ui;padding:2rem}h1{color:#0A84FF}'
  );
  const [js, setJs] = useState('console.log("FlashDev");');
  const [result, setResult] = useState<any>(null);

  const code = tab === 'html' ? html : tab === 'css' ? css : js;

  const preview = useMemo(
    () =>
      `<!doctype html><html><head><style>${css}</style></head><body>${html}<script>${js.replace(
        /<\\/script/gi,
        '<\\\\/script'
      )}</script></body></html>`,
    [html, css, js]
  );

  async function grade() {
    const r = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: lesson.id, html, css, js }),
    });
    setResult(await r.json());
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex gap-1 border-b border-white/5 p-2">
          {(['html', 'css', 'javascript'] as const).map((x) => (
            <button
              key={x}
              onClick={() => setTab(x)}
              className={`rounded-lg px-3 py-2 text-xs ${
                tab === x
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-slate-500'
              }`}
            >
              {x}
            </button>
          ))}
          <button
            onClick={grade}
            className="btn btn-primary ml-auto py-2 text-xs"
          >
            Run & Check
          </button>
        </div>

        <div className="h-[520px]">
          <Editor
            theme="vs-dark"
            language={tab === 'javascript' ? 'javascript' : tab}
            value={code}
            onChange={(v) =>
              tab === 'html'
                ? setHtml(v || '')
                : tab === 'css'
                  ? setCss(v || '')
                  : setJs(v || '')
            }
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="border-b border-white/5 p-3 text-xs text-slate-500">
          LIVE PREVIEW
        </div>
        <iframe
          title="preview"
          sandbox="allow-scripts"
          srcDoc={preview}
          className="h-[520px] w-full bg-white"
        />
        {result && (
          <div
            className={`border-t p-4 ${
              result.passed
                ? 'border-emerald-500/20 text-emerald-300'
                : 'border-red-500/20 text-red-300'
            }`}
          >
            <b>{result.passed ? 'Mastery passed' : 'Keep practising'}</b>
            <p className="mt-1 text-sm">{result.message}</p>
            {result.hints?.map((h: string) => (
              <p key={h} className="mt-1 text-xs">
                → {h}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
