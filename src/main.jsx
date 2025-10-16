// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import GameScreen from './pages/GameScreen';
import ProfileScreen from './pages/ProfileScreen';
import MatchSettingsScreen from './pages/MatchSettingsScreen';
import ShopScreen from './pages/ShopScreen';
// NOVOS IMPORTS
import LobbyScreen from './pages/LobbyScreen';
import WaitingRoomScreen from './pages/WaitingRoomScreen';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App continua sendo o layout principal
    children: [
      // A rota principal agora é o Lobby
      { path: '/', element: <LobbyScreen /> },
      // Rota da partida em si (para onde seremos redirecionados)
      { path: '/game/:salaId', element: <GameScreen /> },
      // Demais rotas
      { path: '/profile', element: <ProfileScreen /> },
      { path: '/settings', element: <MatchSettingsScreen /> },
      { path: '/shop', element: <ShopScreen /> },
      // Rota dinâmica para a sala de espera, que recebe o ID da sala
      { path: '/waiting-room/:salaId', element: <WaitingRoomScreen /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);