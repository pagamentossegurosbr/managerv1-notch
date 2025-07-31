'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Despesa, MesAno } from '@/types';
import { Storage } from '@/lib/storage';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface ExpenseManagerProps {
  despesas: Despesa[];
  mesAno: MesAno;
  onUpdate: () => void;
}

export function ExpenseManager({ despesas, mesAno, onUpdate }: ExpenseManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    tipo: 'variavel',
    categoria: '',
    data: new Date().toISOString().split('T')[0],
    ehInvestimento: false
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaDespesa: Despesa = {
      id: editingId || Date.now().toString(),
      nome: formData.nome,
      valor: parseFloat(formData.valor),
      tipo: formData.tipo as 'fixa' | 'variavel' | 'pessoal',
      categoria: formData.categoria,
      data: formData.data,
      ano: mesAno.ano,
      mes: mesAno.mes,
      createdAt: new Date().toISOString(),
      ehInvestimento: formData.ehInvestimento
    };

    if (editingId) {
      Storage.atualizarDespesa(editingId, novaDespesa);
      setEditingId(null);
    } else {
      Storage.adicionarDespesa(novaDespesa);
    }

    setFormData({
      nome: '',
      valor: '',
      tipo: 'variavel',
      categoria: '',
      data: new Date().toISOString().split('T')[0],
      ehInvestimento: false
    });
    setIsAdding(false);
    onUpdate();
  };

  const handleEdit = (despesa: Despesa) => {
    setEditingId(despesa.id);
    setFormData({
      nome: despesa.nome,
      valor: despesa.valor.toString(),
      tipo: despesa.tipo,
      categoria: despesa.categoria,
      data: despesa.data,
      ehInvestimento: despesa.ehInvestimento || false
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      Storage.removerDespesa(id);
      onUpdate();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      valor: '',
      tipo: 'variavel',
      categoria: '',
      data: new Date().toISOString().split('T')[0],
      ehInvestimento: false
    });
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Gerenciar Despesas</CardTitle>
            <CardDescription className="text-gray-400">
              Adicione e gerencie despesas para {mesAno.label}
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        {(isAdding || editingId) && (
          <form onSubmit={handleSubmit} className="bg-gray-800/50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="variavel">Variável</option>
                  <option value="fixa">Fixa</option>
                  <option value="pessoal">Pessoal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ehInvestimento"
                  checked={formData.ehInvestimento}
                  onChange={(e) => setFormData({ ...formData, ehInvestimento: e.target.checked })}
                  className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="ehInvestimento" className="text-sm text-gray-300">
                  É investimento direto no negócio
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={editingId ? cancelEdit : () => setIsAdding(false)}
                className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Despesas List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Despesas ({despesas.length})</h3>
          {despesas.length > 0 ? (
            <div className="space-y-2">
              {despesas.map((despesa) => (
                <div
                  key={despesa.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{despesa.nome}</span>
                      {despesa.ehInvestimento && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          Investimento
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {despesa.categoria} • {despesa.tipo} • {new Date(despesa.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400 font-medium">
                      {formatCurrency(despesa.valor)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(despesa)}
                      className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(despesa.id)}
                      className="bg-red-600/20 border-red-600 text-red-400 hover:bg-red-600/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhuma despesa registrada para este período.</p>
              <p className="text-sm">Clique em "Nova Despesa" para começar.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 