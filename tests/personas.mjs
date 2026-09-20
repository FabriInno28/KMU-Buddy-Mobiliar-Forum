import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const appUrl=pathToFileURL(resolve('index.html')).href;
mkdirSync('test-artifacts',{recursive:true});
const examples=[
 {id:'baeckerei',label:'Bäckerei, 4 Personen, Inhaberin als Engpass',story:'Ich führe eine Bäckerei mit vier Leuten. Alles läuft über meinen Tisch und ich komme zu nichts mehr.',question:'Wenn du zwei Tage weg wärst',title:'Vielleicht muss nicht alles über deinen Tisch.',action:'Gib diese Woche eine kleine Entscheidung ab.',method:'Aktionspunkte',size:'2'},
 {id:'metallbau',label:'Metallbau, 12 Personen, Übergaben',story:'Wir sind 12 Personen im Metallbau. Bei Übergaben zwischen Büro und Werkstatt geht oft etwas verloren.',question:'Wo geht die Information',title:'Eine gute Übergabe spart zwei Rückfragen.',action:'Testet morgen eine Übergabe mit drei Sätzen.',method:'Zentrale Herausforderung definieren',size:'10'},
 {id:'coiffeur',label:'Coiffeursalon, 6 Personen, Fachkräfte',story:'Wir sind ein Coiffeursalon mit sechs Leuten. Wir haben Mühe, gute Mitarbeitende zu halten und neue Fachkräfte zu finden.',question:'Was beschäftigt dich beim Thema Mitarbeitende',title:'Gute Leute halten beginnt mit einer guten Frage.',action:'Führe ein Gespräch, das sonst zu kurz kommt.',method:'Empathie-Gespräch',size:'5'},
 {id:'schreinerei',label:'Schreinerei, 8 Personen, Nachfolge und Wissen',story:'Unsere Schreinerei hat acht Leute. Unser langjähriger Schreiner geht bald in Pension. Sein Wissen ist nirgends festgehalten.',question:'Welches Wissen wäre morgen',title:'Wissen, das bleibt, wenn jemand geht.',action:'Sichert diese Woche einen wichtigen Kniff.',method:'Beobachten',size:'5'},
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
  await page.locator('[data-choice="0"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-size="'+p.size+'"]').click();
  await page.locator('[data-action="next"]').click();
  const hero=page.locator('.dash-hero h1');
  await hero.waitFor();
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
 console.log(JSON.stringify({result:'PASS',tested:findings.length,findings},null,2));
}finally{await browser.close();}
