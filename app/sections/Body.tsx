'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import LoginModal from '@/app/components/LoginModal';
import RegisterModal from '@/app/components/RegisterModal';
import OTPModal from '@/app/components/OTPModal';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSend, FiMessageCircle, FiX } from 'react-icons/fi';
import axios from 'axios';

const Body = () => {
  const { isLoggedIn, login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

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
  const openOTPModal = (email: string) => {
    setIsRegisterModalOpen(false);
    setRegisteredEmail(email);
    setIsOTPModalOpen(true);
  };
  const closeOTPModal = () => setIsOTPModalOpen(false);

  const handleLoginSuccess = (username: string) => {
    login(username);
    closeLoginModal();

    setTimeout(() => {
      const roleId = localStorage.getItem('role_id');
      if (roleId === '1') router.push('/admin');
      else router.push('/Gradings');
    }, 300);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F2E6D9] via-[#E7D2B8] to-[#CBB292] text-[#2E1C14]">
      {/* Background lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,_rgba(255,255,255,0.3),_transparent_70%),_radial-gradient(circle_at_75%_80%,_rgba(0,0,0,0.05),_transparent_70%)] pointer-events-none"></div>

      {/* Animated gradient glows */}
      <motion.div
        className="absolute w-96 h-96 bg-[#D7CCC8]/50 rounded-full blur-3xl top-[-100px] left-[-100px]"
        animate={{ y: [0, 30, 0], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 9 }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-[#BCAAA4]/40 rounded-full blur-3xl bottom-[-120px] right-[-80px]"
        animate={{ y: [0, -40, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 md:px-10 max-w-5xl"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#3E2723] drop-shadow-lg leading-tight">
          Find Your <span className="text-[#6D4C41]">Right Career</span> Path
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-8 text-lg md:text-2xl lg:text-3xl text-[#4E342E] leading-relaxed font-medium max-w-3xl mx-auto"
        >
          Are you a graduate of <span className="font-semibold text-[#3E2723]">STEM, ABM, or HUMSS</span>? <br />
          Discover your ideal college program with <span className="font-bold text-[#5D4037]">PathFinder</span> — 
          a smart recommendation system that analyzes your scholastic records, personality, and knowledge 
          to guide you toward your best-fit programs.
        </motion.p>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} className="mt-14">
          <button
            onClick={() => {
              if (isLoggedIn) {
                const roleId = localStorage.getItem('role_id');
                if (roleId === '1') router.push('/admin');
                else router.push('/Gradings');
              } else {
                openLoginModal();
              }
            }}
            className="bg-[#6D4C41] hover:bg-[#4E342E] text-white px-12 py-5 rounded-full text-2xl font-semibold shadow-lg transition-all duration-300"
          >
            Get Started
          </button>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onSwitchToRegister={openRegisterModal} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onSwitchToLogin={openLoginModal} onSwitchToOTP={(email: string) => openOTPModal(email)} />
      <OTPModal isOpen={isOTPModalOpen} onClose={closeOTPModal} email={registeredEmail} />

      {/* 💬 Chatbot (only when logged in) */}
      {isLoggedIn && <FloatingChatbot />}
    </section>
  );
};

/* 🧩 Floating Chatbot Component (Improved) */
const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', { message: userMessage });
      const botMessage = response.data.reply || '...';
      setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Unable to reach AI server. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6D4C41] to-[#4E342E] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50"
        >
          <FiMessageCircle size={28} />
        </motion.button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6D4C41] to-[#4E342E] text-white p-3 flex justify-between items-center shadow-md">
            <h2 className="font-semibold text-lg tracking-wide">PathFinder AI</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-300 transition-colors"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#FAF8F5] scrollbar-thin scrollbar-thumb-[#C7B8A1] scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm italic py-6">
                👋 Hi there! How can I help you today?
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#6D4C41] text-white rounded-br-none'
                      : 'bg-[#EFE6DD] text-[#3E2723] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <div className="animate-bounce">•</div>
                <div className="animate-bounce delay-100">•</div>
                <div className="animate-bounce delay-200">•</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-[#6D4C41] placeholder:text-gray-400"
            />
            <motion.button
              onClick={sendMessage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#6D4C41] text-white p-2 rounded-full hover:bg-[#4E342E] transition-all shadow-md"
            >
              <FiSend size={18} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
};


/* 🧩 DVD-style bouncing logo (hydration-safe) */
const BouncingLogo: React.FC<{ src: string; delay?: number }> = ({ src, delay = 0 }) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const startX = Math.random() * (window.innerWidth * 0.8);
    const startY = Math.random() * (window.innerHeight * 0.8);
    const vx = Math.random() < 0.5 ? 0.3 : -0.3;
    const vy = Math.random() < 0.5 ? 0.3 : -0.3;

    setPos({ x: startX, y: startY });
    vel.current = { x: vx, y: vy };
  }, []);

  useEffect(() => {
    let raf: number;
    const move = () => {
      const el = ref.current;
      if (!el) return;

      const { innerWidth: w, innerHeight: h } = window;
      const size = el.offsetWidth || 80;

      setPos((prev) => {
        let { x, y } = prev;
        x += vel.current.x;
        y += vel.current.y;

        if (x <= 0 || x + size >= w) vel.current.x *= -1;
        if (y <= 0 || y + size >= h) vel.current.y *= -1;

        return { x, y };
      });

      raf = requestAnimationFrame(move);
    };

    raf = requestAnimationFrame(move);
    return () => cancelAnimationFrame(raf);
  }, [delay]);

  return (
    <img
      ref={ref}
      src={src}
      alt="bouncing-logo"
      style={{
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: '90px',
        height: '90px',
        opacity: 0.9,
        pointerEvents: 'none',
        transform: `rotate(${(pos.x + pos.y) / 2 % 360}deg)`,
        transition: 'transform 0.6s linear',
      }}
    />
  );
};

export default Body;
