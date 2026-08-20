```javascript
const SUPABASE_URL = "https://hvgllvlwrmzqjxomyoye.supabase.co";
const SUPABASE_KEY = "sb_publishable_qhJI1hmFUq9BQKMQjCknWg_QPHLKAxn";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let clients = [];
let services = [];
let factures = [];
let paiements = [];


/* =========================
   INITIALISATION
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    document
        .getElementById("loginForm")
        .addEventListener("submit", login);

    document
        .getElementById("logout")
        .addEventListener("click", logout);

    await checkSession();
});


/* =========================
   AUTHENTIFICATION
========================= */

async function login(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("loginMessage");

    message.style.color = "#2563eb";
    message.textContent = "Connexion en cours...";

    const { data, error } =
        await db.auth.signInWithPassword({
            email,
            password
        });

    if (error) {

        console.error(error);

        message.style.color = "#dc2626";
        message.textContent =
            "Erreur : " + error.message;

        return;
    }

    if (!data.session) {

        message.style.color = "#dc2626";
        message.textContent =
            "Connexion impossible.";

        return;
    }

    message.style.color = "#16a34a";
    message.textContent = "Connexion réussie.";

    showApplication();
}


async function checkSession() {

    const { data, error } =
        await db.auth.getSession();

    if (error) {

        console.error(error);
        showLogin();
        return;
    }

    if (data.session) {
        showApplication();
    } else {
        showLogin();
    }
}


async function logout() {

    await db.auth.signOut();

    showLogin();
}


function showLogin() {

    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("application").style.display = "none";
}


async function showApplication() {

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("application").style.display = "block";

    await loadDashboard();
}


/* =========================
   NAVIGATION
========================= */

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => page.classList.remove("active"));

    const page =
        document.getElementById(pageName);

    if (!page) return;

    page.classList.add("active");

    if (pageName === "dashboard") {
        loadDashboard();
    }

    if (pageName === "clients") {
        loadClients();
    }

    if (pageName === "services") {
        loadServices();
    }

    if (pageName === "factures") {
        loadFactures();
    }

    if (pageName === "paiements") {
        loadPaiements();
    }
}


/* =========================
   TABLEAU DE BORD
========================= */

async function loadDashboard() {

    await Promise.all([
        loadClients(),
        loadServices(),
        loadFactures(),
        loadPaiements()
    ]);
}


/* =========================
   CLIENTS
========================= */

async function loadClients() {

    const { data, error } =
        await db
            .from("clients")
            .select("*")
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error("Clients :", error);

        showError(
            "clientsList",
            error.message
        );

        return;
    }

    clients = data || [];

    document.getElementById("clientCount").textContent =
        clients.length;

    renderClients(clients);
}


function renderClients(list) {

    const container =
        document.getElementById("clientsList");

    container.innerHTML = "";

    if (!list.length) {

        container.innerHTML =
            `<div class="empty">
                Aucun client enregistré.
            </div>`;

        return;
    }

    list.forEach(client => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <h3>${escapeHtml(client.nom)}</h3>

            <p>
                <strong>Téléphone :</strong>
                ${escapeHtml(client.telephone || "Non renseigné")}
            </p>

            <p>
                <strong>E-mail :</strong>
                ${escapeHtml(client.email || "Non renseigné")}
            </p>

            <p>
                <strong>Adresse :</strong>
                ${escapeHtml(client.adresse || "Non renseignée")}
            </p>

            <p>
                <strong>Entreprise :</strong>
                ${escapeHtml(client.entreprise || "Non renseignée")}
            </p>

            <div class="actions">

                <button
                    class="edit"
                    onclick="editClient(${client.id})"
                >
                    Modifier
                </button>

                <button
                    class="delete"
                    onclick="deleteClient(${client.id})"
                >
                    Supprimer
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}


function searchClients() {

    const search =
        document
            .getElementById("searchClient")
            .value
            .toLowerCase()
            .trim();

    if (!search) {

        renderClients(clients);
        return;
    }

    const result =
        clients.filter(client => {

            return (
                String(client.nom || "")
                    .toLowerCase()
                    .includes(search) ||

                String(client.telephone || "")
                    .toLowerCase()
                    .includes(search) ||

                String(client.email || "")
                    .toLowerCase()
                    .includes(search) ||

                String(client.adresse || "")
                    .toLowerCase()
                    .includes(search) ||

                String(client.entreprise || "")
                    .toLowerCase()
                    .includes(search)
            );
        });

    renderClients(result);
}


function openClientForm() {

    document.getElementById("clientModalTitle").textContent =
        "Ajouter un client";

    document.getElementById("clientId").value = "";
    document.getElementById("clientNom").value = "";
    document.getElementById("clientTelephone").value = "";
    document.getElementById("clientEmail").value = "";
    document.getElementById("clientAdresse").value = "";
    document.getElementById("clientEntreprise").value = "";
    document.getElementById("clientMessage").textContent = "";

    openModal("clientModal");
}


function editClient(id) {

    const client =
        clients.find(item =>
            Number(item.id) === Number(id)
        );

    if (!client) {

        alert("Client introuvable.");
        return;
    }

    document.getElementById("clientModalTitle").textContent =
        "Modifier un client";

    document.getElementById("clientId").value =
        client.id;

    document.getElementById("clientNom").value =
        client.nom || "";

    document.getElementById("clientTelephone").value =
        client.telephone || "";

    document.getElementById("clientEmail").value =
        client.email || "";

    document.getElementById("clientAdresse").value =
        client.adresse || "";

    document.getElementById("clientEntreprise").value =
        client.entreprise || "";

    document.getElementById("clientMessage").textContent = "";

    openModal("clientModal");
}


async function saveClient() {

    const id =
        document.getElementById("clientId").value;

    const data = {

        nom:
            document.getElementById("clientNom")
                .value.trim(),

        telephone:
            document.getElementById("clientTelephone")
                .value.trim(),

        email:
            document.getElementById("clientEmail")
                .value.trim(),

        adresse:
            document.getElementById("clientAdresse")
                .value.trim(),

        entreprise:
            document.getElementById("clientEntreprise")
                .value.trim()
    };

    const message =
        document.getElementById("clientMessage");

    if (!data.nom) {

        message.style.color = "#dc2626";
        message.textContent =
            "Le nom est obligatoire.";

        return;
    }

    message.style.color = "#2563eb";
    message.textContent =
        "Enregistrement...";

    let result;

    if (id) {

        result =
            await db
                .from("clients")
                .update(data)
                .eq("id", id);

    } else {

        result =
            await db
                .from("clients")
                .insert(data);
    }

    if (result.error) {

        console.error(result.error);

        message.style.color = "#dc2626";
        message.textContent =
            "Erreur : " +
            result.error.message;

        return;
    }

    closeModal("clientModal");

    await loadClients();
}


async function deleteClient(id) {

    if (!confirm(
        "Voulez-vous vraiment supprimer ce client ?"
    )) {
        return;
    }

    const { error } =
        await db
            .from("clients")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(error);

        alert(
            "Impossible de supprimer le client :\n\n" +
            error.message
        );

        return;
    }

    await loadClients();
}


/* =========================
   SERVICES
========================= */

async function loadServices() {

    const { data, error } =
        await db
            .from("services")
            .select("*")
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error("Services :", error);

        showError(
            "servicesList",
            error.message
        );

        return;
    }

    services = data || [];

    document.getElementById("serviceCount").textContent =
        services.length;

    renderServices();
}


function renderServices() {

    const container =
        document.getElementById("servicesList");

    container.innerHTML = "";

    if (!services.length) {

        container.innerHTML =
            `<div class="empty">
                Aucun service enregistré.
            </div>`;

        return;
    }

    services.forEach(service => {

        const card =
            document.createElement("div");

        card.className = "card";

        const nom =
            service.nom ||
            service.name ||
            service.libelle ||
            "Service";

        const description =
            service.description ||
            service.details ||
            "";

        const prix =
            service.prix ??
            service.price ??
            "";

        card.innerHTML = `

            <h3>${escapeHtml(nom)}</h3>

            <p>
                ${escapeHtml(description)}
            </p>

            ${
                prix !== ""
                    ? `<p>
                        <strong>Prix :</strong>
                        ${escapeHtml(prix)}
                       </p>`
                    : ""
            }

        `;

        container.appendChild(card);
    });
}


function openServiceForm() {

    document.getElementById("serviceNom").value = "";
    document.getElementById("serviceDescription").value = "";
    document.getElementById("servicePrix").value = "";
    document.getElementById("serviceMessage").textContent = "";

    openModal("serviceModal");
}


async function saveService() {

    const nom =
        document.getElementById("serviceNom")
            .value.trim();

    const description =
        document.getElementById("serviceDescription")
            .value.trim();

    const prix =
        Number(
            document.getElementById("servicePrix")
                .value || 0
        );

    const message =
        document.getElementById("serviceMessage");

    if (!nom) {

        message.style.color = "#dc2626";
        message.textContent =
            "Le nom du service est obligatoire.";

        return;
    }

    const { error } =
        await db
            .from("services")
            .insert({
                nom: nom,
                description: description,
                prix: prix
            });

    if (error) {

        console.error(error);

        message.style.color = "#dc2626";
        message.textContent =
            "Erreur : " +
            error.message;

        return;
    }

    closeModal("serviceModal");

    await loadServices();
}


/* =========================
   FACTURES
========================= */

async function loadFactures() {

    const { data, error } =
        await db
            .from("factures")
            .select(`
                *,
                clients(nom)
            `)
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error("Factures :", error);

        showError(
            "facturesList",
            error.message
        );

        return;
    }

    factures = data || [];

    document.getElementById("factureCount").textContent =
        factures.length;

    renderFactures();
}


function renderFactures() {

    const container =
        document.getElementById("facturesList");

    container.innerHTML = "";

    if (!factures.length) {

        container.innerHTML =
            `<div class="empty">
                Aucune facture enregistrée.
            </div>`;

        return;
    }

    factures.forEach(facture => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <h3>
                Facture ${escapeHtml(facture.numero)}
            </h3>

            <p>
                <strong>Client :</strong>
                ${escapeHtml(
                    facture.clients?.nom ||
                    "Non renseigné"
                )}
            </p>

            <p>
                <strong>Montant :</strong>
                ${escapeHtml(facture.montant)}
            </p>

            <p>
                <strong>Statut :</strong>
                ${escapeHtml(facture.statut)}
            </p>

            <p>
                <strong>Date :</strong>
                ${escapeHtml(facture.date_facture)}
            </p>

            <p>
                <strong>Échéance :</strong>
                ${escapeHtml(facture.date_echeance)}
            </p>

        `;

        container.appendChild(card);
    });
}


