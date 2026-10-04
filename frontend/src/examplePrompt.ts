/** Default example for the process description textarea — see docs/example-prompt.md */
export const EXAMPLE_PROCESS_PROMPT = `Ein Mitarbeiter stellt eine Bestellanforderung im Portal ein und hängt die Begründung sowie eine Kostenschätzung an. Der Vorgesetzte prüft die Anforderung innerhalb von zwei Werktagen.

Wenn der Vorgesetzte genehmigt, leitet er den Vorgang an den Einkauf weiter. Der Einkauf holt mindestens zwei Angebote ein und wählt einen Lieferanten aus. Liegt der Gesamtbetrag über 10.000 Euro, muss zusätzlich die Geschäftsleitung freigeben. Nach erfolgreicher Freigabe erstellt der Einkauf die Bestellung und informiert den Mitarbeiter per E-Mail.

Wenn der Vorgesetzte ablehnt, erhält der Mitarbeiter eine Benachrichtigung mit Begründung und kann die Anforderung überarbeiten und erneut einreichen.

Nach Versand der Ware bestätigt die Wareneingangskontrolle den Empfang im System. Stimmt die Lieferung mit der Bestellung überein, schließt die Buchhaltung den Vorgang ab. Weichen Menge oder Artikel ab, eskaliert die Wareneingangskontrolle an den Einkauf zur Klärung mit dem Lieferanten.`;
