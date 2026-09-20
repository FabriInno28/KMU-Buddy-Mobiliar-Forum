import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import app,{eligibleMethods} from "../src/worker.mjs";
import {METHODS,MEDIA} from "../src/catalog.mjs";
const page=fs.readFileSync(new URL("../public/pilot.html",import.meta.url),"utf8");
const landing=fs.readFileSync(new URL("../public/index.html",import.meta.url),"utf8");
const config=JSON.parse(fs.readFileSync(new URL("../wrangler.jsonc",import.meta.url),"utf8"));
assert.equal(METHODS.length,24);assert.equal(config.ai.binding,"AI");
assert.equal(config.assets.directory,"./public");
assert.match(landing,/KI Werkstatt/);assert.match(page,/id="access"/);assert.match(page,/\/api\/buddy/);
const embedded=page.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];assert.ok(embedded);
new vm.Script(embedded,{filename:"public/pilot.html"});
assert.ok(!page.includes("sk-proj-")&&!page.includes("CF_API_KEY"));
assert.ok(eligibleMethods(1,"Ich suche neue Ideen","").every(m=>m.minPeople<=1));
assert.ok(eligibleMethods(2,"Unser Team braucht Ideen","").every(m=>m.minPeople<=2));
let calls=0;let lastPayload;
const env={BUDDY_TEST_CODE:"separates-test-passwort-mit-32-zeichen",ASSETS:{fetch:async()=>new Response("DEMO OK")},
 AI:{run:async(model,payload)=>{
  calls++;lastPayload=payload;
  assert.match(model,/^@cf\//);assert.equal(payload.response_format.type,"json_schema");
  const user=JSON.parse(payload.messages[1].content);
  const low=(user.story+" "+user.answer).toLowerCase();
  const persona=low.includes("bäckerei")?"Bäckerei":low.includes("metallbau")?"Metallbau":low.includes("coiffeur")?"Coiffeur":"Schreinerei";
  if(user.phase==="ask")return {response:JSON.stringify({question:"Was würde dir im Alltag von "+persona+" konkret am meisten helfen?"})};
  const chosen=user.methods.find(m=>m.minPeople<=user.people);
  return {response:{reflection:"Ihr möchtet in eurem "+persona+" Alltag eine konkrete Veränderung anpacken.",insight:"Vielleicht ist ein einzelner Versuch sinnvoller als ein neues Projekt.",impulseTitle:"Probiert morgen eine kleine Verbesserung im "+persona+" aus.",impulseWhy:"So findet ihr mit wenig Aufwand heraus, was euch wirklich hilft.",steps:["Wählt eine wiederkehrende Situation aus.","Vereinbart mit einer Person einen kleinen Versuch.","Prüft morgen gemeinsam, ob es leichter ging."],methodId:chosen?.id||"none",mediaId:MEDIA[0].id,mediaWhy:"Ein Praxisbeispiel zum Weiterdenken."}};
 }}};
const req=(body,token=env.BUDDY_TEST_CODE,origin="https://buddy.example")=>new Request("https://buddy.example/api/buddy",{method:"POST",headers:{"Content-Type":"application/json","X-Buddy-Access":token,"Origin":origin},body:JSON.stringify(body)});
assert.equal((await app.fetch(req({phase:"ask",story:"Wir sind eine Bäckerei."}),{})).status,503);
assert.equal((await app.fetch(req({phase:"ask",story:"Wir sind eine Bäckerei."},"falsch"),env)).status,401);
assert.equal((await app.fetch(req({phase:"ask",story:"Wir sind eine Bäckerei."},env.BUDDY_TEST_CODE,"https://fremd.example"),env)).status,403);
assert.equal((await app.fetch(req({phase:"ask",story:"x"}),env)).status,400);
assert.equal((await app.fetch(req({phase:"dashboard",story:"Eine Bäckerei",answer:"x"}),env)).status,400);
assert.equal(calls,0,"No AI call before authorization and validation");
const personas=[
 {id:"baeckerei",story:"In unserer Bäckerei läuft alles über meinen Tisch, aber ich möchte Zeit für neue Produkte.",answer:"Die tägliche Bestellung erledige ich immer selbst.",people:4},
 {id:"metallbau",story:"Im Metallbau gehen Übergaben zwischen Werkstatt und Montage schief.",answer:"Die Montage muss bei jedem Auftrag nachtelefonieren.",people:12},
 {id:"coiffeur",story:"Unser Coiffeursalon möchte Mitarbeitende länger im Team halten.",answer:"Unsere Mitarbeitenden möchten häufiger mitreden.",people:6},
 {id:"schreinerei",story:"In unserer Schreinerei geht der erfahrenste Mitarbeitende in Pension.",answer:"Seine Kniffe bei der Kalkulation sind nicht dokumentiert.",people:8},
 {id:"solo",story:"Ich führe allein eine Schreinerei und möchte neue Ideen ausprobieren.",answer:"Ich komme zwischen zwei Aufträgen kaum dazu.",people:1}
];
for(const p of personas){
 const a=await app.fetch(req({phase:"ask",story:p.story,size:p.people}),env);
 assert.equal(a.status,200,p.id+" ask");
 const question=await a.json();assert.equal(question.phase,"ask");assert.ok(question.message.includes("?"));
 const b=await app.fetch(req({phase:"dashboard",story:p.story,answer:p.answer,size:p.people}),env);
 assert.equal(b.status,200,p.id+" dashboard");
 const result=await b.json();
 assert.equal(result.phase,"dashboard");assert.equal(result.steps.length,3);
 assert.ok(result.title.includes(p.id==="solo"?"Schreinerei":p.id==="coiffeur"?"Coiffeur":p.id==="metallbau"?"Metallbau":"Bäckerei"));
 assert.ok(!result.method||result.method.minPeople<=p.people);
 assert.ok(result.media&&result.media.url.startsWith("https://"));
}
assert.equal(calls,10);
const broken={...env,AI:{run:async()=>{throw new Error("Quota exhausted")}}};
const e=await app.fetch(req({phase:"ask",story:"Wir sind eine Bäckerei."}),broken);
assert.equal(e.status,503);
assert.equal(await (await app.fetch(new Request("https://buddy.example/"),env)).text(),"DEMO OK");
console.log("PASS: static pages, 24 methods, 5 synthetic personas, input/access/origin checks and quota failure (all AI calls mocked, no paid inference).");