function openFactureForm() {

    fillClientSelect("factureClient");

    document.getElementById("factureNumero").value = "";
    document.getElementById("factureMontant").value = "";

    document.getElementById("factureDate").value =
        new Date()
            .toISOString()
            .slice(0, 10);

    document.getElementById("factureEcheance").value = "";

    document.getElementById("factureMessage").textContent = "";

    openModal("factureModal");
}


async function saveFacture() {

    const clientId =
        document.getElementById("factureClient").value;

    const numero =
        document.getElementById("factureNumero")
            .value.trim();

    const montant =
        Number(
            document.getElementById("factureMontant")
                .value || 0
        );

    const statut =
        document.getElementById("factureStatut").value;

    const dateFacture =
        document.getElementById("factureDate").value;

    const dateEcheance =
        document.getElementById("factureEcheance").value;

    const message =
        document.getElementById("factureMessage");

    if (!clientId || !numero) {

        message.style.color = "#dc2626";
        message.textContent =
            "Client et numéro de facture obligatoires.";

        return;
    }

    const { error } =
        await db
            .from("factures")
            .insert({
                client_id: Number(clientId),
                numero: numero,
                montant: montant,
                statut: statut,
                date_facture: dateFacture || null,
                date_echeance: dateEcheance || null
            });

    if (error) {

        console.error(error);

        message.style.color = "#dc2626";
        message.textContent =
            "Erreur : " +
            error.message;

        return;
    }

    closeModal("factureModal");

    await loadFactures();
}


