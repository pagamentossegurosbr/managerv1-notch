'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImportCSV } from '@/components/import-csv';
import { KPICards } from '@/components/kpi-cards';
import { MonthSelector } from '@/components/month-selector';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { ExpensesChart } from '@/components/charts/expenses-chart';
import { FinancialCalendar } from '@/components/financial-calendar';
import { ExpenseManager } from '@/components/expense-manager';
import { DataExport } from '@/components/data-export';
import { Storage } from '@/lib/storage';
import { calcularKPIs } from '@/lib/kpi-calculator';
import { Venda, Despesa, KPIs, MesAno } from '@/types';
import { 
  TrendingUp, 
  FileSpreadsheet, 
  Calendar,
  Settings,
  User,
  BarChart3
} from 'lucide-react';

export default function Home() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [kpis, setKPIs] = useState<KPIs>({
    receitaBruta: 0,
    lucroLiquido: 0,
    ticketMedio: 0,
    totalVendas: 0,
    roi: 0,
    gastosPessoais: 0,
    gastosProfissionais: 0,
    despesasFixas: 0,
    despesasVariaveis: 0
  });
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState<MesAno>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    label: ''
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const carregarDados = () => {
    const todasVendas = Storage.carregarVendas();
    const todasDespesas = Storage.carregarDespesas();

    // Filtrar por mês/ano selecionado
    const vendasFiltradas = todasVendas.filter(
      v => v.ano === mesAnoSelecionado.ano && v.mes === mesAnoSelecionado.mes
    );
    const despesasFiltradas = todasDespesas.filter(
      d => d.ano === mesAnoSelecionado.ano && d.mes === mesAnoSelecionado.mes
    );

    setVendas(vendasFiltradas);
    setDespesas(despesasFiltradas);
    setKPIs(calcularKPIs(vendasFiltradas, despesasFiltradas));
  };

  useEffect(() => {
    carregarDados();
  }, [mesAnoSelecionado]);

  const handleImportSuccess = () => {
    carregarDados();
  };

  const handleDataReset = () => {
    setVendas([]);
    setDespesas([]);
    setKPIs({
      receitaBruta: 0,
      lucroLiquido: 0,
      ticketMedio: 0,
      totalVendas: 0,
      roi: 0,
      gastosPessoais: 0,
      gastosProfissionais: 0,
      despesasFixas: 0,
      despesasVariaveis: 0
    });
  };

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const mesAnoLabel = `${nomesMeses[mesAnoSelecionado.mes - 1]} ${mesAnoSelecionado.ano}`;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'import', label: 'Importar', icon: FileSpreadsheet },
    { id: 'expenses', label: 'Despesas', icon: Settings },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'export', label: 'Exportar', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Gestão Financeira Digital
              </h1>
              <p className="text-muted-foreground mt-1">
                Sistema completo para controle financeiro do seu negócio
              </p>
            </div>
            <div className="flex items-center gap-4">
              <MonthSelector
                selectedMonth={mesAnoSelecionado}
                onMonthChange={setMesAnoSelecionado}
              />
              <Badge variant="secondary" className="px-3 py-1">
                <User className="mr-1 h-3 w-3" />
                {vendas.length + despesas.length} registros
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* KPIs */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  KPIs - {mesAnoLabel}
                </h2>
                <KPICards kpis={kpis} />
              </div>

              <Separator />

              {/* Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RevenueChart vendas={vendas} mesAno={mesAnoLabel} />
                <ExpensesChart despesas={despesas} mesAno={mesAnoLabel} />
              </div>
            </>
          )}

          {activeTab === 'import' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                Importar Dados
              </h2>
              <div className="max-w-2xl">
                <ImportCSV onImportSuccess={handleImportSuccess} />
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Settings className="h-6 w-6 text-orange-600" />
                Gerenciar Despesas
              </h2>
              <ExpenseManager
                despesas={despesas}
                mesAno={mesAnoSelecionado}
                onUpdate={carregarDados}
              />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                Calendário Financeiro
              </h2>
              <FinancialCalendar
                vendas={vendas}
                despesas={despesas}
                mesAno={mesAnoSelecionado}
              />
            </div>
          )}

          {activeTab === 'export' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                Exportar & Gerenciar
              </h2>
              <div className="max-w-2xl">
                <DataExport
                  vendas={vendas}
                  despesas={despesas}
                  kpis={kpis}
                  mesAno={mesAnoLabel}
                  onDataReset={handleDataReset}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {kpis.totalVendas}
              </div>
              <div className="text-sm text-muted-foreground">Vendas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(kpis.receitaBruta)}
              </div>
              <div className="text-sm text-muted-foreground">Receita</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {despesas.length}
              </div>
              <div className="text-sm text-muted-foreground">Despesas</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${kpis.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpis.roi.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}