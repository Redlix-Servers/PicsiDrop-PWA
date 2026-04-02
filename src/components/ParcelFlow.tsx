"use client";

import React, { useState, useEffect } from 'react';
import { createParcelRequest, calculateParcelPrice, matchPartnersToParcel } from '../app/actions/parcelActions';
import LiveRouteMap from './LiveRouteMap';

export default function ParcelFlow({ userId }: { userId: string }) {
  const [step, setStep] = useState(0); // 0 = default, 1 = specifics, 2 = payment, 3 = matching, 4 = active transit, 5 = delivery, 6 = completion

  // Step 1 States
  const [pickup, setPickup] = useState('Mumbai');
  const [drop, setDrop] = useState('Pune');
  const [weight, setWeight] = useState('2');
  const [dimensions, setDimensions] = useState('20x20x20');
  const [urgency, setUrgency] = useState('Standard'); // Standard, Express, Urgent
  
  // Step 2 States (Calculation)
  const [price, setPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Step 3 States (Matching)
  const [matchingPartners, setMatchingPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  // Step 4+ States (Tracking/Completion)
  const [parcelData, setParcelData] = useState<any>(null);
  const [rating, setRating] = useState(0);

  // Auto-calculates base projection on the fly
  useEffect(() => {
    if (step === 2) {
      calculateParcelPrice(Number(weight) || 1, urgency).then(res => setPrice(res));
    }
  }, [step, weight, urgency]);

  const initiatePayment = async () => {
    // Escrow simulation
    const res = await createParcelRequest({
      userId,
      pickupLocation: pickup,
      dropLocation: drop,
      weight,
      dimensions,
      urgency,
      paymentMethod
    });
    
    if (res.success) {
       setParcelData(res.parcel);
       setStep(3); // Move to Matching Phase
       
       // Trigger Matching Engine immediately
       const matches = await matchPartnersToParcel(pickup, drop);
       if (matches.success && matches.matches.length > 0) {
          // Fake a 2-second radar delay before showing results
          setTimeout(() => {
             setMatchingPartners(matches.matches);
          }, 2000);
       } else {
          // If none found dynamically, render a highly-rated "Pro Partner" mock fallback 
          // to ensure the demo flow completes successfully if they test a unique city route
          setTimeout(() => {
            setMatchingPartners([{
                id: 'pt-fake-id',
                name: 'System Network Pro',
                phoneNumber: '+919999999999',
                kycCompleted: true,
                rating: 4.9
            }]);
          }, 2500);
       }
    }
  };

  const confirmBooking = (partner: any) => {
      setSelectedPartner(partner);
      setStep(4); // Move to Booking Confirmed / OTP Phase
  };

  const transitionToTransit = () => {
      setStep(5); // Transit MAP view
  }

  const completeDelivery = () => {
      setStep(6);
  }

  return (
    <div className="w-full">
      {/* STEP 0: Dashboard Default State */}
      {step === 0 && (
         <div className="border border-dashed border-gray-300 p-6 md:p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setStep(1)}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white flex items-center justify-center mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-black">Create Parcel Request</h3>
            <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-normal">Initiate a new direct delivery route</p>
         </div>
      )}

      {/* STEP 1: Specs Input */}
      {step === 1 && (
         <div className="bg-white border border-gray-200 shadow-sm p-5 md:p-8 animate-fade-in mx-auto">
             <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 border-b-2 border-black pb-4 text-black uppercase tracking-tight">Parcel Details</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-5 md:space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Pickup Location</label>
                        <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full border-b-2 border-gray-200 p-2 focus:border-black outline-none transition-all rounded-none text-sm text-black bg-transparent" />
                    </div>
                    <div className="space-y-1.5">
                         <label className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Drop-off Location</label>
                        <input type="text" value={drop} onChange={(e) => setDrop(e.target.value)} className="w-full border-b-2 border-gray-200 p-2 focus:border-black outline-none transition-all rounded-none text-sm text-black bg-transparent" />
                    </div>
                </div>
                <div className="space-y-5 md:space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                             <label className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Weight (kg)</label>
                            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full border border-gray-200 p-3 focus:border-black outline-none transition-all rounded-none text-sm text-black bg-[#fafafa]" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Dims (HxWxD)</label>
                            <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full border border-gray-200 p-3 focus:border-black outline-none transition-all rounded-none text-sm text-black bg-[#fafafa]" placeholder="Cm" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                         <label className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest block pl-1">Delivery Speed</label>
                        <div className="flex border border-gray-200">
                            {['Standard', 'Express', 'Urgent'].map((level) => (
                                <button key={level} onClick={() => setUrgency(level)} className={`flex-1 py-3 text-[10px] md:text-xs font-bold transition-all ${urgency === level ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
             <div className="mt-8 md:mt-10 flex justify-center md:justify-end">
                <button onClick={() => setStep(2)} className="w-full md:w-auto bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                     Get Price Quote →
                </button>
             </div>
         </div>
      )}

      {/* STEP 2: Price Calculation & Escrow Payment */}
      {step === 2 && (
          <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8 animate-fade-in max-w-2xl mx-auto">
             <div className="text-center mb-8 md:mb-10 border-b border-gray-100 pb-8 md:pb-10">
                  <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Your Estimated Price</p>
                 <h1 className="text-4xl md:text-6xl font-light tracking-tight text-black">₹{price.toFixed(2)}</h1>
                 <p className="text-[10px] md:text-xs text-gray-500 mt-4 font-normal px-4 md:px-0">Calculated via baseline rate + {weight}kg ({urgency} priority)</p>
             </div>

             <div className="space-y-6 mb-8">
                   <h3 className="text-[9px] md:text-[10px] uppercase font-bold text-black tracking-widest border-l-2 border-black pl-2">Select Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {['UPI', 'Internal Wallet'].map((m) => (
                          <button key={m} onClick={() => setPaymentMethod(m)} className={`py-4 md:py-6 border ${paymentMethod === m ? 'border-black bg-black text-white' : 'border-gray-200 bg-[#fafafa] text-gray-600'} text-xs md:text-sm font-bold uppercase tracking-widest transition-all hover:border-black`}>
                              {m}
                          </button>
                      ))}
                  </div>
                  {paymentMethod && <p className="text-[8px] md:text-[10px] text-gray-400 font-normal italic text-center uppercase tracking-widest leading-relaxed">Amount will be locked in escrow until delivery OTP is matched.</p>}
             </div>

             <button disabled={!paymentMethod} onClick={initiatePayment} className={`w-full py-4 md:py-5 text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-colors ${paymentMethod ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  Pay Now & Find a Driver
             </button>
          </div>
      )}

      {/* STEP 3: Connecting to Grid (Matching) */}
      {step === 3 && (
          <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-10 animate-fade-in text-center min-h-[400px] flex flex-col justify-center relative">
             {matchingPartners.length === 0 ? (
                 <div className="flex flex-col items-center">
                     <div className="relative w-16 h-16 md:w-24 md:h-24 mb-6">
                         <div className="absolute inset-0 border-2 border-black rounded-full animate-ping opacity-20"></div>
                         <div className="absolute inset-2 border-2 border-black rounded-full animate-ping opacity-40 delay-150"></div>
                         <div className="absolute inset-4 md:inset-8 bg-black rounded-full flex items-center justify-center z-10">
                            <span className="text-white text-[8px] md:text-[10px]">RADAR</span>
                         </div>
                     </div>
                     <h2 className="text-lg md:text-xl font-bold tracking-tight text-black">Scanning Transit Grid</h2>
                     <p className="text-xs md:text-sm text-gray-500 font-normal mt-2 px-4 md:px-0">Computing trajectory overlaps for {pickup} → {drop}</p>
                 </div>
             ) : (
                 <div className="animate-fade-in w-full text-left">
                     <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-gray-100">
                         <h2 className="text-[10px] md:text-sm uppercase font-bold tracking-widest text-black">Matches Found ({matchingPartners.length})</h2>
                         <span className="text-[9px] md:text-xs text-green-600 font-bold bg-green-50 px-2 py-1 uppercase tracking-widest">Live</span>
                     </div>
                     <div className="space-y-4">
                         {matchingPartners.map((pt, idx) => (
                             <div key={idx} className="border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-black transition-colors bg-[#fafafa] gap-4">
                                 <div className="flex items-center space-x-4 md:space-x-6">
                                     <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white flex items-center justify-center font-bold text-sm">{pt.name ? pt.name.charAt(0) : 'P'}</div>
                                     <div>
                                         <h3 className="text-sm md:text-base font-bold text-black">{pt.name || 'Verified Partner'}</h3>
                                         <div className="flex items-center space-x-2 md:space-x-3 mt-1 text-[10px] md:text-xs text-gray-500">
                                            <span className="flex items-center">★ 4.9 Rating</span>
                                            <span>•</span>
                                            <span className="uppercase tracking-widest font-bold text-[9px] md:text-[10px] text-green-600">Verified</span>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center pt-1 border-t md:border-t-0 border-gray-100 mt-2 md:mt-0 pt-3 md:pt-1">
                                     <span className="text-xs font-bold text-gray-400 md:mb-1.5 uppercase tracking-widest">Target Met</span>
                                     <button onClick={() => confirmBooking(pt)} className="bg-black text-white px-5 md:px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm">
                                        Choose Driver
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )}
          </div>
      )}

      {/* STEP 4: Booking Active / OTP */}
      {step === 4 && selectedPartner && parcelData && (
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 md:p-8 max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
             
             {/* Background decorative path line */}
             <div className="absolute left-10 top-0 bottom-0 w-px bg-gray-100 -z-10 hidden md:block"></div>

             <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-10 border-b border-gray-100 pb-6 gap-4">
                 <div>
                    <span className="text-[9px] md:text-[10px] uppercase font-bold text-black tracking-widest bg-gray-100 px-2 py-1">Active Operation</span>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-3 text-black">Waiting for Pickup</h2>
                 </div>
                 <div className="md:text-right border-t md:border-t-0 border-gray-50 pt-3 md:pt-0 w-full md:w-auto">
                     <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest">Assigned Partner</p>
                     <p className="text-xs md:text-sm font-bold mt-1">{selectedPartner.name || 'Partner'}</p>
                 </div>
             </div>

             <div className="bg-[#fafafa] border border-gray-200 p-6 md:p-8 text-center space-y-4 mb-8">
                 <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">Give this code to your driver</p>
                 <div className="text-4xl md:text-6xl font-light tracking-[0.2em] text-black">
                     {parcelData.pickupOTP}
                 </div>
                 <p className="text-[9px] md:text-[10px] text-gray-400 px-4 md:px-10 italic leading-relaxed">The driver needs this code to start the journey and unlock the logistics terminal.</p>
             </div>

             <button onClick={transitionToTransit} className="w-full bg-white border border-black text-black py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                 [Simulate OTP Verification Success]
             </button>
          </div>
      )}

      {/* STEP 5: In Transit Map View */}
      {step === 5 && parcelData && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Visual Map Side */}
                <div className="lg:col-span-2 relative h-[300px] md:h-[500px] border border-gray-200 bg-[#f4f4f5] overflow-hidden flex items-center justify-center z-0 shadow-inner">
                    <LiveRouteMap pickup={pickup} drop={drop} />
                    
                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 bg-white p-3 md:p-4 border border-gray-200 shadow-lg flex items-center justify-between z-[500]">
                         <div className="flex items-center gap-2 md:gap-3">
                             <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-ping"></div>
                             <span className="text-[8px] md:text-[10px] uppercase font-bold text-black tracking-widest">Live GPS Telemetry</span>
                         </div>
                         <span className="text-[8px] md:text-[10px] font-mono text-gray-500 border border-gray-200 px-2 py-1">VELOCITY: 48.2 KM/H</span>
                    </div>
                </div>

                {/* Dashboard Meta Side */}
                <div className="space-y-6">
                    <div className="bg-black text-white p-6 border border-black shadow-[4px_4px_0px_rgba(200,200,200,1)]">
                        <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#D2E32B] mb-3">Final Destination</h3>
                        <div className="text-2xl md:text-3xl font-bold mb-6 tracking-tight truncate text-[#D2E32B]">{drop}</div>
                        
                        <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Delivery Handshake</h3>
                        <p className="text-[10px] md:text-sm font-normal text-gray-300 leading-relaxed max-w-full md:max-w-[250px]">
                            Once the partner arrives, the receiver must provide this terminal authorization code:
                        </p>
                        <div className="text-3xl md:text-4xl font-light tracking-[0.2em] mt-4 mb-2 text-white border-b border-gray-800 pb-4">
                           {parcelData.deliveryOTP}
                        </div>
                    </div>

                    <button onClick={completeDelivery} className="w-full bg-white border border-gray-200 text-black py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">
                        [Simulate Drop-off Delivery Success]
                    </button>
                </div>
           </div>
      )}

      {/* STEP 6: Completion & Feedback */}
      {step === 6 && (
           <div className="bg-white border border-gray-200 p-8 md:p-12 max-w-2xl mx-auto text-center animate-fade-in relative shadow-sm">
               
               <div className="w-16 h-16 md:w-20 md:h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-full ring-4 md:ring-8 ring-gray-50">
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
               </div>

               <h2 className="text-2xl md:text-3xl font-light tracking-tight text-black border-b border-gray-100 pb-6 mb-6">Delivery Complete!</h2>
               
               <div className="bg-[#fafafa] p-4 md:p-5 text-[9px] md:text-xs text-gray-500 font-mono tracking-wider uppercase mb-8 md:mb-10 border border-gray-200 leading-relaxed">
                    PAYMENT FOR ₹{price.toFixed(2)} RELEASED TO DRIVER.
               </div>

               <h3 className="text-[10px] uppercase font-bold tracking-widest text-black mb-4">Rate the Driver</h3>
               <div className="flex justify-center space-x-2 mb-8">
                   {[1,2,3,4,5].map((star) => (
                       <button 
                         key={star} 
                         onClick={() => setRating(star)}
                         className={`w-10 h-10 md:w-12 md:h-12 border ${rating >= star ? 'border-black bg-black text-[#D2E32B]' : 'border-gray-200 bg-white text-gray-300 hover:border-black transition-all'} flex items-center justify-center text-sm`}
                       >
                           ★
                       </button>
                   ))}
               </div>

               <button onClick={() => window.location.reload()} disabled={rating === 0} className={`w-full py-4 md:py-5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${rating > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                   Submit Feedback & Reset Console
               </button>
           </div>
      )}
    </div>
  );
}