/* =========================
   PAIEMENTS
========================= */

async function loadPaiements() {

    const { data, error } =
        await db
            .from("paiements")
            .select(`
                *,
                clients(nom),
                factures(numero)
            `)
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error("Paiements :", error);

        showError(
            "paiementsList",
            error.message
        );

        return;
    }

    paiements = data || [];

    document.getElementById("paiementCount").textContent =
        paiements.length;

    renderPaiements();
}


function renderPaiements() {

    const container =
        document.getElementById("paiementsList");

    container.innerHTML = "";

    if (!paiements.length) {

        container.innerHTML =
            `<div class="empty">
                Aucun paiement enregistré.
            </div>`;

        return;
    }

    paiements.forEach(paiement => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <h3>
                Paiement
            </h3>

            <p>
                <strong>Client :</strong>
                ${escapeHtml(
                    paiement.clients?.nom ||
                    "Non renseigné"
                )}
            </p>

            <p>
                <strong>Facture :</strong>
                ${escapeHtml(
                    paiement.factures?.numero ||
                    "Non renseignée"
                )}
            </p>

            <p>
                <strong>Montant :</strong>
                ${escapeHtml(paiement.montant)}
            </p>

            <p>
                <strong>Date :</strong>
                ${escapeHtml(paiement.date_paiement)}
            </p>

            <p>
                <strong>Mode :</strong>
                ${escapeHtml(paiement.mode_paiement)}
            </p>

            <p>
                <strong>Référence :</strong>
                ${escapeHtml(paiement.reference)}
            </p>

        `;

        container.appendChild(card);
    });
}


function openPaiementForm() {

    fillClientSelect("paiementClient");
    fillFactureSelect();

    document.getElementById("paiementMontant").value = "";

    document.getElementById("paiementDate").value =
        new Date()
            .toISOString()
            .slice(0, 10);

    document.getElementById("paiementReference").value = "";
    document.getElementById("paiementMessage").textContent = "";

    openModal("paiementModal");
}


async function savePaiement() {

    const factureId =
        document.getElementById("paiementFacture").value;

    const clientId =
        document.getElementById("paiementClient").value;

    const montant =
        Number(
            document.getElementById("paiementMontant")
                .value || 0
        );

    const datePaiement =
        document.getElementById("paiementDate").value;

    const mode =
        document.getElementById("paiementMode").value;

    const reference =
        document.getElementById("paiementReference")
            .value.trim();

    const message =
        document.getElementById("paiementMessage");

    if (!factureId || !clientId) {

        message.style.color = "#dc2626";
        message.textContent =
            "Le client et la facture sont obligatoires.";

        return;
    }

    const { error } =
        await db
            .from("paiements")
            .insert({
                facture_id: Number(factureId),
                client_id: Number(clientId),
                montant: montant,
                date_paiement: datePaiement || null,
                mode_paiement: mode,
                reference: reference
            });

    if (error) {

        console.error(error);

        message.style.color = "#dc2626";
        message.textContent =
            "Erreur : " +
            error.message;

        return;
    }

    closeModal("paiementModal");

    await loadPaiements();
}


/* =========================
   LISTES
========================= */

function fillClientSelect(id) {

    const select =
        document.getElementById(id);

    select.innerHTML = "";

    clients.forEach(client => {

        const option =
            document.createElement("option");

        option.value = client.id;
        option.textContent = client.nom;

        select.appendChild(option);
    });

    if (!clients.length) {

        const option =
            document.createElement("option");

        option.value = "";
        option.textContent = "Aucun client";

        select.appendChild(option);
    }
}


function fillFactureSelect() {

    const select =
        document.getElementById("paiementFacture");

    select.innerHTML = "";

    factures.forEach(facture => {

        const option =
            document.createElement("option");

        option.value = facture.id;

        option.textContent =
            `${facture.numero} - ${facture.montant}`;

        select.appendChild(option);
    });

    if (!factures.length) {

        const option =
            document.createElement("option");

        option.value = "";
        option.textContent = "Aucune facture";

        select.appendChild(option);
    }
}


/* =========================
   MODALES
========================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {
        modal.classList.add("active");
    }
}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }
}


/* =========================
   ERREURS
========================= */

function showError(id, message) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.innerHTML =
        `<div class="empty">
            Erreur : ${escapeHtml(message)}
        </div>`;
}


/* =========================
   SECURITE AFFICHAGE
========================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```
