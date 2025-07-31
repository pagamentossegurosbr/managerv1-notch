import { Venda, Despesa, KPIs } from '@/types';

export function calcularKPIs(
  vendas: Venda[], 
  despesas: Despesa[]
): KPIs {
  // Vendas
  const receitaBruta = vendas.reduce((sum, venda) => sum + venda.valorBruto, 0);
  const lucroLiquido = vendas.reduce((sum, venda) => sum + venda.valorLiquido, 0);
  const totalVendas = vendas.length;
  const ticketMedio = totalVendas > 0 ? receitaBruta / totalVendas : 0;

  // Despesas
  const gastosPessoais = despesas
    .filter(d => d.tipo === 'pessoal')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const gastosProfissionais = despesas
    .filter(d => d.tipo !== 'pessoal')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const despesasFixas = despesas
    .filter(d => d.tipo === 'fixa')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  const despesasVariaveis = despesas
    .filter(d => d.tipo === 'variavel')
    .reduce((sum, despesa) => sum + despesa.valor, 0);

  // ROI
  const roi = gastosProfissionais > 0 
    ? ((lucroLiquido - gastosProfissionais) / gastosProfissionais) * 100 
    : lucroLiquido > 0 ? 100 : 0;

  return {
    receitaBruta: Math.round(receitaBruta * 100) / 100,
    lucroLiquido: Math.round(lucroLiquido * 100) / 100,
    ticketMedio: Math.round(ticketMedio * 100) / 100,
    totalVendas,
    roi: Math.round(roi * 100) / 100,
    gastosPessoais: Math.round(gastosPessoais * 100) / 100,
    gastosProfissionais: Math.round(gastosProfissionais * 100) / 100,
    despesasFixas: Math.round(despesasFixas * 100) / 100,
    despesasVariaveis: Math.round(despesasVariaveis * 100) / 100
  };
}