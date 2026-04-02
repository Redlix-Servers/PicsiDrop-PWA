"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleAdminSignIn } from '../../actions/authActions';

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage(null);

    const formData = { email, password };
    const result = await handleAdminSignIn(formData);

    if (result.success) {
      setMessage({ text: "Authentication successful! Accessing control panel...", type: 'success' });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/dashboard/users');
      }, 1500);
    } else {
      setMessage({ text: result.error || "An error occurred", type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black font-sans items-center justify-center relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative w-full max-w-[400px] bg-white p-10 border border-gray-800 rounded-none shadow-[0_0_50px_rgba(255,255,255,0.05)] z-10">
          
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-light tracking-tight text-black flex items-center">
                Picsi<span className="font-semibold ml-1">Drop</span>
              </span>
              <span className="mt-1 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest leading-none">
                 System Admin
              </span>
            </div>
          </div>

          <div className="mb-8 text-center px-2">
            <h1 className="text-xl font-normal text-black tracking-tight leading-tight">
              Command Authentication
            </h1>
            <p className="mt-2 text-xs text-gray-500 font-normal border-b border-gray-100 pb-4">
              Authorized personnel only.
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 text-xs font-normal text-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Administrator Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 p-4 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all rounded-none text-sm font-normal text-black bg-[#fafafa]"
                placeholder="admin@picsidrop.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Secure Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-4 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all rounded-none text-sm font-normal text-black bg-[#fafafa]"
                placeholder="••••••••"
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-5 font-medium text-xs transition-all uppercase tracking-widest rounded-none shadow-xl active:scale-[0.98] mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {isLoading ? (message?.type === 'success' ? 'Redirecting...' : 'Verifying...') : 'Authorize Access'}
            </button>
          </div>
        </div>
    </div>
  );
};

export default AdminLoginPage;
