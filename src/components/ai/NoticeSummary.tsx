import { useState } from 'react';
import { api } from '../../services/api';
import type { AIAnswer } from '../../services/aiService';
export function NoticeSummary({noticeId}:{noticeId:string}){
 const [result,setResult]=useState<AIAnswer|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [lastLanguage,setLastLanguage]=useState<'en'|'hi'>('en');
 async function summarize(language:'en'|'hi'){setLastLanguage(language);setBusy(true);setError('');try{setResult(await api<AIAnswer>('/ai/summarize','POST',{noticeId,language}));}catch(e){setError(e instanceof Error?e.message:'Summary failed');}finally{setBusy(false);}}
 return <section className="p-3 bg-slate-50 rounded-xl text-sm"><div className="flex gap-3"><button disabled={busy} onClick={()=>summarize('en')}>Summary + key deadlines</button><button disabled={busy} onClick={()=>summarize('hi')}>हिन्दी सारांश</button></div>{busy&&<p role="status">Preparing summary…</p>}{error&&<p role="alert">{error} <button onClick={()=>summarize(lastLanguage)}>Retry</button></p>}{result&&<div><p className="whitespace-pre-line">{result.answer}</p><small>AI summary · verify against the original notice below.</small></div>}</section>;
}
