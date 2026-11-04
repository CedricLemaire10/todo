import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskLine from "./TaskLine";

describe("Test d'une tache", () => {
    it("devrait afficher correctement une tache",
    async () => {
        const testFn = () => {};
        const mockCategories = [{"id": 1, "name": "Maison"}];
        const mockTask = {"description": "Ranger", "category": 1};
        
        render(<TaskLine 
            task={mockTask}
            categories={mockCategories}
            onDeleteTask={testFn}
            onCheckTask={testFn}
        />);
        const taskElem = screen.getByText(/ranger \(maison\)/i);
        expect(taskElem).toBeInTheDocument();
    });
    
    it("devrait changer le style du texte si la tache est terminée", () => {
        const testFn = () => {};
        const mockCategories = [{"id": 1, "name": "Maison"}];
        const mockTask = {"description": "Ranger", "category": 1, "is_completed": true};
        
        render(<TaskLine 
            task={mockTask}
            categories={mockCategories}
            onDeleteTask={testFn}
            onCheckTask={testFn}
        />);

        const taskElem = screen.getByText(/ranger \(maison\)/i);
        expect(taskElem).toHaveStyle({
            "textDecoration": "line-through",
            "color": "rgb(150,150,150)",
        });
    });
});