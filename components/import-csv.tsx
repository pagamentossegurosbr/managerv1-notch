'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MesAno } from '@/types';
import { parsearCSV } from '@/lib/csv-parser';
import { Storage } from '@/lib/storage';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface ImportCSVProps {
  mesAno: MesAno;
  onVendasChange: () => void;
}

export function ImportCSV({ mesAno, onVendasChange }: ImportCSVProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Por favor, selecione um arquivo CSV válido.' });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Por favor, selecione um arquivo CSV.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const text = await selectedFile.text();
      const vendas = await parsearCSV(text);
      
      // Remover vendas existentes do mês/ano
      Storage.removerVendasDoMes(mesAno.ano, mesAno.mes);
      
      // Adicionar novas vendas
      Storage.adicionarVendas(vendas);
      
      setMessage({ 
        type: 'success', 
        text: `Importação realizada com sucesso! ${vendas.length} vendas importadas para ${mesAno.label}.` 
      });
      
      setSelectedFile(null);
      onVendasChange();
      
      // Limpar input
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Erro na importação: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `ano,mes,dia,vendas,valor_vendas,total_recebido
2024,7,15,5,100.00,95.00
2024,7,16,3,60.00,57.00
2024,7,17,8,160.00,152.00`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_vendas.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Upload className="h-5 w-5" />
          <span>Importar Dados CSV</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Importe dados de vendas do arquivo CSV para {mesAno.label}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">📋 Formato do CSV</h3>
          <p className="text-xs text-gray-400 mb-3">
            O arquivo deve conter as colunas: ano, mes, dia, vendas, valor_vendas, total_recebido
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600"
          >
            <FileText className="h-4 w-4 mr-2" />
            Baixar Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selecionar Arquivo CSV
            </label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600 file:cursor-pointer cursor-pointer"
            />
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
              <span className="text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-600/20 border border-green-600 text-green-400' 
                : 'bg-red-600/20 border border-red-600 text-red-400'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Import Button */}
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">📝 Instruções</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• O arquivo deve estar no formato CSV</li>
            <li>• Use vírgula como separador</li>
            <li>• Inclua cabeçalho na primeira linha</li>
            <li>• Valores monetários devem usar ponto como separador decimal</li>
            <li>• Mês deve ser número (1-12) ou nome em português</li>
            <li>• Dados existentes do mês serão substituídos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 