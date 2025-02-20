// Funktion för att hämta en API-nyckel från servern
async function getApiKey() {
    // Hämtar elementet med id "errorMessage" för att visa felmeddelanden om det behövs
    const errorMessage = document.getElementById("errorMessage");
    try {
        // Skickar en POST-förfrågan till API:et för att få API-nyckeln
        const response = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys", {
            method: "POST",
        });
         // Om förfrågan inte lyckas, visa felmeddelande.
        if (!response.ok) {
            if (errorMessage) {
                errorMessage.innerText = `Failed to fetch API key: ${response.status}`;
            }
            throw new Error(`HTTP error: ${response.status}`);
        }
        // Om förfrågan lyckas, returnera API-nyckeln.
        const data = await response.json();
        return data.key;
    } catch (error) {
        // Logga eventuella fel och visa ett generellt felmeddelande
        console.error("Error fetching API key:", error);
        if (errorMessage) {
            errorMessage.innerText = "Unable to fetch API key.";
        }
    }
}

// Funktion för att hämta information om planeter från API:et
async function fetchPlanets(apiKey) {
    // Hämtar elementet med id "errorMessage" för att visa felmeddelanden vid behov.
    const errorMessage = document.getElementById("errorMessage");
    try {
        // Anropar API:et för att hämta planetsdata, med GET-metod och lägger till API-nyckeln i headers.
        const response = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies", {
            method: "GET", // Definierar att anropet ska vara en GET-begäran
            headers: { "x-zocom": apiKey }, // Lägg till API-nyckeln som en header
        });
        // Kontrollera om HTTP-svaret är ok
        if (!response.ok) {
            // Om svaret inte är ok, visa ett felmeddelande.
            if (errorMessage) {
                errorMessage.innerText = `Failed to fetch planets: ${response.status}`;
            }
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching planets:", error);
        // Visa ett generellt felmeddelande i HTML-elementet "errorMessage" om något går fel
        if (errorMessage) {
            errorMessage.innerText = "Unable to fetch planet data.";
        }
    }
}

// Funktion för att ladda data om solsystemet
async function loadSolarSystemData() {
    // Hämtar elementet med id "errorMessage" för att visa felmeddelanden vid behov
    const errorMessage = document.getElementById("errorMessage");
    // Hämtar API-nyckeln genom att anropa funktionen getApiKey
    const apiKey = await getApiKey();
    // Om ingen API-nyckel hittas, avsluta funktionen.
    if (!apiKey) return;
    // Använder funktionen fetchPlanets för att hämta planetdata från API:et med API-nyckeln
    const planets = await fetchPlanets(apiKey);
    if (!planets || !planets.bodies) {
        if (errorMessage) {
            errorMessage.innerText = "No planet data available.";
        }
        return; // Avsluta funktionen om ingen data finns.
    }

    const pathname = window.location.pathname;
    const planetName = pathname.split("/").pop().replace(".html", "");

    const planet = planets.bodies.find(
        (p) => p.name.toLowerCase().trim() === planetName.toLowerCase().trim()
    );
    // Om planeten inte hittas i datan, logga ett felmeddelande och visa det för användaren.
    if (!planet) {
        console.error("Planet not found:", planetName);
        if (errorMessage) {
            errorMessage.innerText = "Planet data not found.";
        }
        return;
    }

    updatePlanetInfo(planet);
}

loadSolarSystemData(); // Anropar funktionen för att initiera laddning av solsystemets data.


// Planetdata
const planets = {
    "Solen": "Typ: Gult dvärgstjärna (G2V). Diameter: ~1,39 miljoner km. Temperatur (yta): ~5 500 °C. Temperatur (kärna): ~15 miljoner °C. Avstånd från jorden: ~149,6 miljoner km (1 AU). Funktion: Håller hela solsystemet samman med sin gravitation och ger energi genom fusion av väte till helium.",
    "Merkurius": "Position: 1:a planeten från solen. Diameter: 4 880 km. Temperatur: -170 °C till 430 °C. Atmosfär: Nästan obefintlig. Särdrag: Solsystemets minsta planet och snabbast i sin bana runt solen..",
    "Venus": "Position: 2:a planeten från solen Diameter: 12 104 km. Temperatur: Ca 460 °C (hetast i solsystemet). Atmosfär: Tjock, består av koldioxid och svavelsyra. Särdrag: Har en extrem växthuseffekt och roterar baklänges.",
    "Jorden": "Position: 3:e planeten från solen. Diameter: 12 742 km. Temperatur: -88 °C till 58 °C. Atmosfär: Kväve (78 %) och syre (21 %). Särdrag: Den enda kända planeten med liv.",
    "Mars": "Position: 4:e planeten från solen. Diameter: 6 779 km. Temperatur: -125 °C till 20 °C. Atmosfär: Tunn, mestadels koldioxid. Särdrag: Kallas den röda planeten på grund av sin järnrika yta..",
    "Jupiter": "Position: 5:e planten från solen. Diameter: ~139 820 km. Temperatur: -145 °C (molntoppar). Atmosfär: Mest väte och helium. Särskilt: Den största planeten, med över 75 månar och en berömd storm kallad Stora röda fläcken.",
    "Saturnus": "Position: 6:e planeten från solen. Diameter: ~116 460 km. Temperatur: -178 °C. Atmosfär: Mest väte och helium. Särskilt: Känd för sina imponerande ringar av is och sten.",
    "Uranus": "Position: 7:e planeten från solen. Diameter: ~50 724 km. Temperatur: -224 °C. Atmosfär: Mest väte, helium och metan. Särskilt: Roterar på sidan, vilket ger extrema årstidsvariationer.",
    "Neptunus": "Position: 8:e planeten från solen. Diameter: ~49 244 km. Temperatur: -218 °C. Atmosfär: Mest väte, helium och metan. Särskilt: Har de starkaste vindarna i solsystemet, upp till 2 000 km/h."
};


//Sökfunktionen

// Hämta referenser till HTML-element
const searchInput = document.getElementById('searchInput');
const resultDiv = document.getElementById('result');
const modal = document.getElementById('planetModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const closeModal = document.querySelector('.close');

// Funktion för att visa planetinformation i popup-rutan
function showPlanetInfo(planet) {
    modalTitle.textContent = planet;              // Sätt titeln i popup-rutan
    modalText.textContent = planets[planet];      // Sätt texten i popup-rutan
    modal.style.display = 'block';                // Visa popup-rutan
}

// Stäng popup-rutan när man klickar på "X"
closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
});

// Stäng popup-rutan om man klickar utanför innehållet
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Hantera sökningen
searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim().toLowerCase();
    resultDiv.innerHTML = '';  // Rensa tidigare resultat

    if (query) {
        // Filtrera planeter som matchar sökningen
        const suggestions = Object.keys(planets).filter(p => p.toLowerCase().includes(query));

        if (suggestions.length > 0) {
            suggestions.forEach(planet => {
                const suggestionLink = document.createElement('a');
                suggestionLink.href = "#";
                suggestionLink.textContent = planet;
                suggestionLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    showPlanetInfo(planet); // Visa popup-rutan med info om planeten
                });
                resultDiv.appendChild(suggestionLink);
                resultDiv.appendChild(document.createElement('br'));
            });
        } else {
            resultDiv.innerHTML = `<p>Inga förslag hittades för "${query}".</p>`;
        }
    }
});

