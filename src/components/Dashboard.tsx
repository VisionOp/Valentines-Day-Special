import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Clock, Check, X, HelpCircle } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { StoredInvitation, ValentineInvitation } from '../types';

interface Props {
  storedInvitations: StoredInvitation[];
  onBack: () => void;
}

const Dashboard: React.FC<Props> = ({ storedInvitations, onBack }) => {
  const [invitationDetails, setInvitationDetails] = useState<Record<string, ValentineInvitation>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitationDetails = async () => {
      const details: Record<string, ValentineInvitation> = {};
      
      for (const invitation of storedInvitations) {
        try {
          const inviteRef = ref(db, `invitations/${invitation.id}`);
          const snapshot = await get(inviteRef);
          if (snapshot.exists()) {
            details[invitation.id] = snapshot.val();
          }
        } catch (error) {
          console.error('Error fetching invitation details:', error);
        }
      }
      
      setInvitationDetails(details);
      setLoading(false);
    };

    fetchInvitationDetails();
  }, [storedInvitations]);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'accepted':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="text-pink-500 hover:text-pink-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Your Valentine's Dashboard
            <Heart className="w-8 h-8 text-pink-500" />
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Heart className="w-8 h-8 text-pink-500" />
            </motion.div>
          </div>
        ) : storedInvitations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No invitations created yet.</p>
            <button
              onClick={onBack}
              className="mt-4 text-pink-500 hover:text-pink-600 font-medium"
            >
              Create Your First Invitation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {storedInvitations.map((invitation) => {
              const details = invitationDetails[invitation.id];
              return (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        To: {invitation.recipientName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Sent: {formatDate(invitation.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        Status:
                      </span>
                      {getStatusIcon(details?.status)}
                    </div>
                  </div>

                  {details?.status === 'accepted' && details.preferences && (
                    <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                      <h4 className="font-medium text-pink-700 mb-2">
                        Their Preferences
                      </h4>
                      <ul className="space-y-1 text-sm text-pink-600">
                        <li>• Prefers: {details.preferences.treat}</li>
                        <li>• Date choice: {details.preferences.date}</li>
                        <li>• Time preference: {details.preferences.time}</li>
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}?invite=${invitation.id}`;
                        navigator.clipboard.writeText(link);
                      }}
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                    >
                      Copy Invitation Link
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;