const STORAGE_KEY = "tournament_hub_tournaments";

let tournaments = [];

let editingId = null;

let deleteId = null;


/* ================================
   ELEMENTS
================================ */

const addButton =
    document.getElementById("addButton");

const formOverlay =
    document.getElementById("formOverlay");

const closeForm =
    document.getElementById("closeForm");

const tournamentForm =
    document.getElementById("tournamentForm");

const formTitle =
    document.getElementById("formTitle");

const nameInput =
    document.getElementById("nameInput");

const serverInput =
    document.getElementById("serverInput");

const formationInput =
    document.getElementById("formationInput");

const titleInput =
    document.getElementById("titleInput");

const teammates =
    document.getElementById("teammates");

const tournamentList =
    document.getElementById("tournamentList");

const tournamentCounter =
    document.getElementById("tournamentCounter");

const confirmOverlay =
    document.getElementById("confirmOverlay");

const confirmMessage =
    document.getElementById("confirmMessage");

const cancelConfirm =
    document.getElementById("cancelConfirm");

const confirmDelete =
    document.getElementById("confirmDelete");


/* ================================
   LOAD
================================ */

function loadTournaments() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (saved) {

            tournaments =
                JSON.parse(saved);

        }


        if (!Array.isArray(tournaments)) {

            tournaments = [];

        }

    }

    catch {

        tournaments = [];

    }

}


/* ================================
   SAVE
================================ */

function saveTournaments() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(tournaments)

    );

}


/* ================================
   ADD BUTTON
================================ */

addButton.onclick =
function () {

    editingId = null;

    formTitle.textContent =
        "Add Tournament";

    tournamentForm.reset();

    teammates.innerHTML = "";

    formOverlay.classList.remove(
        "hidden"
    );

};


/* ================================
   CLOSE FORM
================================ */

closeForm.onclick =
function () {

    formOverlay.classList.add(
        "hidden"
    );

};


/* ================================
   FORMATION
================================ */

formationInput.onchange =
function () {

    createTeammateInputs(
        formationInput.value,
        []
    );

};


function createTeammateInputs(
    formation,
    existingNames
) {

    teammates.innerHTML = "";


    if (!formation) {

        return;

    }


    const playerCount =
        parseInt(
            formation.charAt(0)
        );


    const teammateCount =
        playerCount - 1;


    if (teammateCount <= 0) {

        return;

    }


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "teammate-title";


    heading.textContent =
        "Teammates";


    teammates.appendChild(
        heading
    );


    for (
        let i = 0;
        i < teammateCount;
        i++
    ) {

        const input =
            document.createElement(
                "input"
            );


        input.type = "text";

        input.className =
            "teammate-input";

        input.placeholder =
            "Teammate " + (i + 1);

        input.required = true;

        input.value =
            existingNames[i] || "";


        teammates.appendChild(
            input
        );

    }

}


/* ================================
   SAVE TOURNAMENT
================================ */

tournamentForm.onsubmit =
function (event) {

    event.preventDefault();


    const teammateInputs =
        document.querySelectorAll(
            ".teammate-input"
        );


    const teammateNames = [];


    teammateInputs.forEach(
        function (input) {

            teammateNames.push(
                input.value.trim()
            );

        }
    );


    if (editingId !== null) {

        const tournament =
            tournaments.find(
                function (item) {

                    return item.id === editingId;

                }
            );


        if (tournament) {

            tournament.name =
                nameInput.value.trim();

            tournament.server =
                serverInput.value.trim();

            tournament.formation =
                formationInput.value;

            tournament.title =
                titleInput.value.trim();

            tournament.teammates =
                teammateNames;

        }

    }

    else {

        tournaments.push({

            id: Date.now(),

            name:
                nameInput.value.trim(),

            server:
                serverInput.value.trim(),

            formation:
                formationInput.value,

            title:
                titleInput.value.trim(),

            teammates:
                teammateNames

        });

    }


    saveTournaments();

    renderTournaments();


    formOverlay.classList.add(
        "hidden"
    );

};


/* ================================
   RENDER
================================ */

