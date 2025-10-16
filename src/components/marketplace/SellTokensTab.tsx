
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CoinsIcon, TrendingUpIcon } from 'lucide-react';

interface SellTokensTabProps {
  sellAmount: string;
  setSellAmount: (value: string) => void;
  sellMode: 'tokens' | 'currency';
  setSellMode: (mode: 'tokens' | 'currency') => void;
  userBalance: number;
  tokenPrice: number;
  onSell: (e: React.FormEvent) => void;
}

export const SellTokensTab: React.FC<SellTokensTabProps> = ({
  sellAmount,
  setSellAmount,
  userBalance,
  tokenPrice,
  onSell
}) => {
  const [currency, setCurrency] = React.useState<'USD' | 'PESOS'>('USD');
  const pesoRate = 1000; // 1 USD = 1000 PESOS (example rate)
  
  const getDisplayPrice = () => {
    if (currency === 'USD') {
      return (parseFloat(sellAmount || '0') * tokenPrice).toFixed(2);
    } else {
      return (parseFloat(sellAmount || '0') * tokenPrice * pesoRate).toLocaleString();
    }
  };

  const getCurrentTokenPrice = () => {
    if (currency === 'USD') {
      return `$${tokenPrice} USD`;
    } else {
      return `$${(tokenPrice * pesoRate).toLocaleString()} PESOS`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CoinsIcon className="mr-2 h-5 w-5 text-AFJPCripto-pink" /> 
          Vender Tokens AFJP
        </CardTitle>
        <CardDescription>
          Tu balance actual: {userBalance.toLocaleString()} Tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSell} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency-select">Moneda de venta</Label>
            <Select value={currency} onValueChange={(value: 'USD' | 'PESOS') => setCurrency(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD (Dólares)</SelectItem>
                <SelectItem value="PESOS">PESOS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sell-amount">Cantidad de tokens a vender</Label>
            <Input
              id="sell-amount"
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              placeholder="Cantidad de tokens"
              max={userBalance}
              min="0"
            />
          </div>
          
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-foreground/70">
                    Recibirás en {currency}
                  </p>
                  <p className="text-xl font-bold">
                    ${getDisplayPrice()} {currency}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-AFJPCripto-gradient flex items-center justify-center">
                  <TrendingUpIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                Precio actual: 1 Token AFJP = {getCurrentTokenPrice()}
              </p>
            </CardContent>
          </Card>
          
          <Button 
            type="submit" 
            className="w-full bg-AFJPCripto-gradient hover:opacity-90"
            disabled={!sellAmount || parseFloat(sellAmount) <= 0 || parseFloat(sellAmount) > userBalance}
          >
            Confirmar Venta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
