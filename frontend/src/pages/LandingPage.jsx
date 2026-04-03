import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import { Bot } from 'lucide-react';

const LogoIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mimicking the "C" block logo */}
    <path d="M30 15 L70 35 L50 45 L10 25 Z" fill="#b893ff" />
    <path d="M10 25 L30 35 L30 70 L10 60 Z" fill="#c1aeff" opacity="0.6"/>
    <path d="M30 35 L50 45 L50 80 L30 70 Z" fill="#ffffff" />
    <path d="M30 70 L50 80 L70 70 L50 60 Z" fill="#5a52d5" />
    <path d="M70 35 L50 45 L50 80 L70 70 Z" opacity="0.1" fill="#000" />
  </svg>
);

const BigLogoIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top face */}
    <path d="M35 15 L75 35 L55 45 L15 25 Z" fill="#c3a6ff" />
    {/* Inner right face */}
    <path d="M55 45 L75 35 L75 70 L55 80 Z" fill="#f0edfa" opacity="0.3" />
    {/* Outer left face */}
    <path d="M15 25 L35 35 L35 75 L15 65 Z" fill="#a493ff" />
    {/* Inner left face */}
    <path d="M35 35 L55 45 L55 85 L35 75 Z" fill="#ffffff" />
    {/* Bottom top-face */}
    <path d="M35 75 L55 85 L75 75 L55 65 Z" fill="#5d52eb" />
  </svg>
);

export default function LandingPage() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Welcome to TimeCure.";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        clearInterval(typingInterval);
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#f2f6ff] via-[#f5f1fc] to-[#fceefa] font-sans">
      
      {/* Wave Background */}
      <div className="absolute right-0 bottom-0 w-full h-[100%] overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[110vh] bg-[#f8e4ee] rounded-tl-[300px] transform rotate-[-5deg]"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col px-6 lg:px-16 py-6 font-sans antialiased">
        
        {/* Navbar */}
        <header className="w-full flex justify-between items-center mb-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800 tracking-tight">TimeCure</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="px-2 py-1.5 text-sm font-semibold text-[#5a52d5] bg-[#eceeff] bg-opacity-70 rounded-md hover:bg-[#dfe3ff] transition-colors">Login</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-12 mt-10 lg:mt-0">
          
          {/* Left Text / Actions Area */}
          <div className="flex-1 flex flex-col items-center flex-start w-full max-w-lg">
            
            <div className="flex items-center justify-center gap-5 mb-8">
              <BigLogoIcon className="w-40 h-40 lg:w-48 lg:h-48 drop-shadow-md" />
              <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-bold text-[#444] tracking-tight ml-[-1rem]">
                TimeCure
              </h1>
            </div>

            <div className="w-32 h-px bg-gray-300 mb-8 mt-2"></div>

            <p className="text-xl text-gray-700 font-mono mb-12 h-8">
              {typedText}
            </p>

            <div className="flex flex-row items-center justify-center gap-4 w-full mb-6 relative z-20">
              <Link to="/dashboard" className="w-[180px] text-center px-6 py-3.5 rounded-lg bg-[#eef1ff] text-[#5a52d5] font-semibold hover:bg-[#e0e6ff] transition-all duration-200">
                Dashboard
              </Link>
              <Link to="/appointment" className="w-[180px] text-center px-6 py-3.5 rounded-lg bg-[#5d5fef] text-white font-semibold shadow-md hover:bg-[#4b4dcd] transition-all duration-200">
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="flex-1 w-full flex justify-center lg:justify-end items-center mb-10 lg:mb-0 relative z-10 pointer-events-none">
            <img 
              src={heroImg} 
              alt="Medical Professionals" 
              className="w-full max-w-3xl object-contain lg:scale-110 xl:scale-125 transform origin-right"
            />
          </div>

        </main>
      </div>
    </div>
  );
}
