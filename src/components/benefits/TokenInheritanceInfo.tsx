
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { HandHeartIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TokenInheritanceInfo: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock data for the beneficiary status
  const inheritanceStatus = {
    configured: true,
    completionPercentage: 75,
    primaryBeneficiary: "María Rodríguez",
    primaryRelation: "Cónyuge",
    primaryPercentage: 60,
    secondaryBeneficiary: "Juan Rodríguez",
    secondaryRelation: "Hijo",
    secondaryPercentage: 40,
    lastUpdate: "15/04/2023"
  };

  return (
    <Card className="border-border/50 glass-card">
      <CardHeader>
        <CardTitle>{t('inheritance.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-AFJPCripto-gradient flex items-center justify-center">
              <HandHeartIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t('inheritance.beneficiaries-config')}
              </h3>
              <p className="text-foreground/70">
                {inheritanceStatus.configured 
                  ? t('inheritance.configured-desc')
                  : t('inheritance.not-configured-desc')}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-foreground/70">{t('inheritance.config-status')}</span>
              <span className="font-medium">{inheritanceStatus.completionPercentage}% {t('inheritance.completed')}</span>
            </div>
            <Progress value={inheritanceStatus.completionPercentage} className="h-2" />
          </div>
          
          {inheritanceStatus.configured ? (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-3">{t('inheritance.designated-beneficiaries')}</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{inheritanceStatus.primaryBeneficiary}</p>
                      <p className="text-sm text-foreground/70">{inheritanceStatus.primaryRelation}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{inheritanceStatus.primaryPercentage}%</p>
                      <p className="text-sm text-foreground/70">{t('inheritance.primary-beneficiary')}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{inheritanceStatus.secondaryBeneficiary}</p>
                      <p className="text-sm text-foreground/70">{inheritanceStatus.secondaryRelation}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{inheritanceStatus.secondaryPercentage}%</p>
                      <p className="text-sm text-foreground/70">{t('inheritance.secondary-beneficiary')}</p>
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-xs text-foreground/60">
                  {t('inheritance.last-update')} {inheritanceStatus.lastUpdate}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">{t('inheritance.how-it-works')}</h4>
                <p className="text-sm text-foreground/70 mb-3">
                  {t('inheritance.description')}
                </p>
                <ol className="text-sm text-foreground/70 list-decimal pl-5 space-y-1">
                  <li>{t('inheritance.step1')}</li>
                  <li>{t('inheritance.step2')}</li>
                  <li>{t('inheritance.step3')}</li>
                  <li>{t('inheritance.step4')}</li>
                </ol>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button variant="outline">{t('inheritance.modify-beneficiaries')}</Button>
                <Button className="bg-AFJPCripto-gradient hover:opacity-90">{t('inheritance.add-documentation')}</Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-foreground/70">
                {t('inheritance.not-configured-note')}
              </p>
              <Button className="bg-AFJPCripto-gradient hover:opacity-90">
                {t('inheritance.configure-beneficiaries')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenInheritanceInfo;
