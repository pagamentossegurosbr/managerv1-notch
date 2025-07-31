'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parsearCSV, CSVParseError } from '@/lib/csv-parser';
import { Storage } from '@/lib/storage';
import { toast } from 'sonner';

interface ImportCSVProps {
  onImportSuccess: () => void;
}

export function ImportCSV({ onImportSuccess }: ImportCSVProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV válido.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const fileContent = await file.text();
      const vendas = await parsearCSV(fileContent);

      if (vendas.length === 0) {
        setError('Nenhuma venda válida encontrada no arquivo.');
        return;
      }

      // Verificar se já existem vendas do mesmo mês/ano
      const vendasExistentes = Storage.carregarVendas();
      const mesAnoImportado = `${vendas[0].mes}/${vendas[0].ano}`;
      const jaExiste = vendasExistentes.some(
        v => v.ano === vendas[0].ano && v.mes === vendas[0].mes
      );

      if (jaExiste) {
        const confirmar = window.confirm(
          `Já existem vendas para ${mesAnoImportado}. Deseja sobrescrever os dados existentes?`
        );
        
        if (confirmar) {
          Storage.removerVendasDoMes(vendas[0].ano, vendas[0].mes);
        } else {
          setIsProcessing(false);
          return;
        }
      }

      Storage.adicionarVendas(vendas);
      
      setSuccess(`✅ Importadas ${vendas.length} vendas para ${mesAnoImportado}`);
      toast.success(`${vendas.length} vendas importadas com sucesso!`);
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notificar componente pai
      onImportSuccess();

    } catch (err) {
      console.error('Erro na importação:', err);
      
      if (err instanceof CSVParseError) {
        setError(`Erro na linha ${err.linha}: ${err.message}`);
      } else {
        setError(`Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Importar Vendas CSV</CardTitle>
        <CardDescription>
          Faça upload do arquivo CSV da PushinPay para importar suas vendas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload">
            <Button 
              variant="outline" 
              className="cursor-pointer"
              disabled={isProcessing}
              asChild
            >
              <span>
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Selecionar Arquivo CSV
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Formato esperado:</strong></p>
          <p>Ano,Mês,Dia,Vendas,Valor Vendas,Total Recebido</p>
          <p>Ex: 2025,Junho,30,3,"19,90","56,55"</p>
        </div>
      </CardContent>
    </Card>
  );
}