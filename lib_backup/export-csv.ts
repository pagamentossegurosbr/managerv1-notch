import { Venda, Despesa, KPIs } from '@/types';

export function exportarDadosCSV(
  vendas: Venda[],
  despesas: Despesa[],
  kpis: KPIs,
  mesAno: string
): string {
  let csv = '';

  // Cabeçalho KPIs
  csv += `"RELATÓRIO FINANCEIRO - ${mesAno}"\n\n`;
  csv += `"INDICADORES (KPIs)"\n`;
  csv += `"Receita Bruta","R$ ${kpis.receitaBruta.toFixed(2)}"\n`;
  csv += `"Lucro Líquido","R$ ${kpis.lucroLiquido.toFixed(2)}"\n`;
  csv += `"Ticket Médio","R$ ${kpis.ticketMedio.toFixed(2)}"\n`;
  csv += `"Total de Vendas","${kpis.totalVendas}"\n`;
  csv += `"ROI","${kpis.roi.toFixed(2)}%"\n`;
  csv += `"Gastos Pessoais","R$ ${kpis.gastosPessoais.toFixed(2)}"\n`;
  csv += `"Gastos Profissionais","R$ ${kpis.gastosProfissionais.toFixed(2)}"\n\n`;

  // Vendas
  csv += `"VENDAS"\n`;
  csv += `"Data","Valor Bruto","Valor Líquido","Origem","Importada"\n`;
  vendas.forEach(venda => {
    csv += `"${venda.data}","R$ ${venda.valorBruto.toFixed(2)}","R$ ${venda.valorLiquido.toFixed(2)}","${venda.origem}","${venda.importada ? 'Sim' : 'Não'}"\n`;
  });

  csv += `\n"DESPESAS"\n`;
  csv += `"Nome","Valor","Tipo","Categoria","Data"\n`;
  despesas.forEach(despesa => {
    csv += `"${despesa.nome}","R$ ${despesa.valor.toFixed(2)}","${despesa.tipo}","${despesa.categoria}","${despesa.data}"\n`;
  });

  return csv;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}