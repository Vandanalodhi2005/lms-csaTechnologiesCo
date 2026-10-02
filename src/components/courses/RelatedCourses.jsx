import CourseCard from "@/components/courses/CourseCard.jsx";

export default function RelatedCourses({ currentCourse, allCourses, limit = 3 }) {
  const currentId = currentCourse?._id || currentCourse?.id;
  const category = currentCourse?.categoryId?.name || currentCourse?.category;

  let related = [];
  if (Array.isArray(allCourses) && currentId) {
    const sameCategory = allCourses.filter((c) => {
      const id = c._id || c.id;
      if (id === currentId) return false;
      const cat = c.categoryId?.name || c.category;
      return cat === category;
    });
    if (sameCategory.length >= limit) {
      related = sameCategory.slice(0, limit);
    } else {
      const others = allCourses.filter((c) => {
        const id = c._id || c.id;
        return id !== currentId && !sameCategory.includes(c);
      });
      related = [...sameCategory, ...others].slice(0, limit);
    }
  }

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" id="related-courses" className="space-y-5">
      <h2
        id="related-heading"
        className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2F5F]"
      >
        Related Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {related.map((course) => {
          const key = course._id || course.id || course.slug;
          return <CourseCard key={key} course={course} variant="home" showWishlist={false} />;
        })}
      </div>
    </section>
  );
}
