'use client'
import React, { useEffect, useState } from 'react';
import { FaTimes, FaKey } from 'react-icons/fa';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Match the transition duration
    }
  }, [isOpen]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSendAnotherOTP = () => {
    // Logic to send another OTP
    console.log('Send another OTP');
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`fixed inset-0 bg-black bg-opacity-0 transition-all duration-300 ${isOpen ? 'backdrop-blur-md' : 'backdrop-blur-none'}`} onClick={handleBackgroundClick} />
      {isVisible && (
        <div className="flex justify-center items-center h-full mt-10">
          <div className="bg-brown-1 p-6 md:p-12 lg:p-20 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-2xl flex flex-col relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300">
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-semibold mb-8 text-center text-black">OTP Confirmation</h2>
            <form>
              <div className="mb-6 relative">
                <input type="text" placeholder="Enter OTP" className="w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-white text-black" />
                <FaKey className="absolute right-4 top-4 text-black" />
              </div>
              <button type="submit" className="w-full py-4 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300">Confirm</button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={handleSendAnotherOTP} className="text-brown-700 hover:underline">Send another OTP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPModal;
