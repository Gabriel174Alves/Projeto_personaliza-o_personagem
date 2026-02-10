# Hero Forge Studio 🗡️⚔️

Um sistema completo de criação e gerenciamento de personagens para RPG/Jogos, com frontend em React/TypeScript e backend em Flask.

## 📋 Pré-requisitos

Para rodar este projeto, você vai precisar de:

- **Node.js** (versão 16+) e **npm** ou **bun** - [Instalar aqui](https://nodejs.org/)
- **Python** (versão 3.8+) - [Instalar aqui](https://www.python.org/)
- **MySQL** (versão 5.7+) - [Instalar aqui](https://dev.mysql.com/downloads/mysql/)

## 🚀 Como executar o projeto

### 1️⃣ Clone o repositório

```bash
git clone <YOUR_GIT_URL>
cd hero-forge-studio
```

### 2️⃣ Configure e inicie o Backend (Flask)

```bash
# Navegue para a pasta do backend
cd hero-forge-backend

# Crie um ambiente virtual (recomendado)
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No macOS/Linux:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure o banco de dados (veja a seção "Configuração do Banco de Dados" abaixo)
python init_db.py

# Inicie o servidor
python app.py
```

O backend estará rodando em: **http://localhost:5000**

### 3️⃣ Configure e inicie o Frontend (React)

Em outro terminal:

```bash
# Navegue para a pasta do frontend
cd hero-forge-studio

# Instale as dependências
npm install
# ou com bun:
bun install

# Inicie o servidor de desenvolvimento
npm run dev
# ou com bun:
bun run dev
```

O frontend estará rodando em: **http://localhost:5173**

## 🗄️ Configuração do Banco de Dados

### Passo 1: Criar o banco de dados MySQL

1. Abra o MySQL Workbench ou acesse o MySQL via terminal
2. Execute este comando para criar o banco:

```sql
CREATE DATABASE IF NOT EXISTS hero_forge;
USE hero_forge_db;
```

### Passo 2: Configurar credenciais

1. Navegue para `hero-forge-backend/`
2. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

3. Edite o arquivo `.env` e adicione suas credenciais MySQL:

```env
MYSQL_HOST=localhost
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=hero_forge
SECRET_KEY=your-secret-key-here
```

### Passo 3: Inicializar o banco

```bash
python init_db.py
```

Isso criará as tabelas necessárias automaticamente.

## 📁 Estrutura do Projeto

```
hero-forge-studio/
├── hero-forge-backend/          # Backend Flask
│   ├── app.py                   # Aplicação principal
│   ├── models.py                # Modelos de banco de dados
│   ├── database.py              # Configuração do banco
│   ├── config.py                # Configurações
│   ├── init_db.py               # Script de inicialização
│   ├── requirements.txt          # Dependências Python
│   ├── .env.example              # Exemplo de variáveis de ambiente
│   └── templates/               # Templates HTML (login, cadastro)
│
└── hero-forge-studio/           # Frontend React/Vite
    ├── src/
    │   ├── components/          # Componentes React
    │   ├── pages/               # Páginas da aplicação
    │   ├── hooks/               # Hooks customizados
    │   └── lib/                 # Utilitários
    ├── package.json             # Dependências Node.js
    ├── vite.config.ts           # Configuração Vite
    └── tsconfig.json            # Configuração TypeScript
```

## 🔧 Scripts disponíveis

### Frontend
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Visualiza build de produção
npm run lint         # Verifica erros de linting
npm run test         # Executa testes
npm run test:watch   # Testes em modo observação
```

### Backend
```bash
python app.py        # Inicia servidor Flask
python init_db.py    # Inicializa banco de dados
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `hero-forge-backend/` com as seguintes variáveis:

```env
# Banco de Dados
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha_aqui
MYSQL_DATABASE=hero_forge

# Flask
SECRET_KEY=your-super-secret-key-change-in-production
FLASK_ENV=development
```

⚠️ **IMPORTANTE:** Nunca commite o arquivo `.env` no Git! Use apenas `.env.example` como referência.

## 🌐 URLs da Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Login**: http://localhost:5173/login
- **Cadastro**: http://localhost:5173/cadastro

## 📦 Dependências Principais

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui (componentes)
- React Query
- Framer Motion

### Backend
- Flask 3.0.0
- Flask-CORS
- MySQL Connector Python
- Werkzeug

## 🐛 Troubleshooting

### "Port already in use" (Porta já está em uso)

Se receber erro de porta já em uso:

```bash
# Frontend usa porta 5173, para usar outra:
npm run dev -- --port 3000

# Backend usa porta 5000, modifique em app.py:
# app.run(port=5001)
```

### "Cannot connect to MySQL"

1. Verifique se MySQL está rodando
2. Verifique credenciais em `.env`
3. Verifique se o banco de dados foi criado

### "ModuleNotFoundError" no backend

Certifique-se que o ambiente virtual está ativado e dependências instaladas:

```bash
pip install -r requirements.txt
```

## 📝 Notas de Desenvolvimento

- O CORS está configurado para aceitar requisições de `localhost:5173`, `localhost:8080` e `localhost:8081`
- O `SECRET_KEY` do Flask deve ser alterado antes de colocar em produção
- Testes podem ser executados com `npm run test` no frontend

## 🚀 Deploy (Produção)

Para fazer deploy em produção:

1. Build do frontend:
```bash
npm run build
```

2. Configure variáveis de ambiente seguras em produção

3. Use um servidor WSGI como Gunicorn para o backend:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📄 Licença

[Adicione informações de licença aqui]

## 👥 Autor

Gabriel

---

**Última atualização:** Fevereiro de 2026
