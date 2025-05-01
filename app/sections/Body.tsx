'use client'

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import LoginModal from '@/app/components/LoginModal';
import RegisterModal from '@/app/components/RegisterModal';
import OTPModal from '@/app/components/OTPModal';
import Link from 'next/link';

const Body = () => {
  const { isLoggedIn, login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openOTPModal = () => {
    setIsRegisterModalOpen(false);
    setIsOTPModalOpen(true);
  };

  const closeOTPModal = () => setIsOTPModalOpen(false);

  const handleLoginSuccess = (username: string) => {
    login(username); // Use global login function
    closeLoginModal();
  };

  return (
    <section className=''>
      <div className='pt-28 container mx-auto max-w-screen-xl text-black'>
        <div className='text-center flex flex-col items-center'>
          <div className='md-flex'>
            <h1 className='flex justify-center mt-16 md:pt-10 lg:pt-10 text-3xl md:text-6xl lg:text-9xl font-bold '>Find your right career.</h1>
            <div>
              <p className='flex justify-center text-[8px] md:text-[15px] lg:text-[18px] place-content-center tracking-tight mt-2 lg:mt-5'>Are you a graduate of STEM, ABM, or HUMSS? Need to know the right path for you? We're on it!<br /> Pathfinder recommends three programs for you based on your academic records, personality, and knowledge.</p>
            </div>
            <div className='mt-5 text-center'>
              {isLoggedIn ? (
                <Link href="/Gradings">
                  <button
                    className='btn-sm btn-primary text-white bg-brown-6 rounded-full border-brown-6 text-[10px] md:text-[15px] lg:text-[18px] w-[100px] md:w-[200px] lg:w-[230px] md:h-[50px] lg:h-[52px] hover:bg-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu'
                  >
                    Get started
                  </button>
                </Link>
              ) : (
                <button
                  onClick={openLoginModal}
                  className='btn-sm btn-primary text-white bg-brown-6 rounded-full border-brown-6 text-[10px] md:text-[15px] lg:text-[18px] w-[100px] md:w-[200px] lg:w-[230px] md:h-[50px] lg:h-[52px] hover:bg-brown-6 hover:scale-95 active:scale-95 transition-transform duration-300 transform-gpu'
                >
                  Get started
                </button>
              )}
            </div>
          </div>
          <div>
            {/* Other content */}
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onSwitchToRegister={openRegisterModal} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onSwitchToLogin={openLoginModal} onSwitchToOTP={openOTPModal} />
      <OTPModal isOpen={isOTPModalOpen} onClose={closeOTPModal} />
    </section>
  );
};

export default Body;