import CategoryCard from "@/components/categories/CategoryCard.jsx";

export default function CategoryGrid({ categories = [] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id || category.slug || category.name} category={category} />
      ))}
    </div>
  );
}
