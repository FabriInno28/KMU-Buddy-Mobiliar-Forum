# MVP 1 – scharfer Praxistest mit kleinen Schweizer KMU

Stand: September 2026. Diese Seite ist das **Testprotokoll für die kostenlose, regelbasierte Konzeptdemo**. Sie enthält keine echten Unternehmensantworten und keine internen Sotomo-Dokumente.

## Was MVP 1 bewusst kann und nicht kann

Die Demo bietet einen kurzen Einstieg mit Alltagsschilderung (tippen, je nach Browser diktieren), einem freiwilligen Wunsch und einer Grössenangabe, einer situationsabhängigen Rückfrage, den eigenen Worten im Dashboard, einem kleinen Versuch, passenden Methodenkarten und einer begrenzten, öffentlich verlinkten Medienauswahl. Sie funktioniert ohne eigenen API-Schlüssel und ohne Gesprächsserver.

**Keine freie KI**: Nicht jede Formulierung wird richtig erkannt. Ein unklarer Text muss zu einer vorsichtigen allgemeinen Rückfrage führen, statt scheinbar sicher eine Diagnose zu behaupten. **Kein dauerhaftes Dashboard**: Nach einem Neustart ist das Ergebnis weg. Das in der Demo angezeigte Feedback wird nicht gesammelt und nicht übertragen. **Keine echten Buchungen, Peer Matches, Förderzusagen oder automatische Wirkungsmessung.**

**Spracheingabe**: Die Webseite nutzt nur dann die Browser-Spracherkennung, wenn das Gerät die Funktion anbietet. Sonst steht das Tastaturmikrofon beziehungsweise die Texteingabe zur Verfügung. Auch bei vorhandenem Schalter kann eine Gerätefreigabe oder Browser-Unterstützung fehlen. Die Browser-Spracherkennung kann Audio an den Dienst des Browseranbieters senden. Daher nur mit fiktiven Situationen testen, keine Namen, Personaldaten, Kundendaten oder vertraulichen Betriebsangaben diktieren.

## Durchführung mit 8–12 echten KMU, je rund 15 Minuten

Verschiedene sehr kleine Unternehmen einladen, beispielsweise Einpersonenbetrieb, Laden, Gastronomie, Handwerk, lokaler Dienstleister und kleiner Produktionsbetrieb. Mindestens zwei Teilnehmende sollen nicht besonders digitalaffin sein. Nicht nur bestehende Mobiliar-Forum-Kontakte einladen. Deutschsprachiger Pilot; französischsprachige Nutzerführung und Prüfung sind noch nicht enthalten.

1. **2 Min. Einstieg:** Nur sagen: «Das ist eine kostenlose Konzeptdemo, noch keine KI. Bitte verwende eine erfundene oder anonymisierte Alltagssituation. Denk beim Benutzen laut.» Keine Methode oder Thema vorgeben.
2. **3 Min. Freier Einstieg:** Teilnehmende wählen selbst zwischen Tippen und verfügbarer Spracheingabe. Beobachten: Finden sie das Eingabefeld? Ist die Mikrofonbeschriftung verständlich? Erkennen sie, wann die Aufnahme beendet ist? Können sie ein erfasstes Wort leicht korrigieren?
3. **3 Min. Rückfrage:** Beobachten, ob die Rückfrage aus der Situation heraus Sinn ergibt, ob sie die Person beantwortet und ob sie überflüssige Fragen empfindet.
4. **4 Min. Dashboard:** Ohne Erklärung schauen lassen. Dann fragen: «Wo siehst du **deine Themen**? Was davon ist deine Aussage und was ist die Vermutung des Buddy? Was würdest du als Nächstes tun?» Dabei sichtbare Irrtümer und ungeeignete Methoden notieren.
5. **2 Min. Medien:** «Welcher Beitrag passt zu dir – oder passt keiner?» Selbst einen Podcast oder ein Video öffnen lassen. Prüfen, ob Originalseite und Beitrag klar bezeichnet sind. Nicht zum Klicken auffordern, wenn kein Bezug vorhanden ist.
6. **1 Min. Abschluss:** «Was war hilfreich? Was wirkte generisch oder falsch? Würdest du freiwillig nochmals zurückkommen – wofür?»

