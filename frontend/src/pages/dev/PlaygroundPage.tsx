import { useState } from 'react';
import { Play, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface Response {
  status: number;
  statusText: string;
  durationMs: number;
  headers: Record<string, string>;
  body: unknown;
}

const PRESETS = [
  { label: 'GET /health', method: 'GET' as Method, path: '/api/health', body: '' },
  { label: 'POST /auth/login (dev)', method: 'POST' as Method, path: '/api/auth/login', body: JSON.stringify({ username: 'dev@qldh.local', password: 'dev123', role: 'dev' }, null, 2) },
  { label: 'GET /auth/me', method: 'GET' as Method, path: '/api/auth/me', body: '' },
  { label: 'GET /dev/tables/sinhVien', method: 'GET' as Method, path: '/api/dev/tables/sinhVien?page=1&pageSize=10', body: '' },
];

export function PlaygroundPage() {
  const [method, setMethod] = useState<Method>('GET');
  const [path, setPath] = useState('/api/health');
  const [body, setBody] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('qldh:token') ?? '');
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    const t0 = performance.now();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') ?? 'http://localhost:4000';
      const url = path.startsWith('/api') ? `${baseURL}${path}` : `${baseURL}/api${path.startsWith('/') ? path : `/${path}`}`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const init: RequestInit = { method, headers };
      if (body.trim() && method !== 'GET' && method !== 'DELETE') init.body = body;
      const res = await fetch(url, init);
      const ct = res.headers.get('content-type') ?? '';
      const raw = ct.includes('json') ? await res.json() : await res.text();
      const hdr: Record<string, string> = {};
      res.headers.forEach((v, k) => (hdr[k] = v));
      setResponse({ status: res.status, statusText: res.statusText, durationMs: Math.round(performance.now() - t0), headers: hdr, body: raw });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi mạng');
    } finally { setLoading(false); }
  };

  const loadPreset = (p: typeof PRESETS[number]) => {
    setMethod(p.method); setPath(p.path); setBody(p.body);
  };

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success('Đã copy');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-display font-bold">API Playground</h1>
        <p className="text-slate-500">Gọi trực tiếp endpoints của backend để kiểm thử</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-slate-500 mr-2 self-center">Preset:</span>
            {PRESETS.map((p) => (
              <Button key={p.label} variant="outline" size="sm" onClick={() => loadPreset(p)}>
                {p.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 font-mono text-sm">
              {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const).map((m) => <option key={m}>{m}</option>)}
            </select>
            <Input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/api/..." className="font-mono" />
            <Button onClick={send} disabled={loading}>
              <Play className="size-4" /> {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
          <div className="space-y-1">
            <Label>Bearer Token</Label>
            <div className="flex gap-2">
              <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="token..." className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={() => { setToken(''); toast.info('Đã xóa token'); }}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
            <div className="space-y-1">
              <Label>Body (JSON)</Label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder='{ "key": "value" }'
              />
            </div>
          )}
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded font-mono text-sm ${
                  response.status < 300 ? 'bg-emerald-100 text-emerald-700' :
                  response.status < 500 ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-sm font-normal text-slate-500">{response.durationMs}ms</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => copy(JSON.stringify(response.body, null, 2))}>
                <Copy className="size-4" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-950 text-emerald-300 p-4 rounded-lg text-xs overflow-auto max-h-96 font-mono">
{JSON.stringify(response.body, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
