import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API base URL
});

export const fetchUserData = async (name: string) => {
  // Simulated API call with random test data
  return {
    name: name,
    learningStreak: Math.floor(Math.random() * 30) + 1,
    xpGained: Math.floor(Math.random() * 1000) + 100,
    goalsCompleted: Math.floor(Math.random() * 10) + 1,
    achievements: Math.floor(Math.random() * 20) + 1,
    role: ['student', 'instructor', 'admin'][Math.floor(Math.random() * 3)],
  };
};

export const fetchWeeklyProgress = async () => {
  // Simulated API call with random test data
  return Array.from({ length: 7 }, (_, i) => ({
    week: `Week ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
  }));
};

export const fetchCourseRecommendations = async () => {
  // Simulated API call with random test data
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `Recommended Course ${i + 1}`,
    description: `This is a great course for you to take next!`,
  }));
};

export const fetchUpcomingEvents = async () => {
  // Simulated API call with random test data
  return Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `Upcoming Event ${i + 1}`,
    date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const fetchDiscussionTopics = async () => {
  // Simulated API call with random test data
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `Hot Topic ${i + 1}`,
    replies: Math.floor(Math.random() * 50) + 1,
  }));
};

export const fetchUserAchievements = async () => {
  // Simulated API call with random test data
  return {
    badges: Array.from({ length: 5 }, (_, i) => ({
      id: `badge-${i + 1}`,
      name: `Achievement Badge ${i + 1}`,
      description: `You've earned this badge for your outstanding performance!`,
      imageUrl: `https://api.dicebear.com/6.x/shapes/svg?seed=${i}`,
      tier: ['bronze', 'silver', 'gold'][Math.floor(Math.random() * 3)],
      category: ['course', 'achievement', 'streak', 'milestone'][Math.floor(Math.random() * 4)],
    })),
    certificates: Array.from({ length: 3 }, (_, i) => ({
      id: `cert-${i + 1}`,
      name: `Course Certificate ${i + 1}`,
      description: `Congratulations on completing this course!`,
      earnedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      downloadUrl: '#',
    })),
    coursesCompleted: Math.floor(Math.random() * 10) + 1,
    streakDays: Math.floor(Math.random() * 30) + 1,
    totalPoints: Math.floor(Math.random() * 5000) + 500,
    contributions: Math.floor(Math.random() * 50) + 1,
  };
};

export const fetchLeaderboard = async () => {
  // Simulated API call with random test data
  return Array.from({ length: 10 }, (_, i) => ({
    userId: `user-${i + 1}`,
    username: `TopLearner${i + 1}`,
    badgeCount: Math.floor(Math.random() * 20) + 1,
    points: Math.floor(Math.random() * 10000) + 1000,
  }));
};

export const fetchResources = async (searchTerm: string, category: string) => {
  // Simulated API call with random test data
  return Array.from({ length: 10 }, (_, i) => ({
    id: `resource-${i + 1}`,
    title: `Resource ${i + 1}`,
    description: `This is a great learning resource for ${category}`,
    type: ['article', 'video', 'ebook'][Math.floor(Math.random() * 3)],
    category: category,
  }));
};

export const fetchCourses = async () => {
  // Simulated API call with random test data
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Course ${i + 1}`,
    field: ['Technology', 'Science', 'Arts', 'Engineering'][Math.floor(Math.random() * 4)],
    level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
    lessons: Math.floor(Math.random() * 20) + 5,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 1000) + 100,
    description: `This is an exciting course about various topics in ${['Technology', 'Science', 'Arts', 'Engineering'][Math.floor(Math.random() * 4)]}.`,
  }));
};

export default api;