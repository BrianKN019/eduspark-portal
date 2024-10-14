export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tier: 'bronze' | 'silver' | 'gold';
  category: 'course' | 'achievement' | 'streak' | 'milestone';
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

export interface UserAchievements {
  badges: Badge[];
  certificates: Certificate[];
  coursesCompleted: number;
  streakDays: number;
  totalPoints: number;
  contributions: number;
}