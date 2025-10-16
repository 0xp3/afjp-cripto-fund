
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-AFJPCripto-dark text-white py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <div className="h-8 w-8 rounded-full bg-AFJPCripto-gradient mr-3"></div>
            <span className="font-bold text-xl">AFJP Cripto</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Navigation sections removed */}
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center md:text-left text-sm opacity-70">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
