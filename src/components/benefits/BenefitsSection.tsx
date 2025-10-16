
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, Coins, FileText, Clock } from 'lucide-react';
import HealthDiscountSimulator from './HealthDiscountSimulator';
import TokenInheritanceInfo from './TokenInheritanceInfo';
import QRPaymentBenefit from './QRPaymentBenefit';
import { useLanguage } from '@/contexts/LanguageContext';

const BenefitsSection: React.FC = () => {
    const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('health.header')}</h2>
        <p className="text-foreground/70">
          {t('health.subtitle')}
        </p>
      </div>
      
      {/* Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Real Estate Benefits */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="pb-3">
            <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mb-2">
              <Building className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">{t('health.benefit-a')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-a-title')}</Badge>
                <span>{t('health.benefit-a-subtitle')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-a-title-b')}</Badge>
                <span>{t('health.benefit-a-subtitle-b')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-a-title-c')}</Badge>
                <span>{t('health.benefit-a-subtitle-c')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">{t('health.benefit-a-cta')}</Button>
          </CardFooter>
        </Card>
        
        {/* Health Benefits */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="pb-3">
            <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">{t('health.benefit-b')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-b-title')}</Badge>
                <span>{t('health.benefit-b-subtitle')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-b-title-b')}</Badge>
                <span>{t('health.benefit-b-subtitle-b')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-b-title-c')}</Badge>
                <span>{t('health.benefit-b-subtitle-c')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">{t('health.benefit-b-cta')}</Button>
          </CardFooter>
        </Card>
        
        {/* Inheritance Benefits */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="pb-3">
            <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">{t('health.benefit-c')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-c-title')}</Badge>
                <span>{t('health.benefit-c-subtitle')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-c-title-b')}</Badge>
                <span>{t('health.benefit-c-subtitle-b')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-c-title-c')}</Badge>
                <span>{t('health.benefit-c-subtitle-c')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">{t('health.benefit-c-cta')}</Button>
          </CardFooter>
        </Card>
        
        {/* Token Benefits */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="pb-3">
            <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mb-2">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">{t('health.benefit-d')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-d-title')}</Badge>
                <span>{t('health.benefit-d-subtitle')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-d-title-b')}</Badge>
                <span>{t('health.benefit-d-subtitle-b')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1 bg-AFJPCripto-gradient">{t('health.benefit-d-title-c')}</Badge>
                <span>{t('health.benefit-d-subtitle-c')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">{t('health.benefit-d-cta')}</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Separator />
      
      {/* QR Payment Benefit */}
      <QRPaymentBenefit />
      
      <Separator />
      
      {/* Interactive sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Health Discount Simulator */}
        <HealthDiscountSimulator />
        
        {/* Token Inheritance Information */}
        <TokenInheritanceInfo />
      </div>
    </div>
  );
};

export default BenefitsSection;
