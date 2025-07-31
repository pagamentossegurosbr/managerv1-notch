import { Venda, Despesa, KPIs } from '@/types';

export function calcularKPIs(
  vendas: Venda[], 
  despesas: Despesa[]
): KPIs {
  // 1. Receita Bruta = soma de "Valor Vendas"
  const receitaBruta = vendas.reduce((sum, venda) => sum + venda.valorBruto, 0);
  
  // 2. Receita Líquida = soma de "Total Recebido" 
  const receitaLiquida = vendas.reduce((sum, venda) => sum + venda.valorLiquido, 0);
  
  // 3. Total de Vendas = soma da coluna "Vendas"
  const totalVendas = vendas.reduce((sum, venda) => sum + 1, 0); // Cada linha do CSV = 1 venda por dia
  
  // 4. Ticket Médio = Receita Bruta ÷ Total de Vendas
  const ticketMedio = totalVendas > 0 ? receitaBruta / totalVendas : 0;

  // Despesas por tipo
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

  // Investimentos diretos (apenas despesas marcadas como investimento)
  const investimentoTotal = despesas
    .filter(despesa => despesa.ehInvestimento === true)
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  // Total de TODAS as despesas
  const totalDespesas = gastosPessoais + despesasFixas + despesasVariaveis;

  // 5. Lucro Líquido = Receita Líquida - Total de Despesas
  const lucroLiquido = receitaLiquida - totalDespesas;

  // 6. ROI = (Lucro Líquido ÷ Investimentos) × 100
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