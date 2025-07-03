'use client'
import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '@/public/PATHFINDER-logo-edited.png';
import ChangePasswordModal from './ChangePasswordModal';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess
}) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [changePwdOpen, setChangePwdOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setUsername('');
      setPassword('');
    } else {
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  const handleLogin = async () => {
    try {
      const res = await fetch('https://YOUR_BACKEND_URL/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Login successful');
        onLoginSuccess(username);
        router.push('/');
      } else {
        alert(data.detail);
      }
    } catch {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`fixed inset-0 bg-black transition-opacity ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
      />
      {visible && (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-lg">
            <button className="absolute top-4 right-4" onClick={onClose}>
              <FaTimes size={24} />
            </button>

            <div className="text-center mb-6">
              <img src={Logo.src} alt="Logo" className="mx-auto w-32" />
              <h2 className="text-2xl font-semibold">PathFinder Login</h2>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-3 border rounded"
                />
                <FaUser className="absolute right-3 top-3 text-gray-500" />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 border rounded"
                />
                {showPwd ? (
                  <FaEyeSlash
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPwd(false)}
                  />
                ) : (
                  <FaEye
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPwd(true)}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <button onClick={() => setChangePwdOpen(true)} className="text-blue-600">
                Forgot Password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>

            <div className="mt-4 text-center">
              <span>Don't have an account? </span>
              <button onClick={onSwitchToRegister} className="text-blue-600">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ChangePasswordModal
        isOpen={changePwdOpen}
        onClose={() => setChangePwdOpen(false)}
      />
    </div>
  );
};

export default LoginModal;
