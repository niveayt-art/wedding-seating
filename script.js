const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSkU-7EO0VStM7Fikh4UFyWUn-vGZhAV3qS5vDsLgrDl1BJqvRFw7Q9jrU5OGWeyul4Eo5iMpg-bDYn/pub?gid=0&single=true&output=csv";

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

        eventGuests = allGuests.filter(
            guest =>
            guest.EventID === eventId
        );

        if (eventGuests.length > 0) {

            document.getElementById("coupleName").textContent =
                eventGuests[0].CoupleName || "Welcome To Our Wedding";
        }
    }
});

searchInput.addEventListener("input", handleSearch);

function handleSearch() {

    const term = searchInput.value
        .toLowerCase()
        .trim();

    suggestions.innerHTML = "";

    if (!term) {
        return;
    }

    const matches = eventGuests.filter(guest =>
        guest.GuestName
            .toLowerCase()
            .includes(term)
    );

    matches.slice(0, 10).forEach(guest => {

        const div = document.createElement("div");

        div.className = "suggestion";

        div.textContent = guest.GuestName;

        div.onclick = () => {
            showGuest(guest);
        };

        suggestions.appendChild(div);
    });
}

function showGuest(guest) {

    suggestions.innerHTML = "";

    searchInput.value = guest.GuestName;

    result.innerHTML = `
        Welcome <strong>${guest.GuestName}</strong><br><br>
        You are seated at<br>
        <span class="highlight-text">
            TABLE ${guest.TableNumber}
        </span>
    `;

    document
        .querySelectorAll(".table")
        .forEach(table =>
            table.classList.remove("selected")
        );

    const selectedTable =
        document.querySelector(
            `[data-table="${guest.TableNumber}"]`
        );

    if (selectedTable) {

        selectedTable.classList.add("selected");

        selectedTable.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}
