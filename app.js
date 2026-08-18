alert("app.js fonctionne");

const SUPABASE_URL = "https://hvgllvlwrmzqjxomyoye.supabase.co";
const SUPABASE_KEY = "sb_publishable_qhJI1hmFUq9BQKMQjCknWg_QPHLKAxn";

console.log("URL Supabase :", SUPABASE_URL);
console.log("Supabase disponible :", typeof window.supabase);

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (!form) {
        alert("ERREUR : loginForm introuvable");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Le bouton Se connecter fonctionne");

    });

});
