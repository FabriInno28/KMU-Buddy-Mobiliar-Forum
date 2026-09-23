# KMU Buddy · Kostenloses KI Gesprächslabor

**Entwicklungsstand 20.09.2026 – noch nicht öffentlich aktiviert.** Die bewährte GitHub Pages Demo auf `main` läuft weiter. Dieser Branch enthält eine **separate** Cloudflare Workers AI Variante. Sie benötigt weder ein zusätzliches ChatGPT Abo noch einen OpenAI, Gemini oder Claude API Schlüssel. Keine interne Sotomo Präsentation und keine echten KMU Gesprächsdaten wurden in das öffentliche Repository übernommen.

## Was du ausprobieren kannst

1. Die bestehende Startseite bietet in der Cloudflare Fassung einen Weg in die **KI Werkstatt**. Sie bleibt optisch und funktional erhalten.
2. Im KI Labor beschreibst du einen **erfundenen** kleinen Betrieb in eigenen Worten. Das Modell formuliert eine persönliche Rückfrage. Deine zweite Antwort erzeugt ein Dashboard mit vorsichtiger Zusammenfassung, neuem Blickwinkel und einem möglichst in 5–15 Minuten beginnbaren Experiment.
3. Die KI darf nur eine der **24 hinterlegten Methodenkarten** empfehlen, wenn die Mindestanzahl Personen passt, und nur einen vorhandenen externen Medienlink aus unserem Katalog. Keine erfundenen Videos, Buchungen oder Peer Matches.
4. Das Katalogmodell, die Antwortstruktur und Fehlerbehandlung werden vom Server kontrolliert. Die KI darf die Struktur des Dashboards nicht frei gestalten.

## Wichtige Grenzen

**Kein kostenpflichtiger Test:** Der geplante Hostingweg ist ausdrücklich **Cloudflare Workers Free + Workers AI Free**. Laut Cloudflare gilt im Free Tarif eine kostenlose Tageszuteilung von derzeit 10’000 Neurons; weitere Anfragen schlagen nach Ausschöpfen fehl, statt im Free Tarif automatisch bezahlt zu werden. **Wechsle bei der Einrichtung nicht zu Workers Paid, aktiviere keine kostenpflichtigen KI Gateways/Credits oder kostenpflichtigen Zusatzangebote.** Prüfe die aktuellen Angaben in deinem Konto vor einer Freischaltung.

**Keine Live Freigabe bisher:** Weder ein Cloudflare Konto noch die bindende Serverumgebung wurden hier verbunden oder veröffentlicht. Automatische Tests nutzen simulierte Modellantworten und sagen **nicht** aus, wie gut das echte kostenlose KI Modell kleine KMU versteht. Auch die Verfügbarkeit des gewählten Modells muss beim ersten Live Test bestätigt werden.

**Zugang:** Die Seite `/pilot.html` ist nicht unsichtbar oder vollständig geschützt. Die serverseitige KI Route ist jedoch ohne einen separaten Testcode deaktiviert. Für den privaten Experimentierraum verwende einen langen, einzigartigen Zugangscode, teile ihn nicht öffentlich und teste nur mit fiktiven Fällen. Der Code schützt noch nicht wie eine professionelle Benutzeranmeldung oder eine global verteilte Rate Limitierung. Keine echten Unternehmens-, Kunden-, Mitarbeitenden- oder internen Forschungsdaten eingeben.

**Daten:** Die Browseranwendung legt keinen Gesprächsverlauf auf unserem Server ab. Für jede KI Antwort übermittelt sie die eingegebenen Texte an Cloudflare Workers AI. Plattformseitige Verarbeitung/Protokollierung kann trotzdem stattfinden. Vor einem Piloten mit echten KMU: Datenschutz, technische Kontrollen, redaktionelle Quellenfreigabe, klare Zuständigkeit und sinnvolle Rate Limits prüfen.

## In vier Schritten kostenlos aktivieren

