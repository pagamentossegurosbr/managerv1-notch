'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { Venda, Despesa, KPIs } from '@/types';
import { Storage } from '@/lib/storage';
import { exportarDadosCSV, downloadCSV } from '@/lib/export-csv';
import { toast } from 'sonner';
import { useState } from 'react';

interface DataExportProps {
  vendas: Venda[];
  despesas: Despesa[];
  kpis: KPIs;
  mesAno: string;
  onDataReset: () => void;
}

export function DataExport({ vendas, despesas, kpis, mesAno, onDataReset }: DataExportProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    try {
      const csvContent = exportarDadosCSV(vendas, despesas, kpis, mesAno);
      const filename = `relatorio-financeiro-${mesAno.replace('/', '-')}.csv`;
      downloadCSV(csvContent, filename);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  const handleResetData = () => {
    if (showResetConfirm) {
      Storage.limparTodosDados();
      toast.success('Todos os dados foram apagados');
      onDataReset();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000); // Auto-cancelar após 5s
    }
  };

  const totalRegistros = vendas.length + despesas.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          Exportar & Gerenciar Dados
        </CardTitle>
        <CardDescription>
          Exportar relatórios e gerenciar seus dados
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Exportar Relatório</h4>
            <p className="text-sm text-muted-foreground">
              Baixar relatório completo em CSV - {mesAno}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalRegistros} registros • {vendas.length} vendas • {despesas.length} despesas
            </p>
          </div>
          <Button onClick={handleExport} disabled={totalRegistros === 0}>
            <Download className="mr-2 h-4 w-4" />
            Baixar CSV
          </Button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Zona de Perigo
          </h4>
          
          {showResetConfirm ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p>
                    <strong>Tem certeza?</strong> Esta ação irá apagar TODOS os seus dados permanentemente:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Todas as vendas importadas e manuais</li>
                    <li>Todas as despesas registradas</li>
                    <li>Configurações do usuário</li>
                  </ul>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleResetData}
                    >
                      Sim, apagar tudo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowResetConfirm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div>
                <h5 className="font-medium">Apagar Todos os Dados</h5>
                <p className="text-sm text-muted-foreground">
                  Remove permanentemente todas as vendas, despesas e configurações
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleResetData}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Apagar Tudo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}