const SUPABASE_URL = "https://hvgllvlwrmzqjxomyoye.supabase.co";

const SUPABASE_KEY =
"sb_publishable_qhJI1hmFUq9BQKMQjCknWg_QPHLKAxn";

const supabaseClient =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    const message =
        document.getElementById("loginMessage");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        message.style.color = "#2563eb";
        message.textContent = "Connexion en cours...";

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {

                console.error("Erreur Supabase :", error);

                message.style.color = "#dc2626";
                message.textContent =
                    "Erreur : " + error.message;

                return;
            }

            console.log("Connexion réussie :", data);

            message.style.color = "#16a34a";
            message.textContent =
                "Connexion réussie !";

            document.getElementById("loginPage").style.display = "none";

            document.getElementById("application").style.display = "block";

        } catch (error) {

            console.error(error);

            message.style.color = "#dc2626";
            message.textContent =
                "Erreur de connexion : " + error.message;
        }

    });

});
