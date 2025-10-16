
import React from 'react';
import { CoinsIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Transaction = {
  id: number;
  type: 'deposit' | 'purchase' | 'sale' | 'reward';
  amount: number;
  tokens: number;
  date: string;
};

const TransactionsList: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock transaction data
  const transactions: Transaction[] = [
    { id: 1, type: 'deposit', amount: 500, tokens: 4.2, date: '15 May 2023' },
    { id: 2, type: 'purchase', amount: 1200, tokens: 10, date: '2 Abr 2023' },
    { id: 3, type: 'reward', amount: 0, tokens: 0.5, date: '28 Mar 2023' },
    { id: 4, type: 'sale', amount: 300, tokens: 2.4, date: '15 Mar 2023' },
  ];

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case 'purchase':
        return <CoinsIcon className="h-4 w-4 text-AFJPCripto-pink" />;
      case 'sale':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case 'reward':
        return <CoinsIcon className="h-4 w-4 text-AFJPCripto-purple" />;
      default:
        return <CoinsIcon className="h-4 w-4" />;
    }
  };

  const getTransactionLabel = (type: Transaction['type']) => {
    return t(`transactions.${type}`);
  };

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p className="text-center text-foreground/70 py-6">{t('transactions.no-recent')}</p>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                {getTransactionIcon(tx.type)}
              </div>
              <div>
                <p className="font-medium">{getTransactionLabel(tx.type)}</p>
                <p className="text-sm text-foreground/70">{tx.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {tx.type === 'sale' ? '-' : '+'}{tx.tokens.toFixed(2)} Tokens
              </p>
              <p className="text-sm text-foreground/70">
                {tx.type === 'reward' ? t('transactions.reward') : `$${tx.amount}`}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionsList;
