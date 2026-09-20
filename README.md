# KMU Buddy | Mobiliar Forum | Konzeptprototyp 03

**Ein Impuls. Ein guter nächster Schritt.**

Ein eigenständiges, responsives Konzept für die Skalierungsinitiative des Mobiliar Forums. Ziel ist nicht, KMU möglichst viele Angebote zu zeigen, sondern zunächst einen kleinen, sofort nutzbaren Impuls zu geben. Danach können sie nach Bedarf Medien, Menschen und passende Unterstützung entdecken.

## Starten

`index.html` lokal in einem regulären Browser öffnen. Es ist eine eigenständige Datei ohne externe Bibliotheken, Installation, API Schlüssel oder Netzverbindung. Die Dateivorschau innerhalb einer App kann interaktive HTML Inhalte blockieren. Für die mobile Vorschau bitte die veröffentlichte Webversion verwenden. GitHub Pages muss gegebenenfalls in den Repository-Einstellungen aktiviert werden.

1. «Hoi Buddy, legen wir los» führt durch drei kurze Gesprächsschritte.
2. «Oder zeig mir erst einmal ein Beispiel» zeigt direkt einen Beispielbetrieb.
3. Im Dashboard den Impuls ausprobieren und weitere passende Möglichkeiten entdecken.
4. «Neues Gespräch» erlaubt einen Vergleich der verschiedenen Themenpfade.

## MVP 1: Vertiefte Methoden und präzise Medien (September 2026)

Der kostenlose Prototyp zeigt die eigenen Themen im Dashboard, führt mit einer situationsabhängigen Rückfrage zu einem kleinen Versuch und bietet in sieben ausgewählten Methoden eigenständig verfasste Arbeitsblätter. Die Empathie-Gespräch-Karte enthält auch eine konkrete Kontaktanfrage, sechs zum Anlass passende offene Fragen und eine einfache Auswertung. Die Notizen bleiben bis zum Neuladen im Browser; bitte keine echten Personendaten oder vertraulichen Angaben eingeben.

[Medienkuration mit direkten Beitragslinks und begründeter Auswahl](MEDIEN-KURATIERUNG.md). Externe Inhalte anderer Finanzdienstleister werden im öffentlichen Empfehlungsbereich nicht verlinkt; öffentliche Studien für die Forschung sind eine getrennte Frage.

## Kostenlose KMU-Realitäten-Demo (September 2026)

Diese GitHub-Pages-Version benötigt **keinen API-Schlüssel, kein ChatGPT-Abo und kein kostenpflichtiges Hosting**. Die Anwendung läuft vollständig im Browser. Sie führt mit einfachen, offengelegten Regeln durch typische Situationen kleiner Schweizer Unternehmen; **sie ist kein echtes KI-Modell und kann freie Texte nicht zuverlässig semantisch verstehen**.

Neu: Die freie Alltagsschilderung steht im Vordergrund, zusätzlich können vier rein fiktive kleine KMU als Beispiele geöffnet werden. Weitere Szenarien behandeln schwächere Nachfrage, Kostendruck, unklare Anforderungen und den Einpersonenbetrieb. Die Antwort auf die Rückfrage beeinflusst den konkreten Impuls; die Person kann eine unpassende Einordnung korrigieren oder freiwillig in der Browseransicht Feedback geben. Kein Gespräch und kein Feedback werden an einen Server gesendet.

Die öffentlichen Schweizer Studien mit Population, Zeitpunkt und Geltungsgrenzen sowie die fiktiven Testfälle stehen in [RESEARCH-CH.md](RESEARCH-CH.md). Interne Sotomo-Präsentationen, Original-Materialkarten und reale KMU-Daten bleiben ausserhalb dieses öffentlichen Repositories.

## Was bereits funktioniert

