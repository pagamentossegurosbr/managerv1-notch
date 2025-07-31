'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImportCSV } from '@/components/import-csv';
import { KPICards } from '@/components/kpi-cards';
import { MonthSelector } from '@/components/month-selector';
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
    label: ''
  });

  const carregarDados = () => {
    const todasVendas = Storage.carregarVendas();
    const todasDespesas = Storage.carregarDespesas();

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
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            NOTCH Gestão Financeira
          </h1>
          <p className="text-center text-muted-foreground">
            Dashboard completo para controle financeiro do seu negócio
          </p>
        </div>

        {/* Month Selector */}
        <div className="mb-6">
          <MonthSelector
            mesAno={mesAnoSelecionado}
            onMesAnoChange={setMesAnoSelecionado}
          />
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards kpis={kpis} />
        </div>

        {/* Import Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Importar Dados
            </CardTitle>
            <CardDescription>
              Importe seus dados de vendas via CSV ou adicione despesas manualmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImportCSV onImportSuccess={handleImportSuccess} />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
                  <p className="text-2xl font-bold">{kpis.totalVendas}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Bruta</p>
                  <p className="text-2xl font-bold">
                    R$ {kpis.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lucro Líquido</p>
                  <p className={`text-2xl font-bold ${kpis.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {kpis.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>NOTCH Gestão Financeira v1.0 - Desenvolvido com Next.js e ShadCN UI</p>
        </div>
      </div>
    </div>
  );
}