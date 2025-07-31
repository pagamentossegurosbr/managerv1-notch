'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MesAno } from '@/types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  mesAno: MesAno;
  onMesAnoChange: (mesAno: MesAno) => void;
}

export function MonthSelector({ mesAno, onMesAnoChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    let novoMes = mesAno.mes;
    let novoAno = mesAno.ano;

    if (direcao === 'anterior') {
      if (novoMes === 1) {
        novoMes = 12;
        novoAno--;
      } else {
        novoMes--;
      }
    } else {
      if (novoMes === 12) {
        novoMes = 1;
        novoAno++;
      } else {
        novoMes++;
      }
    }

    const novoMesAno: MesAno = {
      mes: novoMes,
      ano: novoAno,
      label: `${meses[novoMes - 1]} ${novoAno}`
    };

    onMesAnoChange(novoMesAno);
  };

  const selecionarMes = (mes: number, ano: number) => {
    const novoMesAno: MesAno = {
      mes,
      ano,
      label: `${meses[mes - 1]} ${ano}`
    };
    onMesAnoChange(novoMesAno);
    setIsOpen(false);
  };

  const gerarOpcoesMeses = () => {
    const opcoes = [];
    const anoAtual = new Date().getFullYear();
    
    // Últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const data = new Date(anoAtual, new Date().getMonth() - i, 1);
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();
      
      opcoes.push({
        mes,
        ano,
        label: `${meses[mes - 1]} ${ano}`,
        isCurrent: mes === new Date().getMonth() + 1 && ano === anoAtual
      });
    }

    return opcoes;
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navegarMes('anterior')}
          className="h-8 w-8 p-0 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700 min-w-[140px]"
        >
          <Calendar className="h-4 w-4 mr-2" />
          {mesAno.label}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navegarMes('proximo')}
          className="h-8 w-8 p-0 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2 min-w-[200px]">
          <div className="text-sm font-medium text-gray-300 mb-2 px-2">
            Selecionar Período
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {gerarOpcoesMeses().map((opcao) => (
              <button
                key={`${opcao.ano}-${opcao.mes}`}
                onClick={() => selecionarMes(opcao.mes, opcao.ano)}
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors ${
                  opcao.mes === mesAno.mes && opcao.ano === mesAno.ano
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300'
                } ${opcao.isCurrent ? 'font-semibold' : ''}`}
              >
                {opcao.label}
                {opcao.isCurrent && (
                  <span className="ml-2 text-xs text-blue-400">(Atual)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 