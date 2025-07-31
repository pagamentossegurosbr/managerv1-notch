'use client';

import { useState, useEffect } from 'react';
import { Storage } from '@/lib/storage';
import { calcularKPIs } from '@/lib/kpi-calculator';
import { Venda, Despesa, KPIs } from '@/types';

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

  const carregarDados = () => {
    const todasVendas = Storage.carregarVendas();
    const todasDespesas = Storage.carregarDespesas();

    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    const vendasFiltradas = todasVendas.filter(
      v => v.ano === anoAtual && v.mes === mesAtual
    );
    const despesasFiltradas = todasDespesas.filter(
      d => d.ano === anoAtual && d.mes === mesAtual
    );

    setVendas(vendasFiltradas);
    setDespesas(despesasFiltradas);
    setKPIs(calcularKPIs(vendasFiltradas, despesasFiltradas));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            NOTCH Gestão Financeira
          </h1>
          <p className="text-gray-600">
            Dashboard completo para controle financeiro do seu negócio
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Receita Bruta</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(kpis.receitaBruta)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Receita Líquida</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(kpis.receitaLiquida)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Lucro Líquido</h3>
            <p className={`text-2xl font-bold ${kpis.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(kpis.lucroLiquido)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Vendas</h3>
            <p className="text-2xl font-bold text-purple-600">
              {kpis.totalVendas}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Ticket Médio</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(kpis.ticketMedio)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">ROI</h3>
            <p className={`text-2xl font-bold ${kpis.roiAplicavel ? (kpis.roi >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-600'}`}>
              {kpis.roiAplicavel ? `${kpis.roi.toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Despesas</h3>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(kpis.totalDespesas)}
            </p>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo dos Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Vendas Importadas</h3>
              <p className="text-lg font-semibold text-gray-900">{vendas.length} registros</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Despesas Cadastradas</h3>
              <p className="text-lg font-semibold text-gray-900">{despesas.length} registros</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>NOTCH Gestão Financeira v1.0 - Desenvolvido com Next.js</p>
        </div>
      </div>
    </div>
  );
}