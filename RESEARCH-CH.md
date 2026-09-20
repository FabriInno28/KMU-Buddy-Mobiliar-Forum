# KMU Buddy · Schweizer KMU als Ausgangspunkt

Stand: 20. September 2026. **Öffentliche Forschung und Produktannahmen**, keine interne Sotomo Präsentation. Die fiktiven Testbetriebe sind Konstruktionen, keine befragten KMU.

## Was die öffentlich zugänglichen Quellen sagen

1. **Kleine Betriebe sind kein Randsegment.** Eine Zusammenstellung der Universität St. Gallen mit BFS Daten für 2023 weist 561’952 Mikrounternehmen mit weniger als zehn Mitarbeitenden aus, 89,8 % aller Unternehmen in der dargestellten Grundgesamtheit. Die 2026 veröffentlichte Zusammenstellung verwendet Daten des BFS aus 2023. Quelle: https://kmu.unisg.ch/fileadmin/user_upload/HSG_ROOT/Institut_KMU/Forschung/KMU_in_Zahlen/2026_OBT_KMU_in_Zahlen/2026_KMU_in_Zahlen_OBT_KMU_Studie_2026.pdf

2. **Nicht alle haben dasselbe Problem.** Der ZHAW / ZKB «KMU ZH Monitor 2026» (Befragung von 1’287 Unternehmen im Kanton Zürich, März bis April 2026) nennt Vorschriften, Digitalisierung/KI und Kundenakquise als wichtige Herausforderungen. Für Kleinstunternehmen ist Digitalisierung/KI deutlich wichtiger geworden. Diese Zürcher Umfrage ist **keine repräsentative Schweiz Aussage**. Quelle: https://www.zkb.ch/de/unternehmen/kmu-wissen/initiativen-und-studien/kmu-zh-monitor/kmu-zh-monitor-2026.html

3. **Menschen fehlen oder fallen aus, aber die Gruppe ist heterogen.** Die AXA KMU Arbeitsmarktstudie 2026 wurde von Sotomo anhand 336 KMU mit mindestens fünf Beschäftigten in der deutsch- und französischsprachigen Schweiz durchgeführt. Personalausfälle und psychische Belastungen werden behandelt. Die Studie deckt **Einpersonenbetriebe und Unternehmen mit zwei bis vier Beschäftigten nicht ab**. Quelle: https://www.axa.ch/de/ueber-axa/medien/medienmitteilungen/aktuelle-medienmitteilungen/2026/20260820-kmu-arbeitsmarktstudie-2026-personalausfaelle.html

4. **KI ist auch für kleine Unternehmen ein Thema, nicht automatisch der richtige erste Schritt.** Die AXA/Sotomo Auswertung 2026 zeigt Unterschiede nach KMU Grösse beim wahrgenommenen Nutzen von KI. Die Befragungsgrundlage ist dieselbe wie unter Punkt 3. Quelle: https://www.axa.ch/de/ueber-axa/medien/medienmitteilungen/aktuelle-medienmitteilungen/2026/20260915-kmu-arbeitsmarktstudie-kuenstliche-intelligenz.html

5. **Nachfolge und Weitergabe von Wissen sind eigenständige Situationen.** Das KMU Portal des Bundes verweist auf Erhebungen zur ungeklärten Nachfolge. Die dort referenzierten Studien haben unterschiedliche Jahrgänge und Unternehmensgrössen; Zahlen daraus sind nicht direkt auf die aktuelle Nutzergruppe übertragbar. Quelle: https://www.kmu.admin.ch/de/kmu-in-zahlen-nachfolgeregelungen

## Was wir für das Produkt daraus ableiten (Hypothesen, keine Studienergebnisse)

- Die erste Frage lautet **«Was ist bei euch konkret los?»**, nicht «Zu welcher Branche gehört ihr?».
- Der Buddy spiegelt die konkrete Situation und fragt gezielt nach, statt eine Kategorie als Diagnose auszugeben.
- Ein Impuls muss für **ein oder zwei Menschen genauso möglich** sein wie für ein Team. Methoden mit höherem Personenbedarf werden nicht als unmittelbare Empfehlung ausgegeben.
- Eine Antwort zu Kundennachfrage darf nicht automatisch ein Personalgespräch auslösen. Eine Antwort zu Personalausfall darf nicht ungefragt einen KI Kurs ausspielen.
- Bei Digitalisierung wird zunächst ein fiktiver, datensparsamer Versuch vorgeschlagen, keine ungeprüfte Weitergabe von Firmen- oder Kundendaten.
- Eigene Angebote, bestehende Medien und externe Förderung erscheinen **nur bei Passung und mit ehrlicher Herkunftskennzeichnung**.
- Die öffentliche Konzeptdemo verwendet erkennbare Regeln und vier fiktive Situationen; daraus kann kein Beleg für eine echte KI Gesprächsqualität abgeleitet werden.

## Vier Testfälle mit bewusst verschiedenen nächsten Schritten

| Fiktives KMU | Anlass | Kontextfrage | Passender kleiner Versuch |
|---|---|---|---|
| Bäckerei, 4 Personen | Alle Entscheide landen bei der Inhaberin | Welche Entscheidung bleibt liegen? | Eine wiederkehrende Entscheidung mit klaren Grenzen abgeben |
| Metallbau, 12 Personen | Werkstatt und Montage müssen nachtelefonieren | Wo geht die Information verloren? | Einen echten Auftrag mit drei Angaben übergeben |
| Coiffeursalon, 6 Personen | Mitarbeitende gehen oder fehlen | Was beschäftigt dich beim Personal konkret? | Ein offenes Gespräch und eine kleine Verbesserung vereinbaren |
| Schreinerei, 8 Personen | Eine erfahrene Person geht in Pension | Welches Wissen wäre schwer zu ersetzen? | Einen Kniff zu zweit vorzeigen, notieren und ausprobieren |

Diese Fälle sind **Regressionstests**, keine Interviews und keine Nutzungsstudie. Die zugehörigen automatischen Browserprüfungen stehen in `tests/personas.mjs`.

## Prüffragen für reale KMU Tests

1. Erkennt die Person in eigenen Worten das konkrete Anliegen im Dashboard wieder?
2. Ist der erste Impuls ohne Vorbereitung, grosse Zusatzkosten oder lange Sitzung machbar?
3. Passen die Methodenkarten zu Zeit und Anzahl tatsächlich verfügbarer Menschen?
4. Erscheinen Medien und weitere Angebote als persönliche Einladung statt als Katalog oder Werbung?
5. Ist unmissverständlich klar, was heute vorhanden ist und was erst eine Idee für eine spätere Pilotierung ist?
6. Würde die Person freiwillig zurückkommen, um zu erzählen, was sie ausprobiert hat?

**Vertraulichkeit:** Interne Forschungsunterlagen, reale Gesprächsnotizen und nicht freigegebene Mobiliar Materialien gehören nicht in dieses öffentliche Repository.
