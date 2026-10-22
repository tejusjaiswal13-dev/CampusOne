import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import type { createApp, AuthedResponse } from '../app';
import { HttpError } from '../app';
import { idSchema } from '../schemas';
import type { Notice } from '../../../src/types';
import { canReadContent } from '../permissions';
import type { AIProvider } from './provider';
import { retrieve, suspicious } from './retrieval';
import { generateGrounded, systemPrompt, unknownAnswer } from './grounding';
const languageSchema=z.enum(['auto','en','hi']).default('auto');
export function mountAI(server:ReturnType<typeof createApp>,provider:AIProvider|null){
 const limit=rateLimit({windowMs:60_000,limit:12,keyGenerator:(_req,res)=> (res as AuthedResponse).locals.user.id,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'AI request limit reached. Try again shortly.'}});
 server.app.use('/api/ai',limit);
 server.app.post('/api/ai/ask',async(req,res:AuthedResponse)=>{
  const {question,language}=z.object({question:z.string().trim().min(2).max(1500),language:languageSchema}).strict().parse(req.body);
  const records=retrieve(server.store,res.locals.user,question);const lang=language==='auto'&&/[\u0900-\u097f]/.test(question)?'hi':language;
  if(!records.length||suspicious(question))return res.json({answer:unknownAnswer(lang),sources:[],mode:'grounded'});
  if(!provider)throw new HttpError(503,'AI is not configured. Basic mode is available.');
  try{res.json({...await generateGrounded(provider,question,records,language),mode:'ai'});}catch{throw new HttpError(503,'AI is unavailable. Basic mode is available.');}
 });
 server.app.post('/api/ai/draft',async(req,res:AuthedResponse)=>{
  if(!['FACULTY','DEPARTMENT_ADMIN','COLLEGE_ADMIN'].includes(res.locals.user.role))throw new HttpError(403,'Not authorised');
  const {points,language}=z.object({points:z.string().trim().min(10).max(4000),language:languageSchema}).strict().parse(req.body);
  if(!provider)throw new HttpError(503,'AI drafting is not configured. Enter the circular manually.');
  if(suspicious(points))throw new HttpError(400,'Please provide only the circular facts and rough points.');
  try {const raw=await provider.generate({system:systemPrompt+' This task is DRAFTING ONLY. Turn the supplied points into a formal editable circular in the IPS tone. Do not add facts, signatures or approval claims. Use [confirm detail] for missing information. Return JSON {"title":string,"description":string}. No sources are required for this draft.',input:JSON.stringify({points,language})});const data=z.object({title:z.string().min(1).max(500),description:z.string().min(1).max(10000)}).strict().parse(JSON.parse(raw));res.json({...data,requiresReview:true});}catch{throw new HttpError(503,'AI drafting failed. Enter or edit your circular manually.');}
 });
 server.app.post('/api/ai/summarize',async(req,res:AuthedResponse)=>{
  const {noticeId,language}=z.object({noticeId:idSchema,language:languageSchema}).strict().parse(req.body);const notice=server.store.get<Notice>('notices',noticeId);
  if(!notice||!canReadContent(res.locals.user,notice))throw new HttpError(403,'Notice is not accessible');
  if(!provider)throw new HttpError(503,'AI summary is not configured. Read the original notice.');
  if(suspicious(notice.description+' '+notice.title))return res.json({answer:unknownAnswer(language),sources:[],mode:'grounded'});
  try{res.json({...await generateGrounded(provider,'Summarize this notice and list its explicitly stated deadlines. Do not invent missing dates.',[{type:'notice',id:notice.id,title:notice.title,text:notice.description+(notice.deadline?`\nDeadline: ${notice.deadline}`:'')}],language),mode:'ai'});}catch{throw new HttpError(503,'AI summary failed. Read the original notice.');}
 });
}
