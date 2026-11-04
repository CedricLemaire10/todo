import { render, screen, describe, it, expect } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import CategoryManager from "./CategoryManager";
import { vi } from 'vitest';


describe("Test d'une catégorie", async () => {
    it("devrait modifier correctement l'état du bouton d'ajout",
    async () => {
        const user = userEvent.setup();
        const handleAddCat = vi.fn();
        const handleCatError = vi.fn();
        
        render(<CategoryManager 
            onAddCategory={handleAddCat}
            categoryError={handleCatError}
        />);
        const addButton = screen.getByRole("button", {name: /Ajouter catégorie/});
        expect(addButton).toBeDisabled();

        const catInput = screen.getByPlaceholderText("Nouvelle catégorie");
        await user.type(catInput, "Maison");

        expect(addButton).not.toBeDisabled();

        await user.click(addButton);
        expect(handleAddCat).toHaveBeenCalledTimes(1);
        expect(handleAddCat).toHaveBeenCalledWith('Maison');
    });
});