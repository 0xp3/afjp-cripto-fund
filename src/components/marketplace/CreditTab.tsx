
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCardIcon, ShieldIcon, PercentIcon, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreditTabProps {
  userBalance: number;
  tokenPrice: number;
}

export const CreditTab: React.FC<CreditTabProps> = ({ userBalance, tokenPrice }) => {
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('12');
  const [collateralTokens, setCollateralTokens] = useState<string>('');
  
  // Credit calculation parameters
  const collateralRatio = 0.75; // 75% loan-to-value ratio
  const interestRate = 0.08; // 8% annual interest rate
  
  // Calculate required collateral
  const requiredCollateral = creditAmount ? (parseFloat(creditAmount) / tokenPrice / collateralRatio) : 0;
  
  // Calculate monthly payment
  const monthlyRate = interestRate / 12;
  const numPayments = parseInt(loanTerm) || 12;
  const monthlyPayment = creditAmount && numPayments > 0 
    ? (parseFloat(creditAmount) * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;
  
  const handleCreditRequest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`SIMULACIÓN: Solicitud de crédito por $${creditAmount} USD con ${requiredCollateral.toFixed(0)} tokens AFJP como garantía. Pago mensual: $${monthlyPayment.toFixed(2)} USD por ${loanTerm} meses.`);
  };
  
  const canApplyForCredit = creditAmount && 
    parseFloat(creditAmount) > 0 && 
    requiredCollateral <= userBalance &&
    requiredCollateral > 0;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCardIcon className="mr-2 h-5 w-5 text-green-500" />
            Crédito con Garantía AFJP
          </CardTitle>
          <CardDescription>
            Solicita créditos usando tus tokens AFJP como garantía
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreditRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credit-amount">Monto del Crédito (USD)</Label>
                <Input
                  id="credit-amount"
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="10,000"
                  min="1000"
                  max={userBalance * tokenPrice * collateralRatio}
                  step="100"
                />
                <p className="text-xs text-foreground/50">
                  Mínimo: $1,000 - Máximo: ${(userBalance * tokenPrice * collateralRatio).toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loan-term">Plazo del Préstamo</Label>
                <Select value={loanTerm} onValueChange={setLoanTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el plazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="18">18 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="36">36 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {creditAmount && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/70">Garantía requerida:</span>
                      <div className="text-right">
                        <p className="font-bold">{requiredCollateral.toFixed(0)} Tokens AFJP</p>
                        <p className="text-xs text-foreground/50">
                          ${(requiredCollateral * tokenPrice).toLocaleString()} USD
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/70">Pago mensual:</span>
                      <p className="font-bold">${monthlyPayment.toFixed(2)} USD</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/70">Tasa de interés:</span>
                      <p className="font-bold">{(interestRate * 100).toFixed(1)}% anual</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/70">Ratio LTV:</span>
                      <p className="font-bold">{(collateralRatio * 100)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
              disabled={!canApplyForCredit}
            >
              Solicitar Crédito
            </Button>
            
            {requiredCollateral > userBalance && creditAmount && (
              <p className="text-sm text-red-500 text-center">
                ⚠️ No tienes suficientes tokens AFJP para esta garantía
              </p>
            )}
          </form>
        </CardContent>
      </Card>
      
      {/* Credit Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShieldIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-700">Garantía Segura</p>
                <p className="text-sm text-green-600">Tokens bloqueados como garantía</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PercentIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-700">Tasa Competitiva</p>
                <p className="text-sm text-blue-600">8% anual fijo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-purple-700">Plazos Flexibles</p>
                <p className="text-sm text-purple-600">6 a 36 meses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Terms and Conditions */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Términos y Condiciones del Crédito</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Los tokens AFJP utilizados como garantía quedan bloqueados durante la vigencia del préstamo</li>
            <li>• En caso de default, los tokens garantía pueden ser liquidados para cubrir la deuda</li>
            <li>• Tasa de interés fija del 8% anual durante todo el plazo del préstamo</li>
            <li>• Ratio Loan-to-Value (LTV) máximo del 75%</li>
            <li>• Pagos mensuales fijos calculados con sistema francés</li>
            <li>• Prepago total o parcial sin penalidades</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
