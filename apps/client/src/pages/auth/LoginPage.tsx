import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Phone, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pour l'instant on simule ou on appelle l'API si elle est configurée
      // const response = await axios.post('http://localhost:3000/api/v1/auth/login', { phone, password });
      console.log('Login attempt:', { phone, password });
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <div className="flex justify-center">
            <div className="bg-opep-blue p-3 rounded-xl text-white">
              <LogIn size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bon retour !
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/register" className="font-medium text-opep-blue hover:text-blue-500 underline">
              créez votre compte client
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-opep-blue focus:border-opep-blue focus:z-10 sm:text-sm"
                  placeholder="6XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-opep-blue focus:border-opep-blue focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-opep-blue focus:ring-opep-blue border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-opep-blue hover:text-blue-500">
                Oublié ?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-opep-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opep-blue transition shadow-lg"
            >
              Se connecter
              <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
