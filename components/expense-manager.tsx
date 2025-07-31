'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { Despesa } from '@/types';
import { Storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface ExpenseManagerProps {
  despesas: Despesa[];
  mesAno: { mes: number; ano: number };
  onUpdate: () => void;
}

const categoriasPadrao = {
  fixa: ['Aluguel', 'Internet', 'Energia', 'Água', 'Salário', 'Seguro', 'Mensalidade'],
  variavel: ['Tráfego', 'Domínio', 'Ferramenta', 'Marketing', 'Consultoria', 'Freelancer', 'Material'],
  pessoal: ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Viagem']
};

export function ExpenseManager({ despesas, mesAno, onUpdate }: ExpenseManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Despesa | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    tipo: 'variavel' as 'fixa' | 'variavel' | 'pessoal',
    categoria: '',
    data: '',
    recorrencia: 'mensal' as 'mensal' | 'anual',
    ehInvestimento: false
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      valor: '',
      tipo: 'variavel',
      categoria: '',
      data: new Date().toISOString().split('T')[0],
      recorrencia: 'mensal',
      ehInvestimento: false
    });
    setEditingExpense(null);
  };

  const openDialog = (despesa?: Despesa) => {
    if (despesa) {
      setEditingExpense(despesa);
      setFormData({
        nome: despesa.nome,
        valor: despesa.valor.toString(),
        tipo: despesa.tipo,
        categoria: despesa.categoria,
        data: despesa.data,
        recorrencia: despesa.recorrencia || 'mensal',
        ehInvestimento: despesa.ehInvestimento || false
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.valor || !formData.categoria) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      toast.error('Valor deve ser um número positivo');
      return;
    }

    const data = new Date(formData.data);
    const despesa: Despesa = {
      id: editingExpense?.id || uuidv4(),
      nome: formData.nome.trim(),
      valor: Math.round(valor * 100) / 100,
      tipo: formData.tipo,
      categoria: formData.categoria,
      data: formData.data,
      recorrencia: formData.tipo === 'fixa' ? formData.recorrencia : undefined,
      ano: data.getFullYear(),
      mes: data.getMonth() + 1,
      createdAt: editingExpense?.createdAt || new Date().toISOString(),
      ehInvestimento: formData.ehInvestimento
    };

    if (editingExpense) {
      Storage.atualizarDespesa(editingExpense.id, despesa);
      toast.success('Despesa atualizada com sucesso!');
    } else {
      Storage.adicionarDespesa(despesa);
      toast.success('Despesa adicionada com sucesso!');
    }

    onUpdate();
    closeDialog();
  };

  const handleDelete = (despesa: Despesa) => {
    if (window.confirm(`Tem certeza que deseja excluir "${despesa.nome}"?`)) {
      Storage.removerDespesa(despesa.id);
      toast.success('Despesa removida com sucesso!');
      onUpdate();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'fixa': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'variavel': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'pessoal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              Gerenciar Despesas
            </CardTitle>
            <CardDescription>
              Controle suas despesas fixas, variáveis e pessoais
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Aluguel do escritório"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor *</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.valor}
                      onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, tipo: value, categoria: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixa">Despesa Fixa</SelectItem>
                      <SelectItem value="variavel">Despesa Variável</SelectItem>
                      <SelectItem value="pessoal">Gasto Pessoal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasPadrao[formData.tipo].map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.tipo === 'fixa' && (
                  <div className="space-y-2">
                    <Label htmlFor="recorrencia">Recorrência</Label>
                    <Select 
                      value={formData.recorrencia} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, recorrencia: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(formData.tipo === 'variavel' || formData.tipo === 'fixa') && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ehInvestimento"
                      checked={formData.ehInvestimento}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, ehInvestimento: checked as boolean }))
                      }
                    />
                    <Label htmlFor="ehInvestimento" className="flex items-center gap-2 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      É um investimento direto no negócio?
                    </Label>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingExpense ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {despesas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma despesa registrada neste período.
              <br />
              Clique em "Nova Despesa" para começar.
            </div>
          ) : (
            <div className="space-y-3">
              {despesas.map((despesa) => (
                <div key={despesa.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{despesa.nome}</h4>
                      <Badge className={getTipoColor(despesa.tipo)}>
                        {despesa.tipo === 'fixa' ? 'Fixa' : despesa.tipo === 'variavel' ? 'Variável' : 'Pessoal'}
                      </Badge>
                      <Badge variant="outline">
                        {despesa.categoria}
                      </Badge>
                      {despesa.ehInvestimento && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Investimento
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatCurrency(despesa.valor)}</span>
                      <span>{new Date(despesa.data).toLocaleDateString('pt-BR')}</span>
                      {despesa.recorrencia && (
                        <span>• {despesa.recorrencia}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDialog(despesa)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(despesa)}
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