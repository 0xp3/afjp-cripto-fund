
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon, TrendingUpIcon, CoinsIcon, HomeIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const UserMetrics: React.FC = () => {
  // Mock data para métricas de usuarios
  const totalUsers = 2850;
  const newUsersThisMonth = 245;
  const activeUsers = 1920;
  const userGrowthRate = 8.6; // percentage

  // Mock data para evolución de tokens
  const afjpData = {
    totalSupply: 150000,
    holders: 2850,
    priceChange: 2.5,
    monthlyGrowth: 12.3
  };

  const juventudData = {
    totalSupply: 95000,
    holders: 1240,
    priceChange: -1.2,
    monthlyGrowth: 18.7
  };

  const ladrilloData = {
    totalSupply: 45000,
    holders: 680,
    priceChange: 4.8,
    monthlyGrowth: 25.4
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Usuarios */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <UsersIcon className="mr-2 h-5 w-5 text-blue-500" />
          Métricas de Usuarios
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50 glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">Total Usuarios</p>
                  <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">Nuevos Este Mes</p>
                  <p className="text-2xl font-bold">{newUsersThisMonth}</p>
                  <p className="text-sm text-green-500 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    +{userGrowthRate}%
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <TrendingUpIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">Usuarios Activos</p>
                  <p className="text-2xl font-bold">{activeUsers.toLocaleString()}</p>
                  <p className="text-sm text-foreground/50">
                    {((activeUsers / totalUsers) * 100).toFixed(1)}% del total
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/70">Crecimiento</p>
                  <p className="text-2xl font-bold">+{userGrowthRate}%</p>
                  <p className="text-sm text-foreground/50">vs mes anterior</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <TrendingUpIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evolución de Tokens */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <CoinsIcon className="mr-2 h-5 w-5 text-pink-500" />
          Evolución de Tokens
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Token AFJP */}
          <Card className="border-border/50 glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div className="h-8 w-8 rounded-full bg-AFJPCripto-gradient flex items-center justify-center mr-2">
                  <CoinsIcon className="h-4 w-4 text-white" />
                </div>
                Token AFJP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Suministro Total</span>
                  <span className="font-semibold">{afjpData.totalSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Holders</span>
                  <span className="font-semibold">{afjpData.holders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Cambio 24h</span>
                  <span className={`font-semibold flex items-center ${afjpData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {afjpData.priceChange >= 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                    {afjpData.priceChange >= 0 ? '+' : ''}{afjpData.priceChange}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Crecimiento Mensual</span>
                  <span className="font-semibold text-green-500">+{afjpData.monthlyGrowth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token JUVENTUD */}
          <Card className="border-border/50 glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-2">
                  <CoinsIcon className="h-4 w-4 text-white" />
                </div>
                Token JUVENTUD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Suministro Total</span>
                  <span className="font-semibold">{juventudData.totalSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Holders</span>
                  <span className="font-semibold">{juventudData.holders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Cambio 24h</span>
                  <span className={`font-semibold flex items-center ${juventudData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {juventudData.priceChange >= 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                    {juventudData.priceChange >= 0 ? '+' : ''}{juventudData.priceChange}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Crecimiento Mensual</span>
                  <span className="font-semibold text-green-500">+{juventudData.monthlyGrowth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token LADRILLO */}
          <Card className="border-border/50 glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-2">
                  <HomeIcon className="h-4 w-4 text-white" />
                </div>
                Token LADRILLO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Suministro Total</span>
                  <span className="font-semibold">{ladrilloData.totalSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Holders</span>
                  <span className="font-semibold">{ladrilloData.holders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Cambio 24h</span>
                  <span className={`font-semibold flex items-center ${ladrilloData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {ladrilloData.priceChange >= 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                    {ladrilloData.priceChange >= 0 ? '+' : ''}{ladrilloData.priceChange}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Crecimiento Mensual</span>
                  <span className="font-semibold text-green-500">+{ladrilloData.monthlyGrowth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserMetrics;
