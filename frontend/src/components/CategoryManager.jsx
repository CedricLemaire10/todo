import { useState } from "react";

function CategoryManager(props) {
  const onAddCategory = props.onAddCategory;
  const categoryError = props.categoryError;
  const [category, setCategory] = useState("");
  // const [categoryError, setCategoryError] = useState(null);

  // Gestion de l'ajout d'une catégorie,
  // puis reset de l'input correspondant
  const addCategory = async (cat) => {
    const resultOk = await onAddCategory(cat);
    console.log(resultOk);
    if (resultOk) setCategory("");
  };

  return (
    <>
      <section id="category-manager" className="no-bottom-margin">
        <input
          id="category-input"
          className={`${categoryError ? "form-error" : ""}`}
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Nouvelle catégorie"
        />

        <button id="category-add" onClick={(e) => addCategory(category)}>
          Ajouter catégorie
        </button>
      </section>

      {/* Section permettant l'affichage des erreurs */}
      {/* <section className="no-v-margin">
          {categoryError && (
            <p className="text-error">{categoryError}</p>
          )}
      </section> */}
    </>
  );
}
export default CategoryManager;
