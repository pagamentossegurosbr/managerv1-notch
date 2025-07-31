import { Venda, Despesa, Usuario, MesAno } from '@/types';

const STORAGE_KEYS = {
  VENDAS: 'financial_app_vendas',
  DESPESAS: 'financial_app_despesas',
  USUARIO: 'financial_app_usuario'
};

export class Storage {
  static salvarVendas(vendas: Venda[]): void {
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(vendas));
  }

  static carregarVendas(): Venda[] {
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS);
    return data ? JSON.parse(data) : [];
  }

  static adicionarVendas(novasVendas: Venda[]): void {
    const vendasExistentes = this.carregarVendas();
    const todasVendas = [...vendasExistentes, ...novasVendas];
    this.salvarVendas(todasVendas);
  }

  static removerVendasDoMes(ano: number, mes: number): void {
    const vendas = this.carregarVendas();
    const vendasFiltradas = vendas.filter(v => !(v.ano === ano && v.mes === mes));
    this.salvarVendas(vendasFiltradas);
  }

  static salvarDespesas(despesas: Despesa[]): void {
    localStorage.setItem(STORAGE_KEYS.DESPESAS, JSON.stringify(despesas));
  }

  static carregarDespesas(): Despesa[] {
    const data = localStorage.getItem(STORAGE_KEYS.DESPESAS);
    return data ? JSON.parse(data) : [];
  }

  static adicionarDespesa(despesa: Despesa): void {
    const despesas = this.carregarDespesas();
    despesas.push(despesa);
    this.salvarDespesas(despesas);
  }

  static atualizarDespesa(id: string, despesaAtualizada: Partial<Despesa>): void {
    const despesas = this.carregarDespesas();
    const index = despesas.findIndex(d => d.id === id);
    if (index !== -1) {
      despesas[index] = { ...despesas[index], ...despesaAtualizada };
      this.salvarDespesas(despesas);
    }
  }

  static removerDespesa(id: string): void {
    const despesas = this.carregarDespesas();
    const despesasFiltradas = despesas.filter(d => d.id !== id);
    this.salvarDespesas(despesasFiltradas);
  }

  static salvarUsuario(usuario: Usuario): void {
    localStorage.setItem(STORAGE_KEYS.USUARIO, JSON.stringify(usuario));
  }

  static carregarUsuario(): Usuario {
    const data = localStorage.getItem(STORAGE_KEYS.USUARIO);
    return data ? JSON.parse(data) : {
      nome: 'Usuário',
      totalFaturado: 0,
      totalGasto: 0
    };
  }

  static obterMesesDisponiveis(): MesAno[] {
    const vendas = this.carregarVendas();
    const despesas = this.carregarDespesas();
    
    const mesesSet = new Set<string>();
    
    [...vendas, ...despesas].forEach(item => {
      mesesSet.add(`${item.ano}-${item.mes}`);
    });

    const meses = Array.from(mesesSet).map(mesAno => {
      const [ano, mes] = mesAno.split('-').map(Number);
      return {
        mes,
        ano,
        label: `${this.getNomeMes(mes)}/${ano}`
      };
    });

    return meses.sort((a, b) => b.ano - a.ano || b.mes - a.mes);
  }

  private static getNomeMes(mes: number): string {
    const nomes = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return nomes[mes - 1];
  }

  static limparTodosDados(): void {
    localStorage.removeItem(STORAGE_KEYS.VENDAS);
    localStorage.removeItem(STORAGE_KEYS.DESPESAS);
    localStorage.removeItem(STORAGE_KEYS.USUARIO);
  }
}