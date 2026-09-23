import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].at(-1)?.[1];
assert.ok(script,'Interaktionsskript fehlt');

const instrumented=script.replace(
 /\nrender\(\);\n\}\)\(\);\s*$/,
 '\nglobalThis.__buddyTest={understand,SITUATIONS,ANSWER_VARIANTS,state,model,resultHighlights};\n})();'
);
assert.notEqual(instrumented,script,'Testzugang konnte nicht gesetzt werden');

const app={addEventListener(){},innerHTML:''};
const context={
 console,
 document:{querySelector:selector=>selector==='#app'?app:null,addEventListener(){}},
 window:{scrollTo(){},SpeechRecognition:undefined,webkitSpeechRecognition:undefined},
 navigator:{},
};
vm.createContext(context);
new vm.Script(instrumented,{filename:'index.html'}).runInContext(context);
const api=context.__buddyTest;

assert.equal(api.understand('Alles läuft über meinen Tisch und ich entscheide jeden kleinen Fall.',''),'owner');
assert.equal(api.understand('Unser langjähriger Schreiner geht in Pension. Sein Wissen und seine Kniffe sind kaum dokumentiert.',''),'knowledge');
assert.equal(api.understand('In unserer Schreinerei geht ein Mitarbeiter bald in Pension.',''),'knowledge');
assert.equal(api.understand('Ich möchte unseren Familienbetrieb in drei Jahren an die nächste Generation übergeben.',''),'succession');

Object.assign(api.state,{persona:'knowledge',topic:'pressure',detail:'1',details:['1'],answerText:'Abläufe und Kniffe',size:'5',secondaryTopics:[],story:'Unser Schreiner geht in Pension und sein Wissen ist kaum festgehalten.'});
assert.equal(api.model().title,'Lasst den wichtigsten Kniff einmal vorzeigen.');
assert.ok(api.resultHighlights().some(text=>text.includes('Wissenstransfer')),'Wissenstransfer wird nicht klar abgegrenzt');

Object.assign(api.state,{persona:'succession',topic:'pressure',detail:'2',details:['2'],answerText:'Welche Rolle die heutige Inhaberin oder der heutige Inhaber danach hat',size:'10',secondaryTopics:[],story:'Ich möchte unseren Familienbetrieb in drei bis fünf Jahren übergeben.'});
assert.equal(api.model().title,'Auch die Rolle danach gehört zur Nachfolge.');
assert.equal(api.model().start,'Sprecht über die Zeit nach der Übergabe.');
assert.ok(api.resultHighlights().some(text=>text.includes('Führung, Verantwortung und Eigentum')),'Unternehmensnachfolge bleibt zu eng');

for(const persona of ['owner','knowledge','succession']){
 Object.assign(api.state,{persona,topic:api.SITUATIONS[persona].topic,detail:'',details:[],answerText:'',size:'10',secondaryTopics:[]});
 const count=api.resultHighlights().length;
 assert.ok(count>=3&&count<=5,persona+': Ergebnis enthält nicht 3–5 Highlights');
}

console.log('Gesprächslogik: Engpass, Wissenstransfer und Nachfolge klar getrennt.');
