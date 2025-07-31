'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIs } from '@/types';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  RefreshCw, 
  User, 
  Briefcase, 
  FileText, 
  Minus,
  Activity
} from 'lucide-react';

interface KPICardsProps {
  kpis: KPIs;
}

export function KPICards({ kpis }: KPICardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const kpiData = [
    {
      title: 'Receita Bruta',
      value: formatCurrency(kpis.receitaBruta),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Receita Líquida',
      value: formatCurrency(kpis.receitaLiquida),
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Lucro Líquido',
      value: formatCurrency(kpis.lucroLiquido),
      icon: Activity,
      color: kpis.lucroLiquido >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: kpis.lucroLiquido >= 0 ? 'bg-green-400/10' : 'bg-red-400/10'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(kpis.ticketMedio),
      icon: ShoppingCart,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      title: 'Total de Vendas',
      value: kpis.totalVendas.toString(),
      icon: ShoppingCart,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      title: 'ROI',
      value: kpis.roiAplicavel ? `${kpis.roi.toFixed(1)}%` : 'N/A',
      icon: RefreshCw,
      color: kpis.roiAplicavel ? (kpis.roi >= 0 ? 'text-green-400' : 'text-red-400') : 'text-gray-400',
      bgColor: kpis.roiAplicavel ? (kpis.roi >= 0 ? 'bg-green-400/10' : 'bg-red-400/10') : 'bg-gray-400/10'
    },
    {
      title: 'Gastos Pessoais',
      value: formatCurrency(kpis.gastosPessoais),
      icon: User,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
    {
      title: 'Gastos Profissionais',
      value: formatCurrency(kpis.gastosProfissionais),
      icon: Briefcase,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      title: 'Despesas Fixas',
      value: formatCurrency(kpis.despesasFixas),
      icon: FileText,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10'
    },
    {
      title: 'Total de Despesas',
      value: formatCurrency(kpis.totalDespesas),
      icon: Minus,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {kpiData.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>
                {kpi.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 