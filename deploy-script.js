const fs = require('fs');
const path = require('path');

// Configuração do deploy
const config = {
  sourceDir: './',
  outputDir: './out',
  filesToCopy: [
    'package.json',
    'README.md',
    '.gitignore',
    'next.config.js',
    'tailwind.config.ts',
    'tsconfig.json',
    'postcss.config.js',
    'components.json'
  ],
  dirsToCopy: [
    'app',
    'components',
    'hooks',
    'lib',
    'types',
    'public'
  ]
};

// Função para copiar arquivos
function copyFile(source, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(source, dest);
  console.log(`✅ Copiado: ${source} -> ${dest}`);
}

// Função para copiar diretórios
function copyDir(source, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, destPath);
    } else {
      copyFile(sourcePath, destPath);
    }
  }
}

// Função principal
function deploy() {
  console.log('🚀 Iniciando deploy da aplicação...');
  
  // Limpar diretório de saída
  if (fs.existsSync(config.outputDir)) {
    fs.rmSync(config.outputDir, { recursive: true, force: true });
  }
  
  // Criar diretório de saída
  fs.mkdirSync(config.outputDir, { recursive: true });
  
  // Copiar arquivos individuais
  for (const file of config.filesToCopy) {
    const sourcePath = path.join(config.sourceDir, file);
    const destPath = path.join(config.outputDir, file);
    
    if (fs.existsSync(sourcePath)) {
      copyFile(sourcePath, destPath);
    } else {
      console.log(`⚠️  Arquivo não encontrado: ${file}`);
    }
  }
  
  // Copiar diretórios
  for (const dir of config.dirsToCopy) {
    const sourcePath = path.join(config.sourceDir, dir);
    const destPath = path.join(config.outputDir, dir);
    
    if (fs.existsSync(sourcePath)) {
      copyDir(sourcePath, destPath);
    } else {
      console.log(`⚠️  Diretório não encontrado: ${dir}`);
    }
  }
  
  // Criar arquivo de instruções de deploy
  const deployInstructions = `# Instruções de Deploy

## Opções de Deploy Gratuito

### 1. Vercel (Recomendado)
1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe este repositório
5. Clique em "Deploy"

### 2. Netlify
1. Acesse https://netlify.com
2. Faça login com GitHub
3. Clique em "New site from Git"
4. Selecione este repositório
5. Configure o build command: \`npm run build\`
6. Configure o publish directory: \`out\`
7. Clique em "Deploy site"

### 3. GitHub Pages
1. Vá para Settings do repositório
2. Role até "Pages"
3. Selecione "Deploy from a branch"
4. Escolha a branch main
5. Configure o folder como \`/out\`
6. Clique em "Save"

## Estrutura do Projeto
- \`app/\` - Páginas da aplicação
- \`components/\` - Componentes React
- \`lib/\` - Utilitários e lógica
- \`types/\` - Definições TypeScript
- \`public/\` - Arquivos estáticos

## Tecnologias
- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- ShadCN UI
- Recharts

## Funcionalidades
- Dashboard financeiro
- Importação de CSV
- Gerenciamento de receitas e despesas
- Calendário financeiro
- Gráficos e KPIs
- Exportação de dados
`;

  fs.writeFileSync(path.join(config.outputDir, 'DEPLOY.md'), deployInstructions);
  
  console.log('\n🎉 Deploy concluído!');
  console.log(`📁 Arquivos prontos em: ${config.outputDir}`);
  console.log('📖 Instruções de deploy em: DEPLOY.md');
  console.log('\n💡 Próximos passos:');
  console.log('1. Faça commit dos arquivos');
  console.log('2. Push para o GitHub');
  console.log('3. Use Vercel, Netlify ou GitHub Pages para deploy');
}

// Executar deploy
deploy(); 