function renderTournaments() {

    tournamentList.innerHTML = "";


    tournamentCounter.textContent =
        tournaments.length +
        (
            tournaments.length === 1
                ? " tournament"
                : " tournaments"
        );


    if (tournaments.length === 0) {

        tournamentList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    +
                </div>

                <h3>
                    No tournaments yet
                </h3>

                <p>
                    Add your first tournament.
                </p>

                <button
                    onclick="openAddTournament()"
                >
                    Add Tournament
                </button>

            </div>

        `;

        return;

    }


    tournaments.forEach(
        function (tournament) {

            const card =
                createTournamentCard(
                    tournament
                );


            tournamentList.appendChild(
                card
            );

        }
    );

}


/* ================================
   CREATE CARD
================================ */

function createTournamentCard(
    tournament
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card";


    let teammateHTML = "";


    if (
        !tournament.teammates ||
        tournament.teammates.length === 0
    ) {

        teammateHTML =
            `<span class="info-value">
                Solo
            </span>`;

    }

    else {

        teammateHTML =
            `<div class="tags">`;


        tournament.teammates.forEach(
            function (name) {

                teammateHTML +=
                    `<span class="tag">
                        ${escapeHTML(name)}
                    </span>`;

            }
        );


        teammateHTML +=
            `</div>`;

    }


    card.innerHTML = `

        <div class="card-top">

            <div>

                <div class="card-label">
                    TOURNAMENT
                </div>

                <h3>
                    ${escapeHTML(
                        tournament.name
                    )}
                </h3>

            </div>


            <div class="formation">
                ${escapeHTML(
                    tournament.formation
                )}
            </div>

        </div>


        <div class="info-grid">


            <div class="info">

                <span class="info-label">
                    Server
                </span>

                <span class="info-value">
                    ${escapeHTML(
                        tournament.server
                    )}
                </span>

            </div>


            <div class="info">

                <span class="info-label">
                    Title
                </span>

                <span class="info-value">
                    ${escapeHTML(
                        tournament.title
                    )}
                </span>

            </div>


            <div class="info">

                <span class="info-label">
                    Teammates
                </span>

                ${teammateHTML}

            </div>


        </div>


        <div class="card-actions">

            <button
                class="card-btn"
                onclick="editTournament(${tournament.id})"
            >
                Edit
            </button>

            <button
                class="card-btn delete"
                onclick="askDelete(${tournament.id})"
            >
                Delete
            </button>

        </div>

    `;


    return card;

}


/* ================================
   EDIT
================================ */

function editTournament(id) {

    const tournament =
        tournaments.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!tournament) {

        return;

    }


    editingId = id;


    formTitle.textContent =
        "Edit Tournament";


    nameInput.value =
        tournament.name;

    serverInput.value =
        tournament.server;

    formationInput.value =
        tournament.formation;

    titleInput.value =
        tournament.title;


    createTeammateInputs(
        tournament.formation,
        tournament.teammates || []
    );


    formOverlay.classList.remove(
        "hidden"
    );

}


/* ================================
   DELETE
================================ */

function askDelete(id) {

    const tournament =
        tournaments.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!tournament) {

        return;

    }


    deleteId = id;


    confirmMessage.textContent =
        `"${tournament.name}" will be permanently deleted. This cannot be undone.`;


    confirmOverlay.classList.remove(
        "hidden"
    );

}


/* ================================
   CONFIRM DELETE
================================ */

confirmDelete.onclick =
function () {

    if (deleteId === null) {

        return;

    }


    tournaments =
        tournaments.filter(
            function (item) {

                return item.id !== deleteId;

            }
        );


    saveTournaments();

    renderTournaments();


    deleteId = null;


    confirmOverlay.classList.add(
        "hidden"
    );

};


/* ================================
   CANCEL DELETE
================================ */

cancelConfirm.onclick =
function () {

    deleteId = null;

    confirmOverlay.classList.add(
        "hidden"
    );

};


/* ================================
   EMPTY STATE ADD
================================ */

function openAddTournament() {

    addButton.click();

}


/* ================================
   ESCAPE HTML
================================ */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ================================
   START
================================ */

loadTournaments();

renderTournaments();

/* ================================
   APP / OFFLINE SUPPORT
================================ */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker.register(
                "./sw.js"
            ).then(function () {

                console.log(
                    "Tournament Hub app support enabled."
                );

            }).catch(function (error) {

                console.log(
                    "Service worker error:",
                    error
                );

            });

        }
    );

}