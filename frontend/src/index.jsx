import "./styles.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as Sentry from "@sentry/react";

// On configure Sentry UNIQUEMENT en production
// On utilise la variable `import.meta.env.PROD` fournie automatiquement par Vite. Valeur possibles
// avec Vite :
// - import.meta.env.PROD
// - import.meta.env.DEV
// ou ( import.meta.env.NODE_ENV === "production") fournie par React App. Les valeurs possibles sont :
// - "development" : développement local (npm start)
// - "production" : build de production (npm run build)
// - "test" : environnement de test
if ( import.meta.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN, // On la charge depuis les variables d'env (ou VITE_SENTRY_DSN)
        integrations: [
            // Cette intégration active le monitoring de performance.
            // Elle permet de voir, par exemple, combien de temps prennent les appels API.
            Sentry.browserTracingIntegration(), 
            // Cette intégration enregistre les sessions utilisateur où une erreur se produit.
            // C'est comme avoir une "vidéo" de ce que l'utilisateur a fait avant le bug.
            Sentry.replayIntegration()
        ],
        // On configure le taux d'échantillonnage pour la performance.
        // 1.0 signifie qu'on capture 100% des transactions pour analyse.
        tracesSampleRate: 1.0,
        // On configure le taux d'échantillonnage pour les "replays" de session.
        replaysSessionSampleRate: 0.1,  // On enregistre 10% des sessions.
        replaysOnErrorSampleRate: 1.0,  // Mais on enregistre 100% des sessions où une erreur survient.
    });
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
