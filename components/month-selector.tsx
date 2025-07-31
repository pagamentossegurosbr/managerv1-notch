'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { MesAno } from '@/types';
import { Storage } from '@/lib/storage';

interface MonthSelectorProps {
  selectedMonth: MesAno;
  onMonthChange: (mesAno: MesAno) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const [mesesDisponiveis, setMesesDisponiveis] = useState<MesAno[]>([]);

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    const meses = Storage.obterMesesDisponiveis();
    setMesesDisponiveis(meses);

    // Se não há mês selecionado e há meses disponíveis, selecionar o mais recente
    if (!selectedMonth.mes && meses.length > 0) {
      onMonthChange(meses[0]);
    }
  }, [selectedMonth, onMonthChange]);

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    const mesAtual = selectedMonth.mes;
    const anoAtual = selectedMonth.ano;

    let novoMes = mesAtual;
    let novoAno = anoAtual;

    if (direcao === 'proximo') {
      if (mesAtual === 12) {
        novoMes = 1;
        novoAno = anoAtual + 1;
      } else {
        novoMes = mesAtual + 1;
      }
    } else {
      if (mesAtual === 1) {
        novoMes = 12;
        novoAno = anoAtual - 1;
      } else {
        novoMes = mesAtual - 1;
      }
    }

    const novoMesAno: MesAno = {
      mes: novoMes,
      ano: novoAno,
      label: `${nomesMeses[novoMes - 1]}/${novoAno}`
    };

    onMonthChange(novoMesAno);
  };

  const handleSelectChange = (value: string) => {
    const [mes, ano] = value.split('-').map(Number);
    const novoMesAno: MesAno = {
      mes,
      ano,
      label: `${nomesMeses[mes - 1]}/${ano}`
    };
    onMonthChange(novoMesAno);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navegarMes('anterior')}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select 
          value={`${selectedMonth.mes}-${selectedMonth.ano}`}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-[200px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <SelectValue placeholder="Selecionar mês" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {/* Opção do mês atual selecionado (sempre disponível) */}
            <SelectItem value={`${selectedMonth.mes}-${selectedMonth.ano}`}>
              {nomesMeses[selectedMonth.mes - 1]} {selectedMonth.ano}
            </SelectItem>
            
            {/* Meses com dados disponíveis */}
            {mesesDisponiveis
              .filter(m => !(m.mes === selectedMonth.mes && m.ano === selectedMonth.ano))
              .map((mesAno) => (
                <SelectItem 
                  key={`${mesAno.mes}-${mesAno.ano}`}
                  value={`${mesAno.mes}-${mesAno.ano}`}
                >
                  {nomesMeses[mesAno.mes - 1]} {mesAno.ano}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navegarMes('proximo')}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}