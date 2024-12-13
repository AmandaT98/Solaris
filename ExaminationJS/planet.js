        // De olika planeterna man kan söka på
        const items = ["Solen", "Merkurius", "Venus", "Jorden", "Mars", "Jupiter", "Saturnus", "Uranus", "Neptunus"];

       // Funktion för att söka och visa resultat
       function performSearch() {
        const query = document.getElementById("searchInput").value.toLowerCase().trim();
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = ""; // Rensa tidigare resultat

        // Kontrollera om sökfrågan är tom
        if (query === "") {
            resultsContainer.innerHTML = "<p>Skriv något för att börja söka.</p>";
            return;
        }

        // Filtrera objekt baserat på sökfrågan
        const filteredItems = items.filter(item => item.toLowerCase().includes(query));

        // Visa resultat
        if (filteredItems.length === 0) {
            resultsContainer.innerHTML = "<p>Inga resultat hittades.</p>";
            return;
        }

        filteredItems.forEach(item => {
            const div = document.createElement("div");
            div.className = "result-item";
            div.textContent = item;
            resultsContainer.appendChild(div);
        });
    }

