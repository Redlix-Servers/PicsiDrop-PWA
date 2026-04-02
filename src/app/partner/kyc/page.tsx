"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handlePartnerKYC } from '../../actions/authActions';

function KYCFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // States for all inputs
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [travelFrequency, setTravelFrequency] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [username, setUsername] = useState('');

  // Image Upload States (Base64 storing)
  const [aadhaarImageUrl, setAadhaarImageUrl] = useState<string | null>(null);
  const [panImageUrl, setPanImageUrl] = useState<string | null>(null);
  const [selfieImageUrl, setSelfieImageUrl] = useState<string | null>(null);

  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setMessage({
        text: "Session missing. Please register or sign in again.",
        type: 'error'
      });
    }
  }, [email]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>, typeLabel: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1 MB limit
    if (file.size > 1024 * 1024) {
      setMessage({ text: `${typeLabel} image exceeds the 1MB limit. Please compress and try again.`, type: 'error' });
      return;
    }

    setLoadingFile(typeLabel);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setter(event.target?.result as string);
      setLoadingFile(null);
      setMessage(null); // clear any previous error
    };
    reader.onerror = () => {
      setMessage({ text: `Failed to load ${typeLabel} image.`, type: 'error' });
      setLoadingFile(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        setMessage({ text: "Missing account email. Cannot save KYC.", type: "error" });
        return;
    }
    
    // Optional client-side verification
    if (!aadhaarImageUrl || !panImageUrl || !selfieImageUrl) {
        setMessage({ text: "Please upload all required identity images (Aadhaar, PAN, and Selfie).", type: "error" });
        return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = {
        email,
        aadhaarNumber,
        panNumber,
        city,
        state,
        pincode,
        routeFrom,
        routeTo,
        travelFrequency,
        travelTime,
        upiId,
        bankAccountNumber,
        ifscCode,
        username,
        aadhaarImageUrl,
        panImageUrl,
        selfieImageUrl
    };

    const result = await handlePartnerKYC(formData);

    if (result.success) {
        setMessage({ text: "KYC profile saved successfully! Securing portal...", type: "success" });
        setTimeout(() => {
          router.push('/partner/dashboard');
        }, 1500);
    } else {
        setMessage({ text: result.error || "Failed to process KYC", type: "error" });
        setIsLoading(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="border-b border-gray-100 pb-8 text-center md:text-left">
           <h1 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight">
             Partner Identity Verification
           </h1>
           <p className="mt-3 text-sm md:text-base text-gray-500 font-light max-w-xl">
             To ensure trust and reliability within our logistics network, please complete your mandatory KYC and travel logistics profile.
           </p>
        </div>

        {message && (
            <div className={`p-4 text-xs font-normal text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* SECTION: KYC DETAILS */}
          <section className="bg-white p-8 md:p-10 border border-gray-200 rounded-none shadow-[2px_2px_15px_rgba(0,0,0,0.01)] space-y-8">
            <div className="border-b border-gray-50 pb-4 flex items-center justify-between">
                <h2 className="text-sm uppercase font-bold tracking-widest text-black flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    KYC Details
                </h2>
                <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 px-2 py-1 tracking-widest">Important</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Aadhaar Number</label>
                    <input type="text" value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} placeholder="XXXX XXXX XXXX" className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-sm" required />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">PAN Number</label>
                    <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} placeholder="ABCDE1234F" className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-sm uppercase" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Aadhaar Upload */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Aadhaar (Front) - Max 1MB</label>
                    <label className="border border-dashed border-gray-300 p-2 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer group bg-[#fafafa] relative overflow-hidden h-32">
                        {loadingFile === 'Aadhaar' ? (
                            <div className="animate-pulse text-xs font-bold uppercase tracking-widest text-black">Loading...</div>
                        ) : aadhaarImageUrl ? (
                            <img src={aadhaarImageUrl} alt="Aadhaar preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-black mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest text-center">Upload File</span>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarImageUrl, 'Aadhaar')} className="hidden" />
                    </label>
                </div>
                
                {/* PAN Upload */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">PAN Image - Max 1MB</label>
                    <label className="border border-dashed border-gray-300 p-2 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer group bg-[#fafafa] relative overflow-hidden h-32">
                        {loadingFile === 'PAN' ? (
                            <div className="animate-pulse text-xs font-bold uppercase tracking-widest text-black">Loading...</div>
                        ) : panImageUrl ? (
                            <img src={panImageUrl} alt="PAN preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-black mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest text-center">Upload File</span>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPanImageUrl, 'PAN')} className="hidden" />
                    </label>
                </div>

                {/* Selfie Camera Upload */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Live Selfie Photo</label>
                    <label className="border border-gray-300 p-2 flex flex-col items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer group bg-black text-white relative overflow-hidden h-32">
                         {loadingFile === 'Selfie' ? (
                            <div className="animate-pulse text-xs font-bold uppercase tracking-widest text-white">Loading...</div>
                        ) : selfieImageUrl ? (
                            <img src={selfieImageUrl} alt="Selfie preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-center">Take Selfie</span>
                            </>
                        )}
                        <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, setSelfieImageUrl, 'Selfie')} className="hidden" />
                    </label>
                </div>
            </div>
          </section>

          {/* SECTION: ADDRESS DETAILS */}
          <section className="bg-white p-8 md:p-10 border border-gray-200 rounded-none shadow-[2px_2px_15px_rgba(0,0,0,0.01)] space-y-8">
            <div className="border-b border-gray-50 pb-4">
                <h2 className="text-sm uppercase font-bold tracking-widest text-black flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address Details
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 md:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Current City</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-sm" required />
                </div>
                <div className="space-y-1.5 md:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">State</label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Maharashtra" className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-sm" required />
                </div>
                <div className="space-y-1.5 md:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Pincode</label>
                    <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="000 000" className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-sm" required />
                </div>
            </div>
          </section>

          {/* SECTION: TRAVEL DETAILS */}
          <section className="bg-white p-8 md:p-10 border border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform space-y-8 relative">
            <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5">
                Core Metrics
            </div>
            <div className="border-b border-gray-100 pb-4">
                <h2 className="text-sm uppercase font-bold tracking-widest text-black flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    Travel Details
                </h2>
                <p className="text-xs text-gray-500 mt-2 font-normal">Define your primary logistics corridor for matching.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5 group">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Primary Route (From)</label>
                    <input type="text" value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} placeholder="Starting City/Location" className="w-full border-b-2 border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none bg-transparent text-sm placeholder:italic" required />
                </div>
                <div className="space-y-1.5 group">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Primary Route (To)</label>
                    <input type="text" value={routeTo} onChange={(e) => setRouteTo(e.target.value)} placeholder="Destination City/Location" className="w-full border-b-2 border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none bg-transparent text-sm placeholder:italic" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-6">
                {/* Frequency */}
                <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-black tracking-widest block pl-1">Travel Frequency</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Daily', 'Weekly', 'One-Time'].map((freq) => (
                            <label key={freq} className="cursor-pointer">
                                <input type="radio" name="frequency" value={freq} onChange={() => setTravelFrequency(freq)} className="peer hidden" required />
                                <div className="border border-gray-200 text-center py-2 text-xs font-normal text-gray-500 peer-checked:border-black peer-checked:bg-black peer-checked:text-white transition-all hover:bg-gray-50">
                                    {freq}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Time */}
                <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-black tracking-widest block pl-1">Preferred Time</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Morning', 'Afternoon', 'Evening'].map((time) => (
                            <label key={time} className="cursor-pointer">
                                <input type="radio" name="time" value={time} onChange={() => setTravelTime(time)} className="peer hidden" required />
                                <div className="border border-gray-200 text-center py-2 text-xs font-normal text-gray-500 peer-checked:border-black peer-checked:bg-black peer-checked:text-white transition-all hover:bg-gray-50">
                                    {time}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
          </section>

          {/* SECTION: PAYMENT DETAILS */}
          <section className="bg-white p-8 md:p-10 border border-gray-200 rounded-none shadow-[2px_2px_15px_rgba(0,0,0,0.01)] space-y-8">
            <div className="border-b border-gray-50 pb-4">
                <h2 className="text-sm uppercase font-bold tracking-widest text-black flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Details <span className="text-[10px] font-normal text-gray-400 capitalize tracking-normal italic ml-2">(For Earnings)</span>
                </h2>
            </div>
            
            <div className="space-y-1.5 md:w-1/2">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">UPI ID</label>
                <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@bank" className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-sm" required />
            </div>

            <div className="pt-4 space-y-4">
                <label className="text-[10px] uppercase font-bold text-gray-900 tracking-widest block pl-1 bg-gray-50 py-2 px-3 border-l-2 border-gray-300">Bank Account <span className="text-gray-400">(Optional for later)</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-1 md:pl-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Account Number</label>
                        <input type="text" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} placeholder="00000000000" className="w-full border border-gray-200 p-3 focus:border-black outline-none transition-all rounded-none text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">IFSC Code</label>
                        <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="BANK0000000" className="w-full border border-gray-200 p-3 focus:border-black outline-none transition-all rounded-none text-sm uppercase" />
                    </div>
                </div>
            </div>
          </section>

          {/* SECTION: ACCOUNT SETUP */}
          <section className="bg-white p-8 md:p-10 border border-gray-200 rounded-none shadow-sm space-y-8">
            <div className="border-b border-gray-50 pb-4">
                <h2 className="text-sm uppercase font-bold tracking-widest text-black flex items-center gap-2">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Setup
                </h2>
            </div>
            
            <div className="space-y-1.5 md:w-1/2">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Username <span className="text-gray-400 italic normal-case tracking-normal">(Optional)</span></label>
                <div className="flex bg-[#fafafa]">
                    <span className="px-3 border border-r-0 border-gray-200 flex items-center text-sm text-gray-400">@</span>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="unique_handle" className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-sm bg-white" />
                </div>
            </div>

            <div className="pt-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded-none border-gray-300 text-black focus:ring-black cursor-pointer" required />
                    <span className="text-sm text-gray-600 font-normal leading-relaxed group-hover:text-black transition-colors">
                        I hereby declare that all the information provided above is true to the best of my knowledge. I accept the <a href="#" className="font-bold underline decoration-2 decoration-black/20 hover:decoration-black">Terms & Conditions</a> and <a href="#" className="font-bold underline decoration-2 decoration-black/20 hover:decoration-black">Privacy Policy</a> of the Picsidrop network.
                    </span>
                </label>
            </div>
          </section>

          {/* Submission */}
          <div className="pt-6">
            <button 
                type="submit" 
                disabled={isLoading || !email}
                className="w-full md:w-auto px-12 py-5 bg-black text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Processing Verification...' : 'Submit Profile & Continue'}
            </button>
          </div>

        </form>
      </div>
  );
}

export default function PartnerKYCOnboarding() {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfc] font-sans text-black selection:bg-black/5 py-12 px-6">
        <Suspense fallback={<div className="flex justify-center mt-20"><div className="w-8 h-8 bg-black animate-spin"></div></div>}>
            <KYCFormContent />
        </Suspense>
    </div>
  )
}
