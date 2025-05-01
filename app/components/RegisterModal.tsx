'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '@/public/PATHFINDER-logo-edited.png';
import OTPModal from './OTPModal';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSwitchToOTP: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin, onSwitchToOTP }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState(''); // Ensure default value is an empty string
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [nameDetails, setNameDetails] = useState({
    firstName: '', // Ensure default value is an empty string
    middleName: '', // Ensure default value is an empty string
    lastName: '', // Ensure default value is an empty string
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      resetState(); // Reset all state variables
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const resetState = () => {
    setStep(1); // Reset to the first step
    setNameDetails({ firstName: '', middleName: '', lastName: '' }); // Clear name fields
    setPasswordValue(''); // Clear password field
    setShowPassword(false); // Reset password visibility
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      resetState(); // Reset all state variables
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value || ''); // Ensure value is never undefined
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register button clicked, switching to OTP Modal');
    onSwitchToOTP();
    onClose();
  };

  const closeOTPModal = () => setIsOTPModalOpen(false);

  const handleSwitchToOTP = () => {
    console.log('Switching to OTP Modal from RegisterModal');
    onSwitchToOTP();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNameDetails((prev) => ({ ...prev, [name]: value || '' })); // Ensure value is never undefined
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Allow proceeding without requiring fields to be filled
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-black bg-opacity-0 transition-all duration-300 ${isOpen ? 'backdrop-blur-md' : 'backdrop-blur-none'}`} onClick={handleBackgroundClick} />
        {isVisible && (
          <div className="flex justify-center items-center h-full mt-10">
            <div className="bg-brown-1 p-6 md:p-10 lg:p-14 rounded-lg shadow-lg w-full max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl flex relative z-10 transition-all duration-500">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300">
                <FaTimes size={24} />
              </button>
              <div className="w-full md:w-full lg:w-1/2 p-6 md:p-8 lg:p-10 bg-brown-1 md:bg-brown-1 md:border-2 md:border-brown-6 rounded-lg">
                {step === 1 ? (
                  <form onSubmit={handleNextStep}>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mt-6 md:mt-8 lg:mt-10 mb-6 md:mb-8 lg:mb-10 text-center text-black">Register</h2>
                    <div className="mb-4 md:mb-4 lg:mb-8 mt-8 md:mt-10 lg:mt-12 relative">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={nameDetails.firstName || ''} // Ensure controlled input
                        onChange={handleNameChange}
                        className="w-full p-3 md:p-4 lg:p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black"
                      />
                    </div>
                    <div className="mb-4 md:mb-4 lg:mb-8 mt-8 md:mt-10 lg:mt-12 relative">
                      <input
                        type="text"
                        name="middleName"
                        placeholder="Middle Name"
                        value={nameDetails.middleName || ''} // Ensure controlled input
                        onChange={handleNameChange}
                        className="w-full p-3 md:p-4 lg:p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black"
                      />
                    </div>
                    <div className="mb-4 md:mb-4 lg:mb-8 mt-8 md:mt-10 lg:mt-12 relative">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={nameDetails.lastName || ''} // Ensure controlled input
                        onChange={handleNameChange}
                        className="w-full p-3 md:p-4 lg:p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black"
                      />
                    </div>
                    <button type="submit" className="w-full py-3 md:py-4 lg:py-5 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300">Next</button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister}>
                    <div className="mb-4 md:mb-4 lg:mb-8 mt-8 md:mt-10 lg:mt-12 relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={passwordValue || ''} // Ensure controlled input
                        onChange={handlePasswordChange}
                        className="w-full p-3 md:p-4 lg:p-5 pr-10 md:pr-12 lg:pr-14 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black"
                      />
                      <FaEnvelope className="absolute right-3 md:right-4 lg:right-5 top-3 md:top-4 lg:top-5 text-black" />
                    </div>
                    <div className="mb-4 md:mb-4 lg:mb-8 mt-8 md:mt-10 lg:mt-12 relative">
                      <input type="text" placeholder="Enter your username" className="w-full p-3 md:p-4 lg:p-5 pr-10 md:pr-12 lg:pr-14 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black" />
                      <FaUser className="absolute right-3 md:right-4 lg:right-5 top-3 md:top-4 lg:top-5 text-black" />
                    </div>
                    <div className="mb-4 md:mb-6 lg:mb-8 relative">
                      <input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full p-3 md:p-4 lg:p-5 pr-10 md:pr-12 lg:pr-14 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black" value={passwordValue || ''} onChange={handlePasswordChange} />
                      {passwordValue && (
                        <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 md:right-4 lg:right-5 top-3 md:top-4 lg:top-5 text-black focus:outline-none">
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      )}
                      {!passwordValue && <FaLock className="absolute right-3 md:right-4 lg:right-5 top-3 md:top-4 lg:top-5 text-black" />}
                    </div>
                    <div className="mb-6 relative">
                      <input type="password" placeholder="Confirm your password" className="w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black" />
                      <FaLock className="absolute right-4 top-4 text-black" />
                    </div>
                    <button type="submit" className="w-full py-3 md:py-4 lg:py-5 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300">Register</button>
                  </form>
                )}
                <div className="mt-4 md:mt-4 lg:mt-8 text-center">
                  <p className="text-lg md:text-xl lg:text-2xl text-black">
                    Already have an account? <button onClick={onSwitchToLogin} className="text-brown-700 hover:underline">Sign in</button>
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex lg:w-1/2 p-6 md:p-8 lg:p-10 justify-center items-center bg-brown-1">
                <Image src={Logo} alt="Company Logo" />
              </div>
            </div>
          </div>
        )}
      </div>
      <OTPModal isOpen={isOTPModalOpen} onClose={closeOTPModal} />
    </>
  );
};

export default RegisterModal;
