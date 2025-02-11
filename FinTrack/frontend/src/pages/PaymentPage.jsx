import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
        const response = await fetch("http://localhost:5000/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Order creation failed");
        
        const order = await response.json();

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            order_id: order.id,
            name: "Finance Tracker",
            description: "Premium Plan Subscription",
            handler: async (response) => {
                console.log("✅ Payment successful:", response);

                // 🟢 Send payment details to backend to upgrade user
                await axios.post("http://localhost:5000/api/payment/verify-payment", {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: localStorage.getItem("userId"), // Get user ID from localStorage or context
                });

                alert("Payment successful! You are now a premium user.");
                
                // 🟢 Fetch updated user info
                fetchUserData();
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999",
            },
            theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error("❌ Payment failed:", error);
        alert("Payment failed. Please try again.");
    } finally {
        setLoading(false);
    }
};
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-black flex items-center justify-center">
      <div className="bg-white bg-opacity-10 rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Upgrade to Premium</h1>

        {/* Plan Details */}
        <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Premium Plan</h2>
          <ul className="space-y-2 text-gray-200">
            <li>✔️ Unlimited transactions</li>
            <li>✔️ Advanced financial analytics</li>
            <li>✔️ Priority support</li>
            <li>✔️ Exclusive features</li>
          </ul>
          <p className="text-2xl font-bold mt-4">₹10<span className="text-lg">/month</span></p>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition duration-300 font-semibold flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Pay ₹10.00'
          )}
        </button>

        {/* Footer Note */}
        <p className="text-sm text-black-300 text-center mt-4">
          Your payment is secure and encrypted.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
