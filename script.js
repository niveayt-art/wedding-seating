const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkU-7EO0VStM7Fikh4UFyWUn-vGZhAV3qS5vDsLgrDl1BJqvRFw7Q9jrU5OGWeyul4Eo5iMpg-bDYn/pub?output=csv";

let allGuests = [];
let eventGuests = [];

const searchInput  = document.getElementById("guestSearch");
const suggestions  = document.getElementById("suggestions");
const result       = document.getElementById("result");
const seatCircle   = document.getElementById("seatCircle");
const seatNumber   = document.getElementById("seatNumber");
const seatGuest    = document.getElementById("seatGuest");
const confettiRoot = document.getElementById("confetti");

const params  = new URLSearchParams(window.location.search);
const eventId = params.get("event");

Papa.parse(CSV_URL, {
  download: true,
  header: true,
  complete: function (results) {
    allGuests = results.data;

    eventGuests = allGuests.filter(
      (g) =>
        g.EventID?.trim().toLowerCase() ===
        eventId?.trim().toLowerCase()
    );

    const first = eventGuests[0];
    if (first?.CoupleName) {
      document.getElementById("coupleName").textContent = first.CoupleName;
    }
  },
});

searchInput.addEventListener("input", () => {
  // Clearing the field returns the circle to empty state
  if (!searchInput.value.trim()) {
    resetSeat();
  }
  handleSearch();
});

function handleSearch() {
  const term = searchInput.value.trim().toLowerCase();
  suggestions.innerHTML = "";

  if (!term) return;

  const matches = eventGuests
    .filter((g) => g.GuestName?.toLowerCase().includes(term))
    .slice(0, 8);

  matches.forEach((g) => {
    const div = document.createElement("div");
    div.className = "suggestion";
    div.textContent = g.GuestName;
    div.setAttribute("data-testid", "suggestion-item");
    div.onclick = () => showGuest(g);
    suggestions.appendChild(div);
  });
}

function showGuest(guest) {
  suggestions.innerHTML = "";
  searchInput.value = guest.GuestName;

  // Populate the single reveal circle
  seatNumber.textContent = guest.TableNumber ?? "";
  seatGuest.textContent  = guest.GuestName ?? "";

  seatCircle.classList.remove("is-empty");
  // Re-trigger pop animation
  seatCircle.classList.remove("is-revealed");
  // Force reflow so animation restarts even on repeat selection
  void seatCircle.offsetWidth;
  seatCircle.classList.add("is-revealed");

  // Screen-reader announcement
  result.textContent = `Welcome ${guest.GuestName}. Your table is ${guest.TableNumber}.`;

  // Smooth scroll the seat into view (helps on small screens)
  seatCircle.scrollIntoView({ behavior: "smooth", block: "center" });

  burstConfetti();
}

function resetSeat() {
  seatCircle.classList.remove("is-revealed");
  seatCircle.classList.add("is-empty");
  seatNumber.textContent = "";
  seatGuest.textContent = "";
  result.textContent = "";
}

/* ---------- helpers ---------- */
function burstConfetti() {
  if (!confettiRoot) return;
  const colors = ["#D93B3B", "#FF5E78", "#E63971", "#F2B441", "#FF8A3D", "#FFFFFF"];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti__piece";

    const left  = Math.random() * 100;
    const dx    = (Math.random() - 0.5) * 240;
    const delay = Math.random() * 0.3;
    const dur   = 1.6 + Math.random() * 1.4;
    const size  = 6 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = `${left}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.4}px`;
    piece.style.background = color;
    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.animation = `confettiFall ${dur}s cubic-bezier(.2,.7,.3,1) ${delay}s forwards`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiRoot.appendChild(piece);
    setTimeout(() => piece.remove(), (dur + delay) * 1000 + 100);
  }
}