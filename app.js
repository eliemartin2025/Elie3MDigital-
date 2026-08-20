```javascript
const SUPABASE_URL =
    "https://hvgllvlwrmzqjxomyoye.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qhJI1hmFUq9BQKMQjCknWg_QPHLKAxn";


/* =========================
   SUPABASE
========================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


let clients = [];
let services = [];
let factures = [];
let paiements = [];


/* =========================
   DEMARRAGE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


async function init(){

    console.log(
        "Application démarrée"
    );

    setupEvents();

    await checkSession();
}


/* =========================
   EVENEMENTS
========================= */

function setupEvents(){

    document
        .getElementById("loginForm")
        .addEventListener(
            "submit",
            login
        );


    document
        .getElementById("logoutButton")
        .addEventListener(
            "click",
            logout
        );


    document
        .querySelectorAll(
            "nav button[data-page]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showPage(
                        button.dataset.page
                    );

                }
            );

        });


    document
        .getElementById(
            "clientSearch"
        )
        .addEventListener(
            "input",
            searchClients
        );


    document
        .getElementById(
            "addClientButton"
        )
        .addEventListener(
            "click",
            openClientForm
        );


    document
        .getElementById(
            "saveClientButton"
        )
        .addEventListener(
            "click",
            saveClient
        );


    document
        .getElementById(
            "addServiceButton"
        )
        .addEventListener(
            "click",
            openServiceForm
        );


    document
        .getElementById(
            "saveServiceButton"
        )
        .addEventListener(
            "click",
            saveService
        );


    document
        .getElementById(
            "addFactureButton"
        )
        .addEventListener(
            "click",
            openFactureForm
        );


    document
        .getElementById(
            "saveFactureButton"
        )
        .addEventListener(
            "click",
            saveFacture
        );


    document
        .getElementById(
            "addPaiementButton"
        )
        .addEventListener(
            "click",
            openPaiementForm
        );


    document
        .getElementById(
            "savePaiementButton"
        )
        .addEventListener(
            "click",
            savePaiement
        );


    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.close
                    );

                }
            );

        });

}


/* =========================
   AUTH
========================= */

async function login(event){

    event.preventDefault();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    const message =
        document
            .getElementById(
                "loginMessage"
            );


    message.style.color =
        "#2563eb";

    message.textContent =
        "Connexion en cours...";


    const result =
        await supabaseClient.auth
            .signInWithPassword({

                email:email,
                password:password

            });


    if(result.error){

        console.error(
            result.error
        );

        message.style.color =
            "#dc2626";

        message.textContent =
            "Erreur : " +
            result.error.message;

        return;
    }


    message.style.color =
        "#16a34a";

    message.textContent =
        "Connexion réussie";


    showApplication();

}


async function checkSession(){

    const result =
        await supabaseClient.auth
            .getSession();


    if(result.error){

        console.error(
            result.error
        );

        showLogin();

        return;
    }


    if(result.data.session){

        showApplication();

    }else{

        showLogin();

    }

}


function showLogin(){

    document
        .getElementById(
            "loginPage"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "app"
        )
        .classList.add(
            "hidden"
        );

}


async function showApplication(){

    document
        .getElementById(
            "loginPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "app"
        )
        .classList.remove(
            "hidden"
        );


    await loadAll();

}


async function logout(){

    await supabaseClient.auth.signOut();

    showLogin();

}


/* =========================
   NAVIGATION
========================= */

function showPage(name){

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    const page =
        document.getElementById(
            name
        );


    if(!page){
        return;
    }


    page.classList.add(
        "active"
    );


    if(name === "clients"){
        loadClients();
    }

    if(name === "services"){
        loadServices();
    }

    if(name === "factures"){
        loadFactures();
    }

    if(name === "paiements"){
        loadPaiements();
    }

}


/* =========================
   CHARGEMENT GENERAL
========================= */

async function loadAll(){

    await loadClients();

    await loadServices();

    await loadFactures();

    await loadPaiements();

}


/* =========================
   CLIENTS
========================= */

async function loadClients(){

    const result =
        await supabaseClient
            .from("clients")
            .select(
                "id,nom,telephone,email,adresse,entreprise,created_at"
            )
            .order(
                "created_at",
                {
                    ascending:false
                }
            );


    if(result.error){

        console.error(
            "Clients:",
            result.error
        );

        showError(
            "clientsList",
            result.error.message
        );

        return;
    }


    clients =
        result.data || [];


    document
        .getElementById(
            "clientCount"
        )
        .textContent =
        clients.length;


    renderClients(
        clients
    );

}


function renderClients(list){

    const container =
        document.getElementById(
            "clientsList"
        );


    container.innerHTML = "";


    if(!list.length){

        container.innerHTML =
            '<div class="empty">' +
            'Aucun client enregistré.' +
            '</div>';

        return;
    }


    list.forEach(client => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";


        card.innerHTML = `

            <h3>
                ${escapeHtml(client.nom)}
            </h3>

            <p>
                <strong>Téléphone :</strong>
                ${escapeHtml(client.telephone)}
            </p>

            <p>
                <strong>E-mail :</strong>
                ${escapeHtml(client.email)}
            </p>

            <p>
                <strong>Adresse :</strong>
                ${escapeHtml(client.adresse)}
            </p>

            <p>
                <strong>Entreprise :</strong>
                ${escapeHtml(client.entreprise)}
            </p>

            <div class="actions">

                <button
                    class="edit"
                    data-edit-client="${client.id}"
                >
                    Modifier
                </button>

                <button
                    class="delete"
                    data-delete-client="${client.id}"
                >
                    Supprimer
                </button>

            </div>
        `;


        card
            .querySelector(
                "[data-edit-client]"
            )
            .addEventListener(
                "click",
                () => editClient(client.id)
            );


        card
            .querySelector(
                "[data-delete-client]"
            )
            .addEventListener(
                "click",
                () => deleteClient(client.id)
            );


        container.appendChild(
            card
        );

    });

}


function searchClients(){

    const value =
        document
            .getElementById(
                "clientSearch"
            )
            .value
            .toLowerCase()
            .trim();


    if(!value){

        renderClients(
            clients
        );

        return;
    }


    const result =
        clients.filter(client => {

            return [

                client.nom,

                client.telephone,

                client.email,

                client.adresse,

                client.entreprise

            ]
            .join(" ")
            .toLowerCase()
            .includes(value);

        });


    renderClients(
        result
    );

}


function openClientForm(){

    document
        .getElementById(
            "clientModalTitle"
        )
        .textContent =
        "Ajouter un client";


    document
        .getElementById(
            "clientId"
        )
        .value = "";


    document
        .getElementById(
            "clientNom"
        )
        .value = "";


    document
        .getElementById(
            "clientTelephone"
        )
        .value = "";


    document
        .getElementById(
            "clientEmail"
        )
        .value = "";


    document
        .getElementById(
            "clientAdresse"
        )
        .value = "";


    document
        .getElementById(
            "clientEntreprise"
        )
        .value = "";


    document
        .getElementById(
            "clientFormMessage"
        )
        .textContent = "";


    openModal(
        "clientModal"
    );

}


function editClient(id){

    const client =
        clients.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if(!client){

        alert(
            "Client introuvable."
        );

        return;
    }


    document
        .getElementById(
            "clientModalTitle"
        )
        .textContent =
        "Modifier un client";


    document
        .getElementById(
            "clientId"
        )
        .value =
        client.id;


    document
        .getElementById(
            "clientNom"
        )
        .value =
        client.nom || "";


    document
        .getElementById(
            "clientTelephone"
        )
        .value =
        client.telephone || "";


    document
        .getElementById(
            "clientEmail"
        )
        .value =
        client.email || "";


    document
        .getElementById(
            "clientAdresse"
        )
        .value =
        client.adresse || "";


    document
        .getElementById(
            "clientEntreprise"
        )
        .value =
        client.entreprise || "";


    openModal(
        "clientModal"
    );

}


async function saveClient(){

    const id =
        document
            .getElementById(
                "clientId"
            )
            .value;


    const data = {

        nom:
            document
                .getElementById(
                    "clientNom"
                )
                .value
                .trim(),

        telephone:
            document
                .getElementById(
                    "clientTelephone"
                )
                .value
                .trim(),

        email:
            document
                .getElementById(
                    "clientEmail"
                )
                .value
                .trim(),

        adresse:
            document
                .getElementById(
                    "clientAdresse"
                )
                .value
                .trim(),

        entreprise:
            document
                .getElementById(
                    "clientEntreprise"
                )
                .value
                .trim()

    };


    const message =
        document
            .getElementById(
                "clientFormMessage"
            );


    message.textContent =
        "Enregistrement...";


    let result;


    if(id){

        result =
            await supabaseClient
                .from("clients")
                .update(data)
                .eq("id",id);

    }else{

        result =
            await supabaseClient
                .from("clients")
                .insert(data);

    }


    if(result.error){

        message.style.color =
            "#dc2626";

        message.textContent =
            "Erreur : " +
            result.error.message;

        return;
    }


    closeModal(
        "clientModal"
    );


    await loadClients();

}


async function deleteClient(id){

    if(
        !confirm(
            "Supprimer ce client ?"
        )
    ){
        return;
    }


    const result =
        await supabaseClient
            .from("clients")
            .delete()
            .eq("id",id);


    if(result.error){

        alert(
            "Erreur : " +
            result.error.message
        );

        return;
    }


    await loadClients();

}


/* =========================
   SERVICES
========================= */

async function loadServices(){

    const result =
        await supabaseClient
            .from("services")
            .select(
                "id,nom,description,prix,created_at"
            )
            .order(
                "created_at",
                {
                    ascending:false
                }
            );


    if(result.error){

        console.error(
            "Services:",
            result.error
        );

        showError(
            "servicesList",
            result.error.message
        );

        return;
    }


    services =
        result.data || [];


    document
        .getElementById(
            "serviceCount"
        )
        .textContent =
        services.length;


    renderServices();

}


function renderServices(){

    const container =
        document.getElementById(
            "servicesList"
        );


    container.innerHTML = "";


    if(!services.length){

        container.innerHTML =
            '<div class="empty">' +
            'Aucun service enregistré.' +
            '</div>';

        return;
    }


    services.forEach(service => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";


        card.innerHTML = `

            <h3>
                ${escapeHtml(service.nom)}
            </h3>

            <p>
                ${escapeHtml(service.description)}
            </p>

            <p>
                <strong>Prix :</strong>
                ${escapeHtml(service.prix)}
            </p>

        `;


        container.appendChild(
            card
        );

    });

}


function openServiceForm(){

    document
        .getElementById(
            "serviceNom"
        )
        .value = "";


    document
        .getElementById(
            "serviceDescription"
        )
        .value = "";


    document
        .getElementById(
            "servicePrix"
        )
        .value = "";


    document
        .getElementById(
            "serviceFormMessage"
        )
        .textContent = "";


    openModal(
        "serviceModal"
    );

}


async function saveService(){

    const nom =
        document
            .getElementById(
                "serviceNom"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "serviceDescription"
            )
            .value
            .trim();


    const prix =
        document
            .getElementById(
                "servicePrix"
            )
            .value;


    const message =
        document
            .getElementById(
                "serviceFormMessage"
            );


    const result =
        await supabaseClient
            .from("services")
            .insert({

                nom:nom,

                description:description,

                prix:
                    prix === ""
                    ? null
                    : Number(prix)

            });


    if(result.error){

        message.style.color =
            "#dc2626";

        message.textContent =
            "Erreur : " +
            result.error.message;

        return;
    }


    closeModal(
        "serviceModal"
    );


    await loadServices();

}


/* =========================
   FACTURES
========================= */

async function loadFactures(){

    const result =
        await supabaseClient
            .from("factures")
            .select(
                "id,client_id,numero,montant,statut,date_facture,date_echeance,created_at"
            )
            .order(
                "created_at",
                {
                    ascending:false
                }
            );


    if(result.error){

        console.error(
            "Factures:",
            result.error
        );

        showError(
            "facturesList",
            result.error.message
        );

        return;
    }


    factures =
        result.data || [];


    document
        .getElementById(
            "factureCount"
        )
        .textContent =
        factures.length;


    renderFactures();

}


function renderFactures(){

    const container =
        document.getElementById(
            "facturesList"
        );


    container.innerHTML = "";


    if(!factures.length){

        container.innerHTML =
            '<div class="empty">' +
            'Aucune facture enregistrée.' +
            '</div>';

        return;
    }


    factures.forEach(facture => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";


        card.innerHTML = `

            <h3>
                Facture
                ${escapeHtml(facture.numero)}
            </h3>

            <p>
                <strong>Client :</strong>
                ${escapeHtml(facture.client_id)}
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


        container.appendChild(
            card
        );

    });

}


