// src/main.jsx - Adicionada a rota de resumo

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import GameScreen from './pages/Gamescreen';
import ProfileScreen from './pages/ProfileScreen';
import MatchSettingsScreen from './pages/MatchSettingsScreen';
import ShopScreen from './pages/ShopScreen';
import LobbyScreen from './pages/LobbyScreen';
import WaitingRoomScreen from './pages/WaitingRoomScreen';
import GameSummaryScreen from './pages/GameSummaryScreen'; // <-- 1. IMPORTAR A NOVA TELA
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <LobbyScreen /> },
      { path: '/game/:salaId', element: <GameScreen /> },
      { path: '/profile', element: <ProfileScreen /> },
      { path: '/settings', element: <MatchSettingsScreen /> },
      { path: '/shop', element: <ShopScreen /> },
      { path: '/waiting-room/:salaId', element: <WaitingRoomScreen /> },
      { path: '/game/:salaId/summary', element: <GameSummaryScreen /> }, // <-- 2. ADICIONAR A NOVA ROTA
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);