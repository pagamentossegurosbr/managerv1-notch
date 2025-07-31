'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Venda, Despesa, KPIs } from '@/types';
import { exportarDadosCSV, downloadCSV } from '@/lib/export-csv';
import { Download, FileText, BarChart3 } from 'lucide-react';

interface DataExportProps {
  vendas: Venda[];
  despesas: Despesa[];
  kpis: KPIs;
  mesAno: string;
}

export function DataExport({ vendas, despesas, kpis, mesAno }: DataExportProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportarRelatorioCompleto = () => {
    const csvContent = exportarDadosCSV(vendas, despesas, kpis, mesAno);
    const filename = `relatorio_financeiro_${mesAno.replace(/\s+/g, '_').toLowerCase()}.csv`;
    downloadCSV(csvContent, filename);
  };

  const exportarApenasVendas = () => {
    let csv = 'Data,Valor Bruto,Valor Líquido,Origem,Importada\n';
    vendas.forEach(venda => {
      csv += `"${venda.data}","${formatCurrency(venda.valorBruto)}","${formatCurrency(venda.valorLiquido)}","${venda.origem}","${venda.importada ? 'Sim' : 'Não'}"\n`;
    });
    downloadCSV(csv, `vendas_${mesAno.replace(/\s+/g, '_').toLowerCase()}.csv`);
  };

  const exportarApenasDespesas = () => {
    let csv = 'Nome,Valor,Tipo,Categoria,Data,É Investimento\n';
    despesas.forEach(despesa => {
      csv += `"${despesa.nome}","${formatCurrency(despesa.valor)}","${despesa.tipo}","${despesa.categoria}","${despesa.data}","${despesa.ehInvestimento ? 'Sim' : 'Não'}"\n`;
    });
    downloadCSV(csv, `despesas_${mesAno.replace(/\s+/g, '_').toLowerCase()}.csv`);
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Download className="h-5 w-5" />
          <span>Exportar Dados</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Exporte relatórios e dados para análise externa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Resumo dos Dados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Vendas:</span>
              <div className="text-white font-medium">{vendas.length} registros</div>
            </div>
            <div>
              <span className="text-gray-400">Despesas:</span>
              <div className="text-white font-medium">{despesas.length} registros</div>
            </div>
            <div>
              <span className="text-gray-400">Receita Total:</span>
              <div className="text-green-400 font-medium">{formatCurrency(kpis.receitaLiquida)}</div>
            </div>
            <div>
              <span className="text-gray-400">Despesa Total:</span>
              <div className="text-red-400 font-medium">{formatCurrency(kpis.totalDespesas)}</div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Opções de Exportação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Relatório Completo */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <h4 className="font-medium text-white">Relatório Completo</h4>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Inclui KPIs, vendas e despesas em um único arquivo CSV
              </p>
              <Button
                onClick={exportarRelatorioCompleto}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={vendas.length === 0 && despesas.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Completo
              </Button>
            </div>

            {/* Apenas Vendas */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-5 w-5 text-green-400" />
                <h4 className="font-medium text-white">Apenas Vendas</h4>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Exporta apenas os dados de vendas do período
              </p>
              <Button
                onClick={exportarApenasVendas}
                className="w-full bg-green-600 text-white hover:bg-green-700"
                disabled={vendas.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Vendas
              </Button>
            </div>

            {/* Apenas Despesas */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-5 w-5 text-red-400" />
                <h4 className="font-medium text-white">Apenas Despesas</h4>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Exporta apenas os dados de despesas do período
              </p>
              <Button
                onClick={exportarApenasDespesas}
                className="w-full bg-red-600 text-white hover:bg-red-700"
                disabled={despesas.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Despesas
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-600/20 border border-blue-600 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-400 mb-2">📋 Informações</h3>
          <ul className="text-xs text-blue-300 space-y-1">
            <li>• Os arquivos são exportados no formato CSV</li>
            <li>• Use vírgula como separador de campos</li>
            <li>• Valores monetários estão formatados em Real (R$)</li>
            <li>• Datas estão no formato YYYY-MM-DD</li>
            <li>• Os arquivos podem ser abertos no Excel ou Google Sheets</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 