'use client'
import React, { useState, useEffect } from 'react';
import { FaTimes, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1); // Reset to the first step when modal is opened
      setEmail(''); // Clear email field
      setOtp(''); // Clear OTP field
      setNewPassword(''); // Clear new password field
      setConfirmPassword(''); // Clear confirm password field
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2); // Move to OTP confirmation
      setEmail(''); // Clear email field
    } else if (step === 2) {
      setStep(3); // Move to new password setup
      setOtp(''); // Clear OTP field
    } else if (step === 3) {
      alert('Password changed successfully');
      onClose();
      setNewPassword(''); // Clear new password field
      setConfirmPassword(''); // Clear confirm password field
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-brown-1 p-6 md:p-12 lg:p-20 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-2xl flex flex-col relative z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300">
          <FaTimes size={24} />
        </button>
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold mb-8 text-center text-black">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleNextStep} className="w-full py-4 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300 mb-4">Next</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-semibold mb-8 text-center text-black">OTP Confirmation</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleNextStep} className="w-full py-4 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300 mb-4">Next</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-semibold mb-8 text-center text-black">Reset Password</h2>
            <div className="relative mb-4">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                className="w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-black"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {newPassword ? (showNewPassword ? <FaEye /> : <FaEyeSlash />) : <FaLock />}
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-4 flex items-center text-black">
                <FaLock />
              </div>
            </div>
            <button onClick={handleNextStep} className="w-full py-4 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300 mb-4">Reset Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
