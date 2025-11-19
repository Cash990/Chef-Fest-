import { HeroSlideshow } from '@/components/HeroSlideshow';
import { useLocation } from 'wouter';

export default function HomePage() {
  const [, setLocation] = useLocation();

  const handleExploreClick = () => {
    setLocation('/recipes');
  };

  return (
    <div>
      <HeroSlideshow onExploreClick={handleExploreClick} />
    </div>
  );
}
