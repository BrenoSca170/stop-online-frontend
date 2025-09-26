import { useState } from 'react'; // Importamos o hook de estado
import CategoryRow from '../components/CategoryRow';
import CountdownTimer from '../components/CountdownTimer';
import TimeUpOverlay from '../components/TimeUpOverlay'; // Importamos a cortina

// Mantemos os dados "falsos" por enquanto
const categories = ['Nome', 'Cidade', 'Animal', 'Cor', 'CEP'];
const currentLetter = 'A';

function GameScreen() {
  // 1. ESTADOS DO JOGO
  const [words, setWords] = useState({}); // Guarda as palavras digitadas
  const [isTimeUp, setIsTimeUp] = useState(false); // Controla se o tempo acabou

  // 2. FUNÇÕES DE LÓGICA
  const handleWordChange = (category, value) => {
    setWords((prevWords) => ({
      ...prevWords,
      [category]: value,
    }));
  };

  const handlePowerUpClick = () => {
    // Encontra a primeira categoria que ainda não foi preenchida
    const emptyCategory = categories.find((cat) => !words[cat]);
    if (emptyCategory) {
      handleWordChange(emptyCategory, `Palavra Mágica`);
    } else {
      alert('Todas as categorias já estão preenchidas!');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-gray-800 p-4 text-white">
      {/* A cortina só aparece quando isTimeUp for true */}
      {isTimeUp && <TimeUpOverlay />}

      {/* Cabeçalho */}
      <div className="z-0 mb-8 mt-4 w-full max-w-2xl">
        <div className="flex items-center justify-center">
          {/* O timer agora tem a lógica e a função para avisar quando o tempo acabar */}
          <CountdownTimer initialTime={10} onTimeUp={() => setIsTimeUp(true)} />
        </div>
        <h1 className="mt-4 text-center text-6xl font-bold">
          Letra: {currentLetter}
        </h1>
      </div>

      {/* Formulário */}
      <form className="z-0 w-full max-w-2xl">
        {categories.map((category) => (
          <CategoryRow
            key={category}
            categoryName={category}
            value={words[category] || ''} // O valor vem do nosso estado 'words'
            onChange={(e) => handleWordChange(category, e.target.value)} // Atualiza o estado
            isDisabled={isTimeUp} // Desabilita os campos quando o tempo acaba
          />
        ))}

        {/* Botão de Power-up */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handlePowerUpClick}
            disabled={isTimeUp} // Desabilita o botão quando o tempo acaba
            className="w-full rounded-lg bg-purple-600 px-6 py-3 text-lg font-bold transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            ✨ Usar Power-up (Preencher 1)
          </button>
        </div>

        {/* Botão STOP */}
        <button
          type="button"
          disabled={isTimeUp} // Desabilita o botão quando o tempo acaba
          className="mt-6 w-full rounded-lg bg-red-600 py-4 text-3xl font-bold uppercase tracking-wider transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          Stop!
        </button>
      </form>
    </div>
  );
}

export default GameScreen;