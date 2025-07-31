'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MesAno } from '@/types';
import { Storage } from '@/lib/storage';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface RevenueManagerProps {
  mesAno: MesAno;
  onVendasChange: () => void;
}

export function RevenueManager({ mesAno, onVendasChange }: RevenueManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    valorBruto: '',
    valorLiquido: '',
    origem: 'Orgânico'
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaVenda = {
      id: editingId || Date.now().toString(),
      data: formData.data,
      ano: mesAno.ano,
      mes: mesAno.mes,
      valorBruto: parseFloat(formData.valorBruto),
      valorLiquido: parseFloat(formData.valorLiquido),
      origem: formData.origem as 'Orgânico' | 'Pago',
      importada: false,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      Storage.salvarVenda(novaVenda);
      setEditingId(null);
    } else {
      Storage.salvarVenda(novaVenda);
    }

    setFormData({
      data: new Date().toISOString().split('T')[0],
      valorBruto: '',
      valorLiquido: '',
      origem: 'Orgânico'
    });
    setIsAdding(false);
    onVendasChange();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      valorBruto: '',
      valorLiquido: '',
      origem: 'Orgânico'
    });
  };

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Gerenciar Receitas</CardTitle>
            <CardDescription className="text-gray-400">
              Adicione receitas manualmente para {mesAno.label}
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Receita
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        {(isAdding || editingId) && (
          <form onSubmit={handleSubmit} className="bg-gray-800/50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Origem</label>
                <select
                  value={formData.origem}
                  onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Orgânico">Orgânico</option>
                  <option value="Pago">Pago</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Valor Bruto</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorBruto}
                  onChange={(e) => setFormData({ ...formData, valorBruto: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Valor Líquido</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valorLiquido}
                  onChange={(e) => setFormData({ ...formData, valorLiquido: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
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

        {/* Info */}
        <div className="bg-blue-600/20 border border-blue-600 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-400 mb-2">💡 Dica</h3>
          <p className="text-xs text-blue-300">
            Use este formulário para adicionar receitas manualmente. Para importar dados em lote, 
            use a aba "Importar" com arquivos CSV.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 