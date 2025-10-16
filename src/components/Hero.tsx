
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-AFJPCripto-pink/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-AFJPCripto-purple/10 rounded-full filter blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-3 w-3 rounded-full bg-AFJPCripto-pink animate-pulse"></div>
            <span className="uppercase tracking-wider text-sm font-medium">{t('hero.future-retirement')}</span>
            <div className="h-3 w-3 rounded-full bg-AFJPCripto-purple animate-pulse"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">{t('hero.main-title')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-AFJPCripto-gradient hover:opacity-90 transition-opacity text-white px-8 py-6">
              {t('hero.discover-more')}
            </Button>
            <Button variant="outline" className="border-AFJPCripto-pink text-AFJPCripto-pink hover:bg-AFJPCripto-pink/10 px-8 py-6">
              {t('hero.view-presentation')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
