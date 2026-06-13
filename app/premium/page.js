'use client';

import { useState, useEffect } from 'react';

export default function PremiumPage() {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    email: ''
  });
  
  const [isPremium, setIsPremium] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const premiumStatus = localStorage.getItem('isPremiumUser') === 'true';
    setIsPremium(premiumStatus);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.cardNumber.length < 16) {
      setError('Card number must be at least 16 digits.');
      return;
    }

    setError('');
    localStorage.setItem('isPremiumUser', 'true');
    setIsPremium(true);
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleCancelPremium = () => {
    localStorage.removeItem('isPremiumUser');
    setIsPremium(false);
    window.dispatchEvent(new Event('storage'));
  };

  if (!isMounted) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Premium Membership</h1>
      
      {isPremium ? (
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 font-semibold text-lg mb-4">
            ✅ Payment complete, ads removed!
          </p>
          <p className="text-sm text-gray-600 mb-4">Thank you for supporting us. Enjoy your ad-free experience!</p>
          <button 
            onClick={handleCancelPremium}
            className="text-sm text-red-600 hover:underline"
          >
            Cancel Premium / Restore Ads
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              required
              maxLength="19"
              value={formData.cardNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="1234 5678 1234 5678"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                name="expiry"
                required
                placeholder="MM/YY"
                maxLength="5"
                value={formData.expiry}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CVC</label>
              <input
                type="text"
                name="cvc"
                required
                maxLength="4"
                placeholder="123"
                value={formData.cvc}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200"
          >
            Pay Now & Remove Ads
          </button>
        </form>
      )}
    </div>
  );
}