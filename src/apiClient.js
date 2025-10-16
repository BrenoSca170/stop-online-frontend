// src/apiClient.js - VERSÃO MELHORADA

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para ADICIONAR o token aos pedidos
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- NOVO: Interceptor para LIDAR COM ERROS de token expirado ---
// Isto verifica a RESPOSTA de todos os pedidos da API.
apiClient.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, não faz nada.
    return response;
  },
  (error) => {
    // Se a resposta for um erro 401 (Unauthorized)...
    if (error.response && error.response.status === 401) {
      console.log("Token expirado ou inválido. A limpar e a redirecionar para o login.");
      // ...apaga o token inválido...
      localStorage.removeItem('authToken');
      // ...e recarrega a página, o que irá forçar o ecrã de login a aparecer.
      window.location.reload();
    }
    // Para outros erros, apenas os rejeita para que possam ser tratados no local.
    return Promise.reject(error);
  }
);


export default apiClient;