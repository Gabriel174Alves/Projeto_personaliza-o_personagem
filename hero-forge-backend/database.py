# ============================================
# CLASSE DE CONEXÃO COM BANCO DE DADOS
# Hero Forge Studio
# ============================================

import mysql.connector
from mysql.connector import Error
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

class Database:
    """
    Classe para gerenciar conexões com o banco de dados MySQL
    """
    
    def __init__(self):
        self.connection = None
    
    def connect(self):
        """
        Estabelece conexão com o banco de dados
        """
        try:
            self.connection = mysql.connector.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME
            )
            
            if self.connection.is_connected():
                return True
                
        except Error as e:
            print(f"❌ Erro ao conectar ao MySQL: {e}")
            return False
    
    def disconnect(self):
        """
        Fecha a conexão com o banco de dados
        """
        if self.connection and self.connection.is_connected():
            self.connection.close()
    
    def execute_query(self, query, params=None, fetch_one=False, fetch_all=False, commit=False):
        """
        Executa uma query no banco de dados
        
        Args:
            query (str): Query SQL a ser executada
            params (tuple): Parâmetros para a query
            fetch_one (bool): Se True, retorna apenas um resultado
            fetch_all (bool): Se True, retorna todos os resultados
            commit (bool): Se True, faz commit da transação
        
        Returns:
            Resultado da query ou None em caso de erro
        """
        try:
            cursor = self.connection.cursor(dictionary=True)
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            if commit:
                self.connection.commit()
                return cursor.lastrowid  # Retorna o ID do último registro inserido
            
            if fetch_one:
                return cursor.fetchone()
            
            if fetch_all:
                return cursor.fetchall()
            
            cursor.close()
            return True
            
        except Error as e:
            print(f"❌ Erro ao executar query: {e}")
            if self.connection:
                self.connection.rollback()
            return None
        finally:
            if 'cursor' in locals():
                cursor.close()

# Função auxiliar para obter conexão com o banco
def get_db_connection():
    """
    Retorna uma nova instância de conexão com o banco de dados
    """
    db = Database()
    if db.connect():
        return db
    return None
