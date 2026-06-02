const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSkU-7EO0VStM7Fikh4UFyWUn-vGZhAV3qS5vDsLgrDl1BJqvRFw7Q9jrU5OGWeyul4Eo5iMpg-bDYn/pub?output=csv";

let allGuests = [];
let eventGuests = [];

const searchInput = document.getElementById("guestSearch");
const suggestions = document.getElementById("suggestions");

const seatCircle = document.getElementById("seatCircle");
const tableNumber = document.getElementById("tableNumber");
const guestName = document.getElementById("guestName");

const params = new URLSearchParams(window.location.search);
const eventId = params.get("event");

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    complete: function(results) {

        allGuests = results.data;

        eventGuests = allGuests.filter(g =>
            g.EventID?.trim().toLowerCase() === eventId?.trim().toLowerCase()
        );

        if (eventGuests[0]?.CoupleName) {
            document.getElementById("coupleName").textContent =
                eventGuests[0].CoupleName;
        }
    }
});

searchInput.addEventListener("input", () => {

    const term = searchInput.value.toLowerCase().trim();

    suggestions.innerHTML = "";
    if (!term) return;

    const matches = eventGuests
        .filter(g => g.GuestName?.toLowerCase().includes(term))
        .slice(0, 8);

    matches.forEach(g => {

        const div = document.createElement("div");
        div.className = "suggestion";
        div.textContent = g.GuestName;

        div.onclick = () => showGuest(g);

        suggestions.appendChild(div);
    });
});

function showGuest(guest) {

    suggestions.innerHTML = "";
    searchInput.value = guest.GuestName;

    seatCircle.classList.add("is-revealed");

    tableNumber.textContent = guest.TableNumber;
    guestName.textContent = guest.GuestName;
}