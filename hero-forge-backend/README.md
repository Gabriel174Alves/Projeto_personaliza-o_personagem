# Hero Forge Studio - Backend 🔧

Backend da aplicação Hero Forge Studio construído com Flask e MySQL.

## 📋 Pré-requisitos

- Python 3.8+
- MySQL 5.7+
- pip (gerenciador de pacotes Python)

## 🚀 Instalação e Configuração

### 1. Clone o repositório (se ainda não fez)

```bash
git clone <YOUR_GIT_URL>
cd hero-forge-studio/hero-forge-backend
```

### 2. Crie um ambiente virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais
# MYSQL_HOST=localhost
# MYSQL_USER=seu_usuario
# MYSQL_PASSWORD=sua_senha
```

### 5. Configure o banco de dados MySQL

```bash
# Acesse o MySQL
mysql -u root -p

# Execute este comando para criar o banco
CREATE DATABASE IF NOT EXISTS hero_forge;
EXIT;
```

### 6. Inicialize o banco de dados

```bash
python init_db.py
```

Isso criará as tabelas necessárias:
- `usuario` - Dados dos usuários
- `personagem` - Dados dos personagens

### 7. Inicie o servidor

```bash
python app.py
```

O servidor estará disponível em: **http://localhost:5000**

## 📁 Estrutura dos arquivos

```
hero-forge-backend/
├── app.py              # Aplicação principal Flask com todas as rotas
├── models.py           # Modelos de banco de dados (Usuario, Personagem)
├── database.py         # Configuração e conexão com MySQL
├── config.py           # Configurações da aplicação
├── init_db.py          # Script para inicializar o banco de dados
├── requirements.txt    # Dependências Python
├── .env.example        # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos a ignorar no Git
├── templates/          # Templates HTML
│   ├── login.html      # Página de login
│   └── cadastro.html   # Página de cadastro
└── __pycache__/        # Cache Python (ignorado no Git)
```

## 🔌 Endpoints da API

### Autenticação
- `POST /login` - Fazer login
- `POST /cadastro` - Criar nova conta
- `GET /logout` - Fazer logout

### Personagens
- `GET /personagens` - Listar personagens do usuário
- `POST /criar-personagem` - Criar novo personagem
- `GET /personagem/<id>` - Obter detalhes de um personagem
- `PUT /editar-personagem/<id>` - Editar personagem
- `DELETE /deletar-personagem/<id>` - Deletar personagem

## 🔐 Segurança

- CORS está configurado para aceitar apenas URLs específicas
- Sessões de usuário são protegidas
- Senhas devem ser hashadas (implemente em produção!)
- Altere `SECRET_KEY` antes de colocar em produção

## 📦 Dependências

```
Flask==3.0.0              # Framework web
mysql-connector-python==8.2.0  # Driver MySQL
Werkzeug==3.0.1           # Utilitários para WSGI
Flask-CORS==4.0.0         # Suporte a CORS
```

## 🧪 Testes

Para testar os endpoints, você pode usar:

- **Postman** - Importar requisições da API
- **cURL** - Fazer requisições via terminal
- **Thunder Client** - Extensão VSCode

Exemplo com cURL:

```bash
# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","senha":"senha123"}'
```

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"

Certifique-se que o ambiente virtual está ativado:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### "Cannot connect to MySQL"

1. Verifique se MySQL está rodando
2. Confirme credenciais em `.env`
3. Verifique se o banco foi criado:
   ```sql
   SHOW DATABASES;
   ```

### "Port 5000 already in use"

Altere a porta em `app.py`:
```python
app.run(debug=True, port=5001)
```

## 🚀 Deploy em Produção

### Com Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Checklist antes do deploy:

- [ ] Alterar `SECRET_KEY` para valor seguro
- [ ] Definir `FLASK_ENV=production`
- [ ] Desabilitar `DEBUG=False`
- [ ] Usar banco de dados em produção
- [ ] Implementar hashing de senhas (bcrypt)
- [ ] Configurar HTTPS/SSL
- [ ] Implementar rate limiting

## 📝 Variáveis de Ambiente

Veja `.env.example` para todas as variáveis disponíveis.

## 🔗 Links Úteis

- [Documentação Flask](https://flask.palletsprojects.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)

---

**Última atualização:** Fevereiro de 2026
