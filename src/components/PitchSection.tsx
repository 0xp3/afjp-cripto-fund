
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Quote, Target, TrendingUp, Coins } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PitchSection: React.FC = () => {
  const { t } = useLanguage();
  
  const pitches = [
    {
      text: t('pitch.text1')
    },
    {
      text: t('pitch.text2')
    },
    {
      text: t('pitch.text3')
    }
  ];

  const businessHighlights = [
    {
      icon: <Target size={24} />,
      title: t('pitch.efficiency-title'),
      text: t('pitch.efficiency-text')
    },
    {
      icon: <TrendingUp size={24} />,
      title: t('pitch.wealth-title'),
      text: t('pitch.wealth-text')
    },
    {
      icon: <Coins size={24} />,
      title: t('pitch.tokenomics-title'),
      text: t('pitch.tokenomics-text')
    }
  ];

  return (
    <section id="presentacion" className="py-20 relative">
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-AFJPCripto-pink/5 rounded-full filter blur-3xl"></div>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pitch.title').replace('Hackathon', '')} <span className="text-gradient">Hackathon</span></h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('pitch.subtitle')}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto mb-16">
          {pitches.map((pitch, index) => (
            <div key={index} className="mb-8">
              <Card className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all">
                <div className="text-AFJPCripto-pink mb-4">
                  <Quote size={24} />
                </div>
                <p className="italic text-lg">{pitch.text}</p>
              </Card>
              {index < pitches.length - 1 && (
                <div className="flex justify-center my-8">
                  <Separator className="w-24" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* New Business Model Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('pitch.business-model-title')}</h3>
            <p className="text-lg text-foreground/70">
              {t('pitch.business-model-subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {businessHighlights.map((highlight, index) => (
              <Card key={index} className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all">
                <div className="text-AFJPCripto-cyan mb-4">
                  {highlight.icon}
                </div>
                <h4 className="font-bold text-lg mb-3">{highlight.title}</h4>
                <p className="text-foreground/70">{highlight.text}</p>
              </Card>
            ))}
          </div>

          <Card className="glass-card p-8 border-border/50 bg-gradient-to-br from-AFJPCripto-pink/5 to-AFJPCripto-purple/5">
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4">{t('pitch.execution-title')}</h4>
              <p className="text-lg text-foreground/80">{t('pitch.execution-text')}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PitchSection;
