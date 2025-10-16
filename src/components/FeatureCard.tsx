
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, className }) => {
  return (
    <Card className={cn("border border-border/50 glass-card p-6 h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50", className)}>
      <div className="mb-4 text-AFJPCripto-pink">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </Card>
  );
};

export default FeatureCard;
