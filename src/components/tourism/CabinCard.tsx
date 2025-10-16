
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Coins, Calendar, Check } from 'lucide-react';
import CabinBookingModal from './CabinBookingModal';

interface CabinCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  pricePerNight: number;
  tokenDiscount: number;
  capacity: number;
  amenities: string[];
  description: string;
}

const CabinCard: React.FC<CabinCardProps> = ({
  id,
  name,
  location,
  image,
  pricePerNight,
  tokenDiscount,
  capacity,
  amenities,
  description
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const tokenValue = 25; // USD per JUVENTUD token
  const tokensNeeded = Math.ceil((pricePerNight * tokenDiscount / 100) / tokenValue);
  const finalPrice = pricePerNight - (pricePerNight * tokenDiscount / 100);
  
  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
        <div className="aspect-video bg-muted relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 right-3 bg-green-500 text-white">
            -{tokenDiscount}% con tokens
          </Badge>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{capacity} personas</span>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Servicios incluidos:</p>
            <div className="grid grid-cols-2 gap-1">
              {amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pricing */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Precio por noche:</span>
              <span className="text-sm line-through">${pricePerNight}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Con descuento JUVENTUD:</span>
              <span className="text-lg font-bold text-green-600">${finalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Tokens necesarios:</span>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-purple-500" />
                <span className="font-medium">{tokensNeeded} JUVENTUD</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowBookingModal(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Reservar Ahora
          </Button>
        </CardContent>
      </Card>
      
      <CabinBookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        cabin={{
          id,
          name,
          location,
          pricePerNight,
          tokenDiscount,
          tokensNeeded,
          finalPrice,
          capacity
        }}
      />
    </>
  );
};

export default CabinCard;
