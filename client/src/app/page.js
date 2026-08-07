import MainLayout from '@/layouts/MainLayout';
import Hero from '@/sections/Hero';
import CategoryStrip from '@/sections/CategoryStrip';
import ProductShelf from '@/sections/ProductShelf';
import StoryBand from '@/sections/StoryBand';
import Newsletter from '@/sections/Newsletter';

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <CategoryStrip />
      <ProductShelf
        filterKey="bestSeller"
        eyebrow="Bestsellers"
        title="Fan favourites"
        subtitle="The pieces our customers reach for first, across the full Fortify range."
      />
      <ProductShelf
        filterKey="newArrival"
        eyebrow="Just In"
        title="New Arrivals"
        subtitle="Fresh off the workshop floor."
      />
      <ProductShelf
        filterKey="featured"
        eyebrow="Editor's Pick"
        title="Featured"
        subtitle="Hand-picked by the Fortify team."
      />
      <StoryBand />
      <Newsletter />
    </MainLayout>
  );
}