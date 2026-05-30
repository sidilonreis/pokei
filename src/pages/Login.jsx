import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [apiKey, setApiKey] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('apiKey', apiKey.trim());
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-md shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">ControlPlane Login</h2>
        <input
          type="text"
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-white bg-opacity-20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition py-2 rounded font-medium"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
