'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Venda, Despesa, MesAno } from '@/types';
import { Calendar, DollarSign, Minus } from 'lucide-react';

interface FinancialCalendarProps {
  vendas: Venda[];
  despesas: Despesa[];
  mesAno: MesAno;
}

export function FinancialCalendar({ vendas, despesas, mesAno }: FinancialCalendarProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const gerarCalendario = () => {
    const ano = mesAno.ano;
    const mes = mesAno.mes;
    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = new Date(ano, mes, 0);
    const diasNoMes = ultimoDia.getDate();
    const primeiroDiaSemana = primeiroDia.getDay();

    const calendario = [];
    let semana = [];

    // Preencher dias vazios do início
    for (let i = 0; i < primeiroDiaSemana; i++) {
      semana.push(null);
    }

    // Preencher dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      const vendasDoDia = vendas.filter(v => v.data === data);
      const despesasDoDia = despesas.filter(d => d.data === data);
      
      const receitaTotal = vendasDoDia.reduce((sum, v) => sum + v.valorLiquido, 0);
      const despesaTotal = despesasDoDia.reduce((sum, d) => sum + d.valor, 0);
      const saldo = receitaTotal - despesaTotal;

      semana.push({
        dia,
        data,
        vendas: vendasDoDia.length,
        receita: receitaTotal,
        despesa: despesaTotal,
        saldo
      });

      if (semana.length === 7) {
        calendario.push(semana);
        semana = [];
      }
    }

    // Preencher última semana se necessário
    if (semana.length > 0) {
      while (semana.length < 7) {
        semana.push(null);
      }
      calendario.push(semana);
    }

    return calendario;
  };

  const calendario = gerarCalendario();

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Calendar className="h-5 w-5" />
          <span>Calendário Financeiro - {mesAno.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Receita</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>Despesa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>Saldo Positivo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <span>Saldo Negativo</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Headers */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
              <div key={dia} className="p-2 text-center text-xs font-medium text-gray-400 bg-gray-800/50 rounded">
                {dia}
              </div>
            ))}

            {/* Calendar Days */}
            {calendario.map((semana, semanaIndex) =>
              semana.map((dia, diaIndex) => (
                <div
                  key={`${semanaIndex}-${diaIndex}`}
                  className={`min-h-[80px] p-2 border border-gray-700 rounded ${
                    dia ? 'bg-gray-800/30' : 'bg-gray-900/30'
                  }`}
                >
                  {dia ? (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-white">{dia.dia}</div>
                      
                      {dia.vendas > 0 && (
                        <div className="flex items-center space-x-1 text-xs">
                          <DollarSign className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">{formatCurrency(dia.receita)}</span>
                        </div>
                      )}
                      
                      {dia.despesa > 0 && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Minus className="h-3 w-3 text-red-400" />
                          <span className="text-red-400">{formatCurrency(dia.despesa)}</span>
                        </div>
                      )}
                      
                      {dia.saldo !== 0 && (
                        <div className={`text-xs font-medium ${
                          dia.saldo > 0 ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                          Saldo: {formatCurrency(dia.saldo)}
                        </div>
                      )}
                      
                      {dia.vendas > 0 && (
                        <div className="text-xs text-gray-500">
                          {dia.vendas} venda{dia.vendas > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-600 text-sm">-</div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Resumo do Mês</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Total Vendas:</span>
                <div className="text-white font-medium">{vendas.length}</div>
              </div>
              <div>
                <span className="text-gray-400">Total Receita:</span>
                <div className="text-green-400 font-medium">
                  {formatCurrency(vendas.reduce((sum, v) => sum + v.valorLiquido, 0))}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Total Despesas:</span>
                <div className="text-red-400 font-medium">
                  {formatCurrency(despesas.reduce((sum, d) => sum + d.valor, 0))}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Saldo:</span>
                <div className={`font-medium ${
                  (vendas.reduce((sum, v) => sum + v.valorLiquido, 0) - 
                   despesas.reduce((sum, d) => sum + d.valor, 0)) >= 0 
                    ? 'text-blue-400' 
                    : 'text-gray-400'
                }`}>
                  {formatCurrency(
                    vendas.reduce((sum, v) => sum + v.valorLiquido, 0) - 
                    despesas.reduce((sum, d) => sum + d.valor, 0)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 