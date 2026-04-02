"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { handleSignIn, handleSignUp } from '../actions/authActions';

const allCountries = [
  { name: 'Afghanistan', code: '+93', flag: 'https://flagcdn.com/af.svg' },
  { name: 'Albania', code: '+355', flag: 'https://flagcdn.com/al.svg' },
  { name: 'Algeria', code: '+213', flag: 'https://flagcdn.com/dz.svg' },
  { name: 'Andorra', code: '+376', flag: 'https://flagcdn.com/ad.svg' },
  { name: 'Angola', code: '+244', flag: 'https://flagcdn.com/ao.svg' },
  { name: 'Argentina', code: '+54', flag: 'https://flagcdn.com/ar.svg' },
  { name: 'Armenia', code: '+374', flag: 'https://flagcdn.com/am.svg' },
  { name: 'Australia', code: '+61', flag: 'https://flagcdn.com/au.svg' },
  { name: 'Austria', code: '+43', flag: 'https://flagcdn.com/at.svg' },
  { name: 'Azerbaijan', code: '+994', flag: 'https://flagcdn.com/az.svg' },
  { name: 'Bahamas', code: '+1-242', flag: 'https://flagcdn.com/bs.svg' },
  { name: 'Bahrain', code: '+973', flag: 'https://flagcdn.com/bh.svg' },
  { name: 'Bangladesh', code: '+880', flag: 'https://flagcdn.com/bd.svg' },
  { name: 'Barbados', code: '+1-246', flag: 'https://flagcdn.com/bb.svg' },
  { name: 'Belarus', code: '+375', flag: 'https://flagcdn.com/by.svg' },
  { name: 'Belgium', code: '+32', flag: 'https://flagcdn.com/be.svg' },
  { name: 'Belize', code: '+501', flag: 'https://flagcdn.com/bz.svg' },
  { name: 'Benin', code: '+229', flag: 'https://flagcdn.com/bj.svg' },
  { name: 'Bhutan', code: '+975', flag: 'https://flagcdn.com/bt.svg' },
  { name: 'Bolivia', code: '+591', flag: 'https://flagcdn.com/bo.svg' },
  { name: 'Bosnia and Herzegovina', code: '+387', flag: 'https://flagcdn.com/ba.svg' },
  { name: 'Botswana', code: '+267', flag: 'https://flagcdn.com/bw.svg' },
  { name: 'Brazil', code: '+55', flag: 'https://flagcdn.com/br.svg' },
  { name: 'Brunei', code: '+673', flag: 'https://flagcdn.com/bn.svg' },
  { name: 'Bulgaria', code: '+359', flag: 'https://flagcdn.com/bg.svg' },
  { name: 'Burkina Faso', code: '+226', flag: 'https://flagcdn.com/bf.svg' },
  { name: 'Burundi', code: '+257', flag: 'https://flagcdn.com/bi.svg' },
  { name: 'Cambodia', code: '+855', flag: 'https://flagcdn.com/kh.svg' },
  { name: 'Cameroon', code: '+237', flag: 'https://flagcdn.com/cm.svg' },
  { name: 'Canada', code: '+1', flag: 'https://flagcdn.com/ca.svg' },
  { name: 'Cape Verde', code: '+238', flag: 'https://flagcdn.com/cv.svg' },
  { name: 'Central African Republic', code: '+236', flag: 'https://flagcdn.com/cf.svg' },
  { name: 'Chad', code: '+235', flag: 'https://flagcdn.com/td.svg' },
  { name: 'Chile', code: '+56', flag: 'https://flagcdn.com/cl.svg' },
  { name: 'China', code: '+86', flag: 'https://flagcdn.com/cn.svg' },
  { name: 'Colombia', code: '+57', flag: 'https://flagcdn.com/co.svg' },
  { name: 'Comoros', code: '+269', flag: 'https://flagcdn.com/km.svg' },
  { name: 'Congo', code: '+242', flag: 'https://flagcdn.com/cg.svg' },
  { name: 'Costa Rica', code: '+506', flag: 'https://flagcdn.com/cr.svg' },
  { name: 'Croatia', code: '+385', flag: 'https://flagcdn.com/hr.svg' },
  { name: 'Cuba', code: '+53', flag: 'https://flagcdn.com/cu.svg' },
  { name: 'Cyprus', code: '+357', flag: 'https://flagcdn.com/cy.svg' },
  { name: 'Czech Republic', code: '+420', flag: 'https://flagcdn.com/cz.svg' },
  { name: 'Denmark', code: '+45', flag: 'https://flagcdn.com/dk.svg' },
  { name: 'Djibouti', code: '+253', flag: 'https://flagcdn.com/dj.svg' },
  { name: 'Dominica', code: '+1-767', flag: 'https://flagcdn.com/dm.svg' },
  { name: 'Dominican Republic', code: '+1-809', flag: 'https://flagcdn.com/do.svg' },
  { name: 'Ecuador', code: '+593', flag: 'https://flagcdn.com/ec.svg' },
  { name: 'Egypt', code: '+20', flag: 'https://flagcdn.com/eg.svg' },
  { name: 'El Salvador', code: '+503', flag: 'https://flagcdn.com/sv.svg' },
  { name: 'Equatorial Guinea', code: '+240', flag: 'https://flagcdn.com/gq.svg' },
  { name: 'Eritrea', code: '+291', flag: 'https://flagcdn.com/er.svg' },
  { name: 'Estonia', code: '+372', flag: 'https://flagcdn.com/ee.svg' },
  { name: 'Ethiopia', code: '+251', flag: 'https://flagcdn.com/et.svg' },
  { name: 'Fiji', code: '+679', flag: 'https://flagcdn.com/fj.svg' },
  { name: 'Finland', code: '+358', flag: 'https://flagcdn.com/fi.svg' },
  { name: 'France', code: '+33', flag: 'https://flagcdn.com/fr.svg' },
  { name: 'Gabon', code: '+241', flag: 'https://flagcdn.com/ga.svg' },
  { name: 'Gambia', code: '+220', flag: 'https://flagcdn.com/gm.svg' },
  { name: 'Georgia', code: '+995', flag: 'https://flagcdn.com/ge.svg' },
  { name: 'Germany', code: '+49', flag: 'https://flagcdn.com/de.svg' },
  { name: 'Ghana', code: '+233', flag: 'https://flagcdn.com/gh.svg' },
  { name: 'Greece', code: '+30', flag: 'https://flagcdn.com/gr.svg' },
  { name: 'Grenada', code: '+1-473', flag: 'https://flagcdn.com/gd.svg' },
  { name: 'Guatemala', code: '+502', flag: 'https://flagcdn.com/gt.svg' },
  { name: 'Guinea', code: '+224', flag: 'https://flagcdn.com/gn.svg' },
  { name: 'Guinea-Bissau', code: '+245', flag: 'https://flagcdn.com/gw.svg' },
  { name: 'Guyana', code: '+592', flag: 'https://flagcdn.com/gy.svg' },
  { name: 'Haiti', code: '+509', flag: 'https://flagcdn.com/ht.svg' },
  { name: 'Honduras', code: '+504', flag: 'https://flagcdn.com/hn.svg' },
  { name: 'Hungary', code: '+36', flag: 'https://flagcdn.com/hu.svg' },
  { name: 'Iceland', code: '+354', flag: 'https://flagcdn.com/is.svg' },
  { name: 'India', code: '+91', flag: 'https://flagcdn.com/in.svg' },
  { name: 'Indonesia', code: '+62', flag: 'https://flagcdn.com/id.svg' },
  { name: 'Iran', code: '+98', flag: 'https://flagcdn.com/ir.svg' },
  { name: 'Iraq', code: '+964', flag: 'https://flagcdn.com/iq.svg' },
  { name: 'Ireland', code: '+353', flag: 'https://flagcdn.com/ie.svg' },
  { name: 'Israel', code: '+972', flag: 'https://flagcdn.com/il.svg' },
  { name: 'Italy', code: '+39', flag: 'https://flagcdn.com/it.svg' },
  { name: 'Jamaica', code: '+1-876', flag: 'https://flagcdn.com/jm.svg' },
  { name: 'Japan', code: '+81', flag: 'https://flagcdn.com/jp.svg' },
  { name: 'Jordan', code: '+962', flag: 'https://flagcdn.com/jo.svg' },
  { name: 'Kazakhstan', code: '+7', flag: 'https://flagcdn.com/kz.svg' },
  { name: 'Kenya', code: '+254', flag: 'https://flagcdn.com/ke.svg' },
  { name: 'Kiribati', code: '+686', flag: 'https://flagcdn.com/ki.svg' },
  { name: 'Korea (North)', code: '+850', flag: 'https://flagcdn.com/kp.svg' },
  { name: 'Korea (South)', code: '+82', flag: 'https://flagcdn.com/kr.svg' },
  { name: 'Kuwait', code: '+965', flag: 'https://flagcdn.com/kw.svg' },
  { name: 'Kyrgyzstan', code: '+996', flag: 'https://flagcdn.com/kg.svg' },
  { name: 'Laos', code: '+856', flag: 'https://flagcdn.com/la.svg' },
  { name: 'Latvia', code: '+371', flag: 'https://flagcdn.com/lv.svg' },
  { name: 'Lebanon', code: '+961', flag: 'https://flagcdn.com/lb.svg' },
  { name: 'Lesotho', code: '+266', flag: 'https://flagcdn.com/ls.svg' },
  { name: 'Liberia', code: '+231', flag: 'https://flagcdn.com/lr.svg' },
  { name: 'Libya', code: '+218', flag: 'https://flagcdn.com/ly.svg' },
  { name: 'Liechtenstein', code: '+423', flag: 'https://flagcdn.com/li.svg' },
  { name: 'Lithuania', code: '+370', flag: 'https://flagcdn.com/lt.svg' },
  { name: 'Luxembourg', code: '+352', flag: 'https://flagcdn.com/lu.svg' },
  { name: 'Macedonia', code: '+389', flag: 'https://flagcdn.com/mk.svg' },
  { name: 'Madagascar', code: '+261', flag: 'https://flagcdn.com/mg.svg' },
  { name: 'Malawi', code: '+265', flag: 'https://flagcdn.com/mw.svg' },
  { name: 'Malaysia', code: '+60', flag: 'https://flagcdn.com/my.svg' },
  { name: 'Maldives', code: '+960', flag: 'https://flagcdn.com/mv.svg' },
  { name: 'Mali', code: '+223', flag: 'https://flagcdn.com/ml.svg' },
  { name: 'Malta', code: '+356', flag: 'https://flagcdn.com/mt.svg' },
  { name: 'Marshall Islands', code: '+692', flag: 'https://flagcdn.com/mh.svg' },
  { name: 'Mauritania', code: '+222', flag: 'https://flagcdn.com/mr.svg' },
  { name: 'Mauritius', code: '+230', flag: 'https://flagcdn.com/mu.svg' },
  { name: 'Mexico', code: '+52', flag: 'https://flagcdn.com/mx.svg' },
  { name: 'Micronesia', code: '+691', flag: 'https://flagcdn.com/fm.svg' },
  { name: 'Moldova', code: '+373', flag: 'https://flagcdn.com/md.svg' },
  { name: 'Monaco', code: '+377', flag: 'https://flagcdn.com/mc.svg' },
  { name: 'Mongolia', code: '+976', flag: 'https://flagcdn.com/mn.svg' },
  { name: 'Montenegro', code: '+382', flag: 'https://flagcdn.com/me.svg' },
  { name: 'Morocco', code: '+212', flag: 'https://flagcdn.com/ma.svg' },
  { name: 'Mozambique', code: '+258', flag: 'https://flagcdn.com/mz.svg' },
  { name: 'Myanmar', code: '+95', flag: 'https://flagcdn.com/mm.svg' },
  { name: 'Namibia', code: '+264', flag: 'https://flagcdn.com/na.svg' },
  { name: 'Nauru', code: '+674', flag: 'https://flagcdn.com/nr.svg' },
  { name: 'Nepal', code: '+977', flag: 'https://flagcdn.com/np.svg' },
  { name: 'Netherlands', code: '+31', flag: 'https://flagcdn.com/nl.svg' },
  { name: 'New Zealand', code: '+64', flag: 'https://flagcdn.com/nz.svg' },
  { name: 'Nicaragua', code: '+505', flag: 'https://flagcdn.com/ni.svg' },
  { name: 'Niger', code: '+227', flag: 'https://flagcdn.com/ne.svg' },
  { name: 'Nigeria', code: '+234', flag: 'https://flagcdn.com/ng.svg' },
  { name: 'Norway', code: '+47', flag: 'https://flagcdn.com/no.svg' },
  { name: 'Oman', code: '+968', flag: 'https://flagcdn.com/om.svg' },
  { name: 'Pakistan', code: '+92', flag: 'https://flagcdn.com/pk.svg' },
  { name: 'Palau', code: '+680', flag: 'https://flagcdn.com/pw.svg' },
  { name: 'Panama', code: '+507', flag: 'https://flagcdn.com/pa.svg' },
  { name: 'Papua New Guinea', code: '+675', flag: 'https://flagcdn.com/pg.svg' },
  { name: 'Paraguay', code: '+595', flag: 'https://flagcdn.com/py.svg' },
  { name: 'Peru', code: '+51', flag: 'https://flagcdn.com/pe.svg' },
  { name: 'Philippines', code: '+63', flag: 'https://flagcdn.com/ph.svg' },
  { name: 'Poland', code: '+48', flag: 'https://flagcdn.com/pl.svg' },
  { name: 'Portugal', code: '+351', flag: 'https://flagcdn.com/pt.svg' },
  { name: 'Qatar', code: '+974', flag: 'https://flagcdn.com/qa.svg' },
  { name: 'Romania', code: '+40', flag: 'https://flagcdn.com/ro.svg' },
  { name: 'Russia', code: '+7', flag: 'https://flagcdn.com/ru.svg' },
  { name: 'Rwanda', code: '+250', flag: 'https://flagcdn.com/rw.svg' },
  { name: 'Saint Kitts and Nevis', code: '+1-869', flag: 'https://flagcdn.com/kn.svg' },
  { name: 'Saint Lucia', code: '+1-758', flag: 'https://flagcdn.com/lc.svg' },
  { name: 'Samoa', code: '+685', flag: 'https://flagcdn.com/ws.svg' },
  { name: 'San Marino', code: '+378', flag: 'https://flagcdn.com/sm.svg' },
  { name: 'Saudi Arabia', code: '+966', flag: 'https://flagcdn.com/sa.svg' },
  { name: 'Senegal', code: '+221', flag: 'https://flagcdn.com/sn.svg' },
  { name: 'Serbia', code: '+381', flag: 'https://flagcdn.com/rs.svg' },
  { name: 'Seychelles', code: '+248', flag: 'https://flagcdn.com/sc.svg' },
  { name: 'Sierra Leone', code: '+232', flag: 'https://flagcdn.com/sl.svg' },
  { name: 'Singapore', code: '+65', flag: 'https://flagcdn.com/sg.svg' },
  { name: 'Slovakia', code: '+421', flag: 'https://flagcdn.com/sk.svg' },
  { name: 'Slovenia', code: '+386', flag: 'https://flagcdn.com/si.svg' },
  { name: 'Solomon Islands', code: '+677', flag: 'https://flagcdn.com/sb.svg' },
  { name: 'Somalia', code: '+252', flag: 'https://flagcdn.com/so.svg' },
  { name: 'South Africa', code: '+27', flag: 'https://flagcdn.com/za.svg' },
  { name: 'Spain', code: '+34', flag: 'https://flagcdn.com/es.svg' },
  { name: 'Sri Lanka', code: '+94', flag: 'https://flagcdn.com/lk.svg' },
  { name: 'Sudan', code: '+249', flag: 'https://flagcdn.com/sd.svg' },
  { name: 'Suriname', code: '+597', flag: 'https://flagcdn.com/sr.svg' },
  { name: 'Swaziland', code: '+268', flag: 'https://flagcdn.com/sz.svg' },
  { name: 'Sweden', code: '+46', flag: 'https://flagcdn.com/se.svg' },
  { name: 'Switzerland', code: '+41', flag: 'https://flagcdn.com/ch.svg' },
  { name: 'Syria', code: '+963', flag: 'https://flagcdn.com/sy.svg' },
  { name: 'Taiwan', code: '+886', flag: 'https://flagcdn.com/tw.svg' },
  { name: 'Tajikistan', code: '+992', flag: 'https://flagcdn.com/tj.svg' },
  { name: 'Tanzania', code: '+255', flag: 'https://flagcdn.com/tz.svg' },
  { name: 'Thailand', code: '+66', flag: 'https://flagcdn.com/th.svg' },
  { name: 'Togo', code: '+228', flag: 'https://flagcdn.com/tg.svg' },
  { name: 'Tonga', code: '+676', flag: 'https://flagcdn.com/to.svg' },
  { name: 'Trinidad and Tobago', code: '+1-868', flag: 'https://flagcdn.com/tt.svg' },
  { name: 'Tunisia', code: '+216', flag: 'https://flagcdn.com/tn.svg' },
  { name: 'Turkey', code: '+90', flag: 'https://flagcdn.com/tr.svg' },
  { name: 'Turkmenistan', code: '+993', flag: 'https://flagcdn.com/tm.svg' },
  { name: 'Tuvalu', code: '+688', flag: 'https://flagcdn.com/tv.svg' },
  { name: 'Uganda', code: '+256', flag: 'https://flagcdn.com/ug.svg' },
  { name: 'Ukraine', code: '+380', flag: 'https://flagcdn.com/ua.svg' },
  { name: 'United Arab Emirates', code: '+971', flag: 'https://flagcdn.com/ae.svg' },
  { name: 'United Kingdom', code: '+44', flag: 'https://flagcdn.com/gb.svg' },
  { name: 'United States', code: '+1', flag: 'https://flagcdn.com/us.svg' },
  { name: 'Uruguay', code: '+598', flag: 'https://flagcdn.com/uy.svg' },
  { name: 'Uzbekistan', code: '+998', flag: 'https://flagcdn.com/uz.svg' },
  { name: 'Vanuatu', code: '+678', flag: 'https://flagcdn.com/vu.svg' },
  { name: 'Vatican City', code: '+379', flag: 'https://flagcdn.com/va.svg' },
  { name: 'Venezuela', code: '+58', flag: 'https://flagcdn.com/ve.svg' },
  { name: 'Vietnam', code: '+84', flag: 'https://flagcdn.com/vn.svg' },
  { name: 'Yemen', code: '+967', flag: 'https://flagcdn.com/ye.svg' },
  { name: 'Zambia', code: '+260', flag: 'https://flagcdn.com/zm.svg' },
  { name: 'Zimbabwe', code: '+263', flag: 'https://flagcdn.com/zw.svg' },
];

const LoginPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(allCountries.find(c => c.name === 'India') || allCountries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage(null);

    const formData = {
      name,
      email,
      password,
      phoneNumber: !isSignIn ? `${selectedCountry.code}${phoneNumber}` : undefined,
    };

    const action = isSignIn ? handleSignIn : handleSignUp;
    const result = await action(formData);

    if (result.success) {
      setMessage({ text: isSignIn ? "Signed in successfully! Redirecting..." : "Account created successfully! Redirecting...", type: 'success' });
      
      // Redirect after a short delay to show success
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setMessage({ text: result.error || "An error occurred", type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fcfcfc] font-sans overflow-hidden">
      {/* Left side - Simple Login/Signup Form */}
      <div className="flex w-full items-start justify-center lg:w-[35%] relative pt-12 px-6">
        <div className="relative w-full max-w-[400px] bg-white p-8 border border-gray-100 rounded-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
          
          {/* Logo */}
          <div className="mb-10 flex flex-col items-center">
            <img src="/picsidrop/user.png" alt="PicsiDrop" className="w-12 h-12 rounded-full mb-3" />
            <div className="flex items-center">
              <span className="text-3xl font-light tracking-tight text-black">
                Picsi<span className="font-semibold ml-1">Drop</span>
              </span>
            </div>
          </div>

          {/* Titles */}
          <div className="mb-8 text-center px-2">
            <h1 className="text-2xl font-normal text-black tracking-tight leading-tight">
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="mt-2 text-sm text-gray-600 font-normal border-b border-gray-50 pb-4">
              {isSignIn ? 'Enter your details to send and track packages.' : 'Join us to send packages easily.'}
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 text-xs font-normal text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* Simple Form */}
          <div className="space-y-5 px-1">
            {!isSignIn && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-base font-normal text-black bg-white"
                  placeholder="Your Name"
                />
              </div>
            )}

            {!isSignIn && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Phone Number</label>
                <div className="relative flex border border-gray-200 focus-within:border-black bg-white">
                    {/* Country Picker Toggle */}
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 px-3 border-r border-gray-100 hover:bg-gray-50 transition-colors group h-[52px]"
                    >
                        <img
                        src={selectedCountry.flag}
                        alt={selectedCountry.name}
                        className="h-[12px] w-[18px] object-cover"
                        />
                        <span className="text-gray-900 font-normal text-sm">{selectedCountry.code}</span>
                        <svg className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full p-3.5 outline-none transition-all rounded-none text-base font-normal text-black"
                      placeholder="10-digit number"
                    />

                    {/* Country Dropdown Overlay */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-[280px] bg-white border border-gray-200 shadow-[0_15px_35px_rgba(0,0,0,0.15)] z-[60] rounded-none overflow-hidden">
                            <div className="p-3 border-b border-gray-100 bg-white">
                                <input 
                                    type="text" 
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-100 outline-none text-sm font-normal text-black placeholder:text-gray-400 focus:border-black rounded-none"
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-[250px] overflow-y-auto">
                                {filteredCountries.map((country) => (
                                    <button
                                        key={country.name + country.code}
                                        onClick={() => {
                                            setSelectedCountry(country);
                                            setIsDropdownOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                                    >
                                        <img src={country.flag} alt={country.name} className="h-[10px] w-[14px] object-cover" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-normal text-gray-900 truncate">{country.name}</p>
                                        </div>
                                        <span className="text-[10px] font-light text-gray-500">{country.code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-base font-normal text-black bg-white"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-3.5 focus:border-black outline-none transition-all rounded-none text-base font-normal text-black bg-white"
                placeholder="••••••••"
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 font-medium text-base transition-all rounded-none shadow-sm active:scale-[0.99] mt-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {isLoading ? (message?.type === 'success' ? 'Redirecting...' : 'Processing...') : (isSignIn ? 'Sign In' : 'Sign Up')}
            </button>
            
            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-4 text-gray-300 font-light tracking-widest">or</span></div>
            </div>

            {/* Google Alternative */}
            <button className="w-full flex items-center justify-center space-x-3 py-3.5 border border-gray-200 hover:bg-gray-50 transition-colors rounded-none group">
                <svg className="w-5 h-5 transition-all" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-normal text-black">Continue with Google</span>
            </button>
          </div>

          {/* Form Toggle */}
          <div className="mt-10 text-center">
            <button 
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setMessage(null);
                }}
                className="text-xs font-normal text-gray-500 hover:text-black transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-black"
            >
              {isSignIn ? "New to Picsi Drop? Create an account" : "Back to Sign In"}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for closing dropdown */}
      {isDropdownOpen && (
        <div 
            className="fixed inset-0 z-50 bg-transparent" 
            onClick={() => {
                setIsDropdownOpen(false);
                setSearchQuery('');
            }}
        />
      )}

      {/* Right side - Dynamic Background */}
      <div className="relative hidden w-[65%] lg:block overflow-hidden transition-all duration-1000 ease-in-out">
        <Image
          src={isSignIn ? "/ola_login_bg.png" : "https://img.freepik.com/premium-photo/phone-call-pointing-business-black-woman-taxi-transport-ride-share-her-work-commute-mobile-communication-direction-with-young-employee-cab-backseat-as-travel-passenger_590464-231556.jpg?semt=ais_incoming&w=740&q=80"}
          alt={isSignIn ? "Signing in background" : "Creating account background"}
          fill
          className="object-cover transition-opacity duration-1000 ease-in-out"
          priority
        />
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="absolute inset-0 flex flex-col justify-end px-24 pb-24 text-white">
          <div className="max-w-2xl">
            <h2 className="text-[44px] font-extralight text-white leading-[1.1] tracking-tight mb-8">
                {isSignIn 
                    ? "Welcome back. Send packages anywhere."
                    : "Send packages across the city in minutes."}
            </h2>
            <div className="h-0.5 w-24 bg-[#D2E32B] mb-8"></div>
            <p className="text-xl font-light text-white/90 uppercase tracking-[0.25em] text-[13px] font-medium">
              #PicsiDrop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
