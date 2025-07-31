'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportCSV } from '@/components/import-csv';
import { KPICards } from '@/components/kpi-cards';
import { MonthSelector } from '@/components/month-selector';
import { DateRangeFilter } from '@/components/date-range-filter';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { ExpensesChart } from '@/components/charts/expenses-chart';
import { FinancialCalendar } from '@/components/financial-calendar';
import { ExpenseManager } from '@/components/expense-manager';
import { RevenueManager } from '@/components/revenue-manager';
import { DataExport } from '@/components/data-export';
import { Storage } from '@/lib/storage';
import { calcularKPIs } from '@/lib/kpi-calculator';
import { filtrarVendasPorData, filtrarDespesasPorData, obterPeriodoFormatado } from '@/lib/date-filter';
import { Venda, Despesa, KPIs, MesAno, FiltroData } from '@/types';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  RefreshCw, 
  User, 
  Briefcase, 
  FileText, 
  Minus,
  Calendar,
  Upload,
  Download,
  Plus
} from 'lucide-react';

export default function Home() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [kpis, setKPIs] = useState<KPIs>({
    receitaBruta: 0,
    receitaLiquida: 0,
    lucroLiquido: 0,
    ticketMedio: 0,
    totalVendas: 0,
    roi: 0,
    gastosPessoais: 0,
    gastosProfissionais: 0,
    despesasFixas: 0,
    despesasVariaveis: 0,
    totalDespesas: 0,
    investimentoTotal: 0,
    roiAplicavel: false
  });
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState<MesAno>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    label: `${new Date().toLocaleDateString('pt-BR', { month: 'long' })} ${new Date().getFullYear()}`
  });
  const [filtroData, setFiltroData] = useState<FiltroData>({
    dataInicial: undefined,
    dataFinal: undefined,
    ativo: false
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const carregarDados = () => {
    const todasVendas = Storage.carregarVendas();
    const todasDespesas = Storage.carregarDespesas();
    
    let vendasFiltradas = todasVendas.filter(
      v => v.ano === mesAnoSelecionado.ano && v.mes === mesAnoSelecionado.mes
    );
    let despesasFiltradas = todasDespesas.filter(
      d => d.ano === mesAnoSelecionado.ano && d.mes === mesAnoSelecionado.mes
    );

    // Aplicar filtro de data se ativo
    if (filtroData.ativo) {
      vendasFiltradas = filtrarVendasPorData(vendasFiltradas, filtroData);
      despesasFiltradas = filtrarDespesasPorData(despesasFiltradas, filtroData);
    }

    setVendas(vendasFiltradas);
    setDespesas(despesasFiltradas);
    setKPIs(calcularKPIs(vendasFiltradas, despesasFiltradas));
  };

  useEffect(() => {
    carregarDados();
  }, [mesAnoSelecionado, filtroData]);

  const handleFiltroChange = (novoFiltro: FiltroData) => {
    setFiltroData(novoFiltro);
  };

  const handleMesAnoChange = (novoMesAno: MesAno) => {
    setMesAnoSelecionado(novoMesAno);
  };

  const handleVendasChange = () => {
    carregarDados();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const periodoFormatado = obterPeriodoFormatado(filtroData, mesAnoSelecionado.label);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Gestão Financeira Digital
              </h1>
              <p className="text-gray-400 text-sm hidden md:block">
                Sistema completo para controle financeiro do seu negócio
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <MonthSelector 
                mesAno={mesAnoSelecionado} 
                onMesAnoChange={handleMesAnoChange} 
              />
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                {vendas.length} registros
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Importar</span>
              </TabsTrigger>
              <TabsTrigger value="revenues" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Receitas</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center space-x-2">
                <Minus className="h-4 w-4" />
                <span className="hidden sm:inline">Despesas</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendário</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Date Range Filter */}
                <DateRangeFilter 
                  filtro={filtroData} 
                  onFiltroChange={handleFiltroChange} 
                />

                {/* KPIs Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      KPIs - {periodoFormatado}
                    </h2>
                    <Button 
                      onClick={carregarDados}
                      variant="outline" 
                      size="sm"
                      className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                  </div>
                  <KPICards kpis={kpis} />
                </div>

                {/* Charts Section */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenueChart vendas={vendas} mesAno={periodoFormatado} />
                  <ExpensesChart despesas={despesas} mesAno={periodoFormatado} />
                </div>
              </div>
            </TabsContent>

            {/* Import Tab */}
            <TabsContent value="import" className="space-y-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ImportCSV 
                  mesAno={mesAnoSelecionado} 
                  onVendasChange={handleVendasChange} 
                />
              </div>
            </TabsContent>

            {/* Revenues Tab */}
            <TabsContent value="revenues" className="space-y-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RevenueManager 
                  mesAno={mesAnoSelecionado} 
                  onVendasChange={handleVendasChange} 
                />
              </div>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="space-y-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ExpenseManager 
                  despesas={despesas} 
                  mesAno={mesAnoSelecionado} 
                  onUpdate={carregarDados} 
                />
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FinancialCalendar 
                  vendas={vendas} 
                  despesas={despesas} 
                  mesAno={mesAnoSelecionado} 
                />
              </div>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <DataExport 
                  vendas={vendas} 
                  despesas={despesas} 
                  kpis={kpis} 
                  mesAno={periodoFormatado} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm">
            <div className="flex items-center space-x-6">
              <span className="text-gray-300">
                {vendas.length} Vendas
              </span>
              <span className="text-green-400 font-medium">
                {formatCurrency(kpis.receitaLiquida)} Receita Liq.
              </span>
              <span className="text-red-400 font-medium">
                {formatCurrency(kpis.totalDespesas)} Despesas
              </span>
              <span className="text-gray-400">
                {kpis.roiAplicavel ? `${kpis.roi.toFixed(1)}% ROI` : 'N/A ROI'}
              </span>
            </div>
            <div className="text-gray-500">
              {periodoFormatado}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}