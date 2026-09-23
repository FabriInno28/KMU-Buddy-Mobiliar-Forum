import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const appUrl=pathToFileURL(resolve('index.html')).href;
mkdirSync('test-artifacts',{recursive:true});
const examples=[
 {id:'baeckerei',label:'Bäckerei, 4 Personen, Inhaberin als Engpass',story:'Ich führe eine Bäckerei mit vier Leuten. Alles läuft über meinen Tisch und ich komme zu nichts mehr.',question:'Wenn du zwei Tage weg wärst',title:'Eine Entscheidung weniger auf deinem Tisch.',action:'Gib eine kleine, wiederkehrende Entscheidung frei.',choice:'1',method:'Ideenskizze',size:'2'},
 {id:'metallbau',label:'Metallbau, 12 Personen, Übergaben',story:'Wir sind 12 Personen im Metallbau. Bei Übergaben zwischen Büro und Werkstatt geht oft etwas verloren.',question:'Wo geht die Information',title:'Damit die Montage ohne Rückruf starten kann.',action:'Macht drei Fragen vor der nächsten Montage.',choice:'1',method:'Aktionspunkte',size:'10'},
 {id:'coiffeur',label:'Coiffeursalon, 6 Personen, Fachkräfte',story:'Wir sind ein Coiffeursalon mit sechs Leuten. Wir haben Mühe, gute Mitarbeitende zu halten und neue Fachkräfte zu finden.',question:'Was beschäftigt dich beim Thema Mitarbeitende',title:'Warum gute Leute bleiben, ist eine gute Frage.',action:'Frag eine Person, was ihren Alltag bei euch besser macht.',choice:'1',method:'Empathie-Gespräch',size:'5'},
 {id:'schreinerei',label:'Schreinerei, 8 Personen, Wissenstransfer',story:'Unsere Schreinerei hat acht Leute. Unser langjähriger Schreiner geht bald in Pension. Sein Wissen ist nirgends festgehalten.',question:'Welches Wissen wäre morgen',title:'Lasst den wichtigsten Kniff einmal vorzeigen.',action:'Sichert diese Woche einen einzigen Arbeitskniff.',choice:'1',method:'Beobachten',size:'5'},
 {id:'nachfolge',label:'Familienbetrieb, 14 Personen, Unternehmensnachfolge',story:'Ich möchte unseren Familienbetrieb in drei bis fünf Jahren übergeben. Meine Rolle danach und die Verantwortung der nächsten Generation sind noch unklar.',question:'Was ist bei eurer Nachfolge',title:'Auch die Rolle danach gehört zur Nachfolge.',action:'Nehmt euch 30 Minuten für die Zeit nach der Übergabe.',choice:'2',method:'Fragen-Landkarte',size:'10'},
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
  const highlights=page.locator('.mvp-result-card .mvp-highlights li');
  const highlightCount=await highlights.count();
  assert.ok(highlightCount>=3&&highlightCount<=5,p.id+': Ergebnis braucht 3–5 Highlights');
  const resultDetails=page.locator('.mvp-result-details');
  assert.equal(await resultDetails.evaluate(el=>el.open),false,p.id+': lange Einordnung muss zunächst geschlossen sein');
  await resultDetails.locator('summary').click();
  const heardHeading=resultDetails.getByRole('heading',{name:'Was ich bei euch höre'});
  await heardHeading.waitFor();
  assert.ok(await heardHeading.isVisible(),p.id+': vertiefte Einordnung fehlt');
  assert.ok((await page.locator('.feature.action').innerText()).includes(p.action),p.id+': Impuls nicht passend');
  assert.ok((await page.locator('.method-strip').innerText()).includes(p.method),p.id+': Methodenkarte nicht passend');
  const directLinks=page.locator('.dashboard-media-shelf a[href^="https://"]');
  assert.ok(await directLinks.count()>=1||(await page.locator('.dashboard-media-shelf').innerText()).includes('noch keinen unmittelbar passenden Beitrag'),p.id+': missing relevant media or honest no-match message');
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
  await page.locator('[data-choice="0"]').click(); // Deselection now needed: multiple answers can coexist.
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
  {id:'landing_schreinerei',story:'Unser Schreiner geht bald in Pension und sein Wissen ist kaum festgehalten.',question:'Welches Wissen wäre morgen'},
  {id:'landing_nachfolge',story:'Ich möchte unseren Familienbetrieb in drei Jahren an die nächste Generation übergeben.',question:'Was ist bei eurer Nachfolge'}
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
 assert.ok((await homeLinks.nth(0).getAttribute('href')).includes('srf.ch/audio/input/'),'Podcast not linked to direct SRF episode');
 assert.ok((await homeLinks.nth(1).getAttribute('href')).includes('srf.ch/play/tv/'),'Video not real');
 await homepageMedia.close();
 const desktopHome=await browser.newPage({viewport:{width:1440,height:900}});
 await desktopHome.goto(appUrl);
 await desktopHome.screenshot({path:'test-artifacts/desktop-home-entry.png',fullPage:true});
 await desktopHome.close();

 // Fast voice-first MVP path: 3 tiny inputs and one contextual follow-up, no redundant questionnaire.
 for(const journey of [
  {story:'Wir sind eine Bäckerei mit vier Mitarbeitenden. Ich entscheide immer alles.',goal:'Mehr Zeit für neue Brote',size:'2',question:'Wenn du zwei Tage weg wärst'},
  {story:'Unsere Schreinerei hat acht Mitarbeitende, einer geht in Pension.',goal:'Erfahrung weitergeben',size:'5',question:'Welches Wissen wäre morgen'},
  {story:'Ich arbeite allein und möchte neue Ideen für meine Kundschaft.',goal:'Etwas Neues ausprobieren',size:'1',question:'Was möchtest du im Einpersonenbetrieb'}
 ]){
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(appUrl);
  await page.locator('#hero-story').fill(journey.story);
  await page.locator('.mvp-optional summary').click();
  await page.locator('#hero-goal').fill(journey.goal);
  await page.locator('#hero-size').selectOption(journey.size);
  await page.locator('#hero-form button[type="submit"]').click();
  await page.getByRole('heading',{name:new RegExp(journey.question,'i')}).waitFor();
  await page.locator('[data-choice="0"]').click();
  await page.locator('[data-action="next"]').click();
  assert.ok(await page.locator('.dash-quick [data-action="open-try"]').isVisible(),'First actionable step is not visible');
  await page.locator('.own-theme-details summary').click();
  assert.ok(await page.locator('.own-themes').isVisible(),'Own situation should lead the dashboard');
  assert.ok((await page.locator('.own-themes').innerText()).includes(journey.story),'Own story lost');
  assert.ok((await page.locator('.own-themes').innerText()).includes(journey.goal),'Own goal lost');
  assert.ok(await page.locator('.feature.action h2').isVisible(),'Immediate personal impulse missing');
  assert.equal(errors.length,0,'Errors on direct MVP path');
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert.ok(widths.scroll<=widths.inner+1,'MVP mobile overflow');
  findings.push({persona:'Direkteingabe · '+journey.size,result:'OK',goal:journey.goal});
  await page.close();
 }
 // Unsupported browser has a keyboard dictation alternative; a supported mock can fill the field by voice.
 const noSpeech=await browser.newPage({viewport:{width:390,height:844}});
 await noSpeech.addInitScript(()=>{Object.defineProperty(window,'SpeechRecognition',{value:undefined,configurable:true});Object.defineProperty(window,'webkitSpeechRecognition',{value:undefined,configurable:true});});
 await noSpeech.goto(appUrl);
 assert.ok(await noSpeech.locator('[data-voice="hero-story"]').isHidden(),'Unsupported mic must not advertise an inert button');
 assert.ok((await noSpeech.locator('.voice-support').first().innerText()).includes('Tastatur'),'Native dictation fallback missing');
 await noSpeech.close();
 const mockSpeech=await browser.newPage({viewport:{width:390,height:844}});
 await mockSpeech.addInitScript(()=>{window.SpeechRecognition=class{start(){this.onresult?.({results:[[{transcript:'Wir brauchen mehr Zeit für neue Ideen in der Bäckerei.'}]]});this.onend?.();}stop(){this.onend?.();}};});
 await mockSpeech.goto(appUrl);
 await mockSpeech.locator('[data-voice="hero-story"]').click();
 assert.ok((await mockSpeech.locator('#hero-story').inputValue()).includes('mehr Zeit'),'Mock microphone did not transcribe into editable input');
 await mockSpeech.close();
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

 // Seven real working guides instead of click-through method summaries; the interview is tailored to the customer's issue.
 const workshop=await browser.newPage({viewport:{width:390,height:844}});
 const workshopErrors=[];workshop.on('pageerror',e=>workshopErrors.push(e.message));
 await workshop.goto(appUrl);
 await workshop.locator('#hero-story').fill('Im Quartierladen kommen weniger Stammkundinnen und Stammkunden als früher.');
 await workshop.locator('.mvp-optional summary').click();
 await workshop.locator('#hero-goal').fill('Verstehen, weshalb die Leute seltener einkaufen');
 await workshop.locator('#hero-size').selectOption('2');
 await workshop.locator('#hero-form button[type="submit"]').click();
 await workshop.locator('[data-choice="1"]').click();
 await workshop.locator('[data-action="next"]').click();
 await workshop.locator('.dash-tabs [data-tab="methods"]').click();
 assert.ok((await workshop.locator('.library-head').textContent()).includes('Sieben ausgearbeitete Methoden'),'No extended method overview');
 await workshop.locator('[data-method="empathie"]').first().click();
 const dialog=workshop.locator('.method-workshop');
 assert.ok(await dialog.isVisible(),'Interview worksheet did not open');
 assert.ok((await dialog.innerText()).includes('Quartierladen'),'The method must include the entered KMU situation');
 assert.ok((await dialog.innerText()).includes('Stammkund'),'Interview questions must be tailored to demand context');
 assert.equal(await dialog.locator('.guide-questions li').count(),6,'Not six themed interview questions');
 await dialog.screenshot({path:'test-artifacts/interview-method-guide.png'});
 assert.ok((await dialog.innerText()).includes('So könntest du die Person anfragen'),'Concrete contact invitation missing');
 assert.ok((await dialog.innerText()).includes('AUSWERTEN'),'Practical analysis missing');
 assert.equal(await dialog.locator('textarea[data-method-note]').count(),3,'Notepad does not contain all three reflection questions');
 await dialog.locator('[data-method-note="empathie"][data-note-key="beobachtung"]').fill('Ein konkreter Einkauf war umständlich.');
 await dialog.locator('[data-action="close"]').first().click();
 await workshop.locator('[data-method="empathie"]').first().click();
 assert.ok((await workshop.locator('[data-method-note="empathie"][data-note-key="beobachtung"]').inputValue()).includes('umständlich'),'Notes lost on modal close');
 await workshop.locator('.method-workshop [data-action="close"]').first().click();
 const fullGuides=['empathie','beobachten','fragen','annahmen','skizze','aktion','testen'];
 const details=workshop.locator('.method-all').first();
 for(const id of fullGuides){
  if(!(await details.evaluate(el=>el.open)))await details.locator('summary').click();
  const card=workshop.locator('[data-method="'+id+'"]:visible').first();
  assert.ok(await card.count()>=1,'Full method card missing '+id);
  await card.click();
  assert.ok(await workshop.locator('.method-workshop .guide-notes').isVisible(),'Worksheet missing '+id);
  assert.ok((await workshop.locator('.method-workshop').innerText()).includes('VORBEREITEN'),'Preparation missing '+id);
  assert.ok((await workshop.locator('.method-workshop').innerText()).includes('AUSWERTEN'),'Evaluation missing '+id);
  assert.ok(await workshop.locator('[data-method-copy="report"]').isVisible(),'Takeaway is not copyable '+id);
  await workshop.locator('.method-workshop [data-action="close"]').first().click();
 }
 assert.equal(workshopErrors.length,0,'Method guides raised client errors');
 const allLinks=await workshop.locator('a[href^="http"]').evaluateAll(nodes=>nodes.map(n=>n.href));
 assert.ok(allLinks.every(u=>!u.includes('zkb.ch')&&!u.includes('podcasts.apple.com')),'Competing financial provider or indirect podcast link remains');
 await workshop.screenshot({path:'test-artifacts/methods-overview.png',fullPage:true});
 findings.push({persona:'MVP1 · 7 Praxisguides mit themenbezogenem Interview',result:'OK',questionCount:6,notes:'local'});
 await workshop.close();

 // Neuer Gesprächspfad: mehrere gleichzeitige Themen explizit markieren, Fokus wählen.
 const multi=await browser.newPage({viewport:{width:390,height:844}});
 await multi.goto(appUrl);
 await multi.locator('[data-action="begin"]').click();
 await multi.locator('[data-choice="team"]').click();
 await multi.locator('[data-choice="customers"]').click();
 assert.equal(await multi.locator('[data-choice="team"]').getAttribute('aria-pressed'),'true','first topic lost');
 assert.equal(await multi.locator('[data-choice="customers"]').getAttribute('aria-pressed'),'true','second topic not selected');
 await multi.locator('[data-focus="customers"]').click();
 await multi.locator('[data-action="next"]').click();
 assert.ok(await multi.getByRole('heading',{name:/Wo wünscht ihr euch gerade/}).isVisible(),'User-selected primary topic not respected');
 await multi.locator('[data-choice="0"]').click();
 await multi.locator('[data-action="next"]').click();
 await multi.locator('[data-size="2"]').click();
 await multi.locator('[data-action="next"]').click();
 const multiPanel=await multi.locator('.mvp-result-card').innerText();
 assert.ok(multiPanel.includes('Kundschaft & neue Chancen')&&multiPanel.includes('Zusammenarbeit & Verantwortung'),'Secondary topic missing from result');
 await multi.screenshot({path:'test-artifacts/multi-themen-ergebnis.png',fullPage:true});
 findings.push({persona:'Mehrere Themen + bewusst gewählter Fokus',result:'OK'});
 await multi.close();
 // Rennvelo / E-Bike: keine generische Alltagsübung statt eines konkreten Strategie-Versuchs.
 const ebike=await browser.newPage({viewport:{width:390,height:844}});
 const bikeErrors=[];ebike.on('pageerror',e=>bikeErrors.push(e.message));
 await ebike.goto(appUrl);
 await ebike.locator('#hero-story').fill('Wir sind ein Team von fünf Fahrradmechaniker:innen und auf Rennvelos spezialisiert. Sollen wir auch auf den E-Bike-Zug aufspringen?');
 await ebike.locator('#hero-form button[type="submit"]').click();
 assert.ok(await ebike.getByRole('heading',{name:/Welche Fragen rund um E-Bikes/}).isVisible(),'E-Bike case not recognized');
 await ebike.locator('.theme-adjust summary').click();
 await ebike.locator('[data-secondary="pressure"]').click();
 assert.equal(await ebike.locator('[data-secondary="pressure"]').getAttribute('aria-pressed'),'true','Additional concern not retained');
 await ebike.locator('[data-choice="1"]').click();
 await ebike.locator('[data-choice="0"]').click();
 await ebike.locator('[data-choice="2"]').click();
 assert.equal(await ebike.locator('.answer.selected').count(),3,'Three concrete aspects must remain selected');
 assert.equal(await ebike.locator('[data-detail-focus="1"]').getAttribute('aria-pressed'),'true','First selected answer should be the initial focus');
 await ebike.locator('[data-detail-focus="2"]').click();
 assert.equal(await ebike.locator('[data-detail-focus="2"]').getAttribute('aria-pressed'),'true','Focus must be adjustable without losing other aspects');
 assert.equal(await ebike.locator('.answer.selected').count(),3,'Changing focus must not drop aspects');
 await ebike.locator('[data-action="next"]').click();

 assert.ok((await ebike.locator('.feature.action').innerText()).includes('E-Bike-Anfragen'),'E-Bike-specific action missing');
 const bikeResult=ebike.locator('.mvp-result-card');
 const bikePerspective=await bikeResult.innerText();
 for(const aspect of ['Ob unsere Kundschaft danach fragt','Ob E-Bikes zu unserer Rennvelo-Spezialisierung passen','Was wir dafür können und aufbauen müssten']){
  assert.ok(bikePerspective.includes(aspect),'Selected aspect dropped from personal perspective: '+aspect);
 }
 assert.ok(bikePerspective.includes('Erster Fokus:')&&bikePerspective.includes('Was wir dafür können und aufbauen müssten'),'Chosen primary aspect not reflected');
 await ebike.locator('[data-action="refine"]').click();
 assert.equal(await ebike.locator('.answer.selected').count(),3,'Answers lost when going back to correct');
 await ebike.locator('[data-choice="0"]').click();
 assert.equal(await ebike.locator('.answer.selected').count(),2,'Tapping an answer again must deselect just that answer');
 await ebike.locator('[data-action="next"]').click();
 assert.ok(!(await ebike.locator('.mvp-result-card').innerText()).includes('Ob unsere Kundschaft danach fragt ·'),'Deselected aspect should disappear from result');

 await ebike.locator('.mvp-result-details summary').click();
 const bikeDepth=await ebike.locator('.mvp-result-card').innerText();
 for(const expected of ['Was ich bei euch höre','Was zusätzlich hineinspielt','Worin die Spannung','Eine mögliche Richtung','Was ihr dabei herausfinden könnt','Rennvelos','E-Bikes','Zeit & Entscheidungen']) assert.ok(bikeDepth.toLowerCase().includes(expected.toLowerCase()),'Missing meaningful bike perspective: '+expected+'; found='+bikeDepth.slice(0,600));
 assert.ok(!bikeDepth.includes('Wähle einen konkreten Moment aus deinem Alltag.'),'Wrong generic exercise');
 await ebike.screenshot({path:'test-artifacts/ebike-perspektive-mobile.png',fullPage:true});
 assert.equal(bikeErrors.length,0,'E-bike journey client errors '+bikeErrors.join(' / '));
 findings.push({persona:'Rennvelo + E-Bikes mit zusätzlichem Thema',result:'OK'});
 await ebike.close();

 console.log(JSON.stringify({result:'PASS',tested:findings.length,findings},null,2));
}finally{await browser.close();}

// Mobile-first regression audit: real journeys and screenshots at phone/tablet sizes.
await import('./mobile-audit.mjs');
