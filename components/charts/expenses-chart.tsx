'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Despesa } from '@/types';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ExpensesChartProps {
  despesas: Despesa[];
  mesAno: string;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
];

export function ExpensesChart({ despesas, mesAno }: ExpensesChartProps) {
  const dadosGrafico = useMemo(() => {
    // Agrupar despesas por categoria
    const despesasPorCategoria = despesas.reduce((acc, despesa) => {
      const categoria = despesa.categoria || 'Sem categoria';
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria] += despesa.valor;
      return acc;
    }, {} as Record<string, number>);

    // Converter para array para o gráfico
    return Object.entries(despesasPorCategoria)
      .map(([categoria, valor]) => ({
        categoria,
        valor: Math.round(valor * 100) / 100,
        porcentagem: 0 // será calculado depois
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [despesas]);

  // Calcular porcentagens
  const totalDespesas = dadosGrafico.reduce((sum, item) => sum + item.valor, 0);
  const dadosComPorcentagem = dadosGrafico.map(item => ({
    ...item,
    porcentagem: totalDespesas > 0 ? (item.valor / totalDespesas) * 100 : 0
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{data.categoria}</p>
          <p className="text-primary">
            Valor: {formatCurrency(data.valor)}
          </p>
          <p className="text-muted-foreground">
            {data.porcentagem.toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ categoria, porcentagem }: any) => {
    if (porcentagem < 5) return ''; // Não mostrar label para fatias muito pequenas
    return `${porcentagem.toFixed(0)}%`;
  };

  if (dadosComPorcentagem.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-blue-600" />
            Distribuição de Despesas
          </CardTitle>
          <CardDescription>
            Despesas por categoria - {mesAno}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Nenhuma despesa registrada neste período
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-blue-600" />
          Distribuição de Despesas
        </CardTitle>
        <CardDescription>
          Despesas por categoria - {mesAno}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosComPorcentagem}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {dadosComPorcentagem.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {value} - {formatCurrency(entry.payload.valor)}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}