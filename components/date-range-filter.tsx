'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiltroData } from '@/types';
import { Calendar, X, Filter } from 'lucide-react';

interface DateRangeFilterProps {
  filtro: FiltroData;
  onFiltroChange: (filtro: FiltroData) => void;
}

export function DateRangeFilter({ filtro, onFiltroChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataInicial, setDataInicial] = useState(filtro.dataInicial || '');
  const [dataFinal, setDataFinal] = useState(filtro.dataFinal || '');

  const aplicarFiltro = () => {
    const novoFiltro: FiltroData = {
      dataInicial: dataInicial || undefined,
      dataFinal: dataFinal || undefined,
      ativo: !!(dataInicial && dataFinal)
    };
    onFiltroChange(novoFiltro);
    setIsOpen(false);
  };

  const limparFiltro = () => {
    setDataInicial('');
    setDataFinal('');
    onFiltroChange({
      dataInicial: undefined,
      dataFinal: undefined,
      ativo: false
    });
    setIsOpen(false);
  };

  const aplicarPeriodoRapido = (dias: number) => {
    const hoje = new Date();
    const dataInicial = new Date(hoje);
    dataInicial.setDate(hoje.getDate() - dias);
    
    const dataInicialStr = dataInicial.toISOString().split('T')[0];
    const dataFinalStr = hoje.toISOString().split('T')[0];
    
    setDataInicial(dataInicialStr);
    setDataFinal(dataFinalStr);
  };

  const formatarData = (data: string) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Filter className="h-5 w-5" />
          <span>Filtro por Período</span>
          {filtro.ativo && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              Ativo
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-gray-400">
          Selecione um intervalo de datas para análise detalhada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isOpen ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {filtro.ativo 
                  ? `${formatarData(filtro.dataInicial!)} - ${formatarData(filtro.dataFinal!)}`
                  : 'Selecione um período'
                }
              </Button>
              {filtro.ativo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={limparFiltro}
                  className="bg-red-600/20 border-red-600 text-red-400 hover:bg-red-600/30"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Períodos Rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => aplicarPeriodoRapido(7)}
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Últimos 7 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => aplicarPeriodoRapido(30)}
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Últimos 30 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => aplicarPeriodoRapido(90)}
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Últimos 90 dias
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={aplicarFiltro}
                disabled={!dataInicial || !dataFinal}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Aplicar Filtro
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-800/50 p-3 rounded-md">
          <strong>Dica:</strong> Use os períodos rápidos ou selecione um intervalo personalizado no calendário. 
          Todos os KPIs e gráficos serão atualizados automaticamente.
        </div>
      </CardContent>
    </Card>
  );
} 