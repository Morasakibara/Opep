import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const OtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verifying OTP:', otp.join(''));
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
        <div>
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Vérification</h2>
          <p className="mt-2 text-sm text-gray-600">
            Saisissez le code envoyé par SMS au <br />
            <span className="font-bold">+237 6XX XX XX XX</span>
          </p>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleVerify}>
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-opep-blue focus:ring-opep-blue outline-none transition"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-opep-blue hover:bg-blue-800 focus:outline-none transition"
            >
              Vérifier le code
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button type="button" className="text-sm font-medium text-opep-blue hover:text-blue-500">
              Renvoyer le code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
