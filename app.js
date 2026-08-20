```javascript
"use strict";


/* =====================================================
   CONFIGURATION SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://hvgllvlwrmzqjxomyoye.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_qhJI1hmFUq9BQKMQjCknWg_QPHLKAxn";


/* =====================================================
   INITIALISATION
===================================================== */

let supabaseClient = null;


function afficherMessage(
    texte,
    type
) {

    const message =
        document.getElementById(
            "message"
        );

    if (!message) {
        return;
    }

    message.textContent = texte;

    message.className = "";

    message.classList.add(type);
}


function initialiserSupabase() {

    try {

        if (
            typeof window.supabase ===
            "undefined"
        ) {

            afficherMessage(
                "Erreur : la bibliothèque Supabase n'est pas chargée.",
                "error"
            );

            return false;
        }


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );


        console.log(
            "Supabase initialisé correctement."
        );


        return true;

    } catch (error) {

        console.error(
            "Erreur initialisation Supabase :",
            error
        );

        afficherMessage(
            "Erreur d'initialisation : " +
            error.message,
            "error"
        );

        return false;
    }
}


/* =====================================================
   AFFICHAGE
===================================================== */

function afficherConnexion() {

    document
        .getElementById(
            "loginSection"
        )
        .style.display = "block";


    document
        .getElementById(
            "connected"
        )
        .style.display = "none";

}


function afficherUtilisateur(user) {

    document
        .getElementById(
            "loginSection"
        )
        .style.display = "none";


    document
        .getElementById(
            "connected"
        )
        .style.display = "block";


    document
        .getElementById(
            "userEmail"
        )
        .textContent =
        user.email || "E-mail non disponible";

}


/* =====================================================
   VÉRIFIER LA SESSION
===================================================== */

async function verifierSession() {

    if (!supabaseClient) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Erreur session :",
                error
            );

            afficherConnexion();

            return;
        }


        if (
            data &&
            data.session &&
            data.session.user
        ) {

            afficherUtilisateur(
                data.session.user
            );

        } else {

            afficherConnexion();

        }

    } catch (error) {

        console.error(
            "Erreur vérification session :",
            error
        );

        afficherConnexion();

    }
}


/* =====================================================
   CONNEXION
===================================================== */

async function seConnecter() {

    const emailInput =
        document.getElementById(
            "email"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );

    const loginButton =
        document.getElementById(
            "loginButton"
        );


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email) {

        afficherMessage(
            "Entre ton adresse e-mail.",
            "error"
        );

        emailInput.focus();

        return;
    }


    if (!password) {

        afficherMessage(
            "Entre ton mot de passe.",
            "error"
        );

        passwordInput.focus();

        return;
    }


    loginButton.disabled = true;

    loginButton.textContent =
        "Connexion...";


    afficherMessage(
        "Connexion en cours...",
        "info"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        console.log(
            "Réponse Supabase :",
            data
        );


        if (error) {

            console.error(
                "Erreur connexion :",
                error
            );


            afficherMessage(
                "Erreur : " +
                error.message,
                "error"
            );


            loginButton.disabled = false;

            loginButton.textContent =
                "Se connecter";

            return;
        }


        if (
            !data ||
            !data.user
        ) {

            afficherMessage(
                "Connexion effectuée mais aucun utilisateur n'a été retourné.",
                "error"
            );


            loginButton.disabled = false;

            loginButton.textContent =
                "Se connecter";

            return;
        }


        afficherMessage(
            "Connexion réussie.",
            "success"
        );


        afficherUtilisateur(
            data.user
        );


    } catch (error) {

        console.error(
            "Erreur inattendue :",
            error
        );


        afficherMessage(
            "Erreur inattendue : " +
            error.message,
            "error"
        );


        loginButton.disabled = false;

        loginButton.textContent =
            "Se connecter";
    }
}


/* =====================================================
   DÉCONNEXION
===================================================== */

async function seDeconnecter() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    logoutButton.disabled = true;


    try {

        const {
            error
        } =
            await supabaseClient.auth
                .signOut();


        if (error) {

            console.error(
                "Erreur déconnexion :",
                error
            );

            alert(
                "Erreur : " +
                error.message
            );

            logoutButton.disabled = false;

            return;
        }


        afficherConnexion();


        document
            .getElementById(
                "email"
            )
            .value = "";


        document
            .getElementById(
                "password"
            )
            .value = "";


        afficherMessage(
            "Vous êtes déconnecté.",
            "info"
        );


    } catch (error) {

        console.error(
            error
        );

        alert(
            "Erreur : " +
            error.message
        );

    } finally {

        logoutButton.disabled = false;

    }
}


/* =====================================================
   DÉMARRAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Page chargée."
        );


        const ok =
            initialiserSupabase();


        if (!ok) {
            return;
        }


        document
            .getElementById(
                "loginButton"
            )
            .addEventListener(
                "click",
                seConnecter
            );


        document
            .getElementById(
                "logoutButton"
            )
            .addEventListener(
                "click",
                seDeconnecter
            );


        document
            .getElementById(
                "password"
            )
            .addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        seConnecter();

                    }

                }
            );


        await verifierSession();

    }
);
```
