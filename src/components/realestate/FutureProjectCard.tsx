
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BuildingIcon, 
  MapPinIcon, 
  CalendarIcon, 
  TrendingUpIcon, 
  CoinsIcon,
  TargetIcon,
  ClockIcon
} from 'lucide-react';

interface FutureProject {
  id: number;
  title: string;
  location: string;
  type: string;
  status: string;
  startDate: string;
  estimatedCompletion: string;
  fundingGoal: number;
  currentFunding: number;
  minInvestment: number;
  expectedReturn: number;
  description: string;
  images: string[];
}

interface FutureProjectCardProps {
  project: FutureProject;
}

const FutureProjectCard: React.FC<FutureProjectCardProps> = ({ project }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [showInvestForm, setShowInvestForm] = useState(false);
  
  // Calculate funding progress percentage
  const fundingProgress = (project.currentFunding / project.fundingGoal) * 100;
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % project.images.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(investmentAmount);
    if (amount >= project.minInvestment) {
      alert(`SIMULACIÓN: Invertir ${amount.toLocaleString()} tokens LADRILLO en "${project.title}". Esta inversión te dará participación en el proyecto con un retorno estimado del ${project.expectedReturn}% anual.`);
      setInvestmentAmount('');
      setShowInvestForm(false);
    } else {
      alert(`La inversión mínima es de ${project.minInvestment.toLocaleString()} tokens LADRILLO`);
    }
  };
  
  return (
    <Card className="overflow-hidden border-orange-200/50 hover:shadow-lg transition-all duration-300 glass-card border-2">
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
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            {project.status}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            🚀 Próximamente
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <p className="text-sm text-foreground/70">{project.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-foreground/70">
            <MapPinIcon className="h-4 w-4 mr-2 text-orange-500" />
            {project.location}
          </div>
          
          <div className="flex items-center text-sm text-foreground/70">
            <BuildingIcon className="h-4 w-4 mr-2 text-orange-500" />
            {project.type}
          </div>
          
          <div className="flex items-center text-sm text-foreground/70">
            <CalendarIcon className="h-4 w-4 mr-2 text-orange-500" />
            Inicio: {project.startDate}
          </div>
          
          <div className="flex items-center text-sm text-foreground/70">
            <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />
            Finalización estimada: {project.estimatedCompletion}
          </div>
          
          <div className="flex items-center text-sm text-foreground/70">
            <TrendingUpIcon className="h-4 w-4 mr-2 text-orange-500" />
            Retorno esperado: {project.expectedReturn}% anual
          </div>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progreso de Financiamiento</span>
            <span className="text-sm text-foreground/70">{fundingProgress.toFixed(1)}%</span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
          <div className="flex justify-between text-xs text-foreground/60">
            <span>${project.currentFunding.toLocaleString()} LADRILLO</span>
            <span>Meta: ${project.fundingGoal.toLocaleString()} LADRILLO</span>
          </div>
        </div>

        {/* Investment Info */}
        <div className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-200/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center">
              <TargetIcon className="h-4 w-4 mr-1 text-orange-500" />
              Inversión Mínima
            </span>
            <span className="font-bold">{project.minInvestment.toLocaleString()} LADRILLO</span>
          </div>
          <p className="text-xs text-foreground/70">
            Retorno estimado al completarse el proyecto
          </p>
        </div>

        {/* Investment Form */}
        {showInvestForm && (
          <form onSubmit={handleInvest} className="space-y-3 p-3 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor={`invest-${project.id}`} className="text-sm">
                Cantidad a Invertir (LADRILLO)
              </Label>
              <Input
                id={`invest-${project.id}`}
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder={`Mínimo ${project.minInvestment.toLocaleString()}`}
                min={project.minInvestment}
                step="100"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-sm"
                disabled={!investmentAmount || parseFloat(investmentAmount) < project.minInvestment}
              >
                <CoinsIcon className="h-4 w-4 mr-1" />
                Confirmar Inversión
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowInvestForm(false)}
                className="text-sm"
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-full"
        >
          Ver Detalles del Proyecto
        </Button>
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
            onClick={() => setShowInvestForm(!showInvestForm)}
          >
            <CoinsIcon className="h-4 w-4 mr-1" />
            {showInvestForm ? 'Ocultar Formulario' : 'Invertir con LADRILLO'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FutureProjectCard;
