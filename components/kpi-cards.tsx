'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIs } from '@/types';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Target,
  CreditCard,
  User,
  Building2,
  RotateCcw
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const cards = [
    {
      title: 'Receita Bruta',
      value: formatCurrency(kpis.receitaBruta),
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Lucro Líquido', 
      value: formatCurrency(kpis.lucroLiquido),
      icon: TrendingUp,
      color: kpis.lucroLiquido >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bg: kpis.lucroLiquido >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(kpis.ticketMedio),
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Total de Vendas',
      value: kpis.totalVendas.toString(),
      icon: ShoppingCart,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'ROI',
      value: formatPercentage(kpis.roi),
      icon: RotateCcw,
      color: kpis.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bg: kpis.roi >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
    },
    {
      title: 'Gastos Pessoais',
      value: formatCurrency(kpis.gastosPessoais),
      icon: User,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      title: 'Gastos Profissionais',
      value: formatCurrency(kpis.gastosProfissionais),
      icon: Building2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/20'
    },
    {
      title: 'Despesas Fixas',
      value: formatCurrency(kpis.despesasFixas),
      icon: CreditCard,
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}