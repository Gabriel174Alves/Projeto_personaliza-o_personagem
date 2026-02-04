# ============================================
# MODELOS DE DADOS
# Hero Forge Studio
# ============================================

from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection
from datetime import datetime

class Usuario:
    """
    Modelo para gerenciar usuários
    """
    
    @staticmethod
    def criar_usuario(username, password):
        """
        Cria um novo usuário no banco de dados
        
        Args:
            username (str): Nome de usuário
            password (str): Senha em texto plano
        
        Returns:
            dict: {'success': bool, 'message': str, 'user_id': int}
        """
        # Validações
        if not username or len(username) < 3:
            return {
                'success': False,
                'message': 'Nome de usuário deve ter pelo menos 3 caracteres'
            }
        
        if not password or len(password) < 6:
            return {
                'success': False,
                'message': 'Senha deve ter pelo menos 6 caracteres'
            }
        
        # Verificar se usuário já existe
        db = get_db_connection()
        if not db:
            return {
                'success': False,
                'message': 'Erro ao conectar ao banco de dados'
            }
        
        try:
            # Verificar se username já existe
            query_check = "SELECT id FROM usuarios WHERE username = %s"
            existing_user = db.execute_query(query_check, (username,), fetch_one=True)
            
            if existing_user:
                return {
                    'success': False,
                    'message': 'Nome de usuário já está em uso'
                }
            
            # Criar hash da senha
            password_hash = generate_password_hash(password)
            
            # Inserir novo usuário
            query_insert = """
                INSERT INTO usuarios (username, password_hash) 
                VALUES (%s, %s)
            """
            user_id = db.execute_query(query_insert, (username, password_hash), commit=True)
            
            if user_id:
                return {
                    'success': True,
                    'message': 'Usuário criado com sucesso!',
                    'user_id': user_id
                }
            else:
                return {
                    'success': False,
                    'message': 'Erro ao criar usuário'
                }
                
        except Exception as e:
            print(f"❌ Erro ao criar usuário: {e}")
            return {
                'success': False,
                'message': 'Erro ao criar usuário'
            }
        finally:
            db.disconnect()
    
    @staticmethod
    def autenticar(username, password):
        """
        Autentica um usuário
        
        Args:
            username (str): Nome de usuário
            password (str): Senha em texto plano
        
        Returns:
            dict: {'success': bool, 'message': str, 'user_id': int, 'username': str}
        """
        db = get_db_connection()
        if not db:
            return {
                'success': False,
                'message': 'Erro ao conectar ao banco de dados'
            }
        
        try:
            # Buscar usuário
            query = "SELECT id, username, password_hash FROM usuarios WHERE username = %s"
            user = db.execute_query(query, (username,), fetch_one=True)
            
            if not user:
                return {
                    'success': False,
                    'message': 'Usuário ou senha incorretos'
                }
            
            # Verificar senha
            if check_password_hash(user['password_hash'], password):
                # Atualizar último acesso
                query_update = "UPDATE usuarios SET ultimo_acesso = %s WHERE id = %s"
                db.execute_query(query_update, (datetime.now(), user['id']), commit=True)
                
                return {
                    'success': True,
                    'message': 'Login realizado com sucesso!',
                    'user_id': user['id'],
                    'username': user['username']
                }
            else:
                return {
                    'success': False,
                    'message': 'Usuário ou senha incorretos'
                }
                
        except Exception as e:
            print(f"❌ Erro ao autenticar usuário: {e}")
            return {
                'success': False,
                'message': 'Erro ao autenticar usuário'
            }
        finally:
            db.disconnect()


class Personagem:
    """
    Modelo para gerenciar personagens
    """
    
    @staticmethod
    def salvar_personagem(usuario_id, nome_personagem, classe, forca, inteligencia, cor_pele):
        """
        Salva ou atualiza um personagem
        
        Args:
            usuario_id (int): ID do usuário dono do personagem
            nome_personagem (str): Nome do personagem
            classe (str): Classe do personagem (Guerreiro, Arqueiro, Mago)
            forca (int): Atributo força
            inteligencia (int): Atributo inteligência
            cor_pele (str): Cor da pele em hexadecimal
        
        Returns:
            dict: {'success': bool, 'message': str, 'personagem_id': int}
        """
        # Validações
        if not nome_personagem or len(nome_personagem) < 2:
            return {
                'success': False,
                'message': 'Nome do personagem deve ter pelo menos 2 caracteres'
            }
        
        if classe not in ['Guerreiro', 'Arqueiro', 'Mago']:
            return {
                'success': False,
                'message': 'Classe inválida'
            }
        
        db = get_db_connection()
        if not db:
            return {
                'success': False,
                'message': 'Erro ao conectar ao banco de dados'
            }
        
        try:
            # Verificar se usuário já tem um personagem
            query_check = "SELECT id FROM personagens WHERE usuario_id = %s"
            existing = db.execute_query(query_check, (usuario_id,), fetch_one=True)
            
            if existing:
                # Atualizar personagem existente
                query_update = """
                    UPDATE personagens 
                    SET nome_personagem = %s, classe = %s, forca = %s, 
                        inteligencia = %s, cor_pele = %s
                    WHERE usuario_id = %s
                """
                result = db.execute_query(
                    query_update, 
                    (nome_personagem, classe, forca, inteligencia, cor_pele, usuario_id),
                    commit=True
                )
                
                if result:
                    return {
                        'success': True,
                        'message': 'Personagem atualizado com sucesso!',
                        'personagem_id': existing['id']
                    }
            else:
                # Criar novo personagem
                query_insert = """
                    INSERT INTO personagens 
                    (usuario_id, nome_personagem, classe, forca, inteligencia, cor_pele)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                personagem_id = db.execute_query(
                    query_insert,
                    (usuario_id, nome_personagem, classe, forca, inteligencia, cor_pele),
                    commit=True
                )
                
                if personagem_id:
                    return {
                        'success': True,
                        'message': 'Personagem criado com sucesso!',
                        'personagem_id': personagem_id
                    }
            
            return {
                'success': False,
                'message': 'Erro ao salvar personagem'
            }
            
        except Exception as e:
            print(f"❌ Erro ao salvar personagem: {e}")
            return {
                'success': False,
                'message': 'Erro ao salvar personagem'
            }
        finally:
            db.disconnect()
    
    @staticmethod
    def buscar_personagem(usuario_id):
        """
        Busca o personagem de um usuário
        
        Args:
            usuario_id (int): ID do usuário
        
        Returns:
            dict: Dados do personagem ou None
        """
        db = get_db_connection()
        if not db:
            return None
        
        try:
            query = """
                SELECT id, nome_personagem, classe, forca, inteligencia, cor_pele,
                       data_criacao, data_atualizacao
                FROM personagens 
                WHERE usuario_id = %s
            """
            personagem = db.execute_query(query, (usuario_id,), fetch_one=True)
            return personagem
            
        except Exception as e:
            print(f"❌ Erro ao buscar personagem: {e}")
            return None
        finally:
            db.disconnect()
