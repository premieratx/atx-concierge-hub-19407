import { AnimatePresence } from 'framer-motion';
import { IntroScreen } from '@/components/IntroScreen';
import { Home } from '@/pages/Home';
import { Navigation } from '@/components/Navigation';
import { useAppStore } from '@/store/useAppStore';

const Index = () => {
  const showIntro = useAppStore((state) => state.showIntro);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" />
        ) : (
          <div key="app">
            <Home />
            <Navigation />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
