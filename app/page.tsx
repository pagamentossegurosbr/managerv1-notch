'use client';

import { useState, useEffect } from 'react';

// Tipos básicos
interface Venda {
  id: string;
  data: string;
  ano: number;
  mes: number;
  dia: number;
  quantidade: number;
  valorBruto: number;
  valorLiquido: number;
  tipoReceita: string;
}

interface Despesa {
  id: string;
  data: string;
  ano: number;
  mes: number;
  dia: number;
  valor: number;
  categoria: string;
  tipo: string;
  ehInvestimento?: boolean;
}

interface KPIs {
  receitaBruta: number;
  receitaLiquida: number;
  lucroLiquido: number;
  ticketMedio: number;
  totalVendas: number;
  roi: number;
  gastosPessoais: number;
  gastosProfissionais: number;
  despesasFixas: number;
  despesasVariaveis: number;
  totalDespesas: number;
  investimentoTotal: number;
  roiAplicavel: boolean;
}

// Storage básico
const Storage = {
  carregarVendas: (): Venda[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('vendas');
    return data ? JSON.parse(data) : [];
  },
  
  carregarDespesas: (): Despesa[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('despesas');
    return data ? JSON.parse(data) : [];
  }
};

// Cálculo de KPIs básico
function calcularKPIs(vendas: Venda[], despesas: Despesa[]): KPIs {
  const receitaBruta = vendas.reduce((sum, venda) => sum + venda.valorBruto, 0);
  const receitaLiquida = vendas.reduce((sum, venda) => sum + venda.valorLiquido, 0);
  const totalVendas = vendas.length;
  const ticketMedio = totalVendas > 0 ? receitaBruta / totalVendas : 0;

  const gastosPessoais = despesas
    .filter(d => d.tipo === 'pessoal')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const gastosProfissionais = despesas
    .filter(d => d.tipo === 'variavel')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const despesasFixas = despesas
    .filter(d => d.tipo === 'fixa')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const despesasVariaveis = despesas
    .filter(d => d.tipo === 'variavel')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const investimentoTotal = despesas
    .filter(despesa => despesa.ehInvestimento === true)
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const totalDespesas = gastosPessoais + despesasFixas + despesasVariaveis;
  const lucroLiquido = receitaLiquida - totalDespesas;
  const roiAplicavel = investimentoTotal > 0;
  const roi = roiAplicavel ? (lucroLiquido / investimentoTotal) * 100 : 0;

  return {
    receitaBruta: Math.round(receitaBruta * 100) / 100,
    receitaLiquida: Math.round(receitaLiquida * 100) / 100,
    lucroLiquido: Math.round(lucroLiquido * 100) / 100,
    ticketMedio: Math.round(ticketMedio * 100) / 100,
    totalVendas,
    roi: Math.round(roi * 100) / 100,
    gastosPessoais: Math.round(gastosPessoais * 100) / 100,
    gastosProfissionais: Math.round(gastosProfissionais * 100) / 100,
    despesasFixas: Math.round(despesasFixas * 100) / 100,
    despesasVariaveis: Math.round(despesasVariaveis * 100) / 100,
    totalDespesas: Math.round(totalDespesas * 100) / 100,
    investimentoTotal: Math.round(investimentoTotal * 100) / 100,
    roiAplicavel
  };
}

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            NOTCH Gestão Financeira
          </h1>
          <p style={{ color: '#6b7280' }}>
            Dashboard completo para controle financeiro do seu negócio
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Receita Bruta</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
              {formatCurrency(kpis.receitaBruta)}
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Receita Líquida</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
              {formatCurrency(kpis.receitaLiquida)}
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Lucro Líquido</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: kpis.lucroLiquido >= 0 ? '#059669' : '#dc2626' }}>
              {formatCurrency(kpis.lucroLiquido)}
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Total de Vendas</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
              {kpis.totalVendas}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Ticket Médio</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
              {formatCurrency(kpis.ticketMedio)}
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>ROI</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: kpis.roiAplicavel ? (kpis.roi >= 0 ? '#059669' : '#dc2626') : '#6b7280' }}>
              {kpis.roiAplicavel ? `${kpis.roi.toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Total de Despesas</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ea580c' }}>
              {formatCurrency(kpis.totalDespesas)}
            </p>
          </div>
        </div>

        {/* Data Summary */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Resumo dos Dados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Vendas Importadas</h3>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{vendas.length} registros</p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Despesas Cadastradas</h3>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{despesas.length} registros</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '2rem' }}>
          <p>NOTCH Gestão Financeira v1.0 - Desenvolvido com Next.js</p>
        </div>
      </div>
    </div>
  );
}