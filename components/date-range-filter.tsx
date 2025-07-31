'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarRange, X, Filter, Calendar as CalendarIcon, Clock, Zap } from 'lucide-react';
import { FiltroData } from '@/types';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  filtro: FiltroData;
  onFiltroChange: (filtro: FiltroData) => void;
}

export function DateRangeFilter({ filtro, onFiltroChange }: DateRangeFilterProps) {
  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (filtro.ativo && filtro.dataInicial && filtro.dataFinal) {
      return {
        from: new Date(filtro.dataInicial),
        to: new Date(filtro.dataFinal)
      };
    }
    return undefined;
  });
  const [isOpen, setIsOpen] = useState(false);

  // Presets rápidos
  const presets = [
    {
      label: "Últimos 7 dias",
      icon: Clock,
      range: () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return { from: sevenDaysAgo, to: today };
      }
    },
    {
      label: "Últimos 30 dias",
      icon: Clock,
      range: () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return { from: thirtyDaysAgo, to: today };
      }
    },
    {
      label: "Este mês",
      icon: CalendarIcon,
      range: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: firstDay, to: today };
      }
    },
    {
      label: "Mês passado",
      icon: CalendarIcon,
      range: () => {
        const today = new Date();
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return { from: firstDayLastMonth, to: lastDayLastMonth };
      }
    }
  ];

  const aplicarFiltro = (selectedRange?: DateRange) => {
    const range = selectedRange || date;
    
    if (!range?.from || !range?.to) {
      return;
    }

    onFiltroChange({
      dataInicial: range.from.toISOString().split('T')[0],
      dataFinal: range.to.toISOString().split('T')[0],
      ativo: true
    });
    
    setIsOpen(false);
  };

  const limparFiltro = () => {
    setDate(undefined);
    onFiltroChange({
      dataInicial: undefined,
      dataFinal: undefined,
      ativo: false
    });
  };

  const aplicarPreset = (preset: typeof presets[0]) => {
    const range = preset.range();
    setDate(range);
    aplicarFiltro(range);
  };

  const formatarPeriodo = (from: Date, to: Date) => {
    if (from.toDateString() === to.toDateString()) {
      return format(from, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
    
    if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
      return `${format(from, "dd", { locale: ptBR })} - ${format(to, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
    }
    
    return `${format(from, "dd/MM/yyyy", { locale: ptBR })} - ${format(to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  const calcularDias = (from: Date, to: Date) => {
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-background to-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarRange className="h-5 w-5 text-primary" />
              Filtro por Período
            </CardTitle>
            <CardDescription>
              Selecione um intervalo de datas para análise detalhada
            </CardDescription>
          </div>
          
          {filtro.ativo && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Filtro Ativo
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Seletor de Data Principal */}
        <div className="flex flex-col gap-4">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={filtro.ativo ? "default" : "outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !date && "text-muted-foreground",
                  filtro.ativo && "bg-primary text-primary-foreground shadow-lg"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                {date?.from ? (
                  date.to ? (
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {formatarPeriodo(date.from, date.to)}
                      </span>
                      <span className="text-xs opacity-80">
                        {calcularDias(date.from, date.to)} dias selecionados
                      </span>
                    </div>
                  ) : (
                    format(date.from, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex">
                {/* Sidebar com Presets */}
                <div className="border-r bg-muted/30 p-4 min-w-[200px]">
                  <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                    Períodos Rápidos
                  </h4>
                  <div className="space-y-1">
                    {presets.map((preset, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-sm h-9"
                        onClick={() => aplicarPreset(preset)}
                      >
                        <preset.icon className="mr-2 h-4 w-4" />
                        {preset.label}
                      </Button>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => aplicarFiltro()}
                      disabled={!date?.from || !date?.to}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Aplicar Filtro
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={limparFiltro}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Limpar
                    </Button>
                  </div>
                </div>

                {/* Calendário */}
                <div className="p-4">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={ptBR}
                    className="rounded-md"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md hover:bg-accent"
                      ),
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: cn(
                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                        "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50",
                        "[&:has([aria-selected].day-range-end)]:rounded-r-md",
                        "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                      ),
                      day: cn(
                        "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md"
                      ),
                      day_range_start: "day-range-start",
                      day_range_end: "day-range-end",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground font-semibold",
                      day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Status do Filtro */}
        {filtro.ativo && date?.from && date?.to && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CalendarRange className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Filtro Aplicado
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatarPeriodo(date.from, date.to)}</span>
                    <Badge variant="outline" className="text-xs">
                      {calcularDias(date.from, date.to)} dias
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={limparFiltro}
                className="text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Dicas de Uso */}
        {!filtro.ativo && (
          <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <CalendarIcon className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Dica:</p>
                <p>Use os períodos rápidos ou selecione um intervalo personalizado no calendário. Todos os KPIs e gráficos serão atualizados automaticamente.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}