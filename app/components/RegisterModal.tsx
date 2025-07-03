'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      clearInputs();
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const clearInputs = () => {
    setUsername('');
    setPassword('');
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      clearInputs();
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://pathfinder-2-vhjw.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        onSwitchToLogin();
      } else {
        alert(data.detail || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`fixed inset-0 bg-black bg-opacity-40 transition-all duration-300 ${isOpen ? 'backdrop-blur-md' : 'backdrop-blur-none'}`} onClick={handleBackgroundClick} />
      {isVisible && (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative z-10 transition-all duration-500">
            <button onClick={() => { onClose(); clearInputs(); }} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300">
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} autoComplete="off">
              <div className="mb-4 relative">
                <input type="text" placeholder="Username" className="w-full p-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={username} onChange={(e) => setUsername(e.target.value)} />
                <FaUser className="absolute right-3 top-3.5 text-gray-500" />
              </div>
              <div className="mb-4 relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full p-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                Register
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterModal;
