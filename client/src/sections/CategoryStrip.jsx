import { CATEGORIES } from '@/constants/categories';
import CategoryCard from '@/components/CategoryCard';

export default function CategoryStrip() {
  return (
    <div className="bg-white border-y border-gold/25">
      <div className="max-w-6xl mx-auto px-7 grid grid-cols-4 md:grid-cols-8 py-6">
        {CATEGORIES.map((c) => <CategoryCard key={c.name} {...c} />)}
      </div>
    </div>
  );
}
