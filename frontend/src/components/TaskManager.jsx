import { useState } from "react";

function TaskManager(props) {
  const onAddTask = props.onAddTask;
  const categories = props.categories;
  const taskError = props.taskError;
  const categorySelectError = props.categorySelectError;

  const [task, setTask] = useState("");

  // Gestion de l'ajout d'une tâche à la liste,
  // puis reset de l'input correspondant
  const addTask = async (t) => {
    const catValue = document.getElementById("category-selector").value;
    const resultOk = await onAddTask(t, catValue);
    if (resultOk) setTask("");
  };

  return (
    <>
      <section id="task-manager" className="no-bottom-margin">
        <input
          type="text"
          id="task-input"
          className={`${taskError ? "form-error" : ""}`}
          placeholder="Nouvelle tâche"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          data-cy="task-input"
        />


        <select 
          id="category-selector"
          className={`${categorySelectError ? "form-error" : ""}`}
          data-cy="task-cat-select"
        >
          {categories.length == 0 ? (
            <option value="" placeholder="Sélectionner une catégorie">
              Sélectionner une catégorie
            </option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </select>

        <button 
          id="add-task-button"
          onClick={(e) => addTask(task)}
          data-cy="task-add-button"
        >
          Ajouter
        </button>

      </section>
    </>
  );
}
export default TaskManager;
