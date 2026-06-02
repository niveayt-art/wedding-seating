const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSkU-7EO0VStM7Fikh4UFyWUn-vGZhAV3qS5vDsLgrDl1BJqvRFw7Q9jrU5OGWeyul4Eo5iMpg-bDYn/pub?output=csv";

let allGuests = [];
let eventGuests = [];

const searchInput = document.getElementById("guestSearch");
const suggestions = document.getElementById("suggestions");
const result = document.getElementById("result");

const params = new URLSearchParams(window.location.search);
const eventId = params.get("event");

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    complete: function(results) {

        allGuests = results.data;

        eventGuests = allGuests.filter(g =>
            g.EventID?.trim().toLowerCase() ===
            eventId?.trim().toLowerCase()
        );

        // optional couple name
        const first = eventGuests[0];
        if (first?.CoupleName) {
            document.getElementById("coupleName").textContent =
                first.CoupleName;
        }
    }
});

searchInput.addEventListener("input", handleSearch);

function handleSearch() {

    const term = searchInput.value.trim().toLowerCase();

    suggestions.innerHTML = "";

    if (!term) return;

    const matches = eventGuests
        .filter(g =>
            g.GuestName?.toLowerCase().includes(term)
        )
        .slice(0, 8);

    matches.forEach(g => {
        const div = document.createElement("div");
        div.className = "suggestion";
        div.textContent = g.GuestName;

        div.onclick = () => showGuest(g);

        suggestions.appendChild(div);
    });
}

function showGuest(guest) {

    suggestions.innerHTML = "";
    searchInput.value = guest.GuestName;

    result.innerHTML = `
        Welcome <br><strong>${guest.GuestName}</strong><br><br>
        Table<br>
        <span class="highlight-text"> ${guest.TableNumber} </span>
    `;

    document.querySelectorAll(".table")
        .forEach(t => t.classList.remove("selected"));

    const table = document.querySelector(
        `[data-table="${guest.TableNumber}"]`
    );

    if (table) {
        table.classList.add("selected");

        table.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}
