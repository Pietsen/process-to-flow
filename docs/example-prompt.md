# Beispiel-Prompt

Kopiere den Text unten ins Eingabefeld (oder klicke in der App auf **Beispiel laden**) und starte **Diagramm erstellen**.

## Bestellanforderung mit Freigaben

Ein Mitarbeiter stellt eine Bestellanforderung im Portal ein und hängt die Begründung sowie eine Kostenschätzung an. Der Vorgesetzte prüft die Anforderung innerhalb von zwei Werktagen.

Wenn der Vorgesetzte genehmigt, leitet er den Vorgang an den Einkauf weiter. Der Einkauf holt mindestens zwei Angebote ein und wählt einen Lieferanten aus. Liegt der Gesamtbetrag über 10.000 Euro, muss zusätzlich die Geschäftsleitung freigeben. Nach erfolgreicher Freigabe erstellt der Einkauf die Bestellung und informiert den Mitarbeiter per E-Mail.

Wenn der Vorgesetzte ablehnt, erhält der Mitarbeiter eine Benachrichtigung mit Begründung und kann die Anforderung überarbeiten und erneut einreichen.

Nach Versand der Ware bestätigt die Wareneingangskontrolle den Empfang im System. Stimmt die Lieferung mit der Bestellung überein, schließt die Buchhaltung den Vorgang ab. Weichen Menge oder Artikel ab, eskaliert die Wareneingangskontrolle an den Einkauf zur Klärung mit dem Lieferanten.

## Erwartetes Ergebnis (vereinfacht)

Das LLM sollte u. a. diese Akteure erkennen:

- Mitarbeiter
- Vorgesetzter
- Einkauf
- Geschäftsleitung
- Wareneingangskontrolle
- Buchhaltung

Entscheidungen u. a.:

- Genehmigung durch den Vorgesetzten (Ja/Nein)
- Betrag über 10.000 Euro (Ja/Nein)
- Lieferung entspricht Bestellung (Ja/Nein)
