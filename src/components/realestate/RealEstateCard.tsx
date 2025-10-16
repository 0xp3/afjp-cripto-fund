
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BuildingIcon, MapPinIcon, CalendarIcon, PercentIcon, CoinsIcon } from 'lucide-react';

interface RealEstateProject {
  id: number;
  title: string;
  location: string;
  type: string;
  status: string;
  completion: string;
  available: boolean;
  discount: number;
  rentalYield: number;
  images: string[];
  rentalPriceJuventud?: number;
  purchasePriceLadrillo?: number;
}

interface RealEstateCardProps {
  project: RealEstateProject;
}

const RealEstateCard: React.FC<RealEstateCardProps> = ({ project }) => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % project.images.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length);
  };
  
  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 glass-card">
      <div className="relative h-48">
        <img 
          src={project.images[currentImage]} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        {project.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              &lt;
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              &gt;
            </button>
          </>
        )}
        <div className="absolute top-2 left-2">
          <Badge 
            className={
              project.status === 'Completado' ? 'bg-green-500' : 
              project.status === 'En Construcción' ? 'bg-amber-500' : 
              'bg-blue-500'
            }
          >
            {project.status}
          </Badge>
        </div>
        {project.available && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-AFJPCripto-gradient">Disponible</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">{project.title}</h3>
        
        <div className="space-y-2 mt-3">
          <div className="flex items-center text-sm text-foreground/70">
            <MapPinIcon className="h-4 w-4 mr-2 text-AFJPCripto-pink" />
            {project.location}
          </div>
          
          <div className="flex items-center text-sm text-foreground/70">
            <BuildingIcon className="h-4 w-4 mr-2 text-AFJPCripto-pink" />
            {project.type}
          </div>
          
          <div className="flex items-center text-sm text-foreground/70">
            <CalendarIcon className="h-4 w-4 mr-2 text-AFJPCripto-pink" />
            Finalización: {project.completion}
          </div>
          
          <div className="flex items-center text-sm text-foreground/70">
            <PercentIcon className="h-4 w-4 mr-2 text-AFJPCripto-pink" />
            Rentabilidad estimada: {project.rentalYield}%
          </div>
        </div>
        
        {project.available && (
          <div className="mt-4 space-y-2">
            <div className="p-2 bg-muted/30 rounded-md">
              <p className="text-sm flex items-center">
                <span className="font-medium text-AFJPCripto-pink">Beneficio Afiliados:</span>
                <span className="ml-2">{project.discount}% descuento en alquiler</span>
              </p>
            </div>
            
            {project.rentalPriceJuventud && (
              <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md border border-blue-200/20">
                <p className="text-sm flex items-center">
                  <CoinsIcon className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="font-medium">Alquiler:</span>
                  <span className="ml-2">{project.rentalPriceJuventud} JUVENTUD/mes</span>
                </p>
              </div>
            )}
            
            {project.purchasePriceLadrillo && (
              <div className="p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-md border border-orange-200/20">
                <p className="text-sm flex items-center">
                  <CoinsIcon className="h-4 w-4 mr-1 text-orange-500" />
                  <span className="font-medium">Compra:</span>
                  <span className="ml-2">{project.purchasePriceLadrillo.toLocaleString()} LADRILLO</span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button variant="outline" className="w-full">Ver Detalles</Button>
        {project.available && (
          <div className="flex gap-2 w-full">
            {project.rentalPriceJuventud && (
              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                <CoinsIcon className="h-4 w-4 mr-1" />
                Alquilar
              </Button>
            )}
            {project.purchasePriceLadrillo && (
              <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90">
                <CoinsIcon className="h-4 w-4 mr-1" />
                Comprar
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RealEstateCard;
