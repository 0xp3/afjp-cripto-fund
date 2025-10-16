
import React from 'react';
import { Building, CoinsIcon, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type NewsItem = {
  id: number;
  titleKey: string;
  excerptKey: string;
  date: string;
  category: 'investment' | 'token' | 'benefits' | 'general';
};

const NewsFeed: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock news data with translation keys
  const news: NewsItem[] = [
    {
      id: 1,
      titleKey: 'news.new-property',
      excerptKey: 'news.new-property-desc',
      date: '20 May 2023',
      category: 'investment'
    },
    {
      id: 2,
      titleKey: 'news.token-high',
      excerptKey: 'news.token-high-desc',
      date: '18 May 2023',
      category: 'token'
    },
    {
      id: 3,
      titleKey: 'news.health-benefits',
      excerptKey: 'news.health-benefits-desc',
      date: '10 May 2023',
      category: 'benefits'
    },
  ];

  const getNewsIcon = (category: NewsItem['category']) => {
    switch (category) {
      case 'investment':
        return <Building className="h-4 w-4 text-AFJPCripto-cyan" />;
      case 'token':
        return <CoinsIcon className="h-4 w-4 text-AFJPCripto-pink" />;
      case 'benefits':
        return <FileText className="h-4 w-4 text-AFJPCripto-purple" />;
      default:
        return <CoinsIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {news.length === 0 ? (
        <p className="text-center text-foreground/70 py-6">{t('news.no-recent')}</p>
      ) : (
        news.map((item) => (
          <div key={item.id} className="flex gap-3 py-2 border-b border-border/30 last:border-0">
            <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center mt-1">
              {getNewsIcon(item.category)}
            </div>
            <div>
              <p className="font-medium">{t(item.titleKey)}</p>
              <p className="text-sm text-foreground/70">{t(item.excerptKey)}</p>
              <p className="text-xs text-foreground/70 mt-1">{item.date}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsFeed;
