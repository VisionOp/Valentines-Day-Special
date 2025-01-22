import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { db } from './firebase';
import { ValentineInvitation as InvitationType, StoredInvitation } from './types';
import CreateInvitation from './components/CreateInvitation';
import ValentineInvitation from './components/ValentineInvitation';
import CountdownTimer from './components/CountdownTimer';
import Dashboard from './components/Dashboard';

function App() {
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<InvitationType | null>(null);
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [storedInvitations, setStoredInvitations] = useState<StoredInvitation[]>([]);

  useEffect(() => {
    const loadInvitation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('invite');

      // Load stored invitations from localStorage
      const stored = localStorage.getItem('valentineInvitations');
      if (stored) {
        setStoredInvitations(JSON.parse(stored));
      }

      if (id) {
        const inviteRef = ref(db, `invitations/${id}`);
        const snapshot = await get(inviteRef);
        
        if (snapshot.exists()) {
          setInvitation(snapshot.val());
          setInvitationId(id);
        }
      }

      setLoading(false);
    };

    loadInvitation();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="w-8 h-8 text-pink-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center p-4">
      <CountdownTimer />
      
      {invitation && invitationId ? (
        <ValentineInvitation invitation={invitation} invitationId={invitationId} />
      ) : (
        <div className="w-full max-w-4xl">
          {showDashboard ? (
            <Dashboard 
              storedInvitations={storedInvitations} 
              onBack={() => setShowDashboard(false)} 
            />
          ) : (
            <CreateInvitation 
              onViewDashboard={() => setShowDashboard(true)}
              storedInvitations={storedInvitations}
              setStoredInvitations={setStoredInvitations}
            />
          )}
        </div>
      )}

      <div className="fixed bottom-4 left-4 text-pink-600 flex items-center gap-2">
        <Heart className="w-4 h-4" />
        <span className="text-sm">Made with love</span>
      </div>
    </div>
  );
}

export default App;