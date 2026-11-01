
import api from "../services/api";

// Fonction pour appeler l'API
export async function ApiFetcher(url) {
    try {
        console.log("Trying to fetch data from:", url);

        const response = await api.get(url);

        console.log("Data received:", response.data);

        return response.data;

    } catch (err) {
        console.error("--- ERROR FETCHING DATA ---");
        console.error("Error object:", err);

        throw err;
    }
};


export function errorManager(err) {
    // Erreur réseau
    if (err.message === "Network Error") {
        console.error("Erreur réseau : Serveur hors-ligne.");

        return "Erreur réseau : Serveur hors-ligne. Veuillez réessayer plus tard.";

    } else if (err.response) {
        // Erreur renvoyée par l'API
        console.error("Erreur serveur :", err.response);

        const { status, statusText } = err.response;

        if (status === 404) {
            return "Erreur serveur : Catégories ou tâches introuvables.";
        }

        if (status === 401) {
            return "Session expirée. Veuillez vous reconnecter.";
        }

        return `Erreur serveur : ${status} ${statusText}`;

    } else {
        // Autre erreur
        console.error(`Erreur globale : ${err.message}`);

        return `Erreur globale : ${err.message}`;
    }
};
