import CategoryRow from '../components/CategoryRow';
// 1. Importe o novo componente de cronômetro
import CountdownTimer from '../components/CountdownTimer';

const categories = ['Nome', 'Cidade', 'Animal', 'Cor', 'CEP'];
const currentLetter = 'A';
const players = [
  { name: 'Breno', score: 0 },
  { name: 'Oponente', score: 0 },
];

function GameScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-800 p-4 text-white">
      {/* Cabeçalho */}
      <div className="mb-8 mt-4 w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="w-1/3 text-left">
            <span className="text-xl">{players[0].name}: {players[0].score}</span>
          </div>
          <div className="w-1/3 text-center">
            {/* 2. Adicione o cronômetro aqui */}
            <CountdownTimer />
          </div>
          <div className="w-1/3 text-right">
            <span className="text-xl">{players[1].name}: {players[1].score}</span>
          </div>
        </div>
        <h1 className="mt-4 text-center text-6xl font-bold">
          Letra: {currentLetter}
        </h1>
      </div>

      {/* Formulário */}
      <form className="w-full max-w-2xl">
        {categories.map((category) => (
          <CategoryRow key={category} categoryName={category} />
        ))}

        {/* 3. Seção do Power-up */}
        <div className="mt-8 rounded-lg border-2 border-dashed border-purple-500 bg-gray-900/50 p-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Digite um Power-up"
              className="flex-grow rounded-lg border-2 border-gray-600 bg-gray-700 p-2 text-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="button"
              className="rounded-lg bg-purple-600 px-6 py-2 text-lg font-bold transition-colors hover:bg-purple-700"
            >
              Usar
            </button>
          </div>
        </div>

        {/* Botão STOP */}
        <button
          type="button"
          className="mt-6 w-full rounded-lg bg-red-600 py-4 text-3xl font-bold uppercase tracking-wider transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-red-700"
        >
          Stop!
        </button>
      </form>
    </div>
  );
}

export default GameScreen;