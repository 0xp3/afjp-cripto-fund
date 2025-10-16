
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FlameIcon, CoinsIcon, ArrowRightIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TokenBurn: React.FC = () => {
  const [burnAmount, setBurnAmount] = useState<string>('');
  const { t } = useLanguage();
  
  // Mock data
  const afjpBalance = 1250;
  const juventudBalance = 45;
  const burnRate = 10; // 10 AFJP = 1 JUVENTUD
  
  // Calculate JUVENTUD tokens to receive
  const juventudToReceive = parseFloat(burnAmount) / burnRate;
  
  const handleBurn = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t('tokenburn.simulation')}: ${t('tokenburn.burn-confirmation').replace('{afjp}', burnAmount).replace('{juventud}', juventudToReceive.toFixed(2))}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('tokenburn.title')}</h2>
        <p className="text-foreground/70">
          {t('tokenburn.subtitle')}
        </p>
      </div>
      
      {/* Current Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mr-4">
                <CoinsIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('tokenburn.afjp-balance')}</h3>
                <p className="text-2xl font-bold">{afjpBalance.toLocaleString()}</p>
                <p className="text-foreground/70 text-sm">{t('dashboard.afjp-tokens')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-4">
                <FlameIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('tokenburn.juventud-balance')}</h3>
                <p className="text-2xl font-bold">{juventudBalance.toLocaleString()}</p>
                <p className="text-foreground/70 text-sm">{t('tokenburn.juventud-tokens')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Burn Interface */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlameIcon className="mr-2 h-5 w-5 text-orange-500" /> 
            {t('tokenburn.burn-title')}
          </CardTitle>
          <CardDescription>
            {t('tokenburn.burn-description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBurn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="burn-amount">{t('tokenburn.amount-to-burn')}</Label>
              <Input
                id="burn-amount"
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="0"
                max={afjpBalance}
                min="0"
                step={burnRate}
              />
              <p className="text-xs text-foreground/50">
                {t('tokenburn.rate-info').replace('{rate}', burnRate.toString())}
              </p>
            </div>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground/70">{t('tokenburn.you-will-receive')}</p>
                    <p className="text-xl font-bold">
                      {isNaN(juventudToReceive) ? '0.00' : juventudToReceive.toFixed(2)} 
                      <span className="text-foreground/70 text-lg ml-1">{t('tokenburn.juventud-tokens')}</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <ArrowRightIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
              disabled={!burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > afjpBalance}
            >
              {t('tokenburn.confirm-burn')}
            </Button>
            
            <p className="text-xs text-foreground/50 text-center">
              {t('tokenburn.irreversible-warning')}
            </p>
          </form>
        </CardContent>
      </Card>
      
      {/* Benefits Info */}
      <Card className="glass-card p-6 border-border/50 bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <div className="text-center">
          <h4 className="text-xl font-bold mb-4">{t('tokenburn.benefits-title')}</h4>
          <p className="text-lg text-foreground/80 mb-4">{t('tokenburn.benefits-description')}</p>
          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-center">
              <FlameIcon className="h-4 w-4 text-orange-500 mr-2" />
              <span>{t('tokenburn.benefit-1')}</span>
            </li>
            <li className="flex items-center">
              <FlameIcon className="h-4 w-4 text-orange-500 mr-2" />
              <span>{t('tokenburn.benefit-2')}</span>
            </li>
            <li className="flex items-center">
              <FlameIcon className="h-4 w-4 text-orange-500 mr-2" />
              <span>{t('tokenburn.benefit-3')}</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default TokenBurn;
