import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, it, vi, expect } from "vitest";

import * as ApiManager from '../components/ApiManager'
import TodoList from "./TodoList";

const fetchSpy = vi.spyOn(ApiManager, "ApiFetcher");

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    logout: vi.fn(),
  }),
}));

const mockCatApi = [
    {name: "Maison", id: 1},
    {name: "Jardin", id: 2},
]

const mockTasksApi = [
    {description: "Ranger", category: 1, is_completed: false},
    {description: "Ramasser les feuilles", category: 2, is_completed: true},
];

describe("Test de l'API globale", async () => {
    beforeAll(() => {
        fetchSpy.mockReset()
    });
    afterAll(() => {
        fetchSpy.mockRestore()
    });

    it("devrait afficher un message de chargement en attendant la liste des taches",
    async () => {
        fetchSpy.mockReturnValue(new Promise(() => {}));
        render(<TodoList />);

        const loadingMessage = await screen.findByText(/Chargement de la liste/i);
        expect(loadingMessage).toBeInTheDocument();
    });

    it("devrait afficher les taches reçues de l'API", async () => {
        fetchSpy
            .mockResolvedValueOnce(mockCatApi)
            .mockResolvedValueOnce(mockTasksApi);
        render(<TodoList />);

        expect(await screen.findByText(/ranger \(maison\)/i)).toBeInTheDocument();
        expect(await screen.findByText(/ramasser les feuilles \(jardin\)/i)).toBeInTheDocument();
    });

    it("devrait gérer correctement une erreur d'API", async () => {
        fetchSpy.mockRejectedValueOnce(
            new Error("Le serveur n'est pas joignable.")
        )
        render(<TodoList />);

        const errorMessage = await screen.findByRole("alert")
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(/Le serveur n'est pas joignable/i);
        expect(errorMessage).toHaveClass("text-error")

        const loadingMessage = screen.queryByText(/Chargement de la liste/i);
        expect(loadingMessage).not.toBeInTheDocument();
    });
});