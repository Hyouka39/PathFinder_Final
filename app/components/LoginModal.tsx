'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '@/public/PATHFINDER-logo-edited.png';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [username, setUsername] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      clearInputs();
    } else {
      setTimeout(() => setIsVisible(false), 300); // Match the transition duration
    }
  }, [isOpen]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      clearInputs();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  const handleLogin = () => {
    if (username === 'Drew27' && passwordValue === 'andrew') {
      alert('Login Successfully');
      onLoginSuccess(username);
      router.push('/');
    } else {
      alert('Invalid credentials');
      clearInputs();
    }
  };

  const clearInputs = () => {
    setUsername('');
    setPasswordValue('');
  };

  const handleForgotPassword = () => {
    setIsChangePasswordOpen(true);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`fixed inset-0 bg-black bg-opacity-0 transition-all duration-300 ${isOpen ? 'backdrop-blur-md' : 'backdrop-blur-none'}`} onClick={handleBackgroundClick} />
      {isVisible && (
        <div className="flex justify-center items-center h-full mt-20">
          <div className="bg-brown-1 p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl flex relative z-10 transition-all duration-500">
            <button onClick={() => { onClose(); clearInputs(); }} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300">
              <FaTimes size={24} />
            </button>
            <div className="w-full md:w-full lg:w-1/2 p-8 md:p-10 lg:p-12 bg-brown-1 md:bg-brown-1 md:border-2 md:border-brown-6 rounded-lg">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mt-6 md:mt-8 lg:mt-10 mb-6 md:mb-8 lg:mb-10 text-center text-black">PathFinder</h2>
              <div className="mt-4 md:mt-6 lg:mt-8">
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} autoComplete="off">
                  <div className="mb-4 md:mb-4 lg:mb-8 mt-8 md:mt-10 lg:mt-12 relative">
                    <input type="text" placeholder="Enter your username" className="w-full p-4 md:p-5 lg:p-6 pr-10 md:pr-12 lg:pr-14 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                    <FaUser className="absolute right-3 md:right-4 lg:right-5 top-3 md:top-4 lg:top-5 text-black" />
                  </div>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full p-4 md:p-5 lg:p-6 pr-10 md:pr-12 lg:pr-14 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black" value={passwordValue} onChange={handlePasswordChange} autoComplete="off" />
                    {passwordValue && (
                      <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 md:right-4 lg:right-5 top-3 md:top-4 lg:top-5 text-black focus:outline-none">
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    )}
                    {!passwordValue && <FaLock className="absolute right-3 md:right-4 lg:right-5 top-3 md:top-4 lg:top-5 text-black" />}
                  </div>
                  <div className="text-right mb-4">
                    <button type="button" onClick={handleForgotPassword} className="text-brown-700 font-normal hover:underline text-xl">Forgot Password?</button>
                  </div>
                  <button type="submit" className="w-full py-4 md:py-5 lg:py-6 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300">Login</button>
                </form>
                <div className="mt-4 md:mt-4 lg:mt-8 text-center">
                  <p className="text-lg md:text-xl lg:text-2xl text-black">
                    Don't have an account? <button onClick={onSwitchToRegister} className="text-brown-700 hover:underline">Sign up</button>
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex lg:w-1/2 p-8 md:p-10 lg:p-12 justify-center items-center bg-brown-1">
              <Image src={Logo} alt="Company Logo" />
            </div>
          </div>
        </div>
      )}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default LoginModal;
