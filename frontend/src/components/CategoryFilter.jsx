function CategoryFilter(props) {
  // Gestion du filtrage
  const selectFilter = (cat) => {
    props.onFilter(cat);
  };

  // Affichage du composant
  return (
    <section id="category-filter">
      <select onChange={(e) => selectFilter(e.target.value)}>
        <option value="">Toutes les catégories</option>
        {props.categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </section>
  );
}
export default CategoryFilter;
