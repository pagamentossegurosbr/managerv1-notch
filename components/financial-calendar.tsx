'use client';

import { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { Venda, Despesa } from '@/types';

interface FinancialCalendarProps {
  vendas: Venda[];
  despesas: Despesa[];
  mesAno: { mes: number; ano: number };
}

export function FinancialCalendar({ vendas, despesas, mesAno }: FinancialCalendarProps) {
  const diasComAtividade = useMemo(() => {
    const dias = new Set<string>();
    
    // Adicionar dias com vendas
    vendas.forEach(venda => {
      dias.add(venda.data);
    });
    
    // Adicionar dias com despesas
    despesas.forEach(despesa => {
      dias.add(despesa.data);
    });
    
    return Array.from(dias).map(data => new Date(data));
  }, [vendas, despesas]);

  const obterAtividadesDoDia = (data: Date) => {
    const dataString = data.toISOString().split('T')[0];
    
    const vendasDoDia = vendas.filter(v => v.data === dataString);
    const despesasDoDia = despesas.filter(d => d.data === dataString);
    
    return {
      vendas: vendasDoDia.length,
      receita: vendasDoDia.reduce((sum, v) => sum + v.valorBruto, 0),
      despesas: despesasDoDia.length,
      gastos: despesasDoDia.reduce((sum, d) => sum + d.valor, 0)
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderDay = (date: Date) => {
    const atividades = obterAtividadesDoDia(date);
    const temAtividade = atividades.vendas > 0 || atividades.despesas > 0;
    
    if (!temAtividade) return null;

    return (
      <div className="relative w-full h-full min-h-[60px] p-1">
        <div className="text-sm font-medium mb-1">{date.getDate()}</div>
        <div className="space-y-1">
          {atividades.vendas > 0 && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {atividades.vendas}V - {formatCurrency(atividades.receita)}
            </Badge>
          )}
          {atividades.despesas > 0 && (
            <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {atividades.despesas}D - {formatCurrency(atividades.gastos)}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  const mesAtual = new Date(mesAno.ano, mesAno.mes - 1, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          Calendário Financeiro
        </CardTitle>
        <CardDescription>
          Visão mensal das atividades financeiras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                V
              </Badge>
              <span className="text-muted-foreground">Vendas</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                D
              </Badge>
              <span className="text-muted-foreground">Despesas</span>
            </div>
          </div>
          
          <Calendar
            mode="single"
            month={mesAtual}
            className="rounded-md border"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-16 w-16 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              Day: ({ date, ...props }) => (
                <div className="relative">
                  <button {...props} className="h-16 w-16 p-1 font-normal hover:bg-accent hover:text-accent-foreground rounded-md">
                    {renderDay(date)}
                  </button>
                </div>
              )
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}