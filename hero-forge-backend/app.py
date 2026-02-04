# ============================================
# APLICAÇÃO PRINCIPAL - FLASK
# Hero Forge Studio
# ============================================

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from functools import wraps
from models import Usuario, Personagem

# Inicializar aplicação Flask
app = Flask(__name__)

# Habilitar CORS
CORS(app, origins=['http://localhost:8081', 'http://localhost:8080', 'http://localhost:5173'], supports_credentials=True)

# Configurações
app.config['SECRET_KEY'] = 'hero-forge-secret-key-2026-change-this-in-production'

# ============================================
# DECORADOR PARA PROTEÇÃO DE ROTAS
# ============================================
def login_required(f):
    """
    Decorador para proteger rotas que exigem autenticação
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


# ============================================
# ROTAS DE AUTENTICAÇÃO
# ============================================

@app.route('/')
def index():
    """
    Rota principal - redireciona para login ou personagem
    """
    if 'user_id' in session:
        return redirect(url_for('personalizacao'))
    return redirect(url_for('login'))


@app.route('/login', methods=['GET'])
def login():
    """
    Exibe página de login
    """
    if 'user_id' in session:
        return redirect(url_for('personalizacao'))
    return render_template('login.html')


@app.route('/cadastro', methods=['GET'])
def cadastro():
    """
    Exibe página de cadastro
    """
    if 'user_id' in session:
        return redirect(url_for('personalizacao'))
    return render_template('cadastro.html')


@app.route('/personalizacao')
@login_required
def personalizacao():
    """
    Redireciona para a página de personalização do personagem (front-end React)
    """
    # O front-end está rodando em localhost:8080
    return redirect('http://localhost:8080')


# ============================================
# API ENDPOINTS
# ============================================

@app.route('/api/cadastro', methods=['POST'])
def api_cadastro():
    """
    API para cadastrar novo usuário
    """
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Criar usuário
        result = Usuario.criar_usuario(username, password)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Erro no cadastro: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro ao processar cadastro'
        }), 500


@app.route('/api/login', methods=['POST'])
def api_login():
    """
    API para autenticar usuário
    """
    try:
        print("🔐 Tentativa de login recebida")
        data = request.get_json()
        print(f"📝 Dados recebidos: {data}")
        username = data.get('username', '').strip()
        password = data.get('password', '')
        print(f"👤 Usuário: {username}")
        
        # Autenticar
        result = Usuario.autenticar(username, password)
        print(f"🔍 Resultado da autenticação: {result}")
        
        if result['success']:
            # Criar sessão
            session['user_id'] = result['user_id']
            session['username'] = result['username']
            session.permanent = True
            print(f"✅ Sessão criada: user_id={session.get('user_id')}, username={session.get('username')}")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Erro no login: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'Erro ao processar login'
        }), 500


@app.route('/api/logout', methods=['POST'])
def api_logout():
    """
    API para logout
    """
    try:
        # Limpar sessão
        session.clear()
        
        return jsonify({
            'success': True,
            'message': 'Logout realizado com sucesso!'
        })
        
    except Exception as e:
        print(f"❌ Erro no logout: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro ao processar logout'
        }), 500


@app.route('/api/salvar-personagem', methods=['POST'])
@login_required
def api_salvar_personagem():
    """
    API para salvar personagem
    """
    try:
        data = request.get_json()
        
        usuario_id = session['user_id']
        nome_personagem = data.get('nome_personagem', '').strip()
        classe = data.get('classe', '')
        forca = int(data.get('forca', 0))
        inteligencia = int(data.get('inteligencia', 0))
        cor_pele = data.get('cor_pele', '#FFFFFF')
        
        # Salvar personagem
        result = Personagem.salvar_personagem(
            usuario_id, nome_personagem, classe, forca, inteligencia, cor_pele
        )
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Erro ao salvar personagem: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro ao salvar personagem'
        }), 500


@app.route('/api/buscar-personagem', methods=['GET'])
@login_required
def api_buscar_personagem():
    """
    API para buscar personagem do usuário logado
    """
    try:
        usuario_id = session['user_id']
        personagem = Personagem.buscar_personagem(usuario_id)
        
        if personagem:
            return jsonify({
                'success': True,
                'personagem': personagem
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Personagem não encontrado'
            })
        
    except Exception as e:
        print(f"❌ Erro ao buscar personagem: {e}")
        return jsonify({
            'success': False,
            'message': 'Erro ao buscar personagem'
        }), 500


@app.route('/api/check-auth', methods=['GET'])
def api_check_auth():
    """
    API para verificar se o usuário está autenticado
    """
    print(f"🔍 Verificando autenticação: user_id={session.get('user_id')}, authenticated={bool(session.get('user_id'))}")
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user_id': session['user_id'],
            'username': session['username']
        })
    else:
        return jsonify({
            'authenticated': False
        })


@app.route('/api/usuario-info', methods=['GET'])
@login_required
def api_usuario_info():
    """
    API para obter informações do usuário logado
    """
    return jsonify({
        'success': True,
        'user_id': session['user_id'],
        'username': session['username']
    })


# ============================================
# EXECUTAR APLICAÇÃO
# ============================================

if __name__ == '__main__':
    print("=" * 50)
    print("🎮 Hero Forge Studio - Servidor Iniciado")
    print("=" * 50)
    print("📍 Acesse: http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
