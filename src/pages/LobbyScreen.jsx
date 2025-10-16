// src/pages/LobbyScreen.jsx - CORRIGIDO PARA MOSTRAR AS SALAS

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';

// Componente auxiliar para os botões de seleção
const ToggleButton = ({ item, isExcluded, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(item)}
    className={`px-3 py-1 rounded-full font-bold text-sm transition-colors ${
      isExcluded
        ? 'bg-red-800 text-gray-400 line-through'
        : 'bg-blue-600 text-white hover:bg-blue-500'
    }`}
  >
    {item}
  </button>
);


function LobbyScreen() {
  const navigate = useNavigate();
  const [salas, setSalas] = useState([]);
  const [nomeSala, setNomeSala] = useState('');
  const [loading, setLoading] = useState(true);

  // --- NOVOS ESTADOS PARA A LÓGICA DE EXCLUSÃO ---
  const [allLetras, setAllLetras] = useState([]);
  const [allTemas, setAllTemas] = useState([]);
  const [letrasExcluidas, setLetrasExcluidas] = useState([]);
  const [temasExcluidos, setTemasExcluidos] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Busca as salas, as letras e os temas em paralelo
        const [salasRes, letrasRes, temasRes] = await Promise.all([
          apiClient.get('/game/rooms'),
          apiClient.get('/game/config/letras'),
          apiClient.get('/game/config/temas')
        ]);
        
        setSalas(salasRes.data); //
        setAllLetras(letrasRes.data); //
        setAllTemas(temasRes.data); //

      } catch (error) {
        console.error('Erro ao buscar dados do lobby:', error);
        alert('Não foi possível carregar os dados do lobby. Verifique a sua conexão e recarregue a página.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- FUNÇÕES PARA GERIR AS EXCLUSÕES (sem alterações) ---
  const handleToggleLetra = (letra) => {
    setLetrasExcluidas(prev =>
      prev.includes(letra)
        ? prev.filter(l => l !== letra)
        : [...prev, letra]
    );
  };

  const handleToggleTema = (tema) => {
    if (temasExcluidos.length >= allTemas.length - 1 && !temasExcluidos.includes(tema)) {
      alert("É preciso pelo menos 1 tema para jogar!");
      return;
    }
    setTemasExcluidos(prev =>
      prev.includes(tema)
        ? prev.filter(t => t !== tema)
        : [...prev, tema]
    );
  };

  // --- FUNÇÕES DE SALA (sem alterações) ---
  const handleCreateSala = async (e) => {
    e.preventDefault();
    if (!nomeSala) {
      alert("Por favor, preencha o nome da sala.");
      return;
    }
    setLoading(true);
    try {
        const response = await apiClient.post('/game/rooms', {
            nome_sala: nomeSala,
            letras_excluidas: letrasExcluidas,
            temas_excluidos: temasExcluidos
        }); //
        const { sala_id } = response.data;
        navigate(`/waiting-room/${sala_id}`);
    } catch (error) {
        alert(`Erro ao criar sala: ${error.response?.data?.error || error.message}`);
        setLoading(false);
    }
  };

  const handleJoinSala = async (salaId) => {
    setLoading(true);
    try {
        await apiClient.post(`/game/rooms/${salaId}/join`); //
        navigate(`/waiting-room/${salaId}`); //
    } catch (error) {
        alert(`Erro ao entrar na sala: ${error.response?.data?.error || error.message}`);
        setLoading(false);
    }
  };
  
  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Lobby de Partidas</h1>

      {/* Formulário de Criação de Sala (sem alterações) */}
      <form onSubmit={handleCreateSala} className="mb-8 p-6 bg-gray-800 rounded-lg space-y-6">
        <input
          type="text"
          placeholder="Nome da nova sala"
          value={nomeSala}
          onChange={(e) => setNomeSala(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Excluir Temas:</h3>
          <div className="p-3 bg-gray-900 rounded-md flex flex-wrap gap-2">
            {allTemas.map(tema => (
              <ToggleButton key={tema} item={tema} isExcluded={temasExcluidos.includes(tema)} onToggle={handleToggleTema} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Excluir Letras:</h3>
          <div className="p-3 bg-gray-900 rounded-md flex flex-wrap gap-2">
            {allLetras.map(letra => (
              <ToggleButton key={letra} item={letra} isExcluded={letrasExcluidas.includes(letra)} onToggle={handleToggleLetra} />
            ))}
          </div>
        </div>

        <button type="submit" className="w-full px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold text-lg" disabled={loading}>
          Criar Sala
        </button>
      </form>

      {/* ===== INÍCIO DA SEÇÃO ADICIONADA ===== */}
      {/* Lista de Salas Disponíveis */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Salas Disponíveis</h2>
        
        {/* Estado de Carregamento */}
        {loading && <p className="text-gray-400">A carregar salas...</p>}
        
        {/* Estado sem Salas */}
        {!loading && salas.length === 0 && (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Nenhuma sala disponível no momento.</p>
            <p className="text-gray-500 text-sm mt-2">Crie uma nova sala para começar a jogar!</p>
          </div>
        )}

        {/* Mapeamento e Exibição das Salas */}
        {salas.map((sala) => (
          <div key={sala.sala_id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div>
              <h3 className="text-xl font-semibold">{sala.nome_sala}</h3>
              {/* O backend já nos dá o nome do criador através do join */}
              <p className="text-sm text-gray-400">Criada por: {sala.jogador.nome_de_usuario}</p>
            </div>
            <button
              onClick={() => handleJoinSala(sala.sala_id)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 font-bold disabled:bg-gray-500"
            >
              Entrar
            </button>
          </div>
        ))}
      </div>
       {/* ===== FIM DA SEÇÃO ADICIONADA ===== */}
    </div>
  );
}

export default LobbyScreen;