
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Coins, MapPin, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface CabinBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabin: {
    id: string;
    name: string;
    location: string;
    pricePerNight: number;
    tokenDiscount: number;
    tokensNeeded: number;
    finalPrice: number;
    capacity: number;
  };
}

const CabinBookingModal: React.FC<CabinBookingModalProps> = ({
  isOpen,
  onClose,
  cabin
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();
  
  // Mock user data
  const juventudBalance = 450;
  
  // Calculate total
  const nights = checkIn && checkOut ? 
    Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const totalTokens = cabin.tokensNeeded * nights;
  const totalPrice = cabin.finalPrice * nights;
  const originalTotal = cabin.pricePerNight * nights;
  const totalSavings = originalTotal - totalPrice;
  
  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Error",
        description: "Por favor selecciona las fechas de entrada y salida",
        variant: "destructive"
      });
      return;
    }
    
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast({
        title: "Error",
        description: "La fecha de salida debe ser posterior a la de entrada",
        variant: "destructive"
      });
      return;
    }
    
    if (totalTokens > juventudBalance) {
      toast({
        title: "Saldo Insuficiente",
        description: "No tienes suficientes tokens JUVENTUD para esta reserva",
        variant: "destructive"
      });
      return;
    }
    
    if (guests > cabin.capacity) {
      toast({
        title: "Error",
        description: `La cabaña tiene capacidad máxima para ${cabin.capacity} personas`,
        variant: "destructive"
      });
      return;
    }
    
    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      onClose();
      
      toast({
        title: "¡Reserva Confirmada!",
        description: `Tu reserva en ${cabin.name} ha sido confirmada. Se utilizaron ${totalTokens} tokens JUVENTUD.`,
      });
      
      // Reset form
      setCheckIn('');
      setCheckOut('');
      setGuests(2);
    }, 2000);
  };
      const { t } = useLanguage();
  
  return (
    
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            {t('tourism.book')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cabin Info */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">{cabin.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{cabin.location}</span>
            </div>
            <Badge className="bg-green-100 text-green-700">
              -{cabin.tokenDiscount}% descuento con tokens
            </Badge>
          </div>
          
          {/* Booking Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkin">{t('tourism.checkin')}</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout">{t('tourism.checkout')}</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guests">{t('tourism.guests')}</Label>
              <Input
                id="guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                min={1}
                max={cabin.capacity}
              />
              <p className="text-xs text-muted-foreground">
                {t('tourism.max')} {cabin.capacity} {t('tourism.people')}
              </p>
            </div>
          </div>
          
          {/* Balance Display */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tu saldo JUVENTUD:</span>
              <Badge className="bg-purple-500">
                {juventudBalance} Tokens
              </Badge>
            </div>
          </div>
          
          {/* Booking Summary */}
          {checkIn && checkOut && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Resumen de Reserva</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Noches:</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio original:</span>
                  <span className="line-through">${originalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Ahorro con tokens:</span>
                  <span>-${totalSavings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total a pagar:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tokens necesarios:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{totalTokens} JUVENTUD</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isBooking}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleBooking}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
              disabled={isBooking || !checkIn || !checkOut || totalTokens > juventudBalance}
            >
              {isBooking ? (
                "Procesando..."
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirmar Reserva
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CabinBookingModal;
