import MainLayout from '@/layouts/MainLayout';
import Hero from '@/sections/Hero';
import CategoryStrip from '@/sections/CategoryStrip';
import FeaturedProducts from '@/sections/FeaturedProducts';
import StoryBand from '@/sections/StoryBand';
import Newsletter from '@/sections/Newsletter';

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <StoryBand />
      <Newsletter />
    </MainLayout>
  );
}
