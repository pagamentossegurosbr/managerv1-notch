# 🚀 Guia Completo de Deploy - NOTCH Gestão

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Projeto já está pronto para deploy
- ✅ Arquivos copiados para a pasta `out/`

## 🎯 Opções de Deploy Gratuito

### **1. Vercel (Recomendado - Mais Fácil)**

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Otimizado para Next.js
- ✅ Deploy automático
- ✅ Domínio personalizado gratuito
- ✅ SSL automático

**Passo a Passo:**

1. **Acesse o Vercel:**
   - Vá para https://vercel.com
   - Clique em "Sign Up" ou "Login"

2. **Conecte com GitHub:**
   - Escolha "Continue with GitHub"
   - Autorize o Vercel

3. **Importe o Projeto:**
   - Clique em "New Project"
   - Selecione seu repositório "NOTCH-GESTÃO V1"
   - Clique em "Import"

4. **Configure o Deploy:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (deixe padrão)
   - **Build Command:** `npm run build`
   - **Output Directory:** `out`
   - **Install Command:** `npm install`

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o processo (2-3 minutos)

6. **Acesse sua aplicação:**
   - URL será algo como: `https://notch-gestao-v1.vercel.app`

---

### **2. Netlify (Alternativa Excelente)**

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Excelente para sites estáticos
- ✅ Deploy automático
- ✅ Domínio personalizado gratuito

**Passo a Passo:**

1. **Acesse o Netlify:**
   - Vá para https://netlify.com
   - Clique em "Sign up" ou "Login"

2. **Conecte com GitHub:**
   - Escolha "Sign up with GitHub"
   - Autorize o Netlify

3. **Crie um novo site:**
   - Clique em "New site from Git"
   - Escolha "GitHub"

4. **Selecione o repositório:**
   - Escolha "NOTCH-GESTÃO V1"
   - Clique em "Deploy site"

5. **Configure o build:**
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - Clique em "Deploy site"

6. **Acesse sua aplicação:**
   - URL será algo como: `https://random-name.netlify.app`

---

### **3. GitHub Pages (Opção Básica)**

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Integração nativa com GitHub
- ✅ Domínio personalizado gratuito

**Passo a Passo:**

1. **Vá para Settings do repositório:**
   - No GitHub, vá para seu repositório
   - Clique em "Settings"

2. **Configure GitHub Pages:**
   - Role até "Pages" no menu lateral
   - Em "Source", escolha "Deploy from a branch"
   - **Branch:** `main`
   - **Folder:** `/out`
   - Clique em "Save"

3. **Aguarde o deploy:**
   - Pode levar alguns minutos
   - URL será: `https://seu-usuario.github.io/NOTCH-GESTÃO-V1`

---

## 🔧 Configurações Importantes

### **Para Vercel e Netlify:**

1. **Variáveis de Ambiente (se necessário):**
   - Geralmente não são necessárias para este projeto
   - Se precisar, adicione em Settings > Environment Variables

2. **Domínio Personalizado:**
   - Vercel: Settings > Domains > Add Domain
   - Netlify: Site settings > Domain management > Add custom domain

### **Para GitHub Pages:**

1. **Configurar branch:**
   - Certifique-se de que a branch `main` tem os arquivos
   - O diretório `out/` deve estar no repositório

## 📁 Estrutura do Projeto

```
NOTCH-GESTÃO V1/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
│   ├── ui/                # Componentes ShadCN
│   ├── charts/            # Gráficos
│   └── ...                # Outros componentes
├── lib/                   # Utilitários
├── types/                 # Definições TypeScript
├── hooks/                 # Hooks customizados
├── out/                   # Arquivos para deploy
└── package.json           # Dependências
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 13** - Framework React
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **ShadCN UI** - Componentes
- **Recharts** - Gráficos
- **Local Storage** - Persistência

## 🎯 Funcionalidades da Aplicação

- 📊 **Dashboard Financeiro** - KPIs em tempo real
- 📈 **Gráficos** - Receitas e despesas
- 📅 **Calendário Financeiro** - Visualização por data
- 💰 **Gerenciamento** - Receitas e despesas
- 📁 **Importação CSV** - Dados de vendas
- 📤 **Exportação** - Relatórios
- 🎯 **ROI** - Cálculo automático
- 📱 **Responsivo** - Funciona em mobile

## 🚨 Solução de Problemas

### **Erro de Build:**
- Verifique se todas as dependências estão instaladas
- Execute `npm install` antes do deploy
- Verifique se não há erros de TypeScript

### **Página em Branco:**
- Verifique se o diretório `out/` foi gerado corretamente
- Confirme se o build command está correto
- Verifique os logs de deploy

### **Erro 404:**
- Verifique se o output directory está configurado como `out`
- Confirme se os arquivos estão na pasta correta

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** de deploy na plataforma escolhida
2. **Teste localmente** com `npm run dev`
3. **Verifique** se todos os arquivos estão no repositório
4. **Consulte** a documentação da plataforma escolhida

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. **Teste todas as funcionalidades**
2. **Configure domínio personalizado** (opcional)
3. **Configure SSL** (automático na maioria das plataformas)
4. **Monitore o desempenho**
5. **Faça backups regulares**

---

**🎯 Recomendação:** Use **Vercel** para o deploy inicial, pois é a opção mais simples e otimizada para Next.js.

**⏱️ Tempo estimado:** 5-10 minutos para o deploy completo. 