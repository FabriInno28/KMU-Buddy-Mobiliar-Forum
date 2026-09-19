# KMU Buddy | Mobiliar Forum | Konzeptprototyp 03

**Ein Impuls. Ein guter nächster Schritt.**

Ein eigenständiges, responsives Konzept für die Skalierungsinitiative des Mobiliar Forums. Ziel ist nicht, KMU möglichst viele Angebote zu zeigen, sondern zunächst einen kleinen, sofort nutzbaren Impuls zu geben. Danach können sie nach Bedarf Medien, Menschen und passende Unterstützung entdecken.

## Starten

`index.html` lokal in einem regulären Browser öffnen. Es ist eine eigenständige Datei ohne externe Bibliotheken, Installation, API Schlüssel oder Netzverbindung. Die Dateivorschau innerhalb einer App kann interaktive HTML Inhalte blockieren. Für die mobile Vorschau bitte die veröffentlichte Webversion verwenden. GitHub Pages muss gegebenenfalls in den Repository-Einstellungen aktiviert werden.

1. «Hoi Buddy, legen wir los» führt durch drei kurze Gesprächsschritte.
2. «Oder zeig mir erst einmal ein Beispiel» zeigt direkt einen Beispielbetrieb.
3. Im Dashboard den Impuls ausprobieren und weitere passende Möglichkeiten entdecken.
4. «Neues Gespräch» erlaubt einen Vergleich der verschiedenen Themenpfade.

## Was bereits funktioniert

- Responsives Gespräch mit fünf vordefinierten Bedürfnisthemen und je einer passenden Rückfrage.
- Ein persönliches Dashboard auf Grundlage der ausgewählten Themen, des gewählten Tempos und eines optionalen Betriebsnamens.
- Sofortimpulse und konkrete Schrittfolgen für alle fünf Themen.
- Interaktive Checkliste, kopierbarer Impuls, Medienvorschau, Forum, Peer und Ökosystem als klickbare Konzeptflächen.
- Keine Speicherung oder Übertragung von Eingaben auf einen Server.
- Browserprüfungen für Start, Gespräch, Themenwechsel, Dashboard, Medien, Begegnungen und weitere Möglichkeiten.

## Was dieser Stand bewusst NICHT behauptet

Kein Live KI Gespräch; freie Texte werden noch nicht semantisch interpretiert. Keine echten Podcasts oder Videos im Produkt. Keine reale Buchung, keine echten Peer Gruppen und keine verifizierte individuelle Förderempfehlung. Keine offiziellen Designbibliotheken oder markengeschützten Logos eingebunden. Keine Anbindung an Systeme der Mobiliar. Der Prototyp ist eine öffentliche, rein fiktive Konzeptdemo und noch keine freigegebene Mobiliar Anwendung.

## Zusammenarbeit mit Codex

`AGENTS.md` enthält die Arbeitsregeln für KI gestützte Entwicklung. `PRODUCT.md` beschreibt das fachliche Versprechen und die Abnahmekriterien, `DESIGN.md` die gestalterische Richtung. Änderungen in einem separaten Branch bearbeiten, im Browser testen und erst nach Freigabe zusammenführen.

## Test

Mit installiertem Python Playwright und Chromium: `python test_smoke.py`. Das Testskript verweist auf `/mnt/data/kmu-buddy-studio-v3/index.html` als aktuellen Erstellungsort; in einer GitHub Umgebung den Pfad auf die lokale Repositorydatei umstellen oder `Path(__file__).with_name('index.html')` verwenden.

## Zusammenarbeit und Daten

Nur anonymisierte, erfundene Beispielbetriebe und Inhaltsbeispiele verwenden. Keine echten Gesprächsnotizen, Unternehmensinformationen oder internen Mobiliar Unterlagen in eine öffentlich erreichbare Vorschau übertragen. Vor einer realen Pilotierung müssen Datenverantwortung, Einwilligung, Hosting, Inhaltsqualität, Freigaben und Einbindung der zuständigen Teams geklärt werden.

## Öffentliche Konzeptdemo

Dieses Repository ist zum Zeitpunkt der ersten Veröffentlichung öffentlich. Ausschliesslich fiktive Beispielbetriebe und erfundene Medienideen verwenden. Keine Kundenangaben oder vertraulichen Mobiliar-Dokumente in das Repository oder die gehostete Demo eingeben. Es gibt kein Backend und keine serverseitige Datenspeicherung; der derzeitige Gesprächsablauf ist regelbasiert, keine echte KI. GitHub Pages kann im Repository unter Settings → Pages (Deploy from branch: main / root) aktiviert werden. Eine private Repository-Einstellung schützt nicht automatisch eine bereits veröffentlichte Webseite.
