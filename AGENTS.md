# Agentenregeln für die Entwicklung des KMU Buddy

## Ziel

Baue kein Beratungsportal, keine digitale Versicherungsofferte und keine Sammlung von Empfehlungslinks. Baue ein einladendes, leichtes Produkt, das ein KMU schnell in Bewegung bringt.

## Vor jeder Codeänderung

- Lies `PRODUCT.md`, `DESIGN.md` und `README.md` vollständig.
- Unterscheide Demo Funktion, tatsächlich bestehendes Angebot und zukünftige Idee.
- Erhalte die eigenständige, ohne Installation lauffähige `index.html`, bis der Nutzer eine andere Architektur ausdrücklich freigibt.
- Ändere nichts an echten Mobiliar Daten, Kundensystemen oder externen Diensten.

## Gespräch und Inhalt

- Verwende warmes, natürliches Deutsch mit Schweizer Rechtschreibung.
- Schreibe kurze aktive Sätze, konkrete Beispiele aus dem KMU Alltag und nützliche Fragen.
- Entferne Beratungsfloskeln, künstliche Einstufungen und Formulierungen wie «Assessment abgeschlossen».
- Ein Impuls soll den nächsten kleinen Schritt benennen, nicht bloss das Problem paraphrasieren.
- Keine erfundenen erfolgreichen Medien, Gruppen, Förderzusagen, freien Plätze oder KI Fähigkeiten.
- Externe und interne Angebote nur dann anzeigen, wenn sie für die geäusserte Situation plausibel sind.

## Design und UX

- Prüfe Startseite, Gespräch und Dashboard auf 390 px und 1440 px.
- Keine abgeschnittenen Inhalte, leeren interaktiven Flächen, unlesbare Kontraste oder rein dekorative Buttons.
- Auf dem Dashboard zuerst «Jetzt ausprobieren», danach freiwillige Vertiefungen.
- Funktionierende Tastaturbedienung und sichtbare Fokuszustände erhalten.

## Technik und Datenschutz

- Für den Konzeptprototyp keine API Schlüssel, keine Analytics, keine externen Skripte und keine echten Unternehmensdaten.
- Für künftige echte KI niemals geheime Schlüssel direkt im Browser ablegen.
- Jeder externe Inhalt muss als verifiziertes Angebot oder ausdrücklich als redaktionelle Idee gekennzeichnet werden.
- Vor produktiver Einführung Sicherheit, Hosting, Datenmanagement und Einwilligung gesondert prüfen.

## Abnahme

- Starte die Browser Smoke Tests nach jeder relevanten Änderung.
- Liefere Screenshots von Start und Dashboard für Desktop und Smartphone.
- Schreibe im Pull Request genau, was funktioniert, welche Beispiele erfunden sind, welche Tests ausgeführt wurden und was noch offen ist.
- Niemals ungefragt `main` überschreiben, einen Pull Request zusammenführen oder den Prototyp öffentlich deployen.

## Code Review Rules

### Wahrhaftigkeit
Melde Stellen, an denen eine Demo wie eine echte Buchung, ein echtes KI Matching oder eine gesicherte Förderempfehlung wirkt.

### Benutzerführung
Melde Änderungen, die den sofortigen Nutzwert zugunsten eines langen Fragebogens oder eines überladenen Angebotskatalogs verdrängen.

### Datenschutz
Melde das unbeabsichtigte Erfassen, Speichern oder Übermitteln von KMU Angaben und den Einsatz offener Browser API Schlüssel.