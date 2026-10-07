import { useState, useEffect } from "react";

function TaskLine(props) {
  const task = props.task;
  const categories = props.categories;
  const onDeleteTask = props.onDeleteTask;
  const onCheckTask = props.onCheckTask;

  const [checkState, setCheckState] = useState({
    color: "black",
    deco: "none",
  });

  const checkStateStyleOn = {
    color: "rgb(150,150,150)",
    deco: "line-through",
  }
  const checkStateStyleOff = {
    color: "rgb(50,50,50)",
    deco: "none",
  }

  useEffect(() => {
    console.log("TaskLine chargé ou modifié");
    if (task.is_completed) {
      setCheckState(checkStateStyleOn)
    }
  }, []);

  const getCategoryFromId = () => {
    const category = categories.find((cat) => (
      cat.id === task.category
    ));
    return category.name;
  };

  // Gestion du check de la tâche
  const checkTask = (checkbox) => {
    const isChecked = Boolean(checkbox.checked == true);
    if (isChecked) {
      setCheckState(checkStateStyleOn);
    } else {
      setCheckState(checkStateStyleOff);
    }
    onCheckTask(task, isChecked);
  };

  // Gestion de la suppression de la tache
  const deleteTask = () => {
    props.onDeleteTask(props.task.id);
    console.log("deleted");
  };

  // Affichage d'une tache spécifique
  return (
    <div className="task-line">
      <input
        className="task-line-elem"
        type="checkbox"
        checked={task.is_completed}
        onChange={(e) => checkTask(e.target)}
      />
      <p
        className="task-line-elem"
        style={{
          color: checkState.color,
          textDecoration: checkState.deco,
        }}
      >
        {props.task.description} ({getCategoryFromId()})
      </p>
      <button className="task-line-elem" onClick={deleteTask}>
        Supprimer
      </button>
    </div>
  );
}

export default TaskLine;