function openFactureForm(){

    const select =
        document.getElementById(
            "factureClient"
        );


    select.innerHTML = "";


    clients.forEach(client => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            client.id;


        option.textContent =
            client.nom;


        select.appendChild(
            option
        );

    });


    document
        .getElementById(
            "factureNumero"
        )
        .value = "";


    document
        .getElementById(
            "factureMontant"
        )
        .value = "";


    document
        .getElementById(
            "factureStatut"
        )
        .value =
        "En attente";


    document
        .getElementById(
            "factureDate"
        )
        .value =
        today();


    document
        .getElementById(
            "factureEcheance"
        )
        .value = "";


    document
        .getElementById(
            "factureFormMessage"
        )
        .textContent = "";


    openModal(
        "factureModal"
    );

}


async function saveFacture(){

    const clientId =
        document
            .getElementById(
                "factureClient"
            )
            .value;


    const numero =
        document
            .getElementById(
                "factureNumero"
            )
            .value
            .trim();


    const montant =
        document
            .getElementById(
                "factureMontant"
            )
            .value;


    const statut =
        document
            .getElementById(
                "factureStatut"
            )
            .value;


    const dateFacture =
        document
            .getElementById(
                "factureDate"
            )
            .value;


    const dateEcheance =
        document
            .getElementById(
                "factureEcheance"
            )
            .value;


    const message =
        document
            .getElementById(
                "factureFormMessage"
            );


    const result =
        await supabaseClient
            .from("factures")
            .insert({

                client_id:
                    Number(clientId),

                numero:numero,

                montant:
                    montant === ""
                    ? null
                    : Number(montant),

                statut:statut,

                date_facture:
                    dateFacture || null,

                date_echeance:
                    dateEcheance || null

            });


    if(result.error){

        message.style.color =
            "#dc2626";

        message.textContent =
            "Erreur : " +
            result.error.message;

        return;
    }


    closeModal(
        "factureModal"
    );


    await loadFactures();

}


