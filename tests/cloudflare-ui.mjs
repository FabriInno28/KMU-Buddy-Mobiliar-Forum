import http from "node:http";
import fs from "node:fs";
import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";
import {METHODS,MEDIA} from "../src/catalog.mjs";
const html=fs.readFileSync(new URL("../public/pilot.html",import.meta.url));
const cases=[
 {id:"baeckerei",story:"Wir sind eine kleine Bäckerei mit vier Leuten. Ich mache jede Bestellung selbst und habe keine Zeit für neue Produkte.",answer:"Die tägliche Bestellung könnte meine Stellvertreterin übernehmen.",size:"2",name:"Bäckerei",action:"Bestellung"},
 {id:"metallbau",story:"Wir sind zwölf Leute im Metallbau. Zwischen Werkstatt und Montage fehlt oft eine Angabe.",answer:"Die Montage muss vor dem Kundenbesuch mehrmals anrufen.",size:"10",name:"Metallbau",action:"Übergabe"},
 {id:"coiffeur",story:"Unser Coiffeursalon hat sechs Mitarbeitende und gute Leute kündigen immer wieder.",answer:"Sie wünschen sich mehr Mitsprache bei der Planung.",size:"5",name:"Coiffeursalon",action:"Gespräch"},
 {id:"schreinerei",story:"Unsere Schreinerei hat acht Leute. Der erfahrenste Schreiner geht bald in Pension.",answer:"Sein Wissen zur Kalkulation ist kaum dokumentiert.",size:"5",name:"Schreinerei",action:"Kniff"},
 {id:"solo",story:"Ich arbeite allein im eigenen kleinen Betrieb und möchte ohne grossen Aufwand neue Ideen ausprobieren.",answer:"Zwischen zwei Aufträgen habe ich etwa zehn Minuten Zeit.",size:"1",name:"Einpersonenbetrieb",action:"Idee"}
];
function identify(s){return cases.find(c=>s===c.story)}
const server=http.createServer(async(req,res)=>{
 if(req.url==="/pilot.html"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(html);return;}
 if(req.url!=="/api/buddy"||req.method!=="POST"){res.writeHead(404);res.end();return;}
 let body="";for await(const chunk of req)body+=chunk;
 const input=JSON.parse(body),p=identify(input.story);
 res.setHeader("Content-Type","application/json");
 if(req.headers["x-buddy-access"]!=="test-only-code"){res.writeHead(401);res.end(JSON.stringify({error:"Zugangscode nicht korrekt."}));return;}
 if(!p){res.writeHead(400);res.end(JSON.stringify({error:"Testfall nicht erkannt."}));return;}
 const question="Du hast mir von "+p.name+" erzählt. Welcher konkrete Moment wäre für dich morgen am wichtigsten?";
 const method=METHODS.find(m=>m.minPeople<=Number(input.size||2))||null;
 const payload=input.phase==="ask"?{phase:"ask",message:question}:{
  phase:"dashboard",reflection:"Bei "+p.name+" hast du beschrieben, was dich beschäftigt.",
  insight:"Vielleicht reicht ein kleiner, konkreter Versuch für den Anfang.",
  title:p.action+" morgen mit einem kleinen Versuch vereinfachen.",why:"Das passt zu dem, was du heute erzählt hast.",
  steps:["Wähle einen konkreten Anlass für morgen.","Probiere eine überschaubare Veränderung aus.","Prüfe danach, was euch tatsächlich geholfen hat."],
  method,media:{...MEDIA[0],why:"Ein Schweizer Unternehmer erzählt von einem kleinen Anfang."}
 };
 res.writeHead(200);res.end(JSON.stringify(payload));
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const url="http://127.0.0.1:"+server.address().port+"/pilot.html";
const browser=await chromium.launch({headless:true});
mkdirSync("test-artifacts",{recursive:true});
const findings=[];
try{
 for(const [i,p] of cases.entries()){
  const page=await browser.newPage({viewport:{width:i%2===0?390:1440,height:844}});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(url);
  await page.locator("#story").fill(p.story);
  await page.locator("#access").fill("test-only-code");
  await page.locator("#size").selectOption(p.size);
  await page.locator("#story-form [type=submit]").click();
  await page.locator("#answer-form").waitFor();
  assert.ok((await page.locator(".ask").innerText()).includes(p.name),p.id+": question not contextual");
  await page.locator("#answer").fill(p.answer);
  await page.locator("#answer-form [type=submit]").click();
  await page.locator(".dash-hero h1").waitFor();
  assert.ok((await page.locator(".dash-hero h1").innerText()).includes(p.name),p.id+": personal reflection missing");
  assert.ok((await page.locator(".action h2").innerText()).includes(p.action),p.id+": action mismatch");
  assert.ok(await page.locator(".aside h3").first().isVisible(),p.id+": method area missing");
  await page.locator(".method-detail summary").click();
  assert.equal(await page.locator(".method-detail li").count(),3,p.id+": Methodenkarte muss drei Schritte zeigen");
  assert.ok(await page.locator(".extra a[href^='https://']").count()>=1,p.id+": podcast missing");
  const viewport=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert.ok(viewport.scroll<=viewport.inner+1,p.id+": horizontal overflow "+JSON.stringify(viewport));
  assert.equal(errors.length,0,p.id+": "+errors.join(" | "));
  await page.screenshot({path:"test-artifacts/cloudflare-"+p.id+"-dashboard.png",fullPage:true});
  findings.push({persona:p.id,viewport:viewport.inner,method:await page.locator(".aside h3").first().innerText(),result:"OK"});
  await page.close();
 }
 const denied=await browser.newPage({viewport:{width:390,height:844}});
 await denied.goto(url);
 await denied.locator("#story").fill(cases[0].story);
 await denied.locator("#access").fill("wrong-code");
 await denied.locator("#story-form [type=submit]").click();
 await denied.locator('[role="alert"]').waitFor();
 assert.match(await denied.locator('[role="alert"]').innerText(),/Zugangscode/);
 assert.equal(await denied.locator("#story").inputValue(),cases[0].story);
 await denied.close();
 console.log(JSON.stringify({result:"PASS",note:"Browser and response fixtures only; no real AI calls or user-study evidence.",findings},null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
