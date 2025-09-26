import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importe suas telas
import GameScreen from './pages/GameScreen';
import ProfileScreen from './pages/ProfileScreen';
import MatchSettingsScreen from './pages/MatchSettingsScreen';
import ShopScreen from './pages/ShopScreen';
// E o seu App.jsx, que servirá de layout
import App from './App';
import './index.css';

// Crie o roteador com a definição das rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App.jsx é o elemento PAI, ou "layout"
    children: [
      {
        path: '/', // Rota inicial
        element: <GameScreen />,
      },
      {
        path: '/profile', // Rota para o perfil
        element: <ProfileScreen />,
      },
      {
        path: '/settings', // Rota para configurações
        element: <MatchSettingsScreen />,
      },
      {
        path: '/shop', // Rota para a loja
        element: <ShopScreen />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);