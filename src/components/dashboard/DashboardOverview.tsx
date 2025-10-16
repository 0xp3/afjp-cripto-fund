
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChartIcon, CoinsIcon, CreditCardIcon, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import TokenValueChart from './TokenValueChart';
import TransactionsList from './TransactionsList';
import NewsFeed from './NewsFeed';
import UserMetrics from './UserMetrics';

const DashboardOverview: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock data
  const tokenAmount = 1250;
  const tokenValue = 120.75;
  const totalValue = tokenAmount * tokenValue;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{t('dashboard.title')}</h2>
        <Button className="bg-AFJPCripto-gradient hover:opacity-90">{t('dashboard.contribute-now')}</Button>
      </div>
      
      {/* Main token value card */}
      <Card className="border-border/50 glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-foreground/70">{t('dashboard.retirement-tokens')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mr-4">
                  <CoinsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-bold">{tokenAmount.toLocaleString()}</p>
                  <p className="text-foreground/70">{t('dashboard.afjp-tokens')}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-foreground/70">{t('dashboard.total-estimated-value')}</p>
                <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                <p className="text-foreground/70 text-sm">
                  ${tokenValue} <span className="text-green-500">+2.5%</span> {t('dashboard.per-token')}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <TokenValueChart />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* User Metrics Section */}
      <UserMetrics />
      
      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mr-4">
                <CreditCardIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('dashboard.contribute')}</h3>
                <p className="text-foreground/70 text-sm">{t('dashboard.contribute-desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mr-4">
                <LineChartIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('dashboard.submarket')}</h3>
                <p className="text-foreground/70 text-sm">{t('dashboard.submarket-desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mr-4">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('dashboard.benefits')}</h3>
                <p className="text-foreground/70 text-sm">{t('dashboard.benefits-desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions and News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-foreground/70">{t('dashboard.recent-transactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsList />
          </CardContent>
        </Card>
        
        <Card className="border-border/50 glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-foreground/70">{t('dashboard.fund-news')}</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsFeed />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
