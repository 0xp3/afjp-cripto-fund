
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdvantagesSection: React.FC = () => {
  const { t } = useLanguage();
  
  const advantages = [
    {
      title: t('advantages.dedicated-parachain'),
      description: t('advantages.dedicated-desc')
    },
    {
      title: t('advantages.tokenized-assets'),
      description: t('advantages.tokenized-desc')
    },
    {
      title: t('advantages.institutional-security'),
      description: t('advantages.institutional-desc')
    },
    {
      title: t('advantages.continuous-evolution'),
      description: t('advantages.continuous-desc')
    },
    {
      title: t('advantages.defi-ecosystem'),
      description: t('advantages.defi-desc')
    },
    {
      title: t('advantages.long-term-resistance'),
      description: t('advantages.long-term-desc')
    }
  ];
  
  return (
    <section id="ventajas" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-gradient">{t('advantages.title')}</span></h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('advantages.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, index) => (
            <Card key={index} className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-AFJPCripto-pink">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-foreground/70 text-sm">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
