'use client';

import { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, TrendingUp, TrendingDown, Eye, DollarSign, ShoppingCart, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Venda, Despesa } from '@/types';

interface FinancialCalendarProps {
  vendas: Venda[];
  despesas: Despesa[];
  mesAno: { mes: number; ano: number };
}

export function FinancialCalendar({ vendas, despesas, mesAno }: FinancialCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const dadosProcessados = useMemo(() => {
    const dadosPorDia = new Map();
    
    // Processar vendas
    vendas.forEach(venda => {
      const key = venda.data;
      if (!dadosPorDia.has(key)) {
        dadosPorDia.set(key, {
          data: key,
          vendas: [],
          despesas: [],
          totalVendas: 0,
          totalReceita: 0,
          totalReceitaLiquida: 0,
          totalDespesas: 0,
          saldoDia: 0
        });
      }
      const dia = dadosPorDia.get(key);
      dia.vendas.push(venda);
      dia.totalVendas += 1;
      dia.totalReceita += venda.valorBruto;
      dia.totalReceitaLiquida += venda.valorLiquido;
    });

    // Processar despesas
    despesas.forEach(despesa => {
      const key = despesa.data;
      if (!dadosPorDia.has(key)) {
        dadosPorDia.set(key, {
          data: key,
          vendas: [],
          despesas: [],
          totalVendas: 0,
          totalReceita: 0,
          totalReceitaLiquida: 0,
          totalDespesas: 0,
          saldoDia: 0
        });
      }
      const dia = dadosPorDia.get(key);
      dia.despesas.push(despesa);
      dia.totalDespesas += despesa.valor;
    });

    // Calcular saldo do dia
    dadosPorDia.forEach(dia => {
      dia.saldoDia = dia.totalReceitaLiquida - dia.totalDespesas;
    });

    return dadosPorDia;
  }, [vendas, despesas]);

  const estatisticasGerais = useMemo(() => {
    const totalReceita = vendas.reduce((sum, v) => sum + v.valorBruto, 0);
    const totalReceitaLiquida = vendas.reduce((sum, v) => sum + v.valorLiquido, 0);
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
    const diasAtivos = dadosProcessados.size;
    const metaDiaria = totalReceita / 30; // Meta baseada em média mensal

    return {
      totalReceita,
      totalReceitaLiquida,
      totalDespesas,
      saldoTotal: totalReceitaLiquida - totalDespesas,
      diasAtivos,
      metaDiaria,
      mediaVendasPorDia: vendas.length / Math.max(diasAtivos, 1),
      mediaDespesasPorDia: totalDespesas / Math.max(diasAtivos, 1)
    };
  }, [vendas, despesas, dadosProcessados]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const obterDadosDoDia = (date: Date) => {
    const dataString = date.toISOString().split('T')[0];
    return dadosProcessados.get(dataString);
  };

  const renderDayContent = (date: Date) => {
    const dados = obterDadosDoDia(date);
    if (!dados) {
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <span className="text-xl font-bold text-muted-foreground">
            {date.getDate()}
          </span>
        </div>
      );
    }

    const porcentagemMeta = dados.totalReceita / estatisticasGerais.metaDiaria * 100;
    const isPositive = dados.saldoDia >= 0;

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className={`w-full h-full min-h-[80px] p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
            isPositive 
              ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-green-950/40 border-green-300 dark:border-green-700 hover:border-green-400' 
              : 'bg-gradient-to-br from-red-50 via-rose-50 to-red-100 dark:from-red-950/30 dark:via-rose-950/20 dark:to-red-950/40 border-red-300 dark:border-red-700 hover:border-red-400'
          }`}>
            {/* Header do Dia com Ícone */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-foreground">{date.getDate()}</span>
              <div className={`p-1 rounded-full ${isPositive ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'}`}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-700 dark:text-green-300" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-700 dark:text-red-300" />
                )}
              </div>
            </div>
            
            {/* Informações Financeiras */}
            <div className="space-y-2">
              {dados.totalVendas > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">{dados.totalVendas}v</span>
                  </div>
                  <span className="text-xs font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(dados.totalReceita)}
                  </span>
                </div>
              )}
              
              {dados.totalDespesas > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-red-600" />
                    <span className="text-xs font-medium text-red-700 dark:text-red-300">{dados.despesas.length}d</span>
                  </div>
                  <span className="text-xs font-bold text-red-700 dark:text-red-300">
                    -{formatCurrency(dados.totalDespesas)}
                  </span>
                </div>
              )}
              
              {/* Saldo Final */}
              <div className="pt-2 border-t border-current/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium opacity-80">Saldo:</span>
                  <span className={`text-xs font-bold ${isPositive ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                    {formatCurrency(dados.saldoDia)}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso da Meta */}
              {dados.totalReceita > 0 && (
                <div className="pt-1">
                  <Progress 
                    value={Math.min(porcentagemMeta, 100)} 
                    className="h-1.5 bg-white/50 dark:bg-black/20"
                  />
                  <div className="text-center">
                    <span className="text-xs font-medium opacity-70">
                      {porcentagemMeta.toFixed(0)}% da meta
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-96 p-6" side="top">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">{formatDate(dados.data)}</h4>
              <Badge variant={isPositive ? "default" : "destructive"} className="px-3 py-1">
                {isPositive ? "📈 Lucro" : "📉 Prejuízo"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-green-600">💰 Vendas</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span className="font-semibold">{dados.totalVendas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receita:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(dados.totalReceita)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Líquida:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(dados.totalReceitaLiquida)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-red-600">💸 Despesas</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span className="font-semibold">{dados.despesas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(dados.totalDespesas)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investimentos:</span>
                    <span className="font-semibold text-orange-600">
                      {dados.despesas.filter((d: Despesa) => d.ehInvestimento).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-base">
                <span className="font-semibold">💵 Saldo do Dia:</span>
                <span className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dados.saldoDia)}
                </span>
              </div>
              
              {dados.totalReceita > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">🎯 Performance da Meta:</span>
                    <span className={`font-bold ${porcentagemMeta >= 100 ? 'text-green-600' : porcentagemMeta >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {porcentagemMeta.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(porcentagemMeta, 100)} className="h-3" />
                  <p className="text-xs text-muted-foreground text-center">
                    Meta diária: {formatCurrency(estatisticasGerais.metaDiaria)}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 text-xs text-muted-foreground text-center">
              💡 Clique no dia para ver todos os detalhes
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const DayDetailsDialog = ({ date, dados }: { date: Date; dados: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-full w-full p-0">
          {renderDayContent(date)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Detalhes - {formatDate(dados.data)}
          </DialogTitle>
          <DialogDescription>
            Resumo completo das atividades financeiras do dia
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo do Dia Premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    💰 Receita
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-600 tracking-tight">
                    {formatCurrency(dados.totalReceita)}
                  </p>
                  <p className="text-sm text-muted-foreground">Valor bruto do dia</p>
                  <div className="text-xs text-green-700 dark:text-green-400">
                    Líquido: {formatCurrency(dados.totalReceitaLiquida)}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-red-500 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    💸 Despesas
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-red-600 tracking-tight">
                    {formatCurrency(dados.totalDespesas)}
                  </p>
                  <p className="text-sm text-muted-foreground">{dados.despesas.length} lançamentos</p>
                  <div className="text-xs text-red-700 dark:text-red-400">
                    Investimentos: {dados.despesas.filter((d: Despesa) => d.ehInvestimento).length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${dados.saldoDia >= 0 ? 'border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10' : 'border-l-red-500 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 ${dados.saldoDia >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    {dados.saldoDia >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <Badge variant={dados.saldoDia >= 0 ? "default" : "destructive"} className="text-xs px-2 py-1">
                    {dados.saldoDia >= 0 ? "📈 Lucro" : "📉 Prejuízo"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className={`text-2xl font-bold tracking-tight ${dados.saldoDia >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(dados.saldoDia)}
                  </p>
                  <p className="text-sm text-muted-foreground">Resultado final</p>
                  <div className={`text-xs ${dados.saldoDia >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                    {dados.saldoDia >= 0 ? 'Dia positivo! 🎉' : 'Foque em reduzir custos 📊'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="vendas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vendas">Vendas ({dados.vendas.length})</TabsTrigger>
              <TabsTrigger value="despesas">Despesas ({dados.despesas.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendas" className="space-y-4">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {dados.vendas.length > 0 ? (
                  dados.vendas.map((venda: Venda, index: number) => (
                    <div key={venda.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">Venda #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">{venda.origem}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(venda.valorBruto)}</p>
                        <p className="text-xs text-muted-foreground">Líq: {formatCurrency(venda.valorLiquido)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhuma venda registrada</p>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="despesas" className="space-y-4">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {dados.despesas.length > 0 ? (
                  dados.despesas.map((despesa: Despesa) => (
                    <div key={despesa.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{despesa.nome}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" size="sm">{despesa.categoria}</Badge>
                          <Badge variant="secondary" size="sm">{despesa.tipo}</Badge>
                          {despesa.ehInvestimento && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" size="sm">
                              Investimento
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{formatCurrency(despesa.valor)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhuma despesa registrada</p>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );

  const mesAtual = new Date(mesAno.ano, mesAno.mes - 1, 1);

  return (
    <div className="w-full space-y-8">
      {/* Header Premium */}
      <Card className="border-2 border-primary/10 bg-gradient-to-r from-background via-primary/5 to-background shadow-xl">
        <CardHeader className="pb-8 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                Calendário Financeiro Inteligente
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground max-w-2xl">
                Análise visual completa das suas atividades financeiras com insights detalhados e interações avançadas
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <TabsList className="h-12 p-1 bg-muted/50">
                  <TabsTrigger value="calendar" className="px-6 py-2 text-sm font-medium">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Calendário
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="px-6 py-2 text-sm font-medium">
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Cards de Estatísticas Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500 opacity-60" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-green-600 tracking-tight">
                {formatCurrency(estatisticasGerais.totalReceita)}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
              <div className="h-1 bg-green-200 dark:bg-green-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-red-500 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <TrendingDown className="h-4 w-4 text-red-500 opacity-60" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-red-600 tracking-tight">
                {formatCurrency(estatisticasGerais.totalDespesas)}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Despesas Totais</p>
              <div className="h-1 bg-red-200 dark:bg-red-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${estatisticasGerais.saldoTotal >= 0 ? 'border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10' : 'border-l-red-500 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${estatisticasGerais.saldoTotal >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                {estatisticasGerais.saldoTotal >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
              <Badge variant={estatisticasGerais.saldoTotal >= 0 ? "default" : "destructive"} className="text-xs px-2 py-1">
                {estatisticasGerais.saldoTotal >= 0 ? "Lucro" : "Prejuízo"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className={`text-3xl font-bold tracking-tight ${estatisticasGerais.saldoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(estatisticasGerais.saldoTotal)}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
              <div className={`h-1 ${estatisticasGerais.saldoTotal >= 0 ? 'bg-emerald-200 dark:bg-emerald-900/30' : 'bg-red-200 dark:bg-red-900/30'} rounded-full overflow-hidden`}>
                <div className={`h-full ${estatisticasGerais.saldoTotal >= 0 ? 'bg-emerald-500' : 'bg-red-500'} rounded-full animate-pulse`} style={{width: '85%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-sky-50/30 dark:from-blue-950/20 dark:to-sky-950/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <Clock className="h-4 w-4 text-blue-500 opacity-60" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-blue-600 tracking-tight">
                {estatisticasGerais.diasAtivos}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Dias Ativos</p>
              <div className="h-1 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{width: `${(estatisticasGerais.diasAtivos / 30) * 100}%`}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Container Principal do Calendário */}
      <Card className="border-2 border-muted/20 shadow-xl bg-gradient-to-b from-background to-muted/10">
        <CardContent className="p-8">
          <Tabs value={viewMode} className="w-full">
            <TabsContent value="calendar" className="space-y-8 mt-0">

            {/* Legenda Elegante */}
            <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-2xl p-6 border border-muted/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Legenda Interativa</h3>
                <Badge variant="outline" className="text-xs">
                  <Eye className="mr-1 h-3 w-3" />
                  Guia Visual
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border hover:shadow-md transition-all duration-200">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/50 border-2 border-green-300 rounded-lg shadow-sm"></div>
                  <div>
                    <p className="font-medium text-sm">Dia Positivo</p>
                    <p className="text-xs text-muted-foreground">Lucro no dia</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border hover:shadow-md transition-all duration-200">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/40 dark:to-rose-900/50 border-2 border-red-300 rounded-lg shadow-sm"></div>
                  <div>
                    <p className="font-medium text-sm">Dia Negativo</p>
                    <p className="text-xs text-muted-foreground">Prejuízo no dia</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border hover:shadow-md transition-all duration-200">
                  <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Crescimento</p>
                    <p className="text-xs text-muted-foreground">Tendência alta</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border hover:shadow-md transition-all duration-200">
                  <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Queda</p>
                    <p className="text-xs text-muted-foreground">Tendência baixa</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border hover:shadow-md transition-all duration-200">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Interativo</p>
                    <p className="text-xs text-muted-foreground">Hover + Click</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Container do Calendário Premium */}
            <div className="bg-gradient-to-br from-background via-muted/5 to-background rounded-3xl p-8 border-2 border-muted/20 shadow-inner">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Visão Mensal</h3>
                  <p className="text-sm text-muted-foreground mt-1">Clique nos dias para ver detalhes completos</p>
                </div>
                <Badge variant="secondary" className="px-4 py-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {new Date(mesAtual).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </Badge>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={mesAtual}
                className="rounded-2xl border-2 border-muted/30 bg-background/60 backdrop-blur-sm shadow-lg p-6"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-6 sm:space-x-8 sm:space-y-0",
                  month: "space-y-6",
                  caption: "flex justify-center pt-2 relative items-center mb-4",
                  caption_label: "text-xl font-bold text-foreground",
                  nav: "space-x-2 flex items-center",
                  nav_button: "h-10 w-10 bg-muted/50 hover:bg-muted border-2 border-muted/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105",
                  nav_button_previous: "absolute left-2",
                  nav_button_next: "absolute right-2",
                  table: "w-full border-collapse space-y-2 mt-4",
                  head_row: "flex mb-4",
                  head_cell: "text-muted-foreground rounded-lg w-24 font-semibold text-sm py-2 text-center bg-muted/30",
                  row: "flex w-full mt-3",
                  cell: "relative p-1 text-center text-sm focus-within:relative focus-within:z-20",
                  day: "h-24 w-24 p-0 font-normal aria-selected:opacity-100 rounded-xl transition-all duration-200",
                  day_range_end: "day-range-end",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg",
                  day_today: "bg-accent text-accent-foreground font-bold ring-2 ring-primary/30",
                  day_outside: "day-outside text-muted-foreground opacity-40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-30",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                components={{
                  Day: ({ date, ...props }) => {
                    const dados = obterDadosDoDia(date);
                    
                    return (
                      <div className="relative w-24 h-24 p-1">
                        {dados ? (
                          <DayDetailsDialog date={date} dados={dados} />
                        ) : (
                          <button 
                            {...props} 
                            className="h-full w-full p-2 font-medium hover:bg-muted/50 hover:text-foreground rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 border border-transparent hover:border-muted/40"
                          >
                            <span className="text-lg font-semibold">{date.getDate()}</span>
                          </button>
                        )}
                      </div>
                    );
                  }
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-6 mt-0">
            {/* Header da Timeline */}
            <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-2xl p-6 border border-muted/40">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Timeline Financeira</h3>
                  <p className="text-sm text-muted-foreground mt-1">Histórico cronológico das atividades financeiras</p>
                </div>
                <Badge variant="outline" className="px-4 py-2">
                  <Clock className="mr-2 h-4 w-4" />
                  {Array.from(dadosProcessados.entries()).length} dias com atividade
                </Badge>
              </div>
            </div>

            {/* Container da Timeline */}
            <div className="bg-gradient-to-br from-background via-muted/5 to-background rounded-3xl p-8 border-2 border-muted/20 shadow-inner">
              <ScrollArea className="h-[700px] w-full pr-6">
                <div className="space-y-6">
                  {Array.from(dadosProcessados.entries()).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 bg-muted/20 rounded-full mb-4">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-semibold text-muted-foreground mb-2">Nenhuma atividade encontrada</h4>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Não há registros de vendas ou despesas para este período. Comece importando seus dados ou adicionando despesas manualmente.
                      </p>
                    </div>
                  ) : (
                    Array.from(dadosProcessados.entries())
                      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                      .map(([data, dados], index) => (
                        <Card 
                          key={data} 
                          className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary/50 bg-gradient-to-r from-background to-muted/10"
                        >
                          <CardContent className="p-6">
                            {/* Header do Card */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${dados.saldoDia >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} group-hover:scale-110 transition-transform duration-300`}>
                                  {dados.saldoDia >= 0 ? (
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-foreground">{formatDate(data)}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {dados.vendas.length} vendas • {dados.despesas.length} despesas
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <Badge 
                                  variant={dados.saldoDia >= 0 ? "default" : "destructive"} 
                                  className="text-lg px-4 py-2 font-bold"
                                >
                                  {formatCurrency(dados.saldoDia)}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">Saldo do dia</p>
                              </div>
                            </div>
                            
                            {/* Grid de Informações */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Vendas */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-semibold text-green-600 flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4" />
                                    Vendas ({dados.vendas.length})
                                  </h5>
                                  <span className="text-sm font-medium text-green-600">
                                    {formatCurrency(dados.totalReceita)}
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Meta Diária</span>
                                    <span>{((dados.totalReceita / estatisticasGerais.metaDiaria) * 100).toFixed(0)}%</span>
                                  </div>
                                  <Progress 
                                    value={Math.min((dados.totalReceita / estatisticasGerais.metaDiaria) * 100, 100)} 
                                    className="h-2"
                                  />
                                </div>

                                {dados.vendas.length > 0 && (
                                  <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-3 space-y-2">
                                    <p className="text-xs font-medium text-green-700 dark:text-green-400">Detalhes das Vendas:</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>Receita Bruta:</span>
                                        <span className="font-medium">{formatCurrency(dados.totalReceita)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span>Receita Líquida:</span>
                                        <span className="font-medium">{formatCurrency(dados.totalReceitaLiquida)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span>Ticket Médio:</span>
                                        <span className="font-medium">{formatCurrency(dados.totalReceita / dados.vendas.length)}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Despesas */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-semibold text-red-600 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Despesas ({dados.despesas.length})
                                  </h5>
                                  <span className="text-sm font-medium text-red-600">
                                    {formatCurrency(dados.totalDespesas)}
                                  </span>
                                </div>
                                
                                {dados.despesas.length > 0 ? (
                                  <div className="bg-red-50/50 dark:bg-red-950/20 rounded-lg p-3 space-y-2">
                                    <p className="text-xs font-medium text-red-700 dark:text-red-400">Principais Despesas:</p>
                                    <div className="space-y-1 max-h-20 overflow-y-auto">
                                      {dados.despesas.slice(0, 4).map((despesa: Despesa) => (
                                        <div key={despesa.id} className="flex justify-between items-center text-xs">
                                          <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="truncate">{despesa.nome}</span>
                                            {despesa.ehInvestimento && (
                                              <Badge className="text-xs px-1 py-0 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                INV
                                              </Badge>
                                            )}
                                          </div>
                                          <span className="font-medium text-red-600 ml-2">
                                            {formatCurrency(despesa.valor)}
                                          </span>
                                        </div>
                                      ))}
                                      {dados.despesas.length > 4 && (
                                        <p className="text-xs text-muted-foreground text-center pt-1">
                                          +{dados.despesas.length - 4} despesas adicionais
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                                    <p className="text-xs text-muted-foreground">Nenhuma despesa registrada</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Resumo Final */}
                            <div className="mt-6 pt-4 border-t border-muted/20">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Resultado do dia:</span>
                                <div className="flex items-center gap-2">
                                  {dados.saldoDia >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className={`font-bold ${dados.saldoDia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {dados.saldoDia >= 0 ? 'Lucro de ' : 'Prejuízo de '}{formatCurrency(Math.abs(dados.saldoDia))}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}