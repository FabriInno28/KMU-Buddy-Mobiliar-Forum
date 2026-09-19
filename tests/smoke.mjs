import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(html, /<!doctype html>/i, 'Startseite fehlt');
assert.match(html, /<meta name="viewport"/i, 'Mobile Viewport fehlt');
assert.match(html, /Was wäre, wenn morgen schon/, 'Einstiegsfrage fehlt');
for (const marker of [
  'Hoi Buddy, legen wir los',
  'Meine Impulse entdecken',
  'Jetzt ausprobieren',
  'Hören & sehen',
  'Menschen treffen',
  'Weitere Möglichkeiten',
  'Neues Gespräch',
  'Konzeptdemo',
]) {
  assert.ok(html.includes(marker), 'Produktbaustein fehlt: ' + marker);
}
const matches = [...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/gi)];
assert.ok(matches.length > 0, 'Interaktionsskript fehlt');
for (const [, js] of matches) new vm.Script(js, { filename: 'index.html' });
assert.ok(!/<script[^>]+src=/.test(html), 'Externe Skripte sind für diese Demo nicht freigegeben');
console.log('HTML, mobile Basis, Produktbausteine und JS Syntax: OK');
