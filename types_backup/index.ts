export interface Venda {
  id: string;
  data: string; // YYYY-MM-DD
  ano: number;
  mes: number;
  valorBruto: number;
  valorLiquido: number;
  origem: 'Orgânico' | 'Pago';
  categoria?: string;
  importada: boolean;
  createdAt: string;
}

export interface Despesa {
  id: string;
  nome: string;
  valor: number;
  tipo: 'fixa' | 'variavel' | 'pessoal';
  categoria: string;
  data: string;
  recorrencia?: 'mensal' | 'anual';
  ano: number;
  mes: number;
  createdAt: string;
  ehInvestimento?: boolean; // Campo para marcar se é investimento direto no negócio
}

export interface KPIs {
  receitaBruta: number;
  receitaLiquida: number; // Total Recebido do CSV
  lucroLiquido: number; // Receita Líquida - Total de Despesas
  ticketMedio: number;
  totalVendas: number;
  roi: number;
  gastosPessoais: number;
  gastosProfissionais: number;
  despesasFixas: number;
  despesasVariaveis: number;
  totalDespesas: number; // Soma de todos os gastos
  investimentoTotal: number; // Apenas despesas marcadas como investimento
  roiAplicavel: boolean; // Se há investimentos para calcular ROI
}

export interface Usuario {
  nome: string;
  avatar?: string;
  metaMensal?: number;
  totalFaturado: number;
  totalGasto: number;
}

export interface CSVRow {
  ano: string;
  mes: string;
  dia: string;
  vendas: string;
  valorVendas: string;
  totalRecebido: string;
}

export interface MesAno {
  mes: number;
  ano: number;
  label: string;
}

export interface FiltroData {
  dataInicial?: string; // YYYY-MM-DD
  dataFinal?: string; // YYYY-MM-DD
  ativo: boolean;
}