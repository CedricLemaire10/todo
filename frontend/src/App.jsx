import { useState, useEffect } from "react";
import axios from "axios";

import CategoryManager from "./components/CategoryManager";
import CategoryFilter from "./components/CategoryFilter";
import TaskManager from "./components/TaskManager";
import TaskLine from "./components/TaskLine";
import {ApiFetcher, errorManager} from "./components/ApiManager";

function App() {
  // Variables principales de l'app
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");

  const [globalError, setGlobalError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [taskError, setTaskError] = useState(null);
  const [categorySelectError, setCategorySelectError] = useState(null);

  const baseApiUrl = process.env.REACT_APP_API_URL;
  const categoriesApiUrl = `${baseApiUrl}/api/categories/`;
  const tasksApiUrl = `${baseApiUrl}/api/tasks/`;

  // let apiCategories = [];
  // let apiTasks = [];

  useEffect(() => {
    // Fonction pour appeler l'API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Gestion des catégories
        const responseCat = await ApiFetcher(categoriesApiUrl);
        console.log("Catégories API :", responseCat);
        setCategories(responseCat);
        
        // Gestion des taches
        const responseTask = await ApiFetcher(tasksApiUrl);
        console.log("Tâches API :", responseTask);
        setTasks(responseTask);
      } catch (err) {
        setGlobalError(errorManager(err));
      } finally {
        setIsLoading(false);
      }
    }
    // Exécution de la récupération initiale des données
    fetchData();
    

  }, []);

  // Gestion des catégories
  const addCategory = async (cat) => {
    if (!cat) {
      setCategoryError("Veuillez entrer un nom de catégorie valide.");
      return false;
    }

    const existingCat = categories.some(c => c.name.toLowerCase() === cat.toLowerCase());
    if (existingCat) {
      setCategoryError(`La catégorie ${cat} existe déjà.`);
      return false;
    }

    try {
      // Envoi des données à l'API pour DELETE
      const response = await axios.post(categoriesApiUrl, {
        "name": cat,
      });
      const newCat = response.data;
      // MAJ des données React
      setCategories((previousCategories) => [
        ...previousCategories,
        newCat
      ]);
    } catch (err) {
      // Gestion des erreurs
      setGlobalError(errorManager(err));
      return false;
    }
    // Reset de l'erreur en cas de réussite
    setCategoryError(null);
    return true;
  };

  // Gestion des tâches (ajout, suppression)
  const addTask = async (taskName, catId) => {
    // Tests cas invalides
    if (!taskName) {
      setTaskError("Veuillez entrer un nom de tâche valide.");
      return false;
    }
    const existingCat = categories.some(c => c.id === catId);
    if (!catId) {
      setCategorySelectError(
        `Veuillez d'abord sélectionner une catégorie avant d'ajouter une nouvelle tâche.`
      );
      return false;
    }

    try {
      // Envoi des données à l'API pour POST
      const response = await axios.post(tasksApiUrl, {
        "description": taskName, 
        "is_completed": false, 
        "category": catId,
      });
      const newTask = response.data;
      // MAJ des taches React
      setTasks((previousTasks) => [
        ...previousTasks,
        newTask
      ]);

    } catch (err) {
      // Gestion des erreurs
      setGlobalError(errorManager(err));
      return false;
    }
    // Reset des erreurs en cas de réussite
    setTaskError(null);
    setCategorySelectError(null);
    return true;
  };
  
  const deleteTask = async (id) => {
    try {
      // Envoi des données à l'API pour DELETE
      const deleteTaskApiUrl = `${tasksApiUrl}${id}/`;
      const response = await axios.delete(deleteTaskApiUrl);
      // Suppression de la tâche React
      const majTasks = tasks.filter((t) => t.id !== id);
      setTasks(majTasks);
    } catch (err) {
      // Gestion des erreurs
      setGlobalError(errorManager(err));
    }
  };

  const checkTask = async (task, state) => {
    try {
      // Envoi des données à l'API pour PUT
      const putTaskApiUrl = `${tasksApiUrl}${task.id}/`;
      const response = await axios.patch(putTaskApiUrl, {
        "is_completed": state
      });
      // MAJ de la tâche React
      setTasks(previousTasks => 
        previousTasks.map(t =>
          t.id === task.id ? response.data : t
        )
      );
      console.log("task cochée/décochée")
    } catch (err) {
      // Gestion des erreurs
      setGlobalError(errorManager(err));
    }
  };

  // Gestion du filtrage par catégories
  const filterByCategory = (cat) => {
    setFilter(cat);
  };

  // Gestion de l'affichage de la liste de tâches
  const showTaskList = () => {
    // Avec filtres et taches
    if (tasks.length > 0 && filter) {
      console.log(`filtre : ${filter}`);
      return tasks
        .filter((t) => t.category == filter)
        .map((t) => <TaskLine 
          key={t.id}
          task={t} 
          categories={categories} 
          onDeleteTask={deleteTask}
          onCheckTask={checkTask}
        />);

    // Sans filtre
    } else if (tasks.length > 0) {
      console.log("aucun filtre");
      return tasks.map((t) => (
        <TaskLine
          key={t.id}
          task={t} 
          categories={categories} 
          onDeleteTask={deleteTask}
          onCheckTask={checkTask}
        />
      ));
    
    // Sans tache
    } else {
      console.log("aucune tache");
      return <p>Aucune tâche à afficher</p>;
    }
  };

  // Affichage de l'app
  return (
    <>
      <h1>Ma To-Do List par Catégories</h1>
      {/* Message initial de chargement + erreurs globales */}
      {isLoading && <p style={{fontWeight:"bold"}}>Chargement de la liste...</p>}
      {globalError && <p className="text-error">{globalError}</p>}
      
      {/* Catégories */}
      <CategoryManager onAddCategory={addCategory} categoryError={categoryError} />
      <section className="no-v-margin">
        {categoryError && 
          <p className="no-v-margin text-error">{categoryError}</p>
        }
      </section>

      {/* Filtres */}
      <CategoryFilter categories={categories} onFilter={filterByCategory} />

      {/* Tâches */}
      <TaskManager 
        onAddTask={addTask} 
        categories={categories} 
        taskError={taskError}
        categorySelectError={categorySelectError}
      />
      <section className="no-v-margin">
        {taskError && (
          <div className="text-error">{taskError}</div>
        )}
        {categorySelectError && (
          <div className="text-error">{categorySelectError}</div>
        )}
      </section>
      <section id="task-list">
        {/* Création de TaskLines s'il y a des tâches
        sinon on affiche un simple <p> */}
        {showTaskList()}
      </section>
      <button
        onClick={() => {
          throw new Error('This is your first error!');
        }}
      >
        Break the world
      </button>
    </>
  );
}
export default App;
