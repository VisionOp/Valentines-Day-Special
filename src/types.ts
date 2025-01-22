export interface ValentineInvitation {
  senderName: string;
  recipientName: string;
  message: string;
  memory?: string;
  songLink?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  preferences?: {
    treat: 'chocolates' | 'flowers';
    date: 'dinner' | 'movie' | 'picnic';
    time: 'lunch' | 'dinner';
  };
  createdAt: number;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface StoredInvitation {
  id: string;
  senderName: string;
  recipientName: string;
  createdAt: number;
}