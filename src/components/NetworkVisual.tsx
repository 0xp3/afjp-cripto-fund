
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const NetworkVisual: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('network.title').replace('Arquitectura', '')} <span className="text-gradient">Arquitectura</span> {t('network.title').includes('Arquitectura') ? t('network.title').split('Arquitectura')[1] : ''}</h2>
            <p className="text-lg text-foreground/70 mb-8">
              {t('network.description')}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-AFJPCripto-pink mt-1"></div>
                <div>
                  <h3 className="font-bold">{t('network.retirement-parachain')}</h3>
                  <p className="text-foreground/70">{t('network.retirement-desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-AFJPCripto-purple mt-1"></div>
                <div>
                  <h3 className="font-bold">{t('network.assets-parachain')}</h3>
                  <p className="text-foreground/70">{t('network.assets-desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-AFJPCripto-cyan mt-1"></div>
                <div>
                  <h3 className="font-bold">{t('network.benefits-parachain')}</h3>
                  <p className="text-foreground/70">{t('network.benefits-desc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-AFJPCripto-gradient opacity-5 rounded-full filter blur-3xl"></div>
            <div className="relative p-8">
              <div className="w-32 h-32 bg-AFJPCripto-gradient rounded-full mx-auto flex items-center justify-center text-white font-bold shadow-lg animate-float">
                Relay Chain
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                <div className="w-24 h-24 bg-AFJPCripto-pink rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse-slow">
                  Jubilación
                </div>
                <div className="w-24 h-24 bg-AFJPCripto-purple rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse-slow" style={{ animationDelay: "0.5s" }}>
                  Activos
                </div>
                <div className="w-24 h-24 bg-AFJPCripto-cyan rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse-slow" style={{ animationDelay: "1s" }}>
                  Beneficios
                </div>
              </div>
              
              <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <line x1="200" y1="100" x2="120" y2="250" stroke="#E6007A" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="200" y1="100" x2="200" y2="250" stroke="#6D3AEE" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="200" y1="100" x2="280" y2="250" stroke="#00B2FF" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkVisual;
