
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRightLeftIcon, ArrowRightIcon, HomeIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TokenExchangeTabProps {
  userBalance: number;
  ladrilloBalance: number;
  exchangeRate: number;
  ladrilloExchangeRate: number;
}

export const TokenExchangeTab: React.FC<TokenExchangeTabProps> = ({
  userBalance,
  ladrilloBalance,
  exchangeRate,
  ladrilloExchangeRate
}) => {
  const { t } = useLanguage();
  
  const [exchangeAmount, setExchangeAmount] = useState<string>('');
  const [ladrilloExchangeAmount, setLadrilloExchangeAmount] = useState<string>('');
  
  const juventudToReceive = parseFloat(exchangeAmount) * exchangeRate;
  const ladrilloToReceive = parseFloat(ladrilloExchangeAmount) * ladrilloExchangeRate;
  
  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t('tokenexchange.simulation')}: ${t('tokenexchange.exchange-confirmation').replace('{afjp}', exchangeAmount).replace('{juventud}', juventudToReceive.toFixed(2))}`);
  };
  
  const handleLadrilloExchange = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`SIMULACIÓN: Intercambiar ${ladrilloExchangeAmount} tokens AFJP por ${ladrilloToReceive.toFixed(2)} tokens LADRILLO`);
  };
  
  return (
    <div className="space-y-6">
      {/* JUVENTUD Token Exchange */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowRightLeftIcon className="mr-2 h-5 w-5 text-blue-500" />
            {t('tokenexchange.exchange-title')}
          </CardTitle>
          <CardDescription>
            {t('tokenexchange.exchange-description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleExchange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exchange-amount">{t('tokenexchange.amount-to-exchange')}</Label>
              <Input
                id="exchange-amount"
                type="number"
                value={exchangeAmount}
                onChange={(e) => setExchangeAmount(e.target.value)}
                placeholder="0"
                max={userBalance}
                min="0"
                step="1"
              />
              <p className="text-xs text-foreground/50">
                {t('tokenexchange.rate-info').replace('{rate}', `1 AFJP = ${exchangeRate} JUVENTUD`)}
              </p>
            </div>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground/70">{t('tokenexchange.you-will-receive')}</p>
                    <p className="text-xl font-bold">
                      {isNaN(juventudToReceive) ? '0.00' : juventudToReceive.toFixed(2)} 
                      <span className="text-foreground/70 text-lg ml-1">{t('tokenexchange.juventud-tokens')}</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <ArrowRightIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
              disabled={!exchangeAmount || parseFloat(exchangeAmount) <= 0 || parseFloat(exchangeAmount) > userBalance}
            >
              {t('tokenexchange.confirm-exchange')}
            </Button>
            
            <p className="text-xs text-foreground/50 text-center">
              {t('tokenexchange.exchange-warning')}
            </p>
          </form>
        </CardContent>
      </Card>
      
      {/* LADRILLO Token Exchange */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HomeIcon className="mr-2 h-5 w-5 text-orange-500" />
            Intercambiar AFJP por LADRILLO
          </CardTitle>
          <CardDescription>
            Intercambia tokens AFJP por tokens LADRILLO especializados en inmuebles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70 mb-4">
            Saldo LADRILLO actual: {ladrilloBalance.toLocaleString()} LADRILLO
          </p>
          
          <form onSubmit={handleLadrilloExchange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ladrillo-exchange-amount">Cantidad a Intercambiar (AFJP)</Label>
              <Input
                id="ladrillo-exchange-amount"
                type="number"
                value={ladrilloExchangeAmount}
                onChange={(e) => setLadrilloExchangeAmount(e.target.value)}
                placeholder="0"
                max={userBalance}
                min="0"
                step="1"
              />
              <p className="text-xs text-foreground/50">
                Tasa de Cambio: 1 AFJP = {ladrilloExchangeRate} LADRILLO
              </p>
            </div>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground/70">Recibirás</p>
                    <p className="text-xl font-bold">
                      {isNaN(ladrilloToReceive) ? '0.00' : ladrilloToReceive.toFixed(2)} 
                      <span className="text-foreground/70 text-lg ml-1">LADRILLO</span>
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
              disabled={!ladrilloExchangeAmount || parseFloat(ladrilloExchangeAmount) <= 0 || parseFloat(ladrilloExchangeAmount) > userBalance}
            >
              Confirmar Intercambio
            </Button>
            
            <p className="text-xs text-foreground/50 text-center">
              ⚠️ Por favor verifica los detalles del intercambio
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
