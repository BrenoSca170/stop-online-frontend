// src/pages/GameSummaryScreen.jsx - NOVO FICHEIRO

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { Trophy, Home } from 'lucide-react';

function GameSummaryScreen() {
    const { salaId } = useParams();
    const navigate = useNavigate();
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await apiClient.get(`/game/rooms/${salaId}/summary`);
                setSummary(response.data);
            } catch (error) {
                console.error("Erro ao buscar resumo da partida:", error);
                alert("Não foi possível carregar o resumo da partida.");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [salaId]);

    if (loading) {
        return <div className="text-white text-center p-10">A calcular placar final...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-5xl font-bold mb-8">Fim de Jogo!</h1>
            
            <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center mb-6">Placar Final</h2>
                <ul className="space-y-4">
                    {summary.map(([nome, pontos], index) => (
                        <li 
                            key={nome}
                            className="flex items-center justify-between p-4 rounded-md bg-gray-700"
                        >
                            <div className="flex items-center gap-4">
                                {index === 0 && <Trophy className="text-yellow-400" />}
                                {index === 1 && <Trophy className="text-gray-400" />}
                                {index === 2 && <Trophy className="text-orange-400" />}
                                {index > 2 && <span className="w-6 text-center">{index + 1}</span>}
                                <span className="text-lg font-bold">{nome}</span>
                            </div>
                            <span className="text-xl font-semibold text-green-400">{pontos} pts</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <button
                onClick={() => navigate('/')}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold"
            >
                <Home size={20} />
                Voltar para o Lobby
            </button>
        </div>
    );
}

export default GameSummaryScreen;