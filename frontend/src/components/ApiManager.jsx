import axios from "axios";

// Fonction pour appeler l'API
export async function ApiFetcher(url)  {
    try {
        console.log("Trying to fetch data from:", url);
        // Utilisation d'axios (ou fetch)
        const response = await axios.get(url);
        console.log("Data received:", response.data);
        return response.data;
        
    } catch (err) {
        console.error("--- ERROR FETCHING DATA ---");
        console.error("Error object:", err);

        throw err;
    }
};

export function errorManager(err) {
    // Erreur de réseau
    if (err.message.includes("Network Error")) {
        console.error("Erreur réseau : Serveur hors-ligne.");
        return("Erreur réseau : Serveur hors-ligne. Veuillez réessayer plus tard.");
    } else if (err.response) {
        // Erreur renvoyée par l'API (ex: 404, 500)
        console.error("Erreur serveur :", err.response);
        if (err.status === 404) {
            return(`Erreur serveur : Catégories ou tâches introuvables.`);
        } else {
            return(`Erreur serveur : ${err.status} ${err.statusText}`);
        }
    } else {
    // Autre erreur (ex: configuration axios/fetch)
    console.error(`Erreur globale: ${err.message}`);
    return(`Erreur globale: ${err.message}`);
    }
};