import React from 'react';
import { Link } from 'react-router-dom';
import './Premium.css'
import Sidebar from '../components/Sidebar';

const Premium = () => {
  return (
    <>
    <Sidebar/>
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-black" style={{marginLeft:'350px'}}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-black-300">
            Unlock exclusive features and take your finance tracking to the next level.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Free Plan</h2>
            <p className="text-black-300 mb-6">Perfect for getting started.</p>
            <ul className="mb-6">
              <li className="mb-2">✔️ Basic financial tracking</li>
              <li className="mb-2">✔️ Limited transactions</li>
              <li className="mb-2">❌ Advanced analytics</li>
              <li className="mb-2">❌ Priority support</li>
            </ul>
            <p className="text-4xl font-bold mb-6">$0<span className="text-lg">/month</span></p>
            <button
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300"
              disabled
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white bg-opacity-20 rounded-lg p-8 shadow-lg transform scale-105 relative">
            <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-2 rounded-bl-lg">
              Most Popular
            </div>
            <h2 className="text-2xl font-bold mb-4">Premium Plan</h2>
            <p className="text-black-300 mb-6">For power users who want more.</p>
            <ul className="mb-6">
              <li className="mb-2">✔️ Unlimited transactions</li>
              <li className="mb-2">✔️ Advanced financial analytics</li>
              <li className="mb-2">✔️ Priority support</li>
              <li className="mb-2">✔️ Exclusive features</li>
            </ul>
            <p className="text-4xl font-bold mb-6">$10<span className="text-lg">/month</span></p>
            <Link to="/payment">
              <button className="w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition duration-300">
                Upgrade Now
              </button>
            </Link>
          </div>

      
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">What’s included in the Premium Plan?</h3>
              <p className="text-black-300">
                The Premium Plan includes unlimited transactions, advanced analytics, priority
                support, and exclusive features.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Can I cancel anytime?</h3>
              <p className="text-black-300">
                Yes, you can cancel your subscription anytime. No hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Premium;