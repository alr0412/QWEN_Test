import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function AuthModal({ isOpen, onClose, defaultRole = 'customer' }) {
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const handleSendOtp = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authApi.sendOtp(data.phone);
      setPhone(data.phone);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authApi.verifyOtp(phone, data.otp);
      const { token, user } = response.data;
      login(token, user.role, user.phone);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {step === 'phone' ? 'Login / Sign Up' : 'Enter OTP'}
        </h2>
        
        {step === 'phone' && (
          <form onSubmit={handleSubmit(handleSendOtp)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+375 XX XXX XX XX"
                {...register('phone', { 
                  required: 'Phone is required',
                  pattern: {
                    value: /^\+375\d{9}$/,
                    message: 'Enter valid Belarusian phone number'
                  }
                })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">I am a:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="customer"
                    checked={role === 'customer'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  Customer
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="barber"
                    checked={role === 'barber'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  Barber
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleSubmit(handleVerifyOtp)}>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code sent to {phone}
              <br />
              <span className="text-xs">(Demo: use any 6 digits)</span>
            </p>

            <div className="mb-4">
              <input
                type="text"
                placeholder="XXXXXX"
                maxLength={6}
                {...register('otp', { 
                  required: 'OTP is required',
                  minLength: { value: 6, message: 'OTP must be 6 digits' },
                  maxLength: { value: 6, message: 'OTP must be 6 digits' }
                })}
                className="w-full border rounded px-3 py-2 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Change phone number
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
