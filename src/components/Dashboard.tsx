
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardOverview from './dashboard/DashboardOverview';
import ContributionsModule from './contributions/ContributionsModule';
import TokenMarketplace from './marketplace/TokenMarketplace';
import RealEstateProjects from './realestate/RealEstateProjects';
import BenefitsSection from './benefits/BenefitsSection';
import TourismSection from './tourism/TourismSection';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { t } = useLanguage();
  
  return (
    <div className="container py-8 px-4 md:py-12">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-5xl mx-auto mb-8 grid grid-cols-6">
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="contribute">{t('tabs.contribute')}</TabsTrigger>
          <TabsTrigger value="marketplace">{t('tabs.marketplace')}</TabsTrigger>
          <TabsTrigger value="realestate">{t('tabs.realestate')}</TabsTrigger>
          <TabsTrigger value="tourism">{t('tabs.tourism')}</TabsTrigger>
          <TabsTrigger value="benefits">{t('tabs.benefits')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <DashboardOverview />
        </TabsContent>
        
        <TabsContent value="contribute" className="mt-6">
          <ContributionsModule />
        </TabsContent>
        
        <TabsContent value="marketplace" className="mt-6">
          <TokenMarketplace />
        </TabsContent>
        
        <TabsContent value="realestate" className="mt-6">
          <RealEstateProjects />
        </TabsContent>
        
        <TabsContent value="tourism" className="mt-6">
          <TourismSection />
        </TabsContent>
        
        <TabsContent value="benefits" className="mt-6">
          <BenefitsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
