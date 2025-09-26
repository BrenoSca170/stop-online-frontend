import { useState, useEffect } from 'react';
import axios from 'axios'; // Importamos o axios

function ProfileScreen() {
  // Estado para guardar os dados do formulário
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    age: '',
  });

  // Estado para controlar o feedback visual (ex: "Salvando...", "Salvo!")
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // ==================================================================
  // EFEITO PARA CARREGAR OS DADOS QUANDO A TELA ABRE (API GET)
  // ==================================================================
  useEffect(() => {
    // Função assíncrona para buscar os dados
    const fetchProfile = async () => {
      setMessage('Carregando perfil...');
      setLoading(true);

      try {
        // --- PONTO DE INTEGRAÇÃO COM A API (GET) ---
        // No futuro, a URL será algo como 'http://localhost:3001/api/users/me'
        const response = await axios.get('/api/users/mock-profile'); // Usando um mock por enquanto

        // Simulação de dados recebidos do MongoDB
        const mockDataFromMongo = {
          username: 'BrenoDev',
          email: 'breno@email.com',
          age: 25,
        };

        setProfileData(mockDataFromMongo);
        setMessage('');
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        setMessage('Erro ao carregar o perfil. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // O array vazio [] faz com que este useEffect rode apenas uma vez, quando o componente é montado.

  // Função para lidar com mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ==================================================================
  // FUNÇÃO PARA SALVAR AS ALTERAÇÕES (API PUT/PATCH)
  // ==================================================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    setMessage('Salvando alterações...');
    setLoading(true);

    try {
      // --- PONTO DE INTEGRAÇÃO COM A API (PUT) ---
      // No futuro, a URL será algo como 'http://localhost:3001/api/users/me'
      // O segundo argumento do axios.put é o corpo (body) da requisição com os dados a serem salvos
      const response = await axios.put('/api/users/mock-profile', profileData);

      console.log('Resposta do servidor:', response.data);
      setMessage('Perfil salvo com sucesso!');
      setTimeout(() => setMessage(''), 3000); // Limpa a mensagem após 3 segundos
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.username) {
    return <div className="text-white text-center p-10">{message || 'Carregando...'}</div>;
  }

  return (
    <div className="flex justify-center p-8 text-white">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold mb-6">Meu Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Nome de Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300">
              Idade
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={profileData.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-500"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            {message && <span className="text-green-400">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileScreen;