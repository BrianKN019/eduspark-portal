import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityForums: React.FC = () => {
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
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-6 w-6" />
          Discussion Forums
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap space-x-2 mb-4">
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
                className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-secondary rounded-md"
              >
                <div>
                  <span className="font-semibold">{post.title}</span>
                  <p className="text-sm text-gray-500">by {post.author}</p>
                  <div className="flex mt-1 space-x-1 flex-wrap">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mb-1">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <Button size="sm" variant="ghost" onClick={() => handleVote(post.id, 'like')}>👍 {post.likes}</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleVote(post.id, 'dislike')}>👎 {post.dislikes}</Button>
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CommunityForums;