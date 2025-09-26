import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Barra de Navegação Simples */}
      <nav className="bg-gray-800 p-4 text-white flex gap-4">
        <Link to="/" className="hover:text-blue-400">Jogo</Link>
        <Link to="/profile" className="hover:text-blue-400">Perfil</Link>
        <Link to="/settings" className="hover:text-blue-400">Configurações</Link>
        <Link to="/shop" className="hover:text-blue-400">Loja</Link>
      </nav>

      <main>
        {/* O Outlet renderiza o componente da rota atual aqui */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;