1. Erstelle oder öffne ein [Cloudflare Konto](https://dash.cloudflare.com/) und prüfe, dass **Workers Free** aktiv ist. Falls die Plattform bei der Einrichtung eine bezahlte Stufe verlangt, hier anhalten.
2. Verbinde GitHub mit Cloudflare Workers/Pages und wähle dieses Repository sowie den Branch `feature/cloudflare-gratis-ki-test` mit Projektwurzel als Root Directory; `wrangler.jsonc` liegt bereits dort. Alternativ lokal im geklonten Repository `npx wrangler login` und nach den Schritten unten deployen.
3. Lege für den Worker den geheimen serverseitigen Wert `BUDDY_TEST_CODE` fest. In einer lokalen Konsole im Projektverzeichnis: `npx wrangler secret put BUDDY_TEST_CODE`. Gib dort ein **neues, einzigartiges Testpasswort mit mindestens 24 Zeichen** ein. **Nicht in den Chat, in GitHub, in HTML oder in eine öffentliche CI Variable kopieren.** Ist das Testgeheimnis noch nicht vorhanden, antwortet die KI Route mit 503 und verbraucht keine Modellanfragen.
4. Stelle nur dann mit `npx wrangler deploy` bereit, wenn im Cloudflare Dashboard weiter klar **Free** ausgewiesen ist. Öffne die von Cloudflare angegebene `workers.dev` URL und navigiere zu `/pilot.html`. Der Testcode wird dort in ein Passwortfeld eingegeben. Veröffentliche oder teile den Testlink noch nicht breit.

Bei manuellem Deployment in einem geklonten Repository: keine Abhängigkeiten ausser Wrangler für den Deploy nötig. Die Webseite ist statisches HTML, die Serverfunktion reines JavaScript und die KI läuft über die Cloudflare eigene AI Binding Konfiguration. Für eine GitHub Integration gelten Cloudflares aktuelle Vorgaben zur Branch Auswahl und Secret Einrichtung.

**Nie etwas auf eigene Kosten dazubuchen, nur weil eine Fehlermeldung eine höhere Tarifstufe vorschlägt.** Lieber den Fehler notieren und gemeinsam eine andere kostenfreie Möglichkeit suchen.

## Was bereits automatisiert getestet wird – ohne KI Kosten

`node tests/smoke.mjs` kontrolliert die klassische Webseite. `node tests/cloudflare-free.mjs` prüft Pilot HTML/JS Syntax, 24 Methodenkarten, Teamgrössenfilter, Zugangscode, Ursprungsprüfung, Eingabelimits und fünf fiktive KMU Situationen mit **gemockten**, nicht echten KI Antworten. `node tests/personas.mjs` sichert die ursprüngliche regelbasierte Demo ab; `node tests/cloudflare-ui.mjs` prüft die KI Werkstatt mit simuliertem API Server in echten mobilen und Desktop Browsern. Die GitHub Actions automatisieren diese Prüfungen und speichern Screenshots als Testbelege.

## Unsere fünf fiktiven Prüffälle

| Fall | Was der Buddy verstehen müsste | Woran der erste Impuls zu erkennen ist |
|---|---|---|
| Bäckerei · 2–4 Menschen | Die Inhaberin erledigt Bestellungen selbst, obwohl sie neue Produkte entwickeln möchte. | Der Versuch verbindet bewusst **Verantwortung abgeben** mit **Zeit für neue Ideen**. |
| Metallbau · 10–19 Menschen | Werkstatt und Montage verlieren Informationen an der Schnittstelle. | Eine konkrete Übergabe, kein allgemeines Teambuilding. |
| Coiffeursalon · 5–9 Menschen | Mitarbeitende möchten bleiben, brauchen aber Beteiligung. | Ein konkretes Gespräch und eine kleine Vereinbarung, keine allgemeine Recruiting Kampagne. |
| Schreinerei · 5–9 Menschen | Der Austritt einer erfahrenen Person bedroht Wissen im Alltag. | Einen bestimmten Arbeitskniff zeigen, nachmachen und sichern. |
| Einpersonenbetrieb | Die Person hat nur zehn Minuten und kein Team. | **Keine** Methode mit einem Mindestbedarf von zwei oder mehr Personen. |

Diese Tests sind **Produktannahmen und Regressionen, keine KMU Nutzerinterviews**. Für den gewünschten «Der versteht mich» Moment müssen wir die fünf Fälle danach live durch das kostenlose Modell schicken und die Ergebnisse kritisch beurteilen: Ist die Rückfrage wirklich aufschlussreich? Hat die KI etwas erfunden? Ist der Impuls in 5–15 Minuten beginnbar? Ist die Methodenkarte geeignet? Macht die Darstellung auf dem iPhone neugierig statt müde?

## Hinterlegte Quellen und Redaktionsstand

24 Methodenkarten: im Repo nur kompakte, eigenständig formulierte Zusammenfassungen und Metadaten, **keine Originalkarten oder nicht freigegebenen Bildmotive**. Externe Podcast/Video Beispiele: Links führen auf die Originalseiten und sind als externe Inhalte gekennzeichnet. Die Forschungshypothesen zu kleinen Schweizer KMU findest du in [RESEARCH-CH.md](RESEARCH-CH.md); die interne Sotomo Präsentation ist **nicht** Teil dieses Repositories.

Cloudflare Dokumentation: [Workers AI Free Kontingent](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Workers AI Bindings](https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/), [Worker mit Static Assets](https://developers.cloudflare.com/workers/static-assets/binding/).
