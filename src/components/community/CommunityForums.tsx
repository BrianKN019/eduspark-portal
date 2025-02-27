
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from "@/components/ui/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ForumPost {
  id: number;
  title: string;
  likes: number;
  dislikes: number;
  author: string;
  authorAvatar?: string;
  tags: string[];
  timestamp: string;
  replies?: Array<{
    id: number;
    author: string;
    authorAvatar?: string;
    content: string;
    timestamp: string;
  }>;
}

const CommunityForums: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  useEffect(() => {
    // Simulating API call to fetch forum posts
    const mockPosts: ForumPost[] = [
      { 
        id: 1, 
        title: 'How to optimize React performance?', 
        likes: 42, 
        dislikes: 3, 
        author: 'ReactMaster', 
        authorAvatar: 'https://ui.shadcn.com/avatars/01.png',
        tags: ['react', 'performance'],
        timestamp: '2023-05-15T14:30:00Z',
        replies: [
          {
            id: 101,
            author: 'OptimizationGuru',
            authorAvatar: 'https://ui.shadcn.com/avatars/02.png',
            content: 'Use React.memo for function components that render often with the same props.',
            timestamp: '2023-05-15T15:45:00Z'
          },
          {
            id: 102,
            author: 'PerformanceWizard',
            authorAvatar: 'https://ui.shadcn.com/avatars/03.png',
            content: 'Make sure to implement proper dependency arrays in useEffect and useCallback hooks.',
            timestamp: '2023-05-15T16:20:00Z'
          }
        ]
      },
      { 
        id: 2, 
        title: 'Best practices for state management', 
        likes: 38, 
        dislikes: 1, 
        author: 'ReduxGuru',
        authorAvatar: 'https://ui.shadcn.com/avatars/04.png',
        tags: ['react', 'state-management'],
        timestamp: '2023-05-16T09:45:00Z',
        replies: [
          {
            id: 201,
            author: 'ContextFan',
            authorAvatar: 'https://ui.shadcn.com/avatars/05.png',
            content: 'For simpler apps, React Context with useReducer can be sufficient.',
            timestamp: '2023-05-16T10:30:00Z'
          }
        ]
      },
      { 
        id: 3, 
        title: 'Tips for acing coding interviews', 
        likes: 55, 
        dislikes: 2, 
        author: 'InterviewAce',
        authorAvatar: 'https://ui.shadcn.com/avatars/06.png',
        tags: ['career', 'interviews'],
        timestamp: '2023-05-17T11:15:00Z',
        replies: [
          {
            id: 301,
            author: 'AlgoExpert',
            authorAvatar: 'https://ui.shadcn.com/avatars/07.png',
            content: 'Always practice explaining your thought process while solving problems.',
            timestamp: '2023-05-17T12:10:00Z'
          },
          {
            id: 302,
            author: 'SystemDesigner',
            authorAvatar: 'https://ui.shadcn.com/avatars/08.png',
            content: 'Don\'t forget to prepare for system design questions if you\'re interviewing for senior roles.',
            timestamp: '2023-05-17T13:25:00Z'
          },
          {
            id: 303,
            author: 'BehavioralPro',
            authorAvatar: 'https://ui.shadcn.com/avatars/09.png',
            content: 'Prepare STAR format responses for behavioral questions.',
            timestamp: '2023-05-17T14:40:00Z'
          }
        ]
      },
    ];

    const filteredPosts = mockPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
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
  
  const togglePostExpansion = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
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
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      onClick={() => togglePostExpansion(post.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={post.authorAvatar} alt={post.author} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{post.title}</h3>
                          <p className="text-sm text-gray-500">by {post.author} • {new Date(post.timestamp).toLocaleDateString()}</p>
                          <div className="flex mt-1 space-x-1 flex-wrap">
                            {post.tags.map(tag => (
                              <span key={tag} className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full mb-1">{tag}</span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button size="sm" variant="ghost" onClick={(e) => {
                              e.stopPropagation();
                              handleVote(post.id, 'like');
                            }}>
                              👍 {post.likes}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={(e) => {
                              e.stopPropagation();
                              handleVote(post.id, 'dislike');
                            }}>
                              👎 {post.dislikes}
                            </Button>
                            <span className="text-sm text-gray-500 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" /> {post.replies?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Display replies using Timeline component when post is expanded */}
                    {expandedPost === post.id && post.replies && post.replies.length > 0 && (
                      <div className="border-t p-4">
                        <h4 className="text-sm font-medium mb-3">Replies</h4>
                        <Timeline>
                          {post.replies.map((reply) => (
                            <TimelineItem
                              key={reply.id}
                              className="ml-6 mb-4 last:mb-0"
                            >
                              <TimelineHeader>
                                <TimelineSeparator className="ml-3 h-full" />
                                <TimelineTitle className="mt-0.5 ml-2">
                                  {reply.author}
                                </TimelineTitle>
                                <TimelineIndicator className="ml-3 bg-primary/10">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={reply.authorAvatar} alt={reply.author} />
                                    <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                </TimelineIndicator>
                              </TimelineHeader>
                              <TimelineContent className="text-foreground mt-2 ml-2 rounded-lg border px-4 py-3">
                                {reply.content}
                                <TimelineDate>{new Date(reply.timestamp).toLocaleString()}</TimelineDate>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CommunityForums;
