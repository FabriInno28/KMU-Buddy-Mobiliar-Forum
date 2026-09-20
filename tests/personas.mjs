import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const appUrl=pathToFileURL(resolve('index.html')).href;
mkdirSync('test-artifacts',{recursive:true});
const examples=[
 {id:'baeckerei',label:'Bäckerei, 4 Personen, Inhaberin als Engpass',story:'Ich führe eine Bäckerei mit vier Leuten. Alles läuft über meinen Tisch und ich komme zu nichts mehr.',question:'Wenn du zwei Tage weg wärst',title:'Eine Entscheidung weniger auf deinem Tisch.',action:'Gib eine kleine, wiederkehrende Entscheidung frei.',choice:'1',method:'Beobachten',size:'2'},
 {id:'metallbau',label:'Metallbau, 12 Personen, Übergaben',story:'Wir sind 12 Personen im Metallbau. Bei Übergaben zwischen Büro und Werkstatt geht oft etwas verloren.',question:'Wo geht die Information',title:'Damit die Montage ohne Rückruf starten kann.',action:'Macht drei Fragen vor der nächsten Montage.',choice:'1',method:'Zentrale Herausforderung definieren',size:'10'},
 {id:'coiffeur',label:'Coiffeursalon, 6 Personen, Fachkräfte',story:'Wir sind ein Coiffeursalon mit sechs Leuten. Wir haben Mühe, gute Mitarbeitende zu halten und neue Fachkräfte zu finden.',question:'Was beschäftigt dich beim Thema Mitarbeitende',title:'Warum gute Leute bleiben, ist eine gute Frage.',action:'Frag eine Person, was ihren Alltag bei euch besser macht.',choice:'1',method:'Empathie-Gespräch',size:'5'},
 {id:'schreinerei',label:'Schreinerei, 8 Personen, Nachfolge und Wissen',story:'Unsere Schreinerei hat acht Leute. Unser langjähriger Schreiner geht bald in Pension. Sein Wissen ist nirgends festgehalten.',question:'Welches Wissen wäre morgen',title:'Lasst den wichtigsten Kniff einmal vorzeigen.',action:'Sichert diese Woche einen einzigen Arbeitskniff.',choice:'1',method:'Beobachten',size:'5'},
];
const browser=await chromium.launch({headless:true});
const findings=[];
try{
 for(const [index,p] of examples.entries()){
  const page=await browser.newPage({viewport:{width:index===1?1440:390,height:844},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(appUrl);
  assert.ok(await page.locator('h1').first().isVisible(),p.id+': leere Startseite');
  await page.locator('[data-action="begin"]').click();
  await page.locator('#custom').fill(p.story);
  await page.locator('[data-action="next"]').click();
  await page.getByRole('heading',{name:new RegExp(p.question,'i')}).waitFor();
  await page.locator('[data-choice="'+(p.choice||'0')+'"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-size="'+p.size+'"]').click();
  await page.locator('[data-action="next"]').click();
  const hero=page.locator('.dash-hero h1');
  try{await hero.waitFor({timeout:6000});}catch(e){console.error('DASHBOARD DEBUG',JSON.stringify({persona:p.id,errors,url:page.url(),body:(await page.locator('body').innerText()).slice(0,1800)}));throw e;}
  assert.equal((await hero.innerText()).trim(),p.title,p.id+': falsche persönliche Einordnung');
  assert.ok((await page.locator('.feature.action').innerText()).includes(p.action),p.id+': Impuls nicht passend');
  assert.ok((await page.locator('.method-strip').innerText()).includes(p.method),p.id+': Methodenkarte nicht passend');
  const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert.ok(width.scroll<=width.inner+1,p.id+': horizontales Scrollen '+JSON.stringify(width));
  await page.screenshot({path:'test-artifacts/'+p.id+'-dashboard.png',fullPage:true});
  await page.locator('[data-tab="media"]').click();
  assert.ok(await page.locator('[href^="https://"]').count()>=2,p.id+': Medien fehlen');
  await page.locator('[data-tab="methods"]').click();
  await page.locator('[data-method]').first().click();
  assert.ok(await page.locator('.method-modal').isVisible(),p.id+': Methodenkarte öffnet nicht');
  assert.equal(errors.length,0,p.id+': '+errors.join(' | '));
  findings.push({persona:p.label,result:'OK',question:p.question,impulse:p.action,method:p.method,viewport:width.inner});
  await page.close();
 }
 // A solo entrepreneur must never see a team-only card as the immediate suggestion.
 const solo=await browser.newPage({viewport:{width:390,height:844}});
 await solo.goto(appUrl);await solo.locator('[data-action="begin"]').click();
 await solo.locator('#custom').fill('Ich bin selbstständig und muss jede Woche Offerten mit KI schreiben.');
 await solo.locator('[data-action="next"]').click();
 await solo.locator('[data-choice="0"]').click();await solo.locator('[data-action="next"]').click();
 await solo.locator('[data-size="1"]').click();await solo.locator('[data-action="next"]').click();
 assert.ok(await solo.locator('.dash-hero h1').isVisible(),'Einpersonenbetrieb: leeres Dashboard');
 assert.ok(!((await solo.locator('.method-strip').innerText()).includes('10–30 Personen')),'Solo: ungeeignete Gruppenmethode');
 findings.push({persona:'Einpersonenbetrieb',result:'OK'});
 await solo.close();
 // A correction must really change the result, not merely rephrase the same topic.
 for(const p of examples){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(appUrl);
  await page.locator('[data-action="begin"]').click();
  await page.locator('#custom').fill(p.story);
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-choice="0"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-size="'+p.size+'"]').click();
  await page.locator('[data-action="next"]').click();
  const beforeTitle=(await page.locator('.dash-hero h1').innerText()).trim();
  const beforeAction=(await page.locator('.feature.action h2').innerText()).trim();
  await page.locator('[data-action="refine"]').click();
  await page.locator('[data-choice="1"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-action="next"]').click();
  const afterTitle=(await page.locator('.dash-hero h1').innerText()).trim();
  const afterAction=(await page.locator('.feature.action h2').innerText()).trim();
  assert.notEqual(afterTitle,beforeTitle,p.id+': answer correction did not change the contextual headline');
  assert.notEqual(afterAction,beforeAction,p.id+': answer correction did not change the suggested action');
  assert.equal(errors.length,0,p.id+': script errors on correction');
  findings.push({persona:p.label+' · Antwort korrigiert',result:'OK',before:beforeTitle,after:afterTitle});
  await page.close();
 }
 console.log(JSON.stringify({result:'PASS',tested:findings.length,findings},null,2));
}finally{await browser.close();}
