'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Venda } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueChartProps {
  vendas: Venda[];
  mesAno: string;
}

export function RevenueChart({ vendas, mesAno }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const processarDados = () => {
    const dadosPorDia = new Map<string, { data: string; receita: number; lucro: number }>();

    vendas.forEach(venda => {
      const data = venda.data;
      const receita = venda.valorBruto;
      const lucro = venda.valorLiquido;

      if (dadosPorDia.has(data)) {
        const existente = dadosPorDia.get(data)!;
        existente.receita += receita;
        existente.lucro += lucro;
      } else {
        dadosPorDia.set(data, {
          data: new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          receita,
          lucro
        });
      }
    });

    return Array.from(dadosPorDia.values()).sort((a, b) => 
      new Date(a.data.split('/').reverse().join('-')).getTime() - 
      new Date(b.data.split('/').reverse().join('-')).getTime()
    );
  };

  const dados = processarDados();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{`Data: ${label}`}</p>
          <p className="text-green-400">{`Receita: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-blue-400">{`Lucro: ${formatCurrency(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          Receita e lucro por dia - {mesAno}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dados.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="data" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="receita" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Receita"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="lucro" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Lucro"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">Nenhuma venda registrada</p>
              <p className="text-sm">Importe dados ou adicione vendas manualmente</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 