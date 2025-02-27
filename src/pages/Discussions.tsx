
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, PaperclipIcon, Flag, BarChart2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from "@/components/ui/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DiscussionThread {
  id: number;
  title: string;
  author: string;
  authorAvatar?: string;
  content: string;
  upvotes: number;
  replies: number;
  tags: string[];
  createdAt: string;
}

interface DiscussionReply {
  id: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  threadId: number;
}

const Discussions: React.FC = () => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    // Simulated API call to fetch discussion threads
    const fetchedThreads: DiscussionThread[] = [
      { 
        id: 1, 
        title: "React Hooks Best Practices", 
        author: "Alice", 
        authorAvatar: "https://ui.shadcn.com/avatars/01.png",
        content: "What are your favorite React hooks? I've been using useState and useEffect a lot, but I'm interested in exploring more advanced hooks like useReducer and useContext for state management in larger applications.", 
        upvotes: 15, 
        replies: 3, 
        tags: ["react", "hooks"],
        createdAt: "2023-05-15T14:30:00Z"
      },
      { 
        id: 2, 
        title: "TypeScript vs JavaScript", 
        author: "Bob", 
        authorAvatar: "https://ui.shadcn.com/avatars/02.png",
        content: "Pros and cons of using TypeScript? I'm considering migrating a large JavaScript project to TypeScript and would like to hear about your experiences with the transition.", 
        upvotes: 10, 
        replies: 5, 
        tags: ["typescript", "javascript"],
        createdAt: "2023-05-16T09:45:00Z"
      },
      { 
        id: 3, 
        title: "CSS-in-JS Solutions", 
        author: "Charlie", 
        authorAvatar: "https://ui.shadcn.com/avatars/03.png",
        content: "What's your preferred CSS-in-JS library? I've tried styled-components and emotion, but I'm curious about newer options like vanilla-extract or stitches.", 
        upvotes: 8, 
        replies: 2, 
        tags: ["css", "javascript"],
        createdAt: "2023-05-17T16:20:00Z"
      },
    ];
    
    // Simulated API call to fetch discussion replies
    const fetchedReplies: DiscussionReply[] = [
      {
        id: 101,
        authorName: "David",
        authorAvatar: "https://ui.shadcn.com/avatars/04.png",
        content: "I love useReducer for complex state logic. It makes it much easier to reason about state transitions.",
        timestamp: "2023-05-15T15:10:00Z",
        threadId: 1
      },
      {
        id: 102,
        authorName: "Eva",
        authorAvatar: "https://ui.shadcn.com/avatars/05.png",
        content: "useContext combined with useReducer is a great lightweight alternative to Redux for many applications.",
        timestamp: "2023-05-15T16:45:00Z",
        threadId: 1
      },
      {
        id: 103,
        authorName: "Frank",
        authorAvatar: "https://ui.shadcn.com/avatars/06.png",
        content: "Don't forget about custom hooks! They're a powerful way to extract and reuse stateful logic.",
        timestamp: "2023-05-16T09:30:00Z",
        threadId: 1
      },
      {
        id: 201,
        authorName: "Grace",
        authorAvatar: "https://ui.shadcn.com/avatars/07.png",
        content: "TypeScript has saved our team countless hours debugging runtime errors. The initial setup cost pays off quickly.",
        timestamp: "2023-05-16T10:15:00Z",
        threadId: 2
      },
      {
        id: 202,
        authorName: "Henry",
        authorAvatar: "https://ui.shadcn.com/avatars/08.png",
        content: "The biggest challenge we faced was dealing with third-party libraries without proper type definitions.",
        timestamp: "2023-05-16T11:20:00Z",
        threadId: 2
      },
      {
        id: 301,
        authorName: "Ivy",
        authorAvatar: "https://ui.shadcn.com/avatars/09.png",
        content: "I've been using emotion and really appreciate its composition model and performance optimizations.",
        timestamp: "2023-05-17T17:05:00Z",
        threadId: 3
      },
      {
        id: 302,
        authorName: "Jack",
        authorAvatar: "https://ui.shadcn.com/avatars/10.png",
        content: "Check out vanilla-extract for type-safe CSS-in-TS with zero runtime cost. It's been a game-changer for us.",
        timestamp: "2023-05-17T18:30:00Z",
        threadId: 3
      }
    ];
    
    setThreads(fetchedThreads);
    setReplies(fetchedReplies);
  }, []);

  const handleUpvote = (id: number) => {
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === id ? { ...thread, upvotes: thread.upvotes + 1 } : thread
      )
    );
  };
  
  const handleThreadSelect = (threadId: number) => {
    setSelectedThread(threadId === selectedThread ? null : threadId);
  };
  
  const handleSubmitReply = (threadId: number) => {
    if (!replyContent.trim()) return;
    
    const newReply: DiscussionReply = {
      id: Date.now(),
      authorName: "You",
      content: replyContent,
      timestamp: new Date().toISOString(),
      threadId: threadId
    };
    
    setReplies(prevReplies => [...prevReplies, newReply]);
    
    // Update the thread replies count
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === threadId ? { ...thread, replies: thread.replies + 1 } : thread
      )
    );
    
    setReplyContent('');
  };

  const filteredThreads = selectedTopic === 'all' 
    ? threads 
    : threads.filter(thread => thread.tags.includes(selectedTopic));
    
  const threadReplies = (threadId: number) =>
    replies.filter(reply => reply.threadId === threadId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Discussions</h2>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedTopic('all')}>All Topics</TabsTrigger>
          <TabsTrigger value="react" onClick={() => setSelectedTopic('react')}>React</TabsTrigger>
          <TabsTrigger value="typescript" onClick={() => setSelectedTopic('typescript')}>TypeScript</TabsTrigger>
          <TabsTrigger value="css" onClick={() => setSelectedTopic('css')}>CSS</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-6 w-6" />
                Discussion Threads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          onClick={() => handleThreadSelect(thread.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={thread.authorAvatar} alt={thread.author} />
                              <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">{thread.title}</h3>
                              <p className="text-sm text-gray-500">
                                by {thread.author} • {new Date(thread.createdAt).toLocaleDateString()}
                              </p>
                              <p className="mt-2">{thread.content}</p>
                              <div className="mt-3 flex items-center space-x-4">
                                <Button variant="outline" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpvote(thread.id);
                                }}>
                                  <ThumbsUp className="mr-2 h-4 w-4" />
                                  {thread.upvotes}
                                </Button>
                                <span className="text-sm text-gray-500">{thread.replies} replies</span>
                                <div className="flex space-x-2">
                                  {thread.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Thread replies using Timeline */}
                        {selectedThread === thread.id && (
                          <div className="border-t p-4">
                            <Timeline>
                              {threadReplies(thread.id).map((reply) => (
                                <TimelineItem
                                  key={reply.id}
                                  className="ml-8 mb-4 last:mb-0"
                                >
                                  <TimelineHeader>
                                    <TimelineSeparator className="ml-4 h-full" />
                                    <TimelineTitle className="mt-0.5 ml-2">
                                      {reply.authorName}
                                    </TimelineTitle>
                                    <TimelineIndicator className="ml-4 bg-primary/10">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
                                        <AvatarFallback>{reply.authorName.charAt(0)}</AvatarFallback>
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
                            
                            {/* Reply input */}
                            <div className="mt-4 flex gap-2">
                              <Input
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                onClick={() => handleSubmitReply(thread.id)}
                                disabled={!replyContent.trim()}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="react">
          <Card className="neumorphic-card">
            <CardContent className="p-4">
              <p>React specific discussions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typescript">
          <Card className="neumorphic-card">
            <CardContent className="p-4">
              <p>TypeScript specific discussions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="css">
          <Card className="neumorphic-card">
            <CardContent className="p-4">
              <p>CSS specific discussions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Start a New Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Discussion title" className="mb-4" />
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-2 border rounded-md mb-4"
            rows={4}
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <PaperclipIcon className="mr-2 h-4 w-4" />
              Attach File
            </Button>
            <Button>Post Discussion</Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="neumorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="mr-2 h-6 w-6" />
              Moderation Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>No flagged content at the moment.</p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-6 w-6" />
              Discussion Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Threads: {threads.length}</p>
            <p>Most Active Topic: React</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Discussions;
