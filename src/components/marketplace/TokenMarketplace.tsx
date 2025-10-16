
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketplaceStats } from './MarketplaceStats';
import { BuyTokensTab } from './BuyTokensTab';
import { SellTokensTab } from './SellTokensTab';
import { CreditTab } from './CreditTab';
import { TokenExchangeTab } from './TokenExchangeTab';
import { useLanguage } from '@/contexts/LanguageContext';

const TokenMarketplace: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock token data
  const tokenPrice = 120.75;
  const ladrilloPrice = 85.50; // Price for LADRILLO token
  const userBalance = 1250;
  const ladrilloBalance = 320; // User's LADRILLO balance
  const exchangeRate = 10; // 1 AFJP = 10 JUVENTUD
  const ladrilloExchangeRate = 15; // 1 AFJP = 15 LADRILLO
  
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');
  const [buyMode, setBuyMode] = useState<'tokens' | 'currency'>('tokens');
  const [sellMode, setSellMode] = useState<'tokens' | 'currency'>('tokens');
  
  // Calculate values based on inputs
  const tokensToReceive = buyMode === 'tokens' 
    ? parseFloat(buyAmount) 
    : parseFloat(buyAmount) / tokenPrice;
  
  const valueToReceive = sellMode === 'currency' 
    ? parseFloat(sellAmount) 
    : parseFloat(sellAmount) * tokenPrice;
  
  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t('marketplace.simulation')}: ${t('marketplace.buy-confirmation').replace('{tokens}', tokensToReceive.toFixed(2)).replace('{cost}', (tokensToReceive * tokenPrice).toFixed(2))}`);
  };
  
  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t('marketplace.simulation')}: ${t('marketplace.sell-confirmation').replace('{tokens}', (sellMode === 'tokens' ? sellAmount : (parseFloat(sellAmount) / tokenPrice).toFixed(2))).replace('{value}', valueToReceive.toFixed(2))}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('marketplace.title')}</h2>
        <p className="text-foreground/70">
          {t('marketplace.subtitle')}
        </p>
      </div>
      
      <MarketplaceStats tokenPrice={tokenPrice} userBalance={userBalance} />
      
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buy" className="text-lg font-bold">{t('marketplace.buy-tokens')}</TabsTrigger>
          <TabsTrigger value="sell" className="text-lg font-bold">{t('marketplace.sell-tokens')}</TabsTrigger>
          <TabsTrigger value="exchange" className="text-lg font-bold">{t('marketplace.exchange')}</TabsTrigger>
          <TabsTrigger value="credit" className="text-lg font-bold">{t('marketplace.credit')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy">
          <BuyTokensTab
            buyAmount={buyAmount}
            setBuyAmount={setBuyAmount}
            buyMode={buyMode}
            setBuyMode={setBuyMode}
            tokenPrice={tokenPrice}
            ladrilloPrice={ladrilloPrice}
            ladrilloBalance={ladrilloBalance}
            onBuy={handleBuy}
          />
        </TabsContent>
        
        <TabsContent value="sell">
          <SellTokensTab
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            sellMode={sellMode}
            setSellMode={setSellMode}
            userBalance={userBalance}
            tokenPrice={tokenPrice}
            onSell={handleSell}
          />
        </TabsContent>
        
        <TabsContent value="exchange">
          <TokenExchangeTab
            userBalance={userBalance}
            ladrilloBalance={ladrilloBalance}
            exchangeRate={exchangeRate}
            ladrilloExchangeRate={ladrilloExchangeRate}
          />
        </TabsContent>
        
        <TabsContent value="credit">
          <CreditTab 
            userBalance={userBalance}
            tokenPrice={tokenPrice}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TokenMarketplace;
