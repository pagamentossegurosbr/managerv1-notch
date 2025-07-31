import { Venda, Despesa, FiltroData } from '@/types';

/**
 * Filtra vendas com base no filtro de data
 */
export function filtrarVendasPorData(vendas: Venda[], filtro: FiltroData): Venda[] {
  if (!filtro.ativo || !filtro.dataInicial || !filtro.dataFinal) {
    return vendas;
  }

  return vendas.filter(venda => {
    const dataVenda = new Date(venda.data);
    const dataInicial = new Date(filtro.dataInicial!);
    const dataFinal = new Date(filtro.dataFinal!);
    
    return dataVenda >= dataInicial && dataVenda <= dataFinal;
  });
}

/**
 * Filtra despesas com base no filtro de data
 */
export function filtrarDespesasPorData(despesas: Despesa[], filtro: FiltroData): Despesa[] {
  if (!filtro.ativo || !filtro.dataInicial || !filtro.dataFinal) {
    return despesas;
  }

  return despesas.filter(despesa => {
    const dataDespesa = new Date(despesa.data);
    const dataInicial = new Date(filtro.dataInicial!);
    const dataFinal = new Date(filtro.dataFinal!);
    
    return dataDespesa >= dataInicial && dataDespesa <= dataFinal;
  });
}

/**
 * Obtem o período formatado para exibição
 */
export function obterPeriodoFormatado(filtro: FiltroData, mesAnoLabel: string): string {
  if (!filtro.ativo || !filtro.dataInicial || !filtro.dataFinal) {
    return mesAnoLabel;
  }

  const dataInicial = new Date(filtro.dataInicial).toLocaleDateString('pt-BR');
  const dataFinal = new Date(filtro.dataFinal).toLocaleDateString('pt-BR');
  
  return `${dataInicial} - ${dataFinal}`;
}