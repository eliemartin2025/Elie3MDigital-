```javascript
const SUPABASE_URL =
"https://hvgllvlwrmzqjxomyoye.supabase.co";

const SUPABASE_KEY =
"sb_publishable_qhJI1hmFUq9BQKMQjCknWg_QPHLKAxn";

const db =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

let clients=[];
let services=[];
let interventions=[];
let factures=[];
let paiements=[];


/* =========================
CONNEXION
========================= */

document
.getElementById("loginForm")
.addEventListener("submit",async function(e){

e.preventDefault();

const email=
document.getElementById("email").value.trim();

const password=
document.getElementById("password").value;

const message=
document.getElementById("loginMessage");

message.textContent="Connexion...";

const {error}=
await db.auth.signInWithPassword({
email,
password
});

if(error){

console.error(error);

message.textContent=
"Erreur : "+error.message;

return;
}

message.textContent="";

showApplication();

});


/* =========================
SESSION
========================= */

async function checkSession(){

const {data,error}=
await db.auth.getSession();

if(error){

console.error(error);

showLogin();

return;
}

if(data.session){

showApplication();

}else{

showLogin();

}

}


/* =========================
AFFICHAGE
========================= */

function showLogin(){

document.getElementById("loginPage").style.display="flex";

document.getElementById("application").style.display="none";

}


function showApplication(){

document.getElementById("loginPage").style.display="none";

document.getElementById("application").style.display="block";

loadAll();

}


/* =========================
DECONNEXION
========================= */

document
.getElementById("logout")
.addEventListener("click",async function(){

await db.auth.signOut();

showLogin();

});


/* =========================
NAVIGATION
========================= */

function showPage(name){

document
.querySelectorAll(".page")
.forEach(p=>p.classList.remove("active"));

const page=
document.getElementById(name);

if(page){
page.classList.add("active");
}

if(name==="clients") loadClients();

if(name==="services") loadServices();

if(name==="interventions") loadInterventions();

if(name==="factures") loadFactures();

if(name==="paiements") loadPaiements();

}


/* =========================
CHARGEMENT GLOBAL
========================= */

async function loadAll(){

await loadClients();

await loadServices();

await loadInterventions();

await loadFactures();

await loadPaiements();

}


/* =========================
CLIENTS
========================= */

async function loadClients(){

const {data,error}=
await db
.from("clients")
.select("*")
.order("id",{ascending:false});

if(error){

console.error(error);

document.getElementById("clientsList").innerHTML=
"<div class='empty'>Erreur : "+
error.message+
"</div>";

return;
}

clients=data||[];

document.getElementById("clientCount").textContent=
clients.length;

renderClients(clients);

}


function renderClients(data){

const list=
document.getElementById("clientsList");

list.innerHTML="";

if(data.length===0){

list.innerHTML=
"<div class='empty'>Aucun client enregistré.</div>";

return;
}

data.forEach(client=>{

const card=document.createElement("div");

card.className="card";

card.innerHTML=`
<h3>${escapeHtml(client.nom)}</h3>
<p><strong>Téléphone :</strong> ${escapeHtml(client.telephone||"")}</p>
<p><strong>E-mail :</strong> ${escapeHtml(client.email||"")}</p>
<p><strong>Adresse :</strong> ${escapeHtml(client.adresse||"")}</p>
<p><strong>Entreprise :</strong> ${escapeHtml(client.entreprise||"")}</p>

<div class="actions">

<button class="edit"
onclick="editClient(${client.id})">
Modifier
</button>

<button class="delete"
onclick="deleteClient(${client.id})">
Supprimer
</button>

