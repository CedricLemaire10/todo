import { describe, it } from "vitest";

// - Le test visite la page d'accueil (cy.visit('/')).
// - Il remplit le formulaire de connexion avec les identifiants 
// d'un vrai utilisateur de test présent dans votre BDD Django, et se connecte.
// - Il crée une nouvelle catégorie : "Projet Alpha".
// - Il crée une nouvelle tâche "Déployer la V1" et sélectionne la catégorie 
// "Projet Alpha" dans le menu déroulant.
// - Il vérifie que cette nouvelle tâche apparaît bien dans la liste générale.
// - Il utilise le filtre de l'interface pour n'afficher que la catégorie "Projet Alpha".
// - Il vérifie que la tâche "Déployer la V1" est toujours visible.
// - Il clique sur la case (ou le bouton) pour marquer cette tâche comme 
// "terminée" et valide le changement visuel (ex: ajout d'une classe CSS).
// - Il clique sur le bouton de suppression de la tâche et vérifie qu'elle 
// disparaît définitivement de l'écran.

describe("Parcours utilisateur classique", () => {
    it("Vérifie que la page d'accueil se charge", () => {
        // Visite de la page d'accueil
        cy.visit("/");
        cy.contains("Connexion").should("be.visible");

        // Connexion
        cy.get('[data-cy="login-input"]').type("clemaire");
        cy.get('[data-cy="password-input"]').type("255097Awp!");
        cy.get('[data-cy="connect-button"]').click();
        cy.contains("Ma To-Do List").should("be.visible");
        cy.contains("Déconnexion").should("be.visible");
        
        // Ajout d'une catégorie
        cy.get('[data-cy="cat-input"]').type("Projet Alpha");
        cy.get('[data-cy="cat-add-button"]').click();
        cy.get('[data-cy="task-cat-select"]')
            .find("option")
            .should("contain", "Projet Alpha");
        
        // Ajout d'une tache
        cy.get('[data-cy="task-cat-select"]').select("Projet Alpha");
        cy.get('[data-cy="task-input"]').type("Déployer la V1");
        cy.get('[data-cy="task-add-button"]').click();
        cy.get('[data-cy="task-line-Déployer-la-V1"]').should("be.visible");
        
        // Filtrage par catégorie
        cy.get('[data-cy="cat-filter-select"]').select("Projet Alpha");
        cy.get('[data-cy="task-line-Déployer-la-V1"]').should("be.visible");
        
        // Suppression d'une tache
        cy.get('[data-cy="task-delete-button"]').click();
        cy.get('[data-cy="task-line-Déployer-la-V1"]').should("not.exist");
    });
});