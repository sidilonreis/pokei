import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('apiKey');
    if (!stored) {
      navigate('/login', { replace: true });
    } else {
      setApiKey(stored);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ControlPlane Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded bg-indigo-600 px-4 py-2 hover:bg-indigo-500 transition"
        >
          Sair
        </button>
      </header>

      <section className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md">
        <p className="mb-4">
          API Key em uso:{' '}
          <code className="bg-white bg-opacity-20 px-2 py-1 rounded">{apiKey}</code>
        </p>
        <p>
          Esta é a área de dashboard onde você pode adicionar visualizações,
          gráficos e controles do seu SaaS.
        </p>
      </section>
    </div>
  );
}
