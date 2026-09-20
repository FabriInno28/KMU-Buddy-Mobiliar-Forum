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
  const directLinks=page.locator('.dashboard-media-shelf a[href^="https://"]');
  assert.ok(await directLinks.count()>=1,p.id+': thematic podcast or video link missing from immediate dashboard');
  const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert.ok(width.scroll<=width.inner+1,p.id+': horizontales Scrollen '+JSON.stringify(width));
  await page.screenshot({path:'test-artifacts/'+p.id+'-dashboard.png',fullPage:true});
  await page.locator('.dash-tabs [data-tab="media"]').click();
  assert.ok(await page.locator('.editorial-media-card a[href^="https://"]').count()>=8,p.id+': complete media library missing');
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

 const newCases=[
  {id:'cafe_kosten',story:'Wir sind ein Café mit drei Leuten. Die Einkaufspreise steigen und es bleibt immer weniger übrig.',size:'2',choice:'0',question:'Wo spürst du den Kostendruck',title:'Vielleicht liegt die Überraschung in einem Einkauf.',action:'Vergleicht die Kosten eines häufigen Produkts.',method:'Fragen-Landkarte'},
  {id:'velowerkstatt_auflage',story:'Unsere Velowerkstatt hat zwei Mitarbeitende. Eine neue Vorschrift der Behörde ist für uns unklar.',size:'2',choice:'0',question:'Was ist bei euch gerade unklar',title:'Vom langen Text zu einer einzigen Frage.',action:'Markiert eine unklare Passage.',method:'Fragen-Landkarte'},
  {id:'quartierladen_nachfrage',story:'Wir betreiben einen Quartierladen zu dritt und erhalten weniger neue Anfragen als früher.',size:'2',choice:'0',question:'Wo merkst du die schwächere Nachfrage',title:'Woher kam die letzte neue Anfrage?',action:'Schaut auf eure drei letzten neuen Kontakte.',method:'Empathie-Gespräch'},
  {id:'einpersonenbetrieb_neue_ideen',story:'Ich bin selbstständig und arbeite allein. Ich möchte wieder Raum für neue Ideen haben.',size:'1',choice:'1',question:'Was möchtest du im Einpersonenbetrieb',title:'Eine Idee braucht zuerst einen kleinen Termin.',action:'Reserviere dir 15 Minuten für eine Ideenskizze.',method:'Ideenskizze'}
 ];
 for(const p of newCases){
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(appUrl);
  await page.locator('[data-action="begin"]').click();
  await page.locator('#custom').fill(p.story);
  await page.locator('[data-action="next"]').click();
  await page.getByRole('heading',{name:new RegExp(p.question,'i')}).waitFor();
  await page.locator('[data-choice="'+p.choice+'"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-size="'+p.size+'"]').click();
  await page.locator('[data-action="next"]').click();
  assert.equal((await page.locator('.dash-hero h1').innerText()).trim(),p.title,p.id+': wrong interpretation');
  assert.ok((await page.locator('.feature.action').innerText()).includes(p.action),p.id+': wrong action');
  assert.ok((await page.locator('.method-strip').innerText()).includes(p.method),p.id+': unsuitable method');
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert.ok(widths.scroll<=widths.inner+1,p.id+': horizontal scroll '+JSON.stringify(widths));
  await page.locator('[data-feedback="no"]').click();
  assert.ok(await page.getByRole('button',{name:/Antwort präzisieren/}).count()>=1,p.id+': missing correction after negative feedback');
  await page.screenshot({path:'test-artifacts/'+p.id+'-dashboard.png',fullPage:true});
  assert.equal(errors.length,0,p.id+': '+errors.join(' | '));
  findings.push({persona:p.id,result:'OK',impulse:p.action,method:p.method,viewport:widths.inner});
  await page.close();
 }
 // Free-text entry must be first-class on the landing page, not buried below samples.
 const entryCases=[
  {id:'landing_baeckerei',story:'Wir sind eine Bäckerei mit vier Leuten. Alles läuft über meinen Tisch.',question:'Wenn du zwei Tage weg wärst'},
  {id:'landing_laden',story:'Wir sind ein Quartierladen mit drei Leuten und haben weniger neue Kundenanfragen.',question:'Wo merkst du die schwächere Nachfrage'},
  {id:'landing_coiffeur',story:'Im Coiffeursalon gehen gute Mitarbeitende wieder.',question:'Was beschäftigt dich beim Thema Mitarbeitende'},
  {id:'landing_schreinerei',story:'Unser Schreiner geht bald in Pension und sein Wissen ist kaum festgehalten.',question:'Welches Wissen wäre morgen'}
 ];
 for(const ex of entryCases){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(appUrl);
  const input=page.locator('#hero-story');
  assert.ok(await input.isVisible(),ex.id+': direct text field missing on homepage');
  await input.fill(ex.story);
  await page.locator('#hero-form button[type="submit"]').click();
  await page.getByRole('heading',{name:new RegExp(ex.question,'i')}).waitFor();
  assert.ok((await page.locator('body').innerText()).includes(ex.story.slice(0,35)),ex.id+': story lost');
  assert.equal(errors.length,0,ex.id+': script errors');
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert.ok(widths.scroll<=widths.inner+1,ex.id+': horizontal scrolling');
  findings.push({persona:ex.id,result:'OK',entry:'Freitext direkt auf Startseite'});
  await page.close();
 }
 // The original podcast and video links must be clickable without entering a conversation.
 const homepageMedia=await browser.newPage({viewport:{width:390,height:844}});
 await homepageMedia.goto(appUrl);
 await homepageMedia.screenshot({path:'test-artifacts/mobile-home-entry.png',fullPage:true});
 const homeLinks=homepageMedia.locator('.home-media-grid a[href^="https://"]');
 assert.equal(await homeLinks.count(),2,'Homepage: podcast and videopodcast links missing');
 assert.ok((await homeLinks.nth(0).getAttribute('href')).includes('podcasts.apple.com'),'Podcast not real');
 assert.ok((await homeLinks.nth(1).getAttribute('href')).includes('svc.swiss'),'Video not real');
 await homepageMedia.close();
 const desktopHome=await browser.newPage({viewport:{width:1440,height:900}});
 await desktopHome.goto(appUrl);
 await desktopHome.screenshot({path:'test-artifacts/desktop-home-entry.png',fullPage:true});
 await desktopHome.close();
 const unknown=await browser.newPage({viewport:{width:390,height:844}});
 await unknown.goto(appUrl);await unknown.locator('[data-action="begin"]').click();
 await unknown.locator('#custom').fill('Wir haben ein merkwürdiges Gefühl, wenn wir am Montag wieder starten.');
 await unknown.locator('[data-action="next"]').click();
 assert.ok(await unknown.getByRole('heading',{name:/Wo macht sich das bei dir im Alltag/}).isVisible(),'Unknown text must not be misclassified');
 await unknown.locator('[data-choice="0"]').click();
 await unknown.locator('[data-action="next"]').click();
 await unknown.locator('[data-size="2"]').click();await unknown.locator('[data-action="next"]').click();
 assert.ok(!(await unknown.locator('.dash-hero').innerText()).includes('Bei euch läuft vieles gut'),'Unrecognized problem must not be called fine');
 findings.push({persona:'Nicht erkannter Freitext',result:'OK'});
 await unknown.close();
 console.log(JSON.stringify({result:'PASS',tested:findings.length,findings},null,2));
}finally{await browser.close();}
