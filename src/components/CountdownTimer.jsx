// Importaremos o ícone de relógio do 'lucide-react', uma ótima biblioteca de ícones.
// Primeiro, você precisa instalá-la no terminal: npm install lucide-react
import { Clock } from 'lucide-react';

// O tempo inicial virá como uma "prop" no futuro
function CountdownTimer({ initialTime = 60 }) {
  const minutes = Math.floor(initialTime / 60).toString().padStart(2, '0');
  const seconds = (initialTime % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2">
      <Clock className="h-6 w-6 text-yellow-400" />
      <span className="text-2xl font-bold text-yellow-400">
        {minutes}:{seconds}
      </span>
    </div>
  );
}

export default CountdownTimer;