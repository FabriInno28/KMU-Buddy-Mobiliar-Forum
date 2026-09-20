# KMU Buddy · Mobile Prüfung · 20. September 2026

## Ausgangsfrage

Kann eine KMU Inhaberin auf dem Smartphone **aufmachen, erzählen und rasch einen brauchbaren ersten Versuch entdecken**? Der Prototyp arbeitet derzeit ohne echte KI.

## Was geprüft wurde

Automatisierter Playwright Test mit Chromium und Touch Emulation, sechs Bildschirmgrössen:

| Ansicht | CSS Pixel | Textfeld ab Y | Erster Weiter Button bis Y | Bildschirmhöhe |
|---|---:|---:|---:|---:|
| iPhone SE | 375 × 667 | 408 | 649 | 667 |
| iPhone normal | 390 × 844 | 412 | 653 | 844 |
| iPhone gross | 430 × 932 | 423 | 663 | 932 |
| iPad mini hoch | 768 × 1024 | 597 | 863 | 1024 |
| iPad Pro hoch | 1024 × 1366 | 670 | 937 | 1366 |
| iPad quer | 1024 × 768 | 464 | 675 | 768 |

Alle sechs Testläufe: kein horizontales Überlaufen auf Start oder Ergebnis. Je Gerät: Anliegen eingeben, optionale Angaben aufklappen, Nachfrage beantworten, Dashboard öffnen, ersten Schritt direkt öffnen, Methodenkarte öffnen und Screenshots erzeugen. Die bestehenden 22 Szenariotests und der HTML/JS Smoke Test liefen im selben CI Lauf erfolgreich.

[GitHub Actions: Prüflauf und Screenshots](https://github.com/FabriInno28/KMU-Buddy-Mobiliar-Forum/actions/runs/35526785587)

## Durch diese Prüfung erkannte und behobene Probleme

1. **iPhone SE: kein Einstieg im ersten Bildschirm.** Vorher begann das Texteingabefeld erst bei Y 745, der Weiter Button lag bei Y 1376. Jetzt sind Texteingabe und erster Button im initialen 667 Pixel Bildschirm sichtbar. Zusatzangaben sind freiwillig und aufgeklappt erreichbar.
2. **iPad quer: zu viel Bühne vor der Eingabe.** Der Eingabebereich beginnt nun bei Y 464 statt Y 670.
3. **Ergebnis: der persönliche Steckbrief verdrängte den Nutzen.** Der nächste konkrete Versuch samt „Jetzt ausprobieren“ erscheint jetzt oben, vor allen Reitern und dem umfangreichen Steckbrief. Angaben bleiben in einem aufklappbaren Bereich erreichbar.
4. **Doppelte Wiedergabe der eigenen Aussage in der Rückfrage** wurde entfernt. Die Aussage steht als kurze Gesprächsblase; danach folgt die passende Frage.

## Was die bestandenen Tests NICHT beweisen

- Kein Test auf einem **physischen iPhone oder iPad**, keine Prüfung in nativem iOS Safari und unter realen Mobilfunkbedingungen. Chromium mit Touch und Pixelgrössen ist ein brauchbarer Regressionstest, aber kein Safari Ersatz.
- Die optionale Spracherkennung ist browserabhängig. Falls sie fehlt, kann die Person das **Tastaturmikrofon** des Geräts verwenden, soweit auf ihrem Gerät aktiviert. Kein garantiertes Schweizerdeutsch und **keine gesprochene Antwort** des Buddy.
- Die im Browser hinterlegten Empfehlungen funktionieren nur in den bekannten Themenpfaden. **Keine aktive KI** und keine zuverlässige freie Situationsanalyse.
- Die GitHub Pages Veröffentlichung unter einer nutzbaren öffentlichen URL und alle SRF Medienlinks auf einem physischen Gerät wurden in dieser Prüfung **nicht bestätigt**.
- Ein bestandenes Layout ist noch kein Nachweis, dass KMU den ersten Schritt als wirklich hilfreich erleben oder sich mindestens 15 Minuten aktiv mit der Zukunft beschäftigen.

## Nächster Praxistest vor der Entwicklerdemo

1. **Auf echten Geräten** iPhone mit Safari, iPad hoch und quer: Link öffnen, drei Beispielsätze diktieren, Antwort ansehen, Korrektur ausprobieren und Methodenkarte öffnen.
2. Prüfen, ob das Mikrofon der iOS Tastatur leicht auffindbar ist. Die funktionierende Browser Spracheingabe auf Chromium nicht mit einer garantierten iOS Lösung verwechseln.
3. Fünf reale KMU von unterschiedlichen Branchen ohne Einführung ausprobieren lassen: Wann beginnt ein Gespräch? Kommt ein erster brauchbarer Schritt innerhalb weniger Minuten? Ist der Schritt im Alltag machbar? Was stört? Was bringt neue Klarheit?
4. Mindestens einen vollständigen Weg inklusive externem Audio- oder Videolink auf mobilen Geräten öffnen und den konkreten Beitrag abspielen.
5. Für die Skalierung später **nachgewiesene aktive Zukunftsbeschäftigung von mindestens 15 Minuten** von Seitenaufrufen und Verweildauer trennen.

**Abnahmeentscheidung:** Der technische Responsive Test ist bestanden. Die reale iOS Prüfung, die öffentliche URL, die Sprachnutzung und die Nutzenvalidierung sind weiterhin offen.
