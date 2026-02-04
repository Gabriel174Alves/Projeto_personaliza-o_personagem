# Hero Forge Studio - Frontend 🗡️

Frontend da aplicação Hero Forge Studio construído com React, TypeScript e Vite.

## 📋 Pré-requisitos

- Node.js 16+ ou Bun
- npm ou yarn (gerenciador de pacotes)

## 🚀 Como executar

### 1. Clone o repositório (se ainda não fez)

```bash
git clone <YOUR_GIT_URL>
cd hero-forge-studio/hero-forge-studio
```

### 2. Instale as dependências

```bash
# Com npm
npm install

# Ou com bun (mais rápido)
bun install

# Ou com yarn
yarn install
```

### 3. Inicie o servidor de desenvolvimento

```bash
# Com npm
npm run dev

# Com bun
bun run dev

# Com yarn
yarn dev
```

O frontend estará disponível em: **http://localhost:5173**

## 📁 Estrutura do projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── NavLink.tsx      # Componente de navegação
│   └── ui/              # Componentes Shadcn/UI
├── pages/               # Páginas da aplicação
│   ├── Index.tsx        # Página inicial
│   └── NotFound.tsx     # Página 404
├── hooks/               # Hooks customizados
│   ├── use-mobile.tsx   # Hook para detecção de mobile
│   └── use-toast.ts     # Hook para notificações
├── lib/                 # Utilitários
│   └── utils.ts         # Funções auxiliares
├── App.tsx              # Componente raiz
├── main.tsx             # Ponto de entrada
└── index.css            # Estilos globais
```

## 🔧 Scripts disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build em modo desenvolvimento
npm run preview      # Visualiza build de produção
npm run lint         # Verifica erros de linting (ESLint)
npm run test         # Executa testes (Vitest)
npm run test:watch   # Testes em modo observação
```

## 🛠️ Tecnologias

### Framework & Build
- **Vite** - Build tool e servidor de desenvolvimento
- **React 18** - Biblioteca de UI
- **TypeScript** - Type safety

### UI & Styling
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI de alta qualidade
- **Radix UI** - Componentes primitivos acessíveis
- **Framer Motion** - Animações suaves

### State Management & Data
- **React Query** - Gerenciamento de cache de dados
- **React Hook Form** - Gerenciamento eficiente de formulários

### Testing
- **Vitest** - Framework de testes unitários
- **ESLint** - Linter de código

## 🎨 Componentes Disponíveis

A aplicação vem com diversos componentes Shadcn/ui:
- Accordion, Alert, Avatar, Badge, Button
- Card, Checkbox, Dialog, Dropdown Menu
- Input, Label, Navigation Menu, Pagination
- Select, Sheet, Sidebar, Tabs, Textarea
- Toast, Toggle, Tooltip, e muito mais!

## 📝 Configuração do Vite

O projeto usa Vite para compilação rápida. Veja `vite.config.ts` para configurações.

## 🔗 Conexão com Backend

Por padrão, a aplicação tenta conectar ao backend em `http://localhost:5000`.

Para alterar a URL do backend, modifique a configuração em:
- `src/lib/utils.ts` ou
- Variável de ambiente `VITE_API_URL`

## 🌐 Build para Produção

```bash
npm run build
```

Isso criará uma pasta `dist/` com os arquivos otimizados prontos para deploy.

Para visualizar o build:

```bash
npm run preview
```

## 🧪 Testes

Execute os testes com:

```bash
npm run test
```

Para modo observação (rerun automático):

```bash
npm run test:watch
```

## 🐛 Troubleshooting

### "Port 5173 already in use"

```bash
npm run dev -- --port 3000
```

### "Module not found"

Reinstale as dependências:

```bash
rm -rf node_modules package-lock.json
npm install
```

### "TypeScript errors"

Verifique o arquivo `tsconfig.json` e certifique-se que está importando tipos corretamente.

## 📦 Dependências principais

Veja `package.json` para a lista completa de dependências.

## 🚀 Deploy

### Vercel (recomendado)

1. Push para GitHub
2. Conecte seu repositório no [Vercel](https://vercel.com)
3. Vercel fará o build e deploy automaticamente

### Netlify

```bash
npm run build
# Faça upload da pasta dist/ no Netlify
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:5000
```

## 📝 Formatação e Linting

```bash
npm run lint
```

## 🔗 Links Úteis

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Última atualização:** Fevereiro de 2026
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
