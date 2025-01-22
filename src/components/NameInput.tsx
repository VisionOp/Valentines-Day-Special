import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, User } from 'lucide-react';

interface NameInputProps {
  onSubmit: (userName: string, partnerName: string) => void;
  onSignOut: () => void;
}

const NameInput: React.FC<NameInputProps> = ({ onSubmit, onSignOut }) => {
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !partnerName.trim()) {
      setError('Please fill in both names');
      return;
    }
    onSubmit(userName.trim(), partnerName.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onSignOut}
          className="absolute top-4 right-4 text-pink-500 hover:text-pink-600 flex items-center gap-1 text-sm font-medium bg-pink-50 px-3 py-1.5 rounded-full shadow-sm"
        >
          <User className="w-4 h-4" />
          <span>Sign Out</span>
        </motion.button>

        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-16 h-16 text-pink-500 mx-auto" />
        </motion.div>

        <h2 className="mt-6 text-3xl font-bold text-gray-800">Let's Get Started</h2>
        <p className="mt-2 text-gray-600">Enter your names to create a special invitation</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Valentine's Name</label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter their name"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg font-medium shadow-lg"
            type="submit"
          >
            Continue
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default NameInput;