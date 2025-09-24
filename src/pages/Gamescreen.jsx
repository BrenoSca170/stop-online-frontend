// Dados falsos que virão do backend no futuro
const categories = ['Nome', 'Cidade', 'Animal', 'Cor', 'CEP'];
const currentLetter = 'A';
const players = [
  { name: 'Breno', score: 0 },
  { name: 'Oponente', score: 0 },
];

function GameScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-800 p-4 text-white">
      {/* Cabeçalho com letra e jogadores */}
      <div className="mb-8 w-full max-w-2xl text-center">
        <h1 className="text-6xl font-bold">Letra: {currentLetter}</h1>
        <div className="mt-4 flex justify-around text-xl">
          <span>{players[0].name}: {players[0].score}</span>
          <span>{players[1].name}: {players[1].score}</span>
        </div>
      </div>

      {/* Formulário com as categorias */}
      <form className="w-full max-w-2xl">
        {categories.map((category) => (
          <div key={category} className="mb-4 flex items-center">
            <label className="w-1/4 text-xl font-semibold">{category}:</label>
            <input
              type="text"
              className="w-3/4 rounded-lg border-2 border-gray-600 bg-gray-700 p-2 text-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        ))}

        {/* Botão STOP */}
        <button
          type="button"
          className="mt-6 w-full rounded-lg bg-red-600 py-4 text-3xl font-bold uppercase tracking-wider hover:bg-red-700"
        >
          Stop!
        </button>
      </form>
    </div>
  );
}

export default GameScreen;