Die Testleitung notiert Beobachtungen **ausserhalb** dieser öffentlichen Webseite, ohne Namen/Identifikatoren und ohne vertrauliche Zitate. Nur mit Einwilligung gegebenenfalls anonymisierte O-Töne verwenden. Ein separater freiwilliger Beobachtungsbogen reicht aus; keine Analytics oder Cookies für MVP 1 einbauen.

## Abnahmekriterien für eine erste Feldtest-Runde

| Kriterium | Beobachtbarer Prüfpunkt | Vorgehen bei Problem |
|---|---|---|
| Einstieg | Mindestens 8 von 10 finden den freien Einstieg ohne Hilfe. | Formulierung, Kontrast und Platzierung anpassen. |
| Wiedererkennen | Mindestens 8 von 10 erkennen das eigene Thema im Dashboard wieder; keine erfundenen Unternehmensfakten. | Regelpfad und Spiegelung anhand anonymisierter Fälle korrigieren. |
| Nächster Versuch | Mindestens 7 von 10 können sagen, was sie konkret und in ihrem Team tatsächlich ausprobieren würden. | Versuch verkleinern, Zeit/Personenbedarf ändern. |
| Medien | Link und Herkunft sind vor dem Öffnen eindeutig; bei Nicht-Passung darf nichts empfohlen werden. | Quelle austauschen oder bewusst keine Empfehlung anzeigen. |
| Stimme | Auf jedem tatsächlich eingesetzten Testgerät dokumentieren: Browser-Mikrofon vorhanden / läuft / fehlerhaft / Tastaturdiktat / Textfallback. | Kein «funktioniert auf dem iPhone» behaupten, bis es dort manuell ausprobiert wurde. |
| Vertrauen | Keine Aufforderung zur Eingabe vertraulicher Daten; klare Grenze von Demo, Spracheingabe, Feedback und Buchung. | Sofort vor nächsten Test korrigieren. |
| Bedienung | Auf iPhone Safari und Android Chrome keine abgeschnittenen Schaltflächen, blockierende Modals oder horizontales Scrollen. | Reproduzierbaren Fehler auf konkretem Gerät beheben. |

Die Werte sind **vorläufige Produkt-Abnahmeschwellen, keine Studienbefunde**. Ein Ergebnis von 8/10 beweist noch keine allgemeine KMU-Wirkung. Ein einzelner gravierender Datenschutz- oder Vertrauensfehler ist ein Stoppsignal – unabhängig von Zahlen.

## Technische Regression vor jedem Feldtest

- Die CI prüft vier bestehende Personen-Situationen, neue Nachfrage-/Kosten-/Regel-Themen, Einpersonenbetriebe, die direkte Texteingabe, den Wunsch im Dashboard, Medienlinks, mobile Breite und simulierte Browser-Spracherkennung.
- Vor der ersten Feldrunde zusätzlich **manuell** mindestens je einen vollständigen Durchlauf auf echtem iPhone Safari und Android Chrome machen. Mikrofonberechtigung erlauben und verweigern, längere Spracheingabe ausprobieren, Tastaturfallback, Wortkorrektur und Originalmedien testen. Die automatisierten Tests simulieren Spracherkennung und ersetzen das nicht.
- Die Links führen zu externen Anbietern; Verfügbarkeit und Inhalt können sich ändern. Vor jedem neuen Durchlauf Quellen auf Aktualität und inhaltliche Passung prüfen.

## Entscheid nach der Runde

Erst die beobachteten Missverständnisse priorisieren. MVP 1 ist testreif, wenn die UI zuverlässig nutzbar ist, echte Medien klar gekennzeichnet sind, die Nutzer ihre Worte wiederfinden und die Datenschutz-/Demo-Grenzen verständlich bleiben. Eine echte KI-Anbindung, Login oder aufwendiges Dashboard sind **keine Voraussetzungen** für diesen ersten, kostenlosen Konzepttest.
