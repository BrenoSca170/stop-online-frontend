// src/App.jsx - CORRIGIDO

import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AuthScreen from './pages/AuthScreen';
// Vamos usar o apiClient para fazer o logout corretamente
import apiClient from './apiClient'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Adicionamos um estado de loading

  useEffect(() => {
    // A verificação agora é mais robusta
    const token = localStorage.getItem('authToken');
    // Verifica se o token existe E se não é uma string vazia
    if (token && typeof token === 'string' && token.length > 0) {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Termina o loading após a verificação
  }, []);

  const handleLogout = async () => {
    try {
      // Chama o endpoint de logout do backend para invalidar o token no Supabase
      await apiClient.post('/auth/sign_out');
    } catch (error) {
      console.error("Erro no logout, mas limpando localmente:", error);
    } finally {
      // Independentemente do resultado da API, limpa o token local e recarrega
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      window.location.reload(); 
    }
  };
  
  // Mostra uma tela em branco enquanto verifica o token
  if (isLoading) {
    return <div className="bg-gray-900 min-h-screen" />;
  }

  // Se não estiver autenticado, mostra a tela de autenticação
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Se estiver autenticado, mostra o layout principal
  return (
    <div className="bg-gray-900 min-h-screen">
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="hover:text-blue-400">Lobby</Link>
          <Link to="/profile" className="hover:text-blue-400">Perfil</Link>
          <Link to="/settings" className="hover:text-blue-400">Configurações</Link>
          <Link to="/shop" className="hover:text-blue-400">Loja</Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;