- Responsives Gespräch mit freier Texteingabe, Stichworterkennung, gezielter Rückfrage und Möglichkeit zur Korrektur der Einordnung. **Die Erkennung ist regelbasiert, nicht generative KI.**
- Antwortspezifische Dashboards für acht typische Situationen sowie thematisch passende Kurzimpulse und Schrittfolgen.
- 7 ausgearbeitete Praxisguides mit Vorbereitung, konkretem Ablauf, Auswertung und lokal bearbeitbaren Notizen sowie 17 weitere Methodenkarten als Kurzüberblick. Das Empathie-Gespräch bietet eine situationsbezogene Einladung und sechs konkrete Interviewfragen. Gruppengrösse und Zeit orientieren sich am vorhandenen Methodenkatalog; die erweiterten Texte sind eigene Prototypenhilfen, nicht der Originalwortlaut.
- Externe Schweizer SRF Podcasts, Hörbeiträge und Videos mit konkretem Direktlink zur ausgewählten Folge oder zum klar bezeichneten TV-Beitrag; keine Verweise auf andere Finanz- oder Versicherungsdienstleister. Medien werden nur bei plausibler thematischer Passung persönlich empfohlen. Eigene Medienideen sind gesondert als noch nicht produziert gekennzeichnet.
- Interaktive Checkliste, kopierbarer Impuls, Forum, Peer und Ökosystem als klar markierte Konzeptflächen. Keine Buchungen oder Live-Empfehlungen.
- Keine Speicherung oder Übertragung von Gesprächseingaben auf einen Server. Externe Inhalte werden erst beim bewussten Öffnen eines Links aufgerufen.
- Automatische Browserprüfungen mit vier fiktiven KMU, einem Einpersonenbetrieb und einer Korrektur der Antworten; technische Prüfungen und Screenshots in GitHub Actions.
- Öffentliche Forschungsgrundlage und Geltungsgrenzen: [RESEARCH-CH.md](RESEARCH-CH.md).

## Was dieser Stand bewusst NICHT behauptet

Kein Live KI Gespräch; freie Texte werden anhand begrenzter Stichwortmuster erkannt, nicht mit echter Sprachintelligenz verstanden. Externe Medien sind nicht redaktionell durch die Mobiliar freigegeben. Keine eigene Audio- oder Videoproduktion, keine reale Buchung, keine echten Peer Gruppen und keine verifizierte individuelle Förderempfehlung. Keine offiziellen Designbibliotheken oder markengeschützten Logos eingebunden. Keine Anbindung an Systeme der Mobiliar. Der Prototyp ist eine öffentliche, rein fiktive Konzeptdemo und noch keine freigegebene Mobiliar Anwendung.

## Zusammenarbeit mit Codex

`AGENTS.md` enthält die Arbeitsregeln für KI gestützte Entwicklung. `PRODUCT.md` beschreibt das fachliche Versprechen und die Abnahmekriterien, `DESIGN.md` die gestalterische Richtung. Änderungen in einem separaten Branch bearbeiten, im Browser testen und erst nach Freigabe zusammenführen.

## Test

Die auf GitHub automatisch laufenden Tests liegen in `tests/smoke.mjs` und `tests/personas.mjs`. Lokal: `node tests/smoke.mjs` und mit installiertem Playwright samt Chromium `node tests/personas.mjs`.

## Zusammenarbeit und Daten

Nur anonymisierte, erfundene Beispielbetriebe und Inhaltsbeispiele verwenden. Keine echten Gesprächsnotizen, Unternehmensinformationen oder internen Mobiliar Unterlagen in eine öffentlich erreichbare Vorschau übertragen. Vor einer realen Pilotierung müssen Datenverantwortung, Einwilligung, Hosting, Inhaltsqualität, Freigaben und Einbindung der zuständigen Teams geklärt werden.

## Öffentliche Konzeptdemo

Dieses Repository ist zum Zeitpunkt der ersten Veröffentlichung öffentlich. Ausschliesslich fiktive Beispielbetriebe und erfundene Medienideen verwenden. Keine Kundenangaben oder vertraulichen Mobiliar-Dokumente in das Repository oder die gehostete Demo eingeben. Es gibt kein Backend und keine serverseitige Datenspeicherung; der derzeitige Gesprächsablauf ist regelbasiert, keine echte KI. GitHub Pages kann im Repository unter Settings → Pages (Deploy from branch: main / root) aktiviert werden. Eine private Repository-Einstellung schützt nicht automatisch eine bereits veröffentlichte Webseite.
