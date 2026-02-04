# ============================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# Hero Forge Studio
# ============================================

# Configurações do MySQL (XAMPP)
DB_HOST = 'localhost'
DB_PORT = 3306
DB_USER = 'root'          # Usuário padrão do XAMPP
DB_PASSWORD = ''          # Senha padrão do XAMPP (vazia)
DB_NAME = 'hero_forge_db'

# Configurações da aplicação Flask
SECRET_KEY = 'sua-chave-secreta-super-segura-aqui-mude-isso'  # IMPORTANTE: Mude isso!
SESSION_TYPE = 'memory'  # Alterado de 'filesystem' para 'memory' para evitar erros de serialização
SESSION_PERMANENT = False
SESSION_USE_SIGNER = False  # Desabilitado para sessões em memória

# Configurações de segurança
PERMANENT_SESSION_LIFETIME = 3600  # 1 hora em segundos
