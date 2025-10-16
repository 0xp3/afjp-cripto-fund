
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="w-full py-4 px-4 md:px-6 border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-AFJPCripto-gradient"></div>
          <span className="font-bold text-xl md:text-2xl">AFJP Cripto</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {/* Navigation items removed */}
        </nav>
        
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={(value: 'es' | 'en') => setLanguage(value)}>
            <SelectTrigger className="w-[120px]">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-AFJPCripto-gradient hover:opacity-90 transition-opacity">
            {t('Log out')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
