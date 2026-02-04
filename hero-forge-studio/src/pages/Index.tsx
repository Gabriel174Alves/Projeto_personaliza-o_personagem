import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, Brain, Save, Sparkles, Sword, Target, Palette } from "lucide-react";
import { toast } from "sonner";

const MAX_POINTS = 15;

const classes = [
  { id: "Guerreiro", icon: Sword, color: "hsl(15, 90%, 55%)", glowColor: "rgba(234, 88, 12, 0.4)", description: "Força bruta", emoji: "⚔️" },
  { id: "Mago", icon: Sparkles, color: "hsl(270, 60%, 50%)", glowColor: "rgba(147, 51, 234, 0.4)", description: "Poder arcano", emoji: "✨" },
  { id: "Arqueiro", icon: Target, color: "hsl(45, 90%, 55%)", glowColor: "rgba(234, 179, 8, 0.4)", description: "Precisão mortal", emoji: "🏹" },
];

const presetSkins = ["#FFDFC4", "#F0C8A8", "#D2A56D", "#8D5524", "#6B4423", "#3D2314"];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [name, setName] = useState("Herói");
  const [charClass, setCharClass] = useState("Guerreiro");
  const [skin, setSkin] = useState("#D2B48C");
  const [strength, setStrength] = useState(5);
  const [intel, setIntel] = useState(5);

  // Para debug: verificar autenticação manualmente
  const checkAuthManually = () => {
    console.log('🔍 Verificação manual...');
    fetch('http://localhost:5000/api/check-auth')
      .then(res => res.json())
      .then(data => {
        console.log('Resultado:', data);
        alert(`Autenticado: ${data.authenticated}`);
      })
      .catch(err => {
        console.error('Erro:', err);
        alert('Erro na verificação');
      });
  };

  // Para debug: limpar autenticação
  const clearAuth = () => {
    localStorage.removeItem('authenticated');
    setIsAuthenticated(false);
    setIsLoading(false);
    setAuthChecked(false);
    console.log('🧹 Autenticação limpa');
  };

  useEffect(() => {
    console.log('🔄 useEffect executado, authChecked:', authChecked);

    if (authChecked) {
      console.log('🔄 Verificação já realizada, pulando...');
      return;
    }

    console.log('🔍 Iniciando verificação de autenticação...');
    setAuthChecked(true);

    // Timeout de segurança - se demorar mais de 3 segundos, assumir não autenticado
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout na verificação, assumindo não autenticado');
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 3000);

    // Primeiro verificar localStorage
    const localAuth = localStorage.getItem('authenticated');
    console.log('📱 localStorage authenticated:', localAuth);

    if (localAuth === 'true') {
      console.log('✅ Autenticado via localStorage');
      clearTimeout(timeout);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Se não tem no localStorage, verificar com o backend
    console.log('🌐 Verificando com backend...');
    fetch('http://localhost:5000/api/check-auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante para enviar cookies
    })
      .then(res => {
        console.log('📡 Resposta do backend:', res.status, res.statusText);
        clearTimeout(timeout);
        return res.json();
      })
      .then(data => {
        console.log('📋 Dados recebidos:', data);
        setIsAuthenticated(data.authenticated);
        setIsLoading(false);
        if (data.authenticated) {
          console.log('✅ Autenticado via backend, salvando no localStorage');
          localStorage.setItem('authenticated', 'true');
        } else {
          console.log('❌ Não autenticado, redirecionando para login...');
        }
      })
      .catch(error => {
        console.error('❌ Erro na verificação:', error);
        clearTimeout(timeout);
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, [authChecked]);

  // Buscar personagem salvo quando autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('🔍 Buscando personagem salvo...');
      fetch('http://localhost:5000/api/buscar-personagem', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.personagem) {
            console.log('✅ Personagem encontrado:', data.personagem);
            // Carregar dados do personagem
            setName(data.personagem.nome_personagem || "Herói");
            setCharClass(data.personagem.classe || "Guerreiro");
            setStrength(data.personagem.forca || 5);
            setIntel(data.personagem.inteligencia || 5);
            setSkin(data.personagem.cor_pele || "#D2B48C");
          } else {
            console.log('ℹ️ Nenhum personagem salvo encontrado, usando valores padrão');
          }
        })
        .catch(error => {
          console.error('❌ Erro ao buscar personagem:', error);
        });
    }
  }, [isAuthenticated, isLoading]);

  // Se está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>

          {/* Botões de debug */}
          <div className="mt-4 space-x-2">
            <button
              onClick={checkAuthManually}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Testar API
            </button>
            <button
              onClick={clearAuth}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Limpar Auth
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se não autenticado, redirecionar
  if (!isAuthenticated) {
    console.log('🔄 Redirecionando para login...');
    window.location.href = 'http://localhost:5000/login';
    return null;
  }

  const remainingPoints = MAX_POINTS - (strength + intel);
  const config = classes.find(c => c.id === charClass)!;

  const handleStrengthChange = (value: number) => {
    if (value + intel <= MAX_POINTS) setStrength(value);
  };

  const handleIntelChange = (value: number) => {
    if (value + strength <= MAX_POINTS) setIntel(value);
  };

  const handleSave = () => {
    console.log('💾 Salvando personagem...');

    // Dados do personagem
    const personagemData = {
      nome_personagem: name,
      classe: charClass,
      forca: strength,
      inteligencia: intel,
      cor_pele: skin
    };

    console.log('📋 Dados a serem salvos:', personagemData);

    fetch('http://localhost:5000/api/salvar-personagem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante para enviar cookies de sessão
      body: JSON.stringify(personagemData)
    })
      .then(res => {
        console.log('📡 Resposta do backend:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('📋 Resposta recebida:', data);
        if (data.success) {
          toast.success(<div className="flex items-center gap-2"><Sparkles className="text-primary" size={18} /><span><strong>{name}</strong> foi salvo com sucesso!</span></div>);
        } else {
          toast.error(<div className="flex items-center gap-2"><span>Erro ao salvar: {data.message}</span></div>);
        }
      })
      .catch(error => {
        console.error('❌ Erro ao salvar personagem:', error);
        toast.error(<div className="flex items-center gap-2"><span>Erro ao salvar personagem</span></div>);
      });
  };

  const handleLogout = () => {
    console.log('🚪 Fazendo logout...');

    // Limpar autenticação local primeiro
    localStorage.removeItem('authenticated');

    // Fazer logout no backend
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Importante para enviar cookies de sessão
    })
      .then(res => {
        console.log('📡 Logout response:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('📋 Logout result:', data);
        // Sempre redirecionar para login, independente do resultado
        window.location.href = 'http://localhost:5000/login';
      })
      .catch(error => {
        console.error('❌ Erro no logout:', error);
        // Mesmo com erro, redirecionar para login
        window.location.href = 'http://localhost:5000/login';
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-cinzel font-black tracking-tight mb-3">
          <span className="text-glow-gold bg-gradient-to-r from-primary via-gold-glow to-primary bg-clip-text text-transparent">INFINITY</span>
          <span className="block sm:inline text-glow-arcane text-arcane ml-0 sm:ml-4">ADVENTURE</span>
        </h1>
        <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs md:text-sm font-semibold">Personalize seu Herói</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="w-2 h-2 rotate-45 bg-primary" />
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl w-full">
        {/* Character Viewport */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="card-glass rounded-3xl p-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 animate-orb-rotate" style={{ background: config.glowColor, top: '-20%', left: '-20%' }} />
          </div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} key={charClass} className="absolute top-6 left-6 z-10">
            <div className="px-4 py-2 rounded-lg font-cinzel font-bold text-xs tracking-widest flex items-center gap-2" style={{ background: config.color, boxShadow: `0 0 20px ${config.glowColor}` }}>
              <span>{config.emoji}</span><span className="text-background">{config.id.toUpperCase()}</span>
            </div>
          </motion.div>

          <motion.div className="relative z-10 animate-float" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <svg width="280" height="350" viewBox="0 0 200 250" className="drop-shadow-2xl">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={skin} /><stop offset="100%" stopColor={`${skin}cc`} /></linearGradient>
              </defs>
              {/* Corpo base (por baixo da roupa) */}
              <rect x="75" y="70" width="50" height="90" fill="url(#bodyGradient)" rx="12" filter="url(#glow)" />

              {/* Roupas por classe */}
              {charClass === "Guerreiro" && (
                <g>
                  {/* Armadura de placas */}
                  <rect x="73" y="72" width="54" height="45" fill="#475569" rx="8" />
                  <rect x="78" y="75" width="44" height="38" fill="#64748b" rx="6" />
                  <rect x="85" y="80" width="30" height="8" fill="#94a3b8" rx="2" />
                  <rect x="85" y="92" width="30" height="8" fill="#94a3b8" rx="2" />
                  <path d="M 95 75 L 100 85 L 105 75" fill="#f97316" />
                  {/* Cinto */}
                  <rect x="73" y="115" width="54" height="8" fill="#78350f" />
                  <rect x="95" y="113" width="10" height="12" fill="#fbbf24" rx="2" />
                  {/* Calça de couro */}
                  <rect x="78" y="120" width="18" height="40" fill="#44403c" rx="4" />
                  <rect x="104" y="120" width="18" height="40" fill="#44403c" rx="4" />
                </g>
              )}
              {charClass === "Mago" && (
                <g>
                  {/* Túnica roxa */}
                  <path d="M 75 72 L 65 160 L 135 160 L 125 72 Z" fill="#4c1d95" />
                  <path d="M 78 72 L 70 155 L 130 155 L 122 72 Z" fill="#5b21b6" />
                  {/* Gola */}
                  <path d="M 80 70 Q 100 85 120 70" fill="none" stroke="#8b5cf6" strokeWidth="4" />
                  {/* Cinto mágico */}
                  <rect x="70" y="110" width="60" height="6" fill="#7c3aed" />
                  <circle cx="100" cy="113" r="5" fill="#c4b5fd" className="animate-pulse" />
                  {/* Detalhes de runas */}
                  <text x="85" y="100" fill="#a78bfa" fontSize="10" opacity="0.6">✦</text>
                  <text x="105" y="135" fill="#a78bfa" fontSize="10" opacity="0.6">✦</text>
                </g>
              )}
              {charClass === "Arqueiro" && (
                <g>
                  {/* Túnica de couro leve */}
                  <rect x="73" y="72" width="54" height="50" fill="#365314" rx="6" />
                  <rect x="78" y="75" width="44" height="44" fill="#3f6212" rx="4" />
                  {/* Detalhes de costura */}
                  <line x1="100" y1="75" x2="100" y2="118" stroke="#4d7c0f" strokeWidth="2" />
                  {/* Cinto com fivela */}
                  <rect x="73" y="118" width="54" height="6" fill="#78350f" />
                  <rect x="95" y="116" width="10" height="10" fill="#a16207" rx="1" />
                  {/* Calça verde */}
                  <rect x="78" y="122" width="18" height="38" fill="#1a2e05" rx="4" />
                  <rect x="104" y="122" width="18" height="38" fill="#1a2e05" rx="4" />
                  {/* Aljava nas costas */}
                  <rect x="115" y="60" width="12" height="50" fill="#78350f" rx="3" />
                  <line x1="118" y1="55" x2="118" y2="65" stroke="#78716c" strokeWidth="2" />
                  <line x1="121" y1="55" x2="121" y2="65" stroke="#78716c" strokeWidth="2" />
                  <line x1="124" y1="55" x2="124" y2="65" stroke="#78716c" strokeWidth="2" />
                </g>
              )}

              {/* Cabeça */}
              <circle cx="100" cy="50" r="30" fill="url(#bodyGradient)" filter="url(#glow)" />
              <ellipse cx="90" cy="45" rx="4" ry="5" fill="#1a1a2e" /><ellipse cx="110" cy="45" rx="4" ry="5" fill="#1a1a2e" />
              <circle cx="91" cy="44" r="1.5" fill="#fff" /><circle cx="111" cy="44" r="1.5" fill="#fff" />
              <path d="M 95 58 Q 100 62 105 58" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Braços (pele exposta nas mãos) */}
              <rect x="55" y="75" width="18" height="50" fill={charClass === "Guerreiro" ? "#64748b" : charClass === "Mago" ? "#5b21b6" : "#3f6212"} rx="8" />
              <rect x="127" y="75" width="18" height="50" fill={charClass === "Guerreiro" ? "#64748b" : charClass === "Mago" ? "#5b21b6" : "#3f6212"} rx="8" />
              {/* Mãos */}
              <ellipse cx="64" cy="128" rx="8" ry="6" fill={skin} />
              <ellipse cx="136" cy="128" rx="8" ry="6" fill={skin} />

              {/* Pernas (botas) */}
              <rect x="78" y="155" width="18" height="60" fill={charClass === "Guerreiro" ? "#374151" : charClass === "Mago" ? "#4c1d95" : "#1a2e05"} rx="8" />
              <rect x="104" y="155" width="18" height="60" fill={charClass === "Guerreiro" ? "#374151" : charClass === "Mago" ? "#4c1d95" : "#1a2e05"} rx="8" />

              {/* Equipamentos/Armas */}
              {charClass === "Guerreiro" && <g filter="url(#glow)"><rect x="40" y="60" width="8" height="80" fill="#94a3b8" rx="2" /><rect x="35" y="130" width="18" height="8" fill="#475569" rx="2" /><polygon points="44,55 44,40 48,30 48,55" fill="#cbd5e1" /><ellipse cx="160" cy="100" rx="20" ry="28" fill="#1e293b" stroke="#f97316" strokeWidth="3" /><path d="M 150 90 L 160 80 L 170 90 L 160 120 Z" fill="#f97316" opacity="0.8" /></g>}
              {charClass === "Mago" && <g filter="url(#glow)"><rect x="150" y="30" width="6" height="150" fill="#78350f" rx="3" /><circle cx="153" cy="25" r="15" fill="#8b5cf6" opacity="0.3" className="animate-pulse" /><circle cx="153" cy="25" r="10" fill="#a855f7" className="animate-pulse" /><circle cx="153" cy="25" r="5" fill="#e879f9" /><polygon points="100,-10 75,22 125,22" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="2" /><ellipse cx="100" cy="22" rx="28" ry="8" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="2" /></g>}
              {charClass === "Arqueiro" && <g filter="url(#glow)"><path d="M 145 50 Q 195 115 145 180" fill="none" stroke="#92400e" strokeWidth="8" strokeLinecap="round" /><path d="M 145 50 Q 195 115 145 180" fill="none" stroke="#b45309" strokeWidth="4" strokeLinecap="round" /><line x1="145" y1="50" x2="145" y2="180" stroke="#fbbf24" strokeWidth="2" /><line x1="100" y1="115" x2="155" y2="115" stroke="#78716c" strokeWidth="3" /><polygon points="155,115 145,110 145,120" fill="#f59e0b" /></g>}
            </svg>
          </motion.div>

          <motion.div className="mt-6 relative z-10 px-8 py-3 rounded-xl font-cinzel text-2xl font-bold tracking-wide border" style={{ background: 'linear-gradient(135deg, hsl(230 20% 15%), hsl(230 25% 10%))', borderColor: `${config.color}40`, boxShadow: `0 0 20px ${config.glowColor}`, color: config.color }}>
            {name || "Herói"}
          </motion.div>
        </motion.div>

        {/* Edit Panel */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="card-glass rounded-3xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Nome do Herói</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-game w-full text-xl font-cinzel font-bold" placeholder="Digite o nome..." />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] block">Escolha sua Classe</label>
            <div className="grid grid-cols-3 gap-3">
              {classes.map((cls) => (
                <motion.button key={cls.id} onClick={() => setCharClass(cls.id)} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden ${charClass === cls.id ? 'border-2' : 'border border-border hover:border-muted-foreground/30 bg-muted/30'}`}
                  style={charClass === cls.id ? { borderColor: cls.color, background: `linear-gradient(135deg, ${cls.color}20, transparent)`, boxShadow: `0 0 25px ${cls.glowColor}` } : {}}>
                  <cls.icon size={28} style={{ color: charClass === cls.id ? cls.color : 'hsl(var(--muted-foreground))' }} />
                  <span className="font-cinzel text-sm tracking-wide" style={{ color: charClass === cls.id ? cls.color : 'hsl(var(--foreground))' }}>{cls.id}</span>
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: charClass === cls.id ? `${cls.color}cc` : 'hsl(var(--muted-foreground))' }}>{cls.description}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Atributos</label>
              <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground uppercase tracking-wider">Pontos:</span><span className={`font-bold font-cinzel text-lg ${remainingPoints === 0 ? 'text-destructive' : 'text-primary'}`}>{remainingPoints}</span></div>
            </div>
            {[{ label: "Força", value: strength, onChange: handleStrengthChange, icon: Swords, color: "hsl(15, 90%, 55%)" }, { label: "Inteligência", value: intel, onChange: handleIntelChange, icon: Brain, color: "hsl(270, 60%, 50%)" }].map(attr => (
              <div key={attr.label} className="bg-muted/30 p-5 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${attr.color}30, ${attr.color}10)`, border: `1px solid ${attr.color}40` }}><attr.icon size={20} style={{ color: attr.color }} /></div>
                    <div><span className="font-semibold text-foreground">{attr.label}</span><motion.span key={attr.value} initial={{ scale: 1.2, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="ml-2 text-2xl font-bold font-cinzel" style={{ color: attr.color }}>{attr.value}</motion.span></div>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Max: 10</span>
                </div>
                <div className="relative mb-3"><div className="h-2 bg-muted rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${attr.color}, ${attr.color}aa)`, boxShadow: `0 0 10px ${attr.color}60` }} animate={{ width: `${(attr.value / 10) * 100}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} /></div></div>
                <input type="range" min="1" max="10" value={attr.value} onChange={(e) => attr.onChange(parseInt(e.target.value))} className="w-full" />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><Palette size={14} />Tom de Pele</label>
            <div className="flex items-center gap-4">
              <input type="color" value={skin} onChange={(e) => setSkin(e.target.value)} className="w-16 h-16 cursor-pointer rounded-xl border-2 border-border overflow-hidden bg-transparent" style={{ boxShadow: `0 0 20px ${skin}40` }} />
              <div className="flex gap-2 flex-wrap flex-1">{presetSkins.map((color) => (<motion.button key={color} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setSkin(color)} className={`w-10 h-10 rounded-lg transition-all duration-200 ${skin === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:ring-1 hover:ring-muted-foreground'}`} style={{ backgroundColor: color, boxShadow: skin === color ? `0 0 15px ${color}80` : 'none' }} />))}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="flex-1 bg-gradient-gold text-primary-foreground font-cinzel font-bold py-4 md:py-5 rounded-xl shadow-xl transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 glow-gold">
              <Save size={20} />Salvar Personagem
            </motion.button>

            <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className="px-6 bg-red-600 hover:bg-red-700 text-white font-cinzel font-bold py-4 md:py-5 rounded-xl shadow-xl transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              Sair
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 flex items-center gap-4 text-muted-foreground/40">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-muted-foreground/20" /><span className="text-xs uppercase tracking-[0.3em] font-cinzel">Forje seu Destino</span><div className="h-px w-16 bg-gradient-to-l from-transparent to-muted-foreground/20" />
      </motion.div>
    </div>
  );
};

export default Index;
