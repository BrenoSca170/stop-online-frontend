// src/pages/Gamescreen.jsx - CORRIGIDO O BUG DO LÍDER E ADICIONADO "ENCERRAR"

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
// ... (outros imports)
import CategoryRow from '../components/CategoryRow';
import CountdownTimer from '../components/CountdownTimer';
import TimeUpOverlay from '../components/TimeUpOverlay';

function ResultsDisplay({ results, categories, onNextRound, onEndGame, isCreator }) {
    const jogadores = Object.keys(results);

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-6">Resultados da Rodada</h1>
            <div className="overflow-x-auto bg-gray-800 rounded-lg p-1">
                {/* ... (o conteúdo da tabela de resultados não muda) ... */}
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="p-4">Jogador</th>
                            {categories.map(cat => <th key={cat} className="p-4">{cat}</th>)}
                            <th className="p-4 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jogadores.map(jogador => (
                            <tr key={jogador} className="border-b border-gray-700">
                                <td className="p-4 font-bold">{jogador}</td>
                                {categories.map(cat => (
                                    <td key={cat} className="p-4">
                                        <span className="block">{results[jogador].respostas[cat]?.resposta || '-'}</span>
                                        <span className="text-xs font-bold text-yellow-400">
                                            {results[jogador].respostas[cat]?.pontos} Pts
                                        </span>
                                    </td>
                                ))}
                                <td className="p-4 text-center font-bold text-lg text-green-400">
                                    {results[jogador].total_pontos}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-center mt-8">
                {isCreator ? (
                    <div className="flex justify-center gap-4">
                        {/* --- NOVOS BOTÕES --- */}
                        <button onClick={onNextRound} className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold">
                            Próxima Rodada
                        </button>
                        <button onClick={onEndGame} className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 font-bold">
                            Encerrar Partida
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-400">Aguardando o líder decidir...</p>
                )}
            </div>
        </div>
    );
}

