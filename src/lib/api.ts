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

export const fetchCourses = async () => {
  // For demonstration purposes, we'll return a static list of courses
  // In a real application, this would be an API call
  return [
    { id: 1, title: "Introduction to Machine Learning", field: "Technology", level: "Beginner", lessons: 12, rating: 4.7, reviews: 1250, description: "Learn the basics of ML algorithms and their applications." },
    { id: 2, title: "Advanced Quantum Computing", field: "Science", level: "Advanced", lessons: 15, rating: 4.9, reviews: 320, description: "Explore cutting-edge quantum algorithms and their implementations." },
    { id: 3, title: "Digital Art and Design Fundamentals", field: "Arts", level: "Beginner", lessons: 10, rating: 4.5, reviews: 890, description: "Master the basics of digital art creation and design principles." },
    { id: 4, title: "Robotics Engineering", field: "Engineering", level: "Intermediate", lessons: 14, rating: 4.6, reviews: 750, description: "Design and build your own robots with advanced control systems." },
    { id: 5, title: "Cybersecurity Essentials", field: "Technology", level: "Beginner", lessons: 8, rating: 4.8, reviews: 1100, description: "Learn to protect systems and networks from cyber threats." },
    { id: 6, title: "Astrophysics and Cosmology", field: "Science", level: "Advanced", lessons: 16, rating: 4.9, reviews: 280, description: "Unravel the mysteries of the universe and celestial bodies." },
    { id: 7, title: "3D Animation and Visual Effects", field: "Arts", level: "Intermediate", lessons: 12, rating: 4.7, reviews: 620, description: "Create stunning 3D animations and visual effects for films and games." },
    { id: 8, title: "Sustainable Energy Systems", field: "Engineering", level: "Intermediate", lessons: 10, rating: 4.6, reviews: 480, description: "Design and implement renewable energy solutions for a sustainable future." },
    { id: 9, title: "Blockchain Development", field: "Technology", level: "Advanced", lessons: 14, rating: 4.8, reviews: 390, description: "Build decentralized applications and smart contracts on blockchain platforms." },
    { id: 10, title: "Genetic Engineering and CRISPR", field: "Science", level: "Advanced", lessons: 15, rating: 4.9, reviews: 210, description: "Explore the cutting-edge of genetic modification techniques." },
    { id: 11, title: "Virtual Reality Game Design", field: "Arts", level: "Intermediate", lessons: 11, rating: 4.7, reviews: 540, description: "Create immersive VR experiences and games using Unity." },
    { id: 12, title: "Aerospace Engineering", field: "Engineering", level: "Advanced", lessons: 16, rating: 4.8, reviews: 300, description: "Design and analyze aircraft and spacecraft systems." },
    { id: 13, title: "Data Science and Big Data Analytics", field: "Technology", level: "Intermediate", lessons: 13, rating: 4.6, reviews: 980, description: "Harness the power of big data to derive meaningful insights." },
    { id: 14, title: "Neuroscience and Brain-Computer Interfaces", field: "Science", level: "Advanced", lessons: 14, rating: 4.9, reviews: 180, description: "Explore the frontiers of brain science and neural engineering." },
    { id: 15, title: "Sound Design for Film and Games", field: "Arts", level: "Intermediate", lessons: 9, rating: 4.5, reviews: 420, description: "Create immersive audio experiences for visual media." },
    { id: 16, title: "Nanotechnology and Materials Science", field: "Engineering", level: "Advanced", lessons: 15, rating: 4.8, reviews: 250, description: "Manipulate matter at the atomic scale to create revolutionary materials." },
    { id: 17, title: "Cloud Computing and DevOps", field: "Technology", level: "Intermediate", lessons: 12, rating: 4.7, reviews: 730, description: "Master cloud infrastructure and continuous integration/deployment." },
    { id: 18, title: "Bioinformatics and Computational Biology", field: "Science", level: "Intermediate", lessons: 13, rating: 4.6, reviews: 340, description: "Apply computational methods to solve biological problems." },
    { id: 19, title: "Augmented Reality App Development", field: "Arts", level: "Advanced", lessons: 14, rating: 4.8, reviews: 290, description: "Create AR applications for mobile devices and wearables." },
    { id: 20, title: "Mechatronics and Smart Systems", field: "Engineering", level: "Intermediate", lessons: 11, rating: 4.7, reviews: 410, description: "Design intelligent electromechanical systems and products." },
  ];
};

export default api;
