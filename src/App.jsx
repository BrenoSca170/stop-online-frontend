// src/App.jsx
// Passo 2: Importe seu componente GameScreen no topo do arquivo.
// O caminho './pages/GameScreen' assume que você criou o arquivo dentro de 'src/pages/'
import GameScreen from './pages/GameScreen';

function App() {
  // Passo 1: O conteúdo antigo da função App foi todo apagado.

  // Passo 3: Agora, dentro do 'return', colocamos apenas o nosso componente.
  return (
    <GameScreen />
  );
}

export default App;