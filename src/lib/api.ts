import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API base URL
});

export const fetchUserData = async () => {
  const response = await api.get('/user');
  return response.data;
};

export const fetchWeeklyProgress = async () => {
  const response = await api.get('/progress/weekly');
  return response.data;
};

export const fetchCourseRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const fetchUpcomingEvents = async () => {
  const response = await api.get('/events/upcoming');
  return response.data;
};

export const fetchDiscussionTopics = async () => {
  const response = await api.get('/discussions/topics');
  return response.data;
};

export const submitAssignment = async (assignmentId, data) => {
  const response = await api.post(`/assignments/${assignmentId}/submit`, data);
  return response.data;
};

export const joinLiveClass = async (classId) => {
  const response = await api.post(`/live-classes/${classId}/join`);
  return response.data;
};

export const updateUserSettings = async (settings) => {
  const response = await api.put('/user/settings', settings);
  return response.data;
};

export const fetchUserAchievements = async () => {
  const response = await api.get('/user/achievements');
  return response.data;
};

export const fetchLeaderboard = async () => {
  const response = await api.get('/leaderboard');
  return response.data;
};

export const fetchResources = async (searchTerm: string, category: string) => {
  const response = await api.get('/resources', {
    params: { searchTerm, category },
  });
  return response.data;
};

export const fetchCourses = async (searchTerm: string, category: string) => {
  const response = await api.get('/courses', {
    params: { searchTerm, category },
  });
  return response.data;
};

export default api;