</div>
`;

list.appendChild(card);

});

}


function searchClients(){

const value=
document
.getElementById("searchClient")
.value
.toLowerCase()
.trim();

if(!value){

renderClients(clients);

return;
}

const result=
clients.filter(c=>
String(c.nom||"").toLowerCase().includes(value)||
String(c.telephone||"").toLowerCase().includes(value)||
String(c.email||"").toLowerCase().includes(value)||
String(c.adresse||"").toLowerCase().includes(value)||
String(c.entreprise||"").toLowerCase().includes(value)
);

renderClients(result);

}


function openClientForm(){

document.getElementById("clientModalTitle").textContent=
"Ajouter un client";

document.getElementById("clientId").value="";

document.getElementById("clientNom").value="";

document.getElementById("clientTelephone").value="";

document.getElementById("clientEmail").value="";

document.getElementById("clientAdresse").value="";

document.getElementById("clientEntreprise").value="";

document.getElementById("clientMessage").textContent="";

openModal("clientModal");

}


function editClient(id){

const client=
clients.find(c=>Number(c.id)===Number(id));

if(!client){

alert("Client introuvable.");

return;
}

document.getElementById("clientModalTitle").textContent=
"Modifier un client";

document.getElementById("clientId").value=
client.id;

document.getElementById("clientNom").value=
client.nom||"";

document.getElementById("clientTelephone").value=
client.telephone||"";

document.getElementById("clientEmail").value=
client.email||"";

document.getElementById("clientAdresse").value=
client.adresse||"";

document.getElementById("clientEntreprise").value=
client.entreprise||"";

document.getElementById("clientMessage").textContent="";

openModal("clientModal");

}


async function saveClient(){

const id=
document.getElementById("clientId").value;

const data={

nom:
document.getElementById("clientNom").value.trim(),

telephone:
document.getElementById("clientTelephone").value.trim(),

email:
document.getElementById("clientEmail").value.trim(),

adresse:
document.getElementById("clientAdresse").value.trim(),

entreprise:
document.getElementById("clientEntreprise").value.trim()

};

if(!data.nom){

document.getElementById("clientMessage").textContent=
"Le nom est obligatoire.";

return;
}

let result;

if(id){

result=
await db
.from("clients")
.update(data)
.eq("id",id);

}else{

result=
await db
.from("clients")
.insert(data);

}

if(result.error){

console.error(result.error);

document.getElementById("clientMessage").textContent=
"Erreur : "+result.error.message;

return;
}

closeModal("clientModal");

await loadClients();

}


async function deleteClient(id){

if(!id){

alert("Identifiant manquant.");

return;
}

if(!confirm("Voulez-vous vraiment supprimer ce client ?")){

return;
}

const {error}=
await db
.from("clients")
.delete()
.eq("id",id);

if(error){

console.error(error);

alert(
"Impossible de supprimer le client :\n"+
error.message
);

return;
}

await loadClients();

}


/* =========================
SERVICES
========================= */

async function loadServices(){

const {data,error}=
await db
.from("services")
.select("*")
.order("id",{ascending:false});

if(error){

console.error(error);

document.getElementById("servicesList").innerHTML=
"<div class='empty'>Erreur : "+
error.message+
"</div>";

return;
}

services=data||[];

document.getElementById("serviceCount").textContent=
services.length;

renderServices();

}


function renderServices(){

const list=
document.getElementById("servicesList");

list.innerHTML="";

if(!services.length){

list.innerHTML=
"<div class='empty'>Aucun service.</div>";

return;
}

services.forEach(service=>{

const card=document.createElement("div");

card.className="card";

card.innerHTML=`
<h3>${escapeHtml(service.nom)}</h3>
<p>${escapeHtml(service.description||"")}</p>
<p><strong>Prix :</strong> ${service.prix||0}</p>
`;

list.appendChild(card);

});

}


function openServiceForm(){

document.getElementById("serviceNom").value="";

document.getElementById("serviceDescription").value="";

document.getElementById("servicePrix").value="";

document.getElementById("serviceMessage").textContent="";

openModal("serviceModal");

}


async function saveService(){

const nom=
document.getElementById("serviceNom").value.trim();

const description=
document.getElementById("serviceDescription").value.trim();

const prix=
Number(document.getElementById("servicePrix").value||0);

if(!nom){

document.getElementById("serviceMessage").textContent=
"Le nom du service est obligatoire.";

return;
}

const {error}=
await db
.from("services")
.insert({
nom,
description,
prix
});

if(error){

document.getElementById("serviceMessage").textContent=
"Erreur : "+error.message;

return;
}

closeModal("serviceModal");

await loadServices();

}


/* =========================
INTERVENTIONS
========================= */

async function loadInterventions(){

const {data,error}=
await db
.from("interventions")
.select(`
*,
clients(nom),
services(nom)
`)
.order("id",{ascending:false});

if(error){

console.error(error);

return;
}

interventions=data||[];

document.getElementById("interventionCount").textContent=
interventions.length;

renderInterventions();

}


function renderInterventions(){

const list=
document.getElementById("interventionsList");

list.innerHTML="";

if(!interventions.length){

list.innerHTML=
"<div class='empty'>Aucune intervention.</div>";

return;
}

interventions.forEach(i=>{

const card=document.createElement("div");

card.className="card";

card.innerHTML=`
<h3>${escapeHtml(i.clients?.nom||"Client")}</h3>
<p><strong>Service :</strong> ${escapeHtml(i.services?.nom||"")}</p>
<p><strong>Date :</strong> ${escapeHtml(i.date_intervention||"")}</p>
<p><strong>Statut :</strong> ${escapeHtml(i.statut||"")}</p>
<p>${escapeHtml(i.description||"")}</p>
`;

list.appendChild(card);

});

}


function openInterventionForm(){

fillClientSelect("interventionClient");

fillServiceSelect("interventionService");

document.getElementById("interventionDate").value="";

document.getElementById("interventionDescription").value="";

openModal("interventionModal");

}


async function saveIntervention(){

const data={

client_id:
Number(document.getElementById("interventionClient").value),

service_id:
Number(document.getElementById("interventionService").value)||null,

date_intervention:
document.getElementById("interventionDate").value||null,

description:
document.getElementById("interventionDescription").value.trim(),

statut:
document.getElementById("interventionStatut").value

};

const {error}=
await db
.from("interventions")
.insert(data);

if(error){

document.getElementById("interventionMessage").textContent=
"Erreur : "+error.message;

return;
}

closeModal("interventionModal");

await loadInterventions();

}


/* =========================
FACTURES
========================= */

async function loadFactures(){

const {data,error}=
await db
.from("factures")
.select(`
*,
clients(nom)
`)
.order("id",{ascending:false});

if(error){

console.error(error);

return;
}

factures=data||[];

document.getElementById("factureCount").textContent=
factures.length;

renderFactures();

}


function renderFactures(){

const list=
document.getElementById("facturesList");

list.innerHTML="";

if(!factures.length){

list.innerHTML=
"<div class='empty'>Aucune facture.</div>";

return;
}

factures.forEach(f=>{

const card=document.createElement("div");

card.className="card";

card.innerHTML=`
<h3>${escapeHtml(f.numero)}</h3>
<p><strong>Client :</strong> ${escapeHtml(f.clients?.nom||"")}</p>
<p><strong>Montant :</strong> ${f.montant||0}</p>
<p><strong>Statut :</strong> ${escapeHtml(f.statut||"")}</p>
<p><strong>Date :</strong> ${escapeHtml(f.date_facture||"")}</p>
`;

list.appendChild(card);

});

}


function openFactureForm(){

fillClientSelect("factureClient");

document.getElementById("factureNumero").value="";

document.getElementById("factureMontant").value="";

document.getElementById("factureDate").value=
new Date().toISOString().slice(0,10);

document.getElementById("factureEcheance").value="";

openModal("factureModal");

}


async function saveFacture(){

const data={

client_id:
Number(document.getElementById("factureClient").value),

numero:
document.getElementById("factureNumero").value.trim(),

montant:
Number(document.getElementById("factureMontant").value||0),

statut:
document.getElementById("factureStatut").value,

date_facture:
document.getElementById("factureDate").value,

date_echeance:
document.getElementById("factureEcheance").value||null

};

if(!data.numero){

document.getElementById("factureMessage").textContent=
"Le numéro de facture est obligatoire.";

return;
}

const {error}=
await db
.from("factures")
.insert(data);

if(error){

document.getElementById("factureMessage").textContent=
"Erreur : "+error.message;

return;
}

closeModal("factureModal");

await loadFactures();

}


/* =========================
PAIEMENTS
========================= */

async function loadPaiements(){

const {data,error}=
await db
.from("paiements")
.select(`
*,
clients(nom),
factures(numero)
`)
.order("id",{ascending:false});

if(error){

console.error(error);

return;
}

paiements=data||[];

renderPaiements();

}


function renderPaiements(){

const list=
document.getElementById("paiementsList");

list.innerHTML="";

if(!paiements.length){

list.innerHTML=
"<div class='empty'>Aucun paiement.</div>";

return;
}

paiements.forEach(p=>{

const card=document.createElement("div");

card.className="card";

card.innerHTML=`
<h3>Paiement</h3>
<p><strong>Client :</strong> ${escapeHtml(p.clients?.nom||"")}</p>
<p><strong>Facture :</strong> ${escapeHtml(p.factures?.numero||"")}</p>
<p><strong>Montant :</strong> ${p.montant||0}</p>
<p><strong>Date :</strong> ${escapeHtml(p.date_paiement||"")}</p>
<p><strong>Mode :</strong> ${escapeHtml(p.mode_paiement||"")}</p>
<p><strong>Référence :</strong> ${escapeHtml(p.reference||"")}</p>
`;

list.appendChild(card);

});

}


function openPaiementForm(){

fillClientSelect("paiementClient");

fillFactureSelect();

document.getElementById("paiementMontant").value="";

document.getElementById("paiementDate").value=
new Date().toISOString().slice(0,10);

document.getElementById("paiementReference").value="";

openModal("paiementModal");

}


async function savePaiement(){

const data={

client_id:
Number(document.getElementById("paiementClient").value)||null,

facture_id:
Number(document.getElementById("paiementFacture").value)||null,

montant:
Number(document.getElementById("paiementMontant").value||0),

date_paiement:
document.getElementById("paiementDate").value,

mode_paiement:
document.getElementById("paiementMode").value,

reference:
document.getElementById("paiementReference").value.trim()

};

const {error}=
await db
.from("paiements")
.insert(data);

if(error){

document.getElementById("paiementMessage").textContent=
"Erreur : "+error.message;

return;
}

closeModal("paiementModal");

await loadPaiements();

}


/* =========================
SELECTS
========================= */

function fillClientSelect(id){

const select=
document.getElementById(id);

select.innerHTML="";

clients.forEach(client=>{

const option=
document.createElement("option");

option.value=client.id;

option.textContent=client.nom;

select.appendChild(option);

});

}


function fillServiceSelect(id){

const select=
document.getElementById(id);

select.innerHTML="";

services.forEach(service=>{

const option=
document.createElement("option");

option.value=service.id;

option.textContent=service.nom;

select.appendChild(option);

});

}


function fillFactureSelect(){

const select=
document.getElementById("paiementFacture");

select.innerHTML="";

factures.forEach(f=>{

const option=
document.createElement("option");

option.value=f.id;

option.textContent=
f.numero+" - "+(f.montant||0);

select.appendChild(option);

});

}


/* =========================
MODALES
========================= */

function openModal(id){

document
.getElementById(id)
.classList.add("active");

}


function closeModal(id){

document
.getElementById(id)
.classList.remove("active");

}


/* =========================
SECURITE AFFICHAGE
========================= */

function escapeHtml(value){

return String(value??"")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");

}


/* =========================
DEMARRAGE
========================= */

checkSession();
```
