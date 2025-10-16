
import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const TokenValueChart: React.FC = () => {
  // Mock chart data
  const data = [
    { month: 'Ene', value: 100 },
    { month: 'Feb', value: 105 },
    { month: 'Mar', value: 98 },
    { month: 'Abr', value: 110 },
    { month: 'May', value: 115 },
    { month: 'Jun', value: 118 },
    { month: 'Jul', value: 120 }
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#888' }} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            hide={true}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value}`, 'Valor']}
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #E6007A',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#E6007A" 
            strokeWidth={2}
            dot={{ stroke: '#E6007A', strokeWidth: 2, fill: '#E6007A' }}
            activeDot={{ r: 6, stroke: '#E6007A', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenValueChart;
