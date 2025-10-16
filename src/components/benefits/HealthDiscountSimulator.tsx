
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';

const HealthDiscountSimulator: React.FC = () => {
  const { t } = useLanguage();
  
  const [medicinePrice, setMedicinePrice] = useState<number>(1000);
  const [tokenBalance, setTokenBalance] = useState<number>(500);
  
  // Calculation constants
  const baseDiscount = 30; // percentage
  const maxAdditionalDiscount = 10; // percentage
  const tokenThreshold = 1000; // tokens needed for max additional discount
  
  // Calculate the additional discount based on token balance
  const additionalDiscount = Math.min(
    (tokenBalance / tokenThreshold) * maxAdditionalDiscount,
    maxAdditionalDiscount
  );
  
  const totalDiscountPercentage = baseDiscount + additionalDiscount;
  const discountAmount = (medicinePrice * totalDiscountPercentage) / 100;
  const finalPrice = medicinePrice - discountAmount;
  
  return (
    <Card className="border-border/50 glass-card">
      <CardHeader>
        <CardTitle>{t('health.simulator-title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="medicine-price">{t('health.medicine-price')}</Label>
            <div className="flex gap-4">
              <Slider
                id="medicine-price-slider"
                min={100}
                max={10000}
                step={100}
                value={[medicinePrice]}
                onValueChange={(value) => setMedicinePrice(value[0])}
                className="flex-grow"
              />
              <Input
                id="medicine-price"
                type="number"
                value={medicinePrice}
                onChange={(e) => setMedicinePrice(Number(e.target.value))}
                className="w-20 text-right"
                min={100}
                max={10000}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token-balance">{t('health.token-balance')}</Label>
            <div className="flex gap-4">
              <Slider
                id="token-balance-slider"
                min={0}
                max={2000}
                step={10}
                value={[tokenBalance]}
                onValueChange={(value) => setTokenBalance(value[0])}
                className="flex-grow"
              />
              <Input
                id="token-balance"
                type="number"
                value={tokenBalance}
                onChange={(e) => setTokenBalance(Number(e.target.value))}
                className="w-20 text-right"
                min={0}
                max={2000}
              />
            </div>
            <p className="text-xs text-foreground/60">
              {t('health.more-tokens-desc')} {maxAdditionalDiscount}%)
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-foreground/70">{t('health.base-discount')}</span>
              <span className="font-semibold">{baseDiscount}%</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-foreground/70">{t('health.additional-discount')}</span>
              <span className="font-semibold">{additionalDiscount.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-foreground/70">{t('health.total-discount')}</span>
              <span className="font-semibold">{totalDiscountPercentage.toFixed(1)}%</span>
            </div>
            
            <div className="border-t border-border/50 my-3 pt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-foreground/70">{t('health.original-price')}</span>
                <span className="font-semibold">ARS {medicinePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-foreground/70">{t('health.applied-discount')}</span>
                <span className="font-semibold text-green-500">- ARS {discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold">{t('health.final-price')}</span>
                <span className="text-lg font-bold text-AFJPCripto-pink">ARS {finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-center text-foreground/70">
            {t('health.simulator-note')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthDiscountSimulator;
