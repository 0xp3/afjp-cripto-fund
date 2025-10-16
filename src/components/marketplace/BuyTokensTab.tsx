
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CoinsIcon, TrendingUpIcon, HomeIcon } from 'lucide-react';

interface BuyTokensTabProps {
  buyAmount: string;
  setBuyAmount: (value: string) => void;
  buyMode: 'tokens' | 'currency';
  setBuyMode: (mode: 'tokens' | 'currency') => void;
  tokenPrice: number;
  ladrilloPrice: number;
  ladrilloBalance: number;
  onBuy: (e: React.FormEvent) => void;
}

export const BuyTokensTab: React.FC<BuyTokensTabProps> = ({
  buyAmount,
  setBuyAmount,
  buyMode,
  setBuyMode,
  tokenPrice,
  ladrilloPrice,
  ladrilloBalance,
  onBuy
}) => {
  const [ladrilloAmount, setLadrilloAmount] = useState<string>('');
  const [ladrilloMode, setLadrilloMode] = useState<'tokens' | 'currency'>('tokens');
  
  const ladrilloTokensToReceive = ladrilloMode === 'tokens' 
    ? parseFloat(ladrilloAmount) 
    : parseFloat(ladrilloAmount) / ladrilloPrice;
  
  const handleLadrilloBuy = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`SIMULACIÓN: Comprar ${ladrilloTokensToReceive.toFixed(2)} tokens LADRILLO por $${(ladrilloTokensToReceive * ladrilloPrice).toFixed(2)} USD`);
  };

  return (
    <div className="space-y-6">
      {/* AFJP Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CoinsIcon className="mr-2 h-5 w-5 text-AFJPCripto-pink" /> 
            Comprar Tokens AFJP
          </CardTitle>
          <CardDescription>
            Adquiere tokens para aumentar tu jubilación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onBuy} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="buy-mode">Quiero comprar por</Label>
                <div className="flex gap-2 text-sm">
                  <button 
                    type="button" 
                    onClick={() => setBuyMode('tokens')}
                    className={`px-2 py-1 rounded ${buyMode === 'tokens' ? 'bg-primary text-white' : 'bg-muted'}`}
                  >
                    Tokens
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBuyMode('currency')}
                    className={`px-2 py-1 rounded ${buyMode === 'currency' ? 'bg-primary text-white' : 'bg-muted'}`}
                  >
                    USD
                  </button>
                </div>
              </div>
              <Input
                id="buy-amount"
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder={buyMode === 'tokens' ? "Cantidad de tokens" : "Monto en USD"}
                min="0"
              />
            </div>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground/70">
                      {buyMode === 'tokens' ? 'Costo total' : 'Recibirás'}
                    </p>
                    <p className="text-xl font-bold">
                      {buyMode === 'tokens' 
                        ? `$${(parseFloat(buyAmount || '0') * tokenPrice).toFixed(2)} USD`
                        : `${(parseFloat(buyAmount || '0') / tokenPrice).toFixed(2)} Tokens`
                      }
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-AFJPCripto-gradient flex items-center justify-center">
                    <TrendingUpIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-foreground/50 mt-2">
                  Precio actual: 1 Token AFJP = ${tokenPrice} USD
                </p>
              </CardContent>
            </Card>
            
            <Button 
              type="submit" 
              className="w-full bg-AFJPCripto-gradient hover:opacity-90"
              disabled={!buyAmount || parseFloat(buyAmount) <= 0}
            >
              Confirmar Compra AFJP
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LADRILLO Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HomeIcon className="mr-2 h-5 w-5 text-orange-500" />
            Comprar Tokens LADRILLO
          </CardTitle>
          <CardDescription>
            Tokens especializados para inversiones inmobiliarias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70 mb-4">
            Saldo actual: {ladrilloBalance.toLocaleString()} LADRILLO
          </p>
          
          <form onSubmit={handleLadrilloBuy} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="ladrillo-mode">Quiero comprar por</Label>
                <div className="flex gap-2 text-sm">
                  <button 
                    type="button" 
                    onClick={() => setLadrilloMode('tokens')}
                    className={`px-2 py-1 rounded ${ladrilloMode === 'tokens' ? 'bg-primary text-white' : 'bg-muted'}`}
                  >
                    Tokens
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setLadrilloMode('currency')}
                    className={`px-2 py-1 rounded ${ladrilloMode === 'currency' ? 'bg-primary text-white' : 'bg-muted'}`}
                  >
                    USD
                  </button>
                </div>
              </div>
              <Input
                id="ladrillo-amount"
                type="number"
                value={ladrilloAmount}
                onChange={(e) => setLadrilloAmount(e.target.value)}
                placeholder={ladrilloMode === 'tokens' ? "Cantidad de tokens" : "Monto en USD"}
                min="0"
              />
            </div>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground/70">
                      {ladrilloMode === 'tokens' ? 'Costo total' : 'Recibirás'}
                    </p>
                    <p className="text-xl font-bold">
                      {ladrilloMode === 'tokens' 
                        ? `$${(parseFloat(ladrilloAmount || '0') * ladrilloPrice).toFixed(2)} USD`
                        : `${(parseFloat(ladrilloAmount || '0') / ladrilloPrice).toFixed(2)} Tokens`
                      }
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <HomeIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-foreground/50 mt-2">
                  Precio actual: 1 Token LADRILLO = ${ladrilloPrice} USD
                </p>
              </CardContent>
            </Card>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
              disabled={!ladrilloAmount || parseFloat(ladrilloAmount) <= 0}
            >
              Confirmar Compra LADRILLO
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