function GameScreen() {
    const { salaId } = useParams();
    const navigate = useNavigate();

    const [gameState, setGameState] = useState({
        view: 'loading',
        // ... (outros estados)
        categories: [],
        currentLetter: '',
        results: null,
        roundDuration: 60,
        isCreator: false,
        rodadaId: null,
    });
    const [words, setWords] = useState({});
    const [isTimeUp, setIsTimeUp] = useState(false);

    const fetchGameState = async () => {
        // ... (esta função não precisa de alterações)
        try {
            const response = await apiClient.get(`/game/rooms/${salaId}/gamestate`);
            const data = response.data;
            
            if (data.status === 'jogando') {
                setGameState(prev => ({
                    ...prev,
                    categories: data.categorias,
                    currentLetter: data.letra,
                    roundDuration: data.duracao_rodada,
                    isCreator: data.is_creator,
                    rodadaId: data.rodada_id,
                    view: 'playing'
                }));
                setWords({});
                setIsTimeUp(false);
            } else if (data.status === 'finalizada') {
                setGameState(prev => ({...prev, view: 'waiting'}));
            }

        } catch (error) {
            console.error("Erro ao buscar estado do jogo:", error);
            alert("Não foi possível carregar o jogo. A redirecionar para o lobby.");
            navigate('/');
        }
    };

    useEffect(() => {
        fetchGameState();
    }, [salaId]);
    
    // ... (o useEffect de polling não precisa de alterações)
    useEffect(() => {
        let intervalId;

        const checkForUpdates = async () => {
            if (gameState.view === 'waiting') {
                try {
                    const response = await apiClient.get(`/game/rooms/${salaId}/results`);
                    if (response.data.status === 'finalizado') {
                        setGameState(prev => ({...prev, view: 'results', results: response.data.resultados}));
                    }
                } catch(error) {
                    console.error("Erro ao buscar resultados", error);
                }
            } 
            else if (gameState.view === 'results' && !gameState.isCreator) { // Polling só para não-líderes
                try {
                    // Verifica se a sala foi finalizada pelo líder
                    const roomStatusRes = await apiClient.get(`/game/rooms/${salaId}/details`);
                    if (roomStatusRes.data.status === 'finalizada') {
                        navigate(`/game/${salaId}/summary`);
                        return;
                    }

                    const response = await apiClient.get(`/game/rooms/${salaId}/gamestate`);
                    if (response.data.rodada_id !== gameState.rodadaId) {
                        fetchGameState();
                    }
                } catch (error) {
                    console.error("Erro ao verificar nova rodada:", error);
                }
            }
        };
        
        if (['waiting', 'results'].includes(gameState.view)) {
            intervalId = setInterval(checkForUpdates, 3000);
        }

        return () => clearInterval(intervalId);
    }, [gameState.view, gameState.rodadaId, salaId, navigate, gameState.isCreator]);

    // ... (handleWordChange e handleStop não mudam)
     const handleWordChange = (category, value) => {
        setWords((prevWords) => ({ ...prevWords, [category]: value }));
    };

    const handleStop = async () => {
        if (gameState.view !== 'playing' || isTimeUp) return;
        setIsTimeUp(true);
        try {
            await apiClient.post(`/game/rooms/${salaId}/submit`, words);
            setGameState(prev => ({...prev, view: 'waiting'}));
        } catch (error) {
            alert("Houve um problema ao enviar as suas respostas.");
            setIsTimeUp(false);
        }
    };
    
    // --- FUNÇÃO handleNextRound CORRIGIDA ---
    const handleNextRound = async () => {
        try {
            setGameState(prev => ({...prev, view: 'loading'}));
            await apiClient.post(`/game/rooms/${salaId}/next_round`);
            // Chama ativamente a função para buscar o novo estado, corrigindo o bug
            await fetchGameState(); 
        } catch (error) {
             alert(`Erro ao iniciar próxima rodada: ${error.response?.data?.error || "Ocorreu um erro."}`);
             setGameState(prev => ({...prev, view: 'results'}));
        }
    };

    // --- NOVA FUNÇÃO PARA ENCERRAR A PARTIDA ---
    const handleEndGame = async () => {
        try {
            await apiClient.post(`/game/rooms/${salaId}/end`);
            // Navega para a nova tela de resumo
            navigate(`/game/${salaId}/summary`);
        } catch (error) {
            alert(`Erro ao encerrar a partida: ${error.response?.data?.error || "Ocorreu um erro."}`);
        }
    };

    // ... (o resto do return não muda, apenas passamos a nova função para o ResultsDisplay)
    if (gameState.view === 'loading') {
        return <div className="text-white text-center p-10">A carregar...</div>;
    }
    
    if (gameState.view === 'waiting') {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 p-4 text-white">
                <h1 className="text-4xl font-bold">Respostas Enviadas!</h1>
                <p className="text-xl text-gray-400 mt-4">A aguardar a finalização da rodada...</p>
            </div>
        );
    }

    if (gameState.view === 'results') {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 p-4 text-white">
                <ResultsDisplay 
                    results={gameState.results} 
                    categories={gameState.categories}
                    onNextRound={handleNextRound}
                    onEndGame={handleEndGame} // <-- Passa a nova função
                    isCreator={gameState.isCreator}
                />
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-800 p-4 text-white">
            {isTimeUp && <TimeUpOverlay />}
            <div className="z-0 mb-8 mt-4 w-full max-w-2xl">
                <div className="flex items-center justify-center">
                    <CountdownTimer initialTime={gameState.roundDuration} onTimeUp={handleStop} />
                </div>
                <h1 className="mt-4 text-center text-6xl font-bold">Letra: {gameState.currentLetter}</h1>
            </div>
            <form className="z-0 w-full max-w-2xl">
                {gameState.categories.map((category) => (
                    <CategoryRow
                        key={category}
                        categoryName={category}
                        value={words[category] || ''}
                        onChange={(e) => handleWordChange(category, e.target.value)}
                        isDisabled={isTimeUp}
                    />
                ))}
                <button
                    type="button"
                    onClick={handleStop}
                    disabled={isTimeUp}
                    className="mt-6 w-full rounded-lg bg-red-600 py-4 text-3xl font-bold uppercase tracking-wider transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                    Stop!
                </button>
            </form>
        </div>
    );
}

export default GameScreen;