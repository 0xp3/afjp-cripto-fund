
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUpIcon, CoinsIcon, UsersIcon } from 'lucide-react';

interface MarketplaceStatsProps {
  tokenPrice: number;
  userBalance: number;
}

export const MarketplaceStats: React.FC<MarketplaceStatsProps> = ({ tokenPrice, userBalance }) => {
  // Mock statistics
  const tokenChange = 2.5; // percentage
  const volume24h = 45000; // tokens
  const holders = 2850; // users
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-border/50 glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm">Precio Token</p>
              <p className="text-2xl font-bold">${tokenPrice}</p>
              <p className={`text-sm ${tokenChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tokenChange >= 0 ? '+' : ''}{tokenChange}% (24h)
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center">
              <TrendingUpIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm">Volumen 24h</p>
              <p className="text-2xl font-bold">{volume24h.toLocaleString()}</p>
              <p className="text-sm text-foreground/70">Tokens</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center">
              <CoinsIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm">Holders</p>
              <p className="text-2xl font-bold">{holders.toLocaleString()}</p>
              <p className="text-sm text-foreground/70">Usuarios</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-AFJPCripto-gradient flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
