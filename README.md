# NOTCH Gestão - Dashboard Financeiro

Um dashboard financeiro completo para controle de receitas, despesas e análise de KPIs.

## 🚀 Funcionalidades

- 📊 Dashboard com KPIs em tempo real
- 📈 Gráficos de receitas e despesas
- 📅 Calendário financeiro interativo
- 💰 Gerenciamento de receitas e despesas
- 📁 Importação de dados via CSV
- 📤 Exportação de relatórios
- 🎯 Cálculo automático de ROI
- 📱 Interface responsiva

## 🛠️ Tecnologias

- **Next.js 13** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **ShadCN UI** - Componentes
- **Recharts** - Gráficos
- **Local Storage** - Persistência de dados

## 📦 Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Entre na pasta
cd NOTCH-GESTAO-V1

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

## 🚀 Deploy

O projeto está configurado para deploy estático e pode ser hospedado em:

- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**

## 📊 Estrutura do CSV

O sistema aceita arquivos CSV com a seguinte estrutura:

```csv
ano,mes,dia,quantidade,valor_cheio,valor_pago
2024,1,15,5,100.00,95.00
```

## 🎯 KPIs Calculados

- **Receita Bruta** - Soma total das vendas
- **Receita Líquida** - Valor após taxas
- **Lucro Líquido** - Receita Líquida - Despesas
- **ROI** - (Lucro Líquido / Investimentos) × 100
- **Ticket Médio** - Receita Bruta / Total de Vendas

## 📝 Licença

Este projeto é de uso pessoal e educacional. 