import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Video, FileText, Award, Search, Zap, Globe, Lightbulb, Rocket } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';

const Community: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [forumPosts, setForumPosts] = useState([
    { id: 1, title: 'How to optimize React performance?', likes: 42, dislikes: 3, author: 'ReactMaster', tags: ['react', 'performance'] },
    { id: 2, title: 'Best practices for state management', likes: 38, dislikes: 1, author: 'ReduxGuru', tags: ['react', 'state-management'] },
    { id: 3, title: 'Tips for acing coding interviews', likes: 55, dislikes: 2, author: 'InterviewAce', tags: ['career', 'interviews'] },
  ]);

  useEffect(() => {
    // Simulating API call to fetch forum posts
    const filteredPosts = [
      { id: 1, title: 'How to optimize React performance?', likes: 42, dislikes: 3, author: 'ReactMaster', tags: ['react', 'performance'] },
      { id: 2, title: 'Best practices for state management', likes: 38, dislikes: 1, author: 'ReduxGuru', tags: ['react', 'state-management'] },
      { id: 3, title: 'Tips for acing coding interviews', likes: 55, dislikes: 2, author: 'InterviewAce', tags: ['career', 'interviews'] },
    ].filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setForumPosts(filteredPosts);
  }, [searchTerm]);

  const handleVote = (id: number, type: 'like' | 'dislike') => {
    setForumPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id
          ? { ...post, [type === 'like' ? 'likes' : 'dislikes']: post[type === 'like' ? 'likes' : 'dislikes'] + 1 }
          : post
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Community & Forums</h2>
      <Tabs defaultValue="forums" className="w-full">
        <TabsList>
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="chat">Real-Time Chat</TabsTrigger>
          <TabsTrigger value="studyGroups">Study Groups</TabsTrigger>
          <TabsTrigger value="askExpert">Ask an Expert</TabsTrigger>
          <TabsTrigger value="challenges">Coding Challenges</TabsTrigger>
          <TabsTrigger value="events">Community Events</TabsTrigger>
        </TabsList>
        <TabsContent value="forums">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Discussion Forums
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Button onClick={() => setSelectedTopic('general')} variant={selectedTopic === 'general' ? 'default' : 'outline'}>General</Button>
                <Button onClick={() => setSelectedTopic('javascript')} variant={selectedTopic === 'javascript' ? 'default' : 'outline'}>#JavaScript</Button>
                <Button onClick={() => setSelectedTopic('examprep')} variant={selectedTopic === 'examprep' ? 'default' : 'outline'}>#ExamPrep</Button>
                <Button onClick={() => setSelectedTopic('machinelearning')} variant={selectedTopic === 'machinelearning' ? 'default' : 'outline'}>#MachineLearning</Button>
              </div>
              <div className="relative mb-4">
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <AnimatePresence>
                <ul className="space-y-2">
                  {forumPosts.map((post) => (
                    <motion.li
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-2 bg-secondary rounded-md"
                    >
                      <div>
                        <span className="font-semibold">{post.title}</span>
                        <p className="text-sm text-gray-500">by {post.author}</p>
                        <div className="flex mt-1 space-x-1">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleVote(post.id, 'like')}>👍 {post.likes}</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleVote(post.id, 'dislike')}>👎 {post.dislikes}</Button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-6 w-6" />
                Real-Time Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Interactive chat rooms coming soon! Connect with peers in real-time.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="studyGroups">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Join or create study groups for collaborative learning experiences.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="askExpert">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-6 w-6" />
                Ask an Expert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Schedule one-on-one sessions with industry experts and mentors.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="challenges">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-6 w-6" />
                Coding Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Test your skills with daily coding challenges and compete with peers!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-6 w-6" />
                Community Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discover and participate in virtual meetups, webinars, and hackathons.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Resource Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>Introduction to React Hooks</span>
              <Button size="sm">View</Button>
            </li>
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>Machine Learning Fundamentals</span>
              <Button size="sm">View</Button>
            </li>
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>Cybersecurity Best Practices</span>
              <Button size="sm">View</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-6 w-6" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>1. John Doe</span>
              <span>1250 points</span>
            </li>
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>2. Jane Smith</span>
              <span>1180 points</span>
            </li>
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>3. Alex Johnson</span>
              <span>1050 points</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-6 w-6" />
            Innovation Corner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Share your innovative ideas and get feedback from the community!</p>
          <Button className="mt-2">Submit Idea</Button>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="mr-2 h-6 w-6" />
            Community Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Collaborate on open-source projects and build your portfolio.</p>
          <Button className="mt-2">Explore Projects</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;