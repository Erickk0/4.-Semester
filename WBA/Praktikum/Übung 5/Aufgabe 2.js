document.addEventListener('DOMContentLoaded', function() {
    // Alle Eingabefelder für Flaschenanzahlen auswählen
    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Entfernt alles, was keine Ziffer ist
            this.value = this.value.replace(/\D/g, '');
        });
    });
});