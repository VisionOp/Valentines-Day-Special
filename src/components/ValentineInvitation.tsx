import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Music } from 'lucide-react';
import Confetti from 'react-confetti';
import { ref, update } from 'firebase/database';
import { db } from '../firebase';
import { ValentineInvitation as InvitationType } from '../types';

interface Props {
  invitation: InvitationType;
  invitationId: string;
}

const ValentineInvitation: React.FC<Props> = ({ invitation, invitationId }) => {
  const [step, setStep] = useState<'welcome' | 'memory' | 'media' | 'question' | 'preferences' | 'summary'>('welcome');
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [preferences, setPreferences] = useState({
    treat: '' as 'chocolates' | 'flowers',
    date: '' as 'dinner' | 'movie' | 'picnic',
    time: '' as 'lunch' | 'dinner'
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMedia] = useState(Boolean(invitation.songLink));

  useEffect(() => {
    if (yesPressed) {
      setShowConfetti(true);
      setTimeout(() => setStep('preferences'), 2000);
    }
  }, [yesPressed]);

  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current.getBoundingClientRect();
    const x = Math.random() * (container.width - 100);
    const y = Math.random() * (container.height - 40);
    return { x, y };
  };

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    setNoButtonPosition(getRandomPosition());
  };

  const handleYesClick = async () => {
    setYesPressed(true);
    await update(ref(db, `invitations/${invitationId}`), {
      status: 'accepted'
    });
  };

  const handlePreferencesSubmit = async () => {
    await update(ref(db, `invitations/${invitationId}`), {
      preferences
    });
    setStep('summary');
  };

  const handleReject = async () => {
    await update(ref(db, `invitations/${invitationId}`), {
      status: 'rejected'
    });
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold text-gray-800 mb-6"
            >
              Hi {invitation.recipientName}! 💝
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-gray-700 mb-8"
            >
              Someone special has sent you something amazing...
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(invitation.memory ? 'memory' : hasMedia ? 'media' : 'question')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-6 rounded-lg font-medium shadow-lg"
            >
              Continue 💖
            </motion.button>
          </motion.div>
        );

      case 'memory':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Do you remember...
              </h3>
              <p className="text-xl text-gray-700 italic">
                "{invitation.memory}"
              </p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(hasMedia ? 'media' : 'question')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-6 rounded-lg font-medium shadow-lg"
            >
              Continue 💝
            </motion.button>
          </motion.div>
        );

      case 'media':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800">
              {invitation.senderName} dedicated this to you...
            </h3>
            
            {invitation.songLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href={invitation.songLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1DB954] text-white py-2 px-6 rounded-lg font-medium shadow-lg hover:bg-[#1ed760] transition-colors"
                >
                  <Music className="w-5 h-5" />
                  Listen to Our Song
                </a>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={() => setStep('question')}
                className="mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-6 rounded-lg font-medium shadow-lg"
              >
                Continue 💝
              </button>
            </motion.div>
          </motion.div>
        );

      case 'question':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-700 italic mb-8"
            >
              "{invitation.message}"
            </motion.p>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {invitation.recipientName}, will you be {invitation.senderName}'s Valentine?
            </h2>

            <div className="flex justify-center items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: noCount * 20 + 100 }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-6 rounded-lg font-medium shadow-lg"
                onClick={handleYesClick}
              >
                Yes! 💖
              </motion.button>

              <motion.button
                initial={{ x: 0, y: 0 }}
                animate={{
                  x: noButtonPosition.x,
                  y: noButtonPosition.y,
                  scale: Math.max(0.8 - noCount * 0.1, 0.4)
                }}
                whileHover={{ scale: 0.95 }}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg font-medium"
                onClick={handleNoClick}
              >
                No 😢
              </motion.button>
            </div>
          </motion.div>
        );

      case 'preferences':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-8">
              Let's plan the perfect date! 💝
            </h3>

            <div className="space-y-6">
              <div>
                <p className="text-gray-700 mb-3">What would you prefer?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setPreferences(p => ({ ...p, treat: 'chocolates' }))}
                    className={`px-4 py-2 rounded-lg ${
                      preferences.treat === 'chocolates'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    Chocolates 🍫
                  </button>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, treat: 'flowers' }))}
                    className={`px-4 py-2 rounded-lg ${
                      preferences.treat === 'flowers'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    Flowers 💐
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-3">Perfect date idea?</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => setPreferences(p => ({ ...p, date: 'dinner' }))}
                    className={`px-4 py-2 rounded-lg ${
                      preferences.date === 'dinner'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    Romantic Dinner 🍽️
                  </button>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, date: 'movie' }))}
                    className={`px-4 py-2 rounded-lg ${
                      preferences.date === 'movie'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    Movie Date 🎬
                  </button>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, date: 'picnic' }))}
                    className={`px-4 py-2 rounded-lg ${
                      preferences.date === 'picnic'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    Picnic in the Park 🧺
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-3">Preferred time?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setPreferences(p => ({ ...p, time: 'lunch' }))}
                    className={`px-4 py-2 rounded-lg ${
                      preferences.time === 'lunch'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    Lunch ☀️
                  </button>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, time: 'dinner' }))}
                    className={`px-4 py-2 rounded-lg ${
                      preferences.time === 'dinner'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    Dinner 🌙
                  </button>
                </div>
              </div>

              {preferences.treat && preferences.date && preferences.time && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-6 rounded-lg font-medium shadow-lg flex items-center gap-2 mx-auto"
                  onClick={handlePreferencesSubmit}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        );

      case 'summary':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              It's a Date! 💝
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              {invitation.recipientName} said YES to {invitation.senderName}!
            </p>
            <div className="space-y-4 text-gray-600">
              <p>Looking forward to:</p>
              <ul className="space-y-2">
                <li>A {preferences.time} {preferences.date} date</li>
                <li>With lots of {preferences.treat}</li>
              </ul>
            </div>
            <p className="mt-8 text-pink-600 font-medium">
              Get ready for the most amazing Valentine's Day! ✨
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-16 h-16 text-pink-500 mx-auto" />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ValentineInvitation;