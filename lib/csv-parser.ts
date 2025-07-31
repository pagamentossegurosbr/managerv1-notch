import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { Venda, CSVRow } from '@/types';

const meses = {
  "Janeiro": 1, "Fevereiro": 2, "Março": 3, "Abril": 4,
  "Maio": 5, "Junho": 6, "Julho": 7, "Agosto": 8,
  "Setembro": 9, "Outubro": 10, "Novembro": 11, "Dezembro": 12
};

export class CSVParseError extends Error {
  constructor(message: string, public linha?: number) {
    super(message);
    this.name = 'CSVParseError';
  }
}

function converterValor(valor: string): number {
  if (!valor) throw new Error('Valor vazio');
  const valorLimpo = valor.replace(/['"]/g, '').replace(',', '.');
  const numero = parseFloat(valorLimpo);
  if (isNaN(numero) || numero < 0) {
    throw new Error(`Valor inválido: ${valor}`);
  }
  return numero;
}

function validarLinha(row: any, numeroLinha: number): CSVRow {
  const colunas = Object.values(row) as string[];
  
  if (colunas.length !== 6) {
    throw new CSVParseError(`Linha deve conter exatamente 6 colunas, encontradas ${colunas.length}`, numeroLinha);
  }

  const [ano, mes, dia, vendas, valorVendas, totalRecebido] = colunas;

  // Validar ano
  const anoNum = parseInt(ano);
  if (isNaN(anoNum) || anoNum < 2000 || anoNum > 2100) {
    throw new CSVParseError(`Ano inválido: ${ano}`, numeroLinha);
  }

  // Validar mês
  if (!meses[mes as keyof typeof meses]) {
    throw new CSVParseError(`Mês inválido: ${mes}`, numeroLinha);
  }

  // Validar dia
  const diaNum = parseInt(dia);
  if (isNaN(diaNum) || diaNum < 1 || diaNum > 31) {
    throw new CSVParseError(`Dia inválido: ${dia}`, numeroLinha);
  }

  // Validar quantidade de vendas
  const vendasNum = parseInt(vendas);
  if (isNaN(vendasNum) || vendasNum <= 0) {
    throw new CSVParseError(`Quantidade de vendas inválida: ${vendas}`, numeroLinha);
  }

  // Validar valores
  try {
    converterValor(valorVendas);
    converterValor(totalRecebido);
  } catch (error) {
    throw new CSVParseError(`${error} na linha ${numeroLinha}`, numeroLinha);
  }

  // Validar data
  const mesNum = meses[mes as keyof typeof meses];
  const data = new Date(anoNum, mesNum - 1, diaNum);
  if (data.getDate() !== diaNum || data.getMonth() !== mesNum - 1 || data.getFullYear() !== anoNum) {
    throw new CSVParseError(`Data inválida: ${dia}/${mes}/${ano}`, numeroLinha);
  }

  return { ano, mes, dia, vendas, valorVendas, totalRecebido };
}

export function parsearCSV(csvContent: string): Promise<Venda[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const vendas: Venda[] = [];
          let totalVendasDetectadas = 0;

          results.data.forEach((row: any, index: number) => {
            // Pular linha de totais
            if (row.Ano === 'Total' || row.ano === 'Total') return;

            const numeroLinha = index + 2; // +2 porque começamos do cabeçalho
            const dadosValidados = validarLinha(row, numeroLinha);

            const anoNum = parseInt(dadosValidados.ano);
            const mesNum = meses[dadosValidados.mes as keyof typeof meses];
            const diaNum = parseInt(dadosValidados.dia);
            const quantidadeVendas = parseInt(dadosValidados.vendas);
            const valorBrutoTotal = converterValor(dadosValidados.valorVendas);
            const valorLiquidoTotal = converterValor(dadosValidados.totalRecebido);

            // Calcular valores individuais
            const valorBrutoUnitario = valorBrutoTotal / quantidadeVendas;
            const valorLiquidoUnitario = valorLiquidoTotal / quantidadeVendas;

            // Criar data no formato YYYY-MM-DD
            const dataFormatada = `${anoNum}-${mesNum.toString().padStart(2, '0')}-${diaNum.toString().padStart(2, '0')}`;

            // Gerar vendas individuais
            for (let i = 0; i < quantidadeVendas; i++) {
              vendas.push({
                id: uuidv4(),
                data: dataFormatada,
                ano: anoNum,
                mes: mesNum,
                valorBruto: Math.round(valorBrutoUnitario * 100) / 100,
                valorLiquido: Math.round(valorLiquidoUnitario * 100) / 100,
                origem: 'Orgânico',
                importada: true,
                createdAt: new Date().toISOString()
              });
            }

            totalVendasDetectadas += quantidadeVendas;
          });

          console.log(`✅ Detectadas ${totalVendasDetectadas} vendas individuais`);
          resolve(vendas);

        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new CSVParseError(`Erro ao processar CSV: ${error.message}`));
      }
    });
  });
}