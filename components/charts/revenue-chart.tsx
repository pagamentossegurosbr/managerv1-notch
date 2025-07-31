'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Venda } from '@/types';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  vendas: Venda[];
  mesAno: string;
}

export function RevenueChart({ vendas, mesAno }: RevenueChartProps) {
  const dadosGrafico = useMemo(() => {
    // Agrupar vendas por dia
    const vendasPorDia = vendas.reduce((acc, venda) => {
      const dia = new Date(venda.data).getDate();
      if (!acc[dia]) {
        acc[dia] = {
          dia,
          receita: 0,
          lucro: 0,
          vendas: 0
        };
      }
      acc[dia].receita += venda.valorBruto;
      acc[dia].lucro += venda.valorLiquido;
      acc[dia].vendas += 1;
      return acc;
    }, {} as Record<number, any>);

    // Converter para array e ordenar por dia
    return Object.values(vendasPorDia)
      .sort((a: any, b: any) => a.dia - b.dia)
      .map((item: any) => ({
        ...item,
        receita: Math.round(item.receita * 100) / 100,
        lucro: Math.round(item.lucro * 100) / 100
      }));
  }, [vendas]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{`Dia ${label}`}</p>
          <p className="text-green-600">
            Receita: {formatCurrency(payload[0]?.value || 0)}
          </p>
          <p className="text-blue-600">
            Lucro: {formatCurrency(payload[1]?.value || 0)}
          </p>
          <p className="text-muted-foreground">
            Vendas: {payload[0]?.payload?.vendas || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Faturamento Diário
            </CardTitle>
            <CardDescription>
              Receita e lucro por dia - {mesAno}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="dia" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="receita" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Receita"
              />
              <Line 
                type="monotone" 
                dataKey="lucro" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Lucro"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}