/* =========================
   PAIEMENTS
========================= */

async function loadPaiements(){

    const result =
        await supabaseClient
            .from("paiements")
            .select(
                "id,facture_id,client_id,montant,date_paiement,reference,created_at"
            )
            .order(
                "created_at",
                {
                    ascending:false
                }
            );


    if(result.error){

        console.error(
            "Paiements:",
            result.error
        );

        showError(
            "paiementsList",
            result.error.message
        );

        return;
    }


    paiements =
        result.data || [];


    document
        .getElementById(
            "paiementCount"
        )
        .textContent =
        paiements.length;


    renderPaiements();

}


function renderPaiements(){

    const container =
        document.getElementById(
            "paiementsList"
        );


    container.innerHTML = "";


    if(!paiements.length){

        container.innerHTML =
            '<div class="empty">' +
            'Aucun paiement enregistré.' +
            '</div>';

        return;
    }


    paiements.forEach(paiement => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";


        card.innerHTML = `

            <h3>
                Paiement
            </h3>

            <p>
                <strong>Facture :</strong>
                ${escapeHtml(paiement.facture_id)}
            </p>

            <p>
                <strong>Client :</strong>
                ${escapeHtml(paiement.client_id)}
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
                <strong>Référence :</strong>
                ${escapeHtml(paiement.reference)}
            </p>

        `;


        container.appendChild(
            card
        );

    });

}


