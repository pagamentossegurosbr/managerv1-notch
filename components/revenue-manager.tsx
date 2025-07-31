'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, DollarSign, Calendar, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Venda } from '@/types';
import { Storage } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';

interface RevenueManagerProps {
  mesAno: { mes: number; ano: number };
  onVendasChange: () => void;
}

export function RevenueManager({ mesAno, onVendasChange }: RevenueManagerProps) {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    data: '',
    valorBruto: '',
    valorLiquido: '',
    quantidade: '1',
    descricao: '',
    categoria: 'venda'
  });

  useEffect(() => {
    carregarVendasDoMes();
  }, [mesAno]);

  const carregarVendasDoMes = () => {
    const todasVendas = Storage.carregarVendas();
    const vendasDoMes = todasVendas.filter(venda => {
      const dataVenda = new Date(venda.data);
      return dataVenda.getMonth() + 1 === mesAno.mes && dataVenda.getFullYear() === mesAno.ano;
    });
    setVendas(vendasDoMes);
  };

  const resetForm = () => {
    setFormData({
      data: '',
      valorBruto: '',
      valorLiquido: '',
      quantidade: '1',
      descricao: '',
      categoria: 'venda'
    });
    setEditingId(null);
  };

  const openDialog = (venda?: Venda) => {
    if (venda) {
      setFormData({
        data: venda.data,
        valorBruto: venda.valorBruto.toString(),
        valorLiquido: venda.valorLiquido.toString(),
        quantidade: '1',
        descricao: venda.descricao || '',
        categoria: venda.categoria || 'venda'
      });
      setEditingId(venda.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.data || !formData.valorBruto || !formData.valorLiquido) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const novaVenda: Venda = {
      id: editingId || Date.now().toString(),
      data: formData.data,
      valorBruto: parseFloat(formData.valorBruto),
      valorLiquido: parseFloat(formData.valorLiquido),
      quantidade: parseInt(formData.quantidade),
      descricao: formData.descricao,
      categoria: formData.categoria as 'venda' | 'servico' | 'produto' | 'outro'
    };

    Storage.salvarVenda(novaVenda);
    carregarVendasDoMes();
    onVendasChange();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      Storage.deletarVenda(id);
      carregarVendasDoMes();
      onVendasChange();
    }
  };

  const totalReceita = vendas.reduce((sum, venda) => sum + venda.valorBruto, 0);
  const totalReceitaLiquida = vendas.reduce((sum, venda) => sum + venda.valorLiquido, 0);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-background to-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Gerenciar Receitas
            </CardTitle>
            <CardDescription>
              Adicione e gerencie suas receitas manualmente
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Receita' : 'Nova Receita'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da receita. Clique em salvar quando terminar.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      min="1"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    placeholder="Ex: Venda de produto X"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="servico">Serviço</SelectItem>
                      <SelectItem value="produto">Produto</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorBruto">Valor Bruto *</Label>
                    <Input
                      id="valorBruto"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={formData.valorBruto}
                      onChange={(e) => setFormData({ ...formData, valorBruto: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorLiquido">Valor Líquido *</Label>
                    <Input
                      id="valorLiquido"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={formData.valorLiquido}
                      onChange={(e) => setFormData({ ...formData, valorLiquido: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingId ? 'Atualizar' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Total Receitas</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceita)}</p>
            <p className="text-xs text-green-600/70">{vendas.length} registros</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Receita Líquida</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalReceitaLiquida)}</p>
            <p className="text-xs text-blue-600/70">Após taxas</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Ticket Médio</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {vendas.length > 0 ? formatCurrency(totalReceita / vendas.length) : 'R$ 0,00'}
            </p>
            <p className="text-xs text-purple-600/70">Por receita</p>
          </div>
        </div>

        <Separator />

        {/* Lista de Receitas */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Receitas Registradas</h3>
          
          {vendas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma receita registrada para este mês</p>
              <p className="text-sm">Clique em "Nova Receita" para começar</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vendas.map((venda) => (
                <div
                  key={venda.id}
                  className="flex items-center justify-between p-4 bg-background border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {venda.descricao || `Receita ${venda.categoria}`}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {venda.categoria}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(venda.data).toLocaleDateString('pt-BR')}</span>
                        <span>Qtd: {venda.quantidade}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(venda.valorBruto)}</p>
                    <p className="text-xs text-muted-foreground">
                      Líquido: {formatCurrency(venda.valorLiquido)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(venda)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(venda.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 