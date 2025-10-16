// src/pages/Gamescreen.jsx - CORRIGIDO

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import CategoryRow from '../components/CategoryRow';
import CountdownTimer from '../components/CountdownTimer';
import TimeUpOverlay from '../components/TimeUpOverlay';

function GameScreen() {
  const { salaId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [currentLetter, setCurrentLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState({});
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchGameState = async () => {
      // ERRO CORRIGIDO AQUI: "try:" foi substituído por "try {"
      try {
        const response = await apiClient.get(`/game/rooms/${salaId}/gamestate`);
        const gameState = response.data;

        setCurrentLetter(gameState.letra);
        setCategories(gameState.categorias);
        setLoading(false);

      } catch (error) {
        console.error("Erro ao buscar o estado do jogo:", error);
        alert("Não foi possível carregar o jogo. A redirecionar para o lobby.");
        navigate('/');
      }
    };
    fetchGameState();
  }, [salaId, navigate]);

  const handleWordChange = (category, value) => {
    setWords((prevWords) => ({
      ...prevWords,
      [category]: value,
    }));
  };

  const handleStop = async () => {
    if (submitted) return; 

    setIsTimeUp(true);
    try {
      await apiClient.post(`/game/rooms/${salaId}/submit`, words);
      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao submeter respostas:", error);
      alert("Houve um problema ao enviar as suas respostas.");
      setIsTimeUp(false);
    }
  };


  if (loading) {
    return <div className="text-white text-center p-10">A carregar partida...</div>;
  }
  
  if (submitted) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 p-4 text-white">
            <h1 className="text-4xl font-bold">Respostas Enviadas!</h1>
            <p className="text-xl text-gray-400 mt-4">A aguardar a finalização da rodada...</p>
        </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-800 p-4 text-white">
      {isTimeUp && <TimeUpOverlay />}
      <div className="z-0 mb-8 mt-4 w-full max-w-2xl">
        <div className="flex items-center justify-center">
          <CountdownTimer initialTime={90} onTimeUp={handleStop} />
        </div>
        <h1 className="mt-4 text-center text-6xl font-bold">
          Letra: {currentLetter}
        </h1>
      </div>
      <form className="z-0 w-full max-w-2xl">
        {categories.map((category) => (
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