function openPaiementForm(){

    const clientSelect =
        document.getElementById(
            "paiementClient"
        );


    clientSelect.innerHTML = "";


    clients.forEach(client => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            client.id;


        option.textContent =
            client.nom;


        clientSelect.appendChild(
            option
        );

    });


    const factureSelect =
        document.getElementById(
            "paiementFacture"
        );


    factureSelect.innerHTML = "";


    factures.forEach(facture => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            facture.id;


        option.textContent =
            facture.numero;


        factureSelect.appendChild(
            option
        );

    });


    document
        .getElementById(
            "paiementMontant"
        )
        .value = "";


    document
        .getElementById(
            "paiementDate"
        )
        .value =
        today();


    document
        .getElementById(
            "paiementReference"
        )
        .value = "";


    document
        .getElementById(
            "paiementFormMessage"
        )
        .textContent = "";


    openModal(
        "paiementModal"
    );

}


async function savePaiement(){

    const factureId =
        document
            .getElementById(
                "paiementFacture"
            )
            .value;


    const clientId =
        document
            .getElementById(
                "paiementClient"
            )
            .value;


    const montant =
        document
            .getElementById(
                "paiementMontant"
            )
            .value;


    const datePaiement =
        document
            .getElementById(
                "paiementDate"
            )
            .value;


    const reference =
        document
            .getElementById(
                "paiementReference"
            )
            .value
            .trim();


    const message =
        document
            .getElementById(
                "paiementFormMessage"
            );


    const result =
        await supabaseClient
            .from("paiements")
            .insert({

                facture_id:
                    Number(factureId),

                client_id:
                    Number(clientId),

                montant:
                    montant === ""
                    ? null
                    : Number(montant),

                date_paiement:
                    datePaiement || null,

                reference:reference

            });


    if(result.error){

        message.style.color =
            "#dc2626";

        message.textContent =
            "Erreur : " +
            result.error.message;

        return;
    }


    closeModal(
        "paiementModal"
    );


    await loadPaiements();

}


/* =========================
   MODALES
========================= */

function openModal(id){

    document
        .getElementById(id)
        .classList.add(
            "active"
        );

}


function closeModal(id){

    document
        .getElementById(id)
        .classList.remove(
            "active"
        );

}


/* =========================
   OUTILS
========================= */

function today(){

    return new Date()
        .toISOString()
        .substring(
            0,
            10
        );

}


function showError(
    elementId,
    message
){

    const element =
        document.getElementById(
            elementId
        );


    if(!element){
        return;
    }


    element.innerHTML =
        '<div class="empty">' +
        'Erreur : ' +
        escapeHtml(message) +
        '</div>';

}


function escapeHtml(value){

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}
```
