import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, Copy, Check, LayoutDashboard, Music } from 'lucide-react';
import { ref, set, push } from 'firebase/database';
import { db } from '../firebase';
import { ValentineInvitation, StoredInvitation } from '../types';

interface Props {
  onViewDashboard: () => void;
  storedInvitations: StoredInvitation[];
  setStoredInvitations: React.Dispatch<React.SetStateAction<StoredInvitation[]>>;
}

const CreateInvitation: React.FC<Props> = ({ 
  onViewDashboard, 
  storedInvitations, 
  setStoredInvitations 
}) => {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [memory, setMemory] = useState('');
  const [songLink, setSongLink] = useState('');
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInvitation = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!senderName.trim() || !recipientName.trim() || !message.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Create a new reference first
      const invitationsRef = ref(db, 'invitations');
      const newInvitationRef = push(invitationsRef);

      if (!newInvitationRef.key) {
        throw new Error('Failed to generate invitation ID');
      }

      // Prepare the invitation data
      const invitation: ValentineInvitation = {
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        message: message.trim(),
        memory: memory.trim() || undefined,
        songLink: songLink.trim() || undefined,
        status: 'pending',
        createdAt: Date.now()
      };

      // Save to specific location using the generated key
      await set(ref(db, `invitations/${newInvitationRef.key}`), invitation);

      // Store locally after successful save
      const newStoredInvitation: StoredInvitation = {
        id: newInvitationRef.key,
        senderName: invitation.senderName,
        recipientName: invitation.recipientName,
        createdAt: invitation.createdAt
      };

      const updatedInvitations = [...storedInvitations, newStoredInvitation];
      localStorage.setItem('valentineInvitations', JSON.stringify(updatedInvitations));
      setStoredInvitations(updatedInvitations);
      setInvitationId(newInvitationRef.key);

    } catch (err) {
      console.error('Error creating invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to create invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [senderName, recipientName, message, memory, songLink, storedInvitations, setStoredInvitations]);

  const copyLink = useCallback(() => {
    if (!invitationId) return;
    
    const link = `${window.location.origin}?invite=${invitationId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setError('Failed to copy link. Please try again.');
      });
  }, [invitationId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto relative"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewDashboard}
          className="absolute top-4 right-4 text-pink-500 hover:text-pink-600 flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full shadow-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>View Responses</span>
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

        <h2 className="mt-6 text-3xl font-bold text-center text-gray-800">
          Create Your Valentine's Invitation
        </h2>
        
        {!invitationId ? (
          <form onSubmit={generateInvitation} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Valentine's Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter their name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32 resize-none"
                placeholder="Write your love letter or pickup line..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Share a Memory</label>
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-24 resize-none"
                placeholder="Share a special memory you both cherish..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Music className="w-4 h-4" />
                Dedicate a Song (Spotify Link)
              </label>
              <input
                type="url"
                value={songLink}
                onChange={(e) => setSongLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Paste Spotify song link..."
                disabled={isLoading}
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
              className={`w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={isLoading}
            >
              <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
              {isLoading ? 'Creating...' : 'Create Invitation'}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-green-600 font-medium mb-4">
              Your invitation has been created! 🎉
            </p>
            <div className="bg-pink-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-pink-700 break-all">
                {`${window.location.origin}?invite=${invitationId}`}
              </p>
            </div>
            <button
              onClick={copyLink}
              className="w-full bg-pink-100 text-pink-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-pink-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Invitation Link
                </>
              )}
            </button>
            <button
              onClick={() => {
                setInvitationId(null);
                setSenderName('');
                setRecipientName('');
                setMessage('');
                setMemory('');
                setSongLink('');
                setError(null);
              }}
              className="mt-4 text-pink-600 hover:text-pink-700 text-sm font-medium"
            >
              Create Another Invitation
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CreateInvitation;