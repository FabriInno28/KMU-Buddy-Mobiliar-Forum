import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const URL=pathToFileURL(resolve('index.html')).href;
mkdirSync('test-artifacts/mobile-audit',{recursive:true});
const devices=[
 {id:'iphone-se',width:375,height:667,dpr:2,mobile:true},
 {id:'iphone-regular',width:390,height:844,dpr:3,mobile:true},
 {id:'iphone-large',width:430,height:932,dpr:3,mobile:true},
 {id:'ipad-mini',width:768,height:1024,dpr:2,mobile:true},
 {id:'ipad-pro',width:1024,height:1366,dpr:2,mobile:true},
 {id:'ipad-landscape',width:1024,height:768,dpr:2,mobile:true}
];
const browser=await chromium.launch({headless:true});
const records=[];
try {
 for(const device of devices){
  const page=await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:device.dpr,isMobile:device.mobile,hasTouch:true});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(URL);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'test-artifacts/mobile-audit/'+device.id+'-home.png'});
  const home=await page.evaluate(()=>{
   const rect=sel=>{const el=document.querySelector(sel),b=el?.getBoundingClientRect();return b?{top:Math.round(b.top),bottom:Math.round(b.bottom),left:Math.round(b.left),right:Math.round(b.right),height:Math.round(b.height)}:null;};
   return {scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth,viewportHeight:window.innerHeight,heading:rect('.mvp-intro h1'),entry:rect('#hero-story'),microphone:rect('.voice-support'),submit:rect('#hero-form button[type="submit"]'),smallprint:rect('.mvp-smallprint')};
  });
  assert.ok(home.scrollWidth<=home.viewport+1,device.id+': horizontal overflow home '+JSON.stringify(home));
  assert.ok(home.entry && home.entry.left>=-1 && home.entry.right<=home.viewport+1,device.id+': entry clipped');
  assert.ok(home.entry.top<home.viewportHeight,device.id+': user has to scroll to discover the entry '+JSON.stringify(home));
  await page.locator('#hero-story').fill('Wir sind vier in einer Bäckerei. Ich muss fast alles entscheiden und habe kaum Zeit für neue Ideen.');
  await page.locator('#hero-goal').fill('Mehr Freiraum für neue Rezepte');
  await page.locator('#hero-size').selectOption('2');
  await page.locator('#hero-form button[type="submit"]').click();
  assert.ok(await page.locator('.chat-title').isVisible(),device.id+': no follow-up');
  assert.ok((await page.locator('body').innerText()).includes('Wenn du zwei Tage weg wärst'),device.id+': wrong contextual follow-up');
  await page.screenshot({path:'test-artifacts/mobile-audit/'+device.id+'-question.png'});
  await page.locator('[data-choice="1"]').click();
  await page.locator('[data-action="next"]').click();
  assert.ok(await page.locator('.feature.action h2').isVisible(),device.id+': no immediate action');
  await page.screenshot({path:'test-artifacts/mobile-audit/'+device.id+'-dashboard.png'});
  const dash=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth,methodButton:(()=>{const el=document.querySelector('.method-strip button'),b=el?.getBoundingClientRect();return b?{left:b.left,right:b.right,width:b.width,height:b.height}:null})()}));
  assert.ok(dash.scrollWidth<=dash.viewport+1,device.id+': horizontal overflow dashboard '+JSON.stringify(dash));
  assert.ok(dash.methodButton&&dash.methodButton.left>=-1&&dash.methodButton.right<=dash.viewport+1,device.id+': method CTA clipped');
  await page.locator('.method-strip button').click();
  assert.ok(await page.locator('.method-workshop').isVisible(),device.id+': method unavailable');
  await page.screenshot({path:'test-artifacts/mobile-audit/'+device.id+'-method.png'});
  assert.equal(errors.length,0,device.id+': runtime errors '+errors.join(' | '));
  const row={device:device.id,...home,dashboard:dash,result:'PASS'};
  records.push(row);
  console.log('MOBILE_LAYOUT '+JSON.stringify(row));
  await page.close();
 }
 console.log('MOBILE_AUDIT_PASS devices='+records.length);
}finally{await browser.close();}
