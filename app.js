const SUPABASE_URL = "https://hvgllvlwrmzqjxomyoye.supabase.co";
const SUPABASE_KEY = "sb_publishable_qhJI1hmFUq9BQKMQjCknWg_QPHLKAxn";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (!loginForm) {
        alert("ERREUR : loginForm introuvable");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        loginMessage.textContent = "Connexion en cours...";

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const { data, error } =
            await db.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {

            loginMessage.textContent =
                "Erreur : " + error.message;

            return;
        }

        loginMessage.textContent =
            "CONNEXION RÉUSSIE — LE JAVASCRIPT FONCTIONNE";

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("application").style.display = "block";

    });

});
