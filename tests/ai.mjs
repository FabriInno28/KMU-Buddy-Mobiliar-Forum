import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import handler from '../api/buddy.mjs';
import { METHODS, MEDIA } from '../api/_catalog.mjs';

const page=fs.readFileSync(new URL('../ai-prototyp.html',import.meta.url),'utf8');
assert.match(page,/<meta name="viewport"/);
assert.match(page,/id="story"/);
assert.match(page,/id="access"/);
assert.match(page,/\/api\/buddy/);
assert.match(page,/Dein erster Impuls/);
const js=page.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
assert.ok(js,'Missing client script');
new vm.Script(js,{filename:'ai-prototyp.html'});
assert.equal(METHODS.length,24);
assert.ok(!page.includes('sk-proj-'),'Never embed API key');
const originalFetch=globalThis.fetch;
const previous={OPENAI_API_KEY:process.env.OPENAI_API_KEY,BUDDY_ACCESS_TOKEN:process.env.BUDDY_ACCESS_TOKEN};
const mk=(body,token='long-secret-demo-token-123',origin='https://buddy.example')=>new Request('https://buddy.example/api/buddy',{
 method:'POST',headers:{'content-type':'application/json','x-buddy-access':token,origin},body:JSON.stringify(body)
});
let apiCalls=0;
globalThis.fetch=async (_url,opts)=>{
 apiCalls++;
 assert.match(String(opts.headers.Authorization),/^Bearer /);
 const request=JSON.parse(opts.body);
 assert.equal(request.store,false);
 assert.equal(request.response_format.type,'json_schema');
 assert.ok(!request.messages[0].content.includes('Versicherungsprodukte bevorzugen'));
 const payload=JSON.parse(request.messages[1].content);
 const userText=payload.story+' '+payload.answer;
 const team=payload.teamSize;
 const chosen=team===1?'skizze':'aktion';
 const names=['Bäckerei','Metallbau','Coiffeursalon','Schreinerei'];
 const persona=names.find(n=>userText.includes(n))||'Andere';
 const output=payload.phase==='ask'?{
  phase:'ask',message:'Das klingt nach einem vollen Alltag. Was bleibt bei euch konkret liegen, wenn du dich einen Tag herausnimmst?',
  reflection:'',insight:'',impulseTitle:'',impulseWhy:'',steps:['','',''],methodId:'none',mediaId:'none',mediaWhy:''
 }:{
  phase:'dashboard',message:'',reflection:'Du möchtest Zeit für neue Ideen finden.',insight:'Vielleicht hängt eine kleine Entscheidung noch an dir.',
  impulseTitle:'Dein konkreter Versuch für '+persona+'.',impulseWhy:'Das könnte dir Zeit für neue Ideen geben.',
  steps:['Wähle eine kleine Aufgabe.','Besprich den Rahmen mit einer Person.','Probiert es morgen aus.'],
  methodId:chosen,mediaId:'kmu_innovation',mediaWhy:'Passt zu deiner Suche nach neuen Ideen.'
 };
 assert.ok(persona!=='Andere','Unexpected test persona');
 return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(output)}}]}),{status:200});
};
try{
 delete process.env.OPENAI_API_KEY;delete process.env.BUDDY_ACCESS_TOKEN;
 assert.equal((await handler.fetch(mk({phase:'ask',story:'Wir arbeiten in einer Bäckerei.'}))).status,503);
 process.env.OPENAI_API_KEY='test-api-key';process.env.BUDDY_ACCESS_TOKEN='long-secret-demo-token-123';
 assert.equal((await handler.fetch(mk({phase:'ask',story:'Wir arbeiten in einer Bäckerei.'},'wrong-token'))).status,401);
 assert.equal((await handler.fetch(mk({phase:'ask',story:'Wir arbeiten in einer Bäckerei.'},'long-secret-demo-token-123','https://attacker.example'))).status,403);
 assert.equal((await handler.fetch(mk({phase:'ask',story:'x'}))).status,400);
 assert.equal(apiCalls,0,'Failed requests must not call paid API');
 const personas=[
 {name:'Bäckerei',story:'Wir sind eine Bäckerei mit vier Leuten, ich komme kaum zu neuen Ideen.',size:3},
 {name:'Metallbau',story:'Im Metallbau verlieren wir zwischen Werkstatt und Montage Informationen.',size:12},
 {name:'Coiffeur',story:'Wir sind ein Coiffeursalon und möchten gute Mitarbeitende halten.',size:6},
 {name:'Schreinerei',story:'In unserer Schreinerei geht bald viel Wissen mit dem Pensionierten verloren.',size:8},
 ];
 for(const persona of personas){
 const story=persona.story;
 const question=await handler.fetch(mk({phase:'ask',story,size:persona.size}));
 assert.equal(question.status,200,persona.name+' first turn');
 const q=await question.json();assert.equal(q.phase,'ask');assert.ok(q.message.includes('Was bleibt'));
 const dashboard=await handler.fetch(mk({phase:'dashboard',story,answer:'Die tägliche Bestellung liegt bei mir.',size:persona.size}));
 assert.equal(dashboard.status,200,persona.name+' dashboard');
 const d=await dashboard.json();assert.equal(d.phase,'dashboard');assert.equal(d.steps.length,3);assert.ok(d.method);
 assert.ok(d.method.minPeople<=persona.size);
 assert.ok(MEDIA.some(x=>x.id===d.media.id));
 assert.ok(d.title.includes(persona.name),'Personalized test output was not returned');
 }
 const solo=await handler.fetch(mk({phase:'dashboard',story:'Ich bin allein in meiner Bäckerei.',answer:'Ich brauche Zeit für neue Ideen.',size:1}));
 const result=await solo.json();assert.equal(result.method.id,'skizze');
 assert.ok(apiCalls>=9);
 console.log('PASS: 24 Methoden, HTML/JS syntax, secrets, authorization, origin, validation and 4 KMU + solo mocked two-step AI turns.');
}finally{
 globalThis.fetch=originalFetch;
 for(const k of Object.keys(previous)){if(previous[k]===undefined)delete process.env[k];else process.env[k]=previous[k];}
}
