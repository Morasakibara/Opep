import React from 'react';

export default function OTPPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Vérification OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nous avons envoyé un code à 6 chiffres à votre numéro.
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="flex justify-between space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-xl font-bold"
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Vérifier le code
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas reçu le code ?{' '}
              <button type="button" className="font-medium text-blue-600 hover:text-blue-500">
                Renvoyer
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
