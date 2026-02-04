# ============================================
# SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS
# Hero Forge Studio
# ============================================

from database import get_db_connection

def init_database():
    """
    Inicializa o banco de dados criando as tabelas necessárias
    """
    db = get_db_connection()
    if not db:
        print("❌ Erro ao conectar ao banco de dados")
        return False

    try:
        # Criar tabela usuarios
        create_usuarios = """
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            ultimo_acesso DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        db.execute_query(create_usuarios, commit=True)
        print("✅ Tabela 'usuarios' criada/verificada")

        # Criar tabela personagens
        create_personagens = """
        CREATE TABLE IF NOT EXISTS personagens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            nome_personagem VARCHAR(100) NOT NULL,
            classe VARCHAR(20) NOT NULL,
            forca INT DEFAULT 5,
            inteligencia INT DEFAULT 5,
            cor_pele VARCHAR(7) DEFAULT '#D2B48C',
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
        """
        db.execute_query(create_personagens, commit=True)
        print("✅ Tabela 'personagens' criada/verificada")

        print("🎉 Banco de dados inicializado com sucesso!")
        return True

    except Exception as e:
        print(f"❌ Erro ao inicializar banco de dados: {e}")
        return False
    finally:
        db.disconnect()

def criar_usuario_teste():
    """
    Criar um usuário de teste para facilitar os testes
    """
    from models import Usuario

    # Tentar criar usuário teste
    result = Usuario.criar_usuario("teste", "123456")
    if result['success']:
        print("✅ Usuário de teste criado: teste / 123456")
    else:
        print(f"❌ Erro ao criar usuário teste: {result['message']}")

if __name__ == "__main__":
    if init_database():
        criar_usuario_teste()