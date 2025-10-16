
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRightIcon, CalendarIcon, TrendingUpIcon, Clock, Coins, ArrowUpIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ContributionsModule: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const { t } = useLanguage();
  
  // Token price in USD
  const tokenPrice = 120.75;
  const contributionAmount = 150; // USD per month
  
  // Token growth metrics
  const initialTokenPrice = 85.50; // Price when user started contributing
  const tokenGrowth = ((tokenPrice - initialTokenPrice) / initialTokenPrice) * 100;
  const tokenValueAppreciation = tokenGrowth > 0 ? tokenGrowth : 0;
  
  // Mock retirement data
  const retirementData = {
    monthsPaid: 142,
    yearsAccumulated: 11.8,
    nextPaymentMonth: 'Sep 2025',
    monthsToRetirement: 218,
    yearsToRetirement: 18.2,
    retirementAge: 65,
    currentAge: 46.8
  };
  
  // Calculate accumulated tokens based on months paid (rounded)
  const tokensAccumulated = Math.round((retirementData.monthsPaid * contributionAmount) / tokenPrice);
  
  // Mock payment history
  const paymentHistory = [
    { year: 2024, monthsPaid: 12, totalAmount: 14400, status: 'Completo' },
    { year: 2023, monthsPaid: 12, totalAmount: 13800, status: 'Completo' },
    { year: 2022, monthsPaid: 11, totalAmount: 12600, status: 'Incompleto' },
    { year: 2021, monthsPaid: 12, totalAmount: 13200, status: 'Completo' },
    { year: 2020, monthsPaid: 10, totalAmount: 10800, status: 'Incompleto' }
  ];
  
  // Calculate tokens that would be received
  const tokensToReceive = parseFloat(amount) / tokenPrice;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Simulación: Aporte de ${currency} ${amount} procesado. Recibirías ${tokensToReceive.toFixed(2)} tokens AFJP.`);
  };
  
  return (
    <div className="space-y-6">
      {/* Retirement Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-border/50 glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{retirementData.monthsPaid}</p>
                <p className="text-foreground/70 text-sm">{t('contribute.months')}</p>
                <p className="text-foreground/50 text-xs">{retirementData.yearsAccumulated} {t('contribute.years')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center mr-4">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tokensAccumulated}</p>
                <p className="text-foreground/70 text-sm">{t('contribute.tokens')}</p>
                <p className="text-foreground/50 text-xs">{t('contribute.total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mr-4">
                <ArrowUpIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">+{tokenValueAppreciation.toFixed(1)}%</p>
                <p className="text-foreground/70 text-sm">{t('contribute.growth')}</p>
                <p className="text-foreground/50 text-xs">{t('contribute.beginning')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center mr-4">
                <TrendingUpIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{retirementData.nextPaymentMonth}</p>
                <p className="text-foreground/70 text-sm">{t('contribute.next')}</p>
                <p className="text-foreground/50 text-xs">{t('contribute.next-month')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{retirementData.monthsToRetirement}</p>
                <p className="text-foreground/70 text-sm">{t('contribute.pending')}</p>
                <p className="text-foreground/50 text-xs">{retirementData.yearsToRetirement} {t('contribute.pending-years')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress to Retirement */}
      <Card className="border-border/50 glass-card">
        <CardHeader>
          <CardTitle className="text-xl">{t('contribute.progress')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{t('contribute.age')} {retirementData.currentAge} {t('contribute.agey')}.</span>
              <span>{t('contribute.ageof')} {retirementData.retirementAge} {t('contribute.agey')}.</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-AFJPCripto-gradient h-3 rounded-full transition-all duration-500"
                style={{ width: `${(retirementData.yearsAccumulated / 30) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-foreground/70">
              <span>{retirementData.yearsAccumulated}{t('contribute.completed')}</span>
              <span>{(30 - retirementData.yearsAccumulated).toFixed(1)}{t('contribute.rest')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment History */}
      <Card className="border-border/50 glass-card">
        <CardHeader>
          <CardTitle className="text-xl">{t('contribute.transactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('contribute.year')}</TableHead>
                <TableHead>{t('contribute.month')}</TableHead>
                <TableHead>{t('contribute.amount')}</TableHead>
                <TableHead>{t('contribute.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.year}>
                  <TableCell className="font-medium">{payment.year}</TableCell>
                  <TableCell>{payment.monthsPaid}/12</TableCell>
                  <TableCell>${payment.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'Completo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* New Contribution Form */}
      <div className="max-w-xl mx-auto">
        <Card className="border-border/50 glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{t('contribute.new')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency-type">{t('contribute.currency')}</Label>
                <RadioGroup 
                  id="currency-type" 
                  value={currency} 
                  onValueChange={setCurrency}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USD" id="usd" />
                    <Label htmlFor="usd">USD</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ARS" id="ars" />
                    <Label htmlFor="ars">ARS</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">{t('contribute.contribution')}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-foreground/70">{currency === 'USD' ? '$' : '$'}</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8"
                    min="1"
                  />
                </div>
              </div>
              
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-foreground/70">{t('contribute.receive')}</p>
                      <p className="text-2xl font-bold">
                        {isNaN(tokensToReceive) ? '0.00' : tokensToReceive.toFixed(2)} 
                        <span className="text-foreground/70 text-lg ml-1">{t('contribute.afjp')}</span>
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-AFJPCripto-gradient flex items-center justify-center">
                      <ArrowRightIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-foreground/50 mt-2">
                    {t('contribute.rate')}${tokenPrice} {currency}
                  </p>
                </CardContent>
              </Card>
              
              <Button 
                type="submit" 
                className="w-full bg-AFJPCripto-gradient hover:opacity-90"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                {t('contribute.confirm')}
              </Button>
              
              <p className="text-xs text-foreground/50 text-center">
                {t('contribute.add')}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContributionsModule;
