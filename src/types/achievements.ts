export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tier: 'bronze' | 'silver' | 'gold';
}

export interface Certificate {
  id: string;
  name: string;
  description: string;
  earnedDate: string;
  downloadUrl: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  badgeCount: number;
  points: number;
}