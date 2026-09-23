# KMU Buddy AI · geschützter Konzeptpilot

**Status:** Entwicklungszweig. Die bestehende öffentliche GitHub Pages Demo in `main` bleibt unverändert. Der KI Zugang ist **noch nicht live**, solange kein eigenes Vercel Projekt mit den nötigen Umgebungsvariablen eingerichtet und getestet wurde.

## Was wir konkret gebaut haben

- `ai-prototyp.html`: mobiles, warmes Gespräch mit freiem Text, einer persönlich erzeugten Rückfrage und einem aus zwei Antworten generierten Dashboard. Kein Zugriff auf vertrauliche Geschäftsdaten notwendig.
- `api/buddy.mjs`: serverseitige OpenAI Anbindung via strukturierter JSON Antwort. Der API Schlüssel ist ausschliesslich in einer Server Umgebungsvariable vorgesehen.
- `api/_catalog.mjs`: alle 24 Methodenkarten als eigene knappe redaktionelle Zusammenfassungen, Zeitbedarf und Mindestgruppengrösse. Enthält drei öffentlich verfügbare externe Medienbeispiele. Es sind keine Originalkarten, internen Sotomo Folien oder realen KMU Kundendaten enthalten.
- `tests/ai.mjs`: Tests ohne echte API Kosten für Zugangsschutz, Validierung, Antwortstruktur und vier fiktive Schweizer KMU Situationen sowie einen Einpersonenbetrieb.

## So wird der KI Pilot wirklich nutzbar

1. Zunächst GitHub Repository auf **private** stellen. Das macht eine bisherige GitHub Pages Webseite allerdings nicht automatisch privat. Interne Daten nie in `main`, in einen Branch oder auf eine öffentliche Testseite eingeben.
2. Bei [platform.openai.com](https://platform.openai.com/) einen **separaten API Projektbereich** für diese Demo erstellen. Dort ein eigenes kleines Nutzungsbudget, Nutzungswarnungen und ggf. projektbezogene Limits konfigurieren. Das ChatGPT Plus Abonnement ist kein API Guthaben. Ein eigenes neues API Geheimnis erstellen, aber **nicht in ChatGPT, GitHub, die HTML Datei oder eine E-Mail kopieren**.
3. Das Repository in einem geeigneten **Vercel Projekt** importieren (Root Directory: Repository Root, kein Framework/Build nötig). Für diesen Pilot möglichst einen **geschützten Preview Deployment** des Branches `feature/ki-buddy-prototyp` verwenden. Vor Aktivierung Zugriffsschutz der gesamten Vorschau prüfen (Vercel Deployment Protection, je nach Plan); ein zufälliger URL ist kein Schutz.
4. In Vercel unter Project Settings → Environment Variables nur serverseitig eintragen:
   - `OPENAI_API_KEY`: dein eigener API Schlüssel. **Nicht mit `VITE_`, `NEXT_PUBLIC_` oder `PUBLIC_` beginnen.**
   - `BUDDY_ACCESS_TOKEN`: separates langes zufälliges Testpasswort von mindestens 24 Zeichen. Das ist **nicht** der API Schlüssel. Es wird auf der Testseite in das Zugangscode Feld eingegeben. Geteilte Zugangscodes bieten keinen echten Nutzerkontenschutz; zusätzlich Deployment Protection nutzen.
   - `BUDDY_MODEL`: optional, derzeit voreingestellt `gpt-4.1-mini`.
5. Neu deployen und unter der geschützten Vercel URL **`/ai-prototyp.html`** öffnen. Die Webseite spricht ausschliesslich die gleichnamige serverseitige Route **`/api/buddy`** auf demselben Ursprung an. GitHub Pages kann den KI Server **nicht** selbst betreiben.
6. Erst mit **fiktiven** Fällen testen: Bäckerei 4 Personen, Metallbau 12, Coiffeursalon 6, Schreinerei 8 und Einpersonenbetrieb. Die generierte Rückfrage muss zum Gesagten passen; alle drei Schritte müssen für diesen Betrieb ausführbar sein. Prüfe zusätzlich, ob die Methode tatsächlich zur Gruppengrösse passt und das genannte Medium verlinkt ist.

## Sicherheitsgrenzen

- Der API Schlüssel ist nie Bestandteil von HTML, öffentlichem JavaScript oder GitHub. Bei fehlendem Schlüssel oder Testpasswort antwortet die API mit 503 und verbraucht keine API Tokens.
- Pro Anfrage höchstens zwei Texte mit maximal 650 Zeichen, begrenzte Zahl von Ausgabetokens; keine automatische Gesprächsarchivierung in unserer Anwendung. OpenAI erhält die ausdrücklich eingegebenen Texte für die Antwort. Weitere Verarbeitung und Aufbewahrungsbedingungen des Anbieters müssen vor echten KMU Tests geprüft werden.
- Das Zugangspasswort ist ein **zusätzliches Pilot Hindernis**, kein vollständiger Missbrauchsschutz. Ein öffentlich erreichbarer Server ohne robuste Zugangskontrolle und serverseitiges, geteiltes Rate Limiting kann API Kosten verursachen. **Kein offener öffentlicher Start**, bevor Zugriffsschutz, Limits/Monitoring und Freigaben geklärt sind.
- Unsere serverlose Funktion speichert aktuell **keinen** Gesprächsverlauf und besitzt **kein dauerhaftes serverseitiges, verteiltes Request Limit**. Das muss vor einem Pilot mit echten KMU ergänzt werden.
- Externe Quellen sind exemplarisch, nicht durch die Mobiliar redaktionell freigegeben. Es gibt derzeit weder tatsächliche Peer Vermittlung noch Buchung, Förderzusage oder ein dauerhaft gespeichertes Dashboard.
- Die KI kann Aussagen missverstehen oder unpassende Vorschläge machen. Vier synthetische Tests weisen keine Gesprächsqualität nach. Echte KMU Tests erst mit Datenschutz und redaktioneller Freigabe.

## Entwicklung und Abnahme

Vor dem Übernehmen von `main`: `node tests/smoke.mjs`, `node tests/ai.mjs`, `node tests/personas.mjs` (das letzte benötigt Playwright + Chromium). In GitHub Actions führt `.github/workflows/quality.yml` alle drei Prüfschritte aus.

Der erste Live Test mit einem echten API Schlüssel ist ausdrücklich noch **offen**. Das Ergebnis der Tests mit simulierten Antworten belegt nur die technische Verarbeitung und Schranken, nicht Qualität oder Zuverlässigkeit der Modellantworten.
