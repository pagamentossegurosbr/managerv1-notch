'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Despesa } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpensesChartProps {
  despesas: Despesa[];
  mesAno: string;
}

export function ExpensesChart({ despesas, mesAno }: ExpensesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const processarDados = () => {
    const dadosPorCategoria = new Map<string, number>();

    despesas.forEach(despesa => {
      const categoria = despesa.categoria;
      const valor = despesa.valor;

      if (dadosPorCategoria.has(categoria)) {
        dadosPorCategoria.set(categoria, dadosPorCategoria.get(categoria)! + valor);
      } else {
        dadosPorCategoria.set(categoria, valor);
      }
    });

    const cores = [
      '#EF4444', '#F97316', '#EAB308', '#22C55E', 
      '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4',
      '#84CC16', '#F59E0B', '#10B981', '#6366F1'
    ];

    return Array.from(dadosPorCategoria.entries()).map(([categoria, valor], index) => ({
      name: categoria,
      value: valor,
      color: cores[index % cores.length]
    }));
  };

  const dados = processarDados();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{`Categoria: ${data.name}`}</p>
          <p className="text-red-400">{`Valor: ${formatCurrency(data.value)}`}</p>
          <p className="text-gray-400">{`Percentual: ${((data.value / dados.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          Despesas por categoria - {mesAno}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dados.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">Nenhuma despesa registrada neste período</p>
              <p className="text-sm">Adicione despesas para visualizar o gráfico</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 