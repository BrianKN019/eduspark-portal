import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, PaperclipIcon, Flag, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DiscussionThread {
  id: number;
  title: string;
  author: string;
  content: string;
  upvotes: number;
  replies: number;
  tags: string[];
}

const Discussions: React.FC = () => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('all');

  useEffect(() => {
    // Simulated API call to fetch discussion threads
    const fetchedThreads: DiscussionThread[] = [
      { id: 1, title: "React Hooks Best Practices", author: "Alice", content: "What are your favorite React hooks?", upvotes: 15, replies: 7, tags: ["react", "hooks"] },
      { id: 2, title: "TypeScript vs JavaScript", author: "Bob", content: "Pros and cons of using TypeScript?", upvotes: 10, replies: 5, tags: ["typescript", "javascript"] },
      { id: 3, title: "CSS-in-JS Solutions", author: "Charlie", content: "What's your preferred CSS-in-JS library?", upvotes: 8, replies: 3, tags: ["css", "javascript"] },
    ];
    setThreads(fetchedThreads);
  }, []);

  const handleUpvote = (id: number) => {
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === id ? { ...thread, upvotes: thread.upvotes + 1 } : thread
      )
    );
  };

  const filteredThreads = selectedTopic === 'all' ? threads : threads.filter(thread => thread.tags.includes(selectedTopic));

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
              <div className="space-y-4">
                {filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-secondary rounded-lg"
                  >
                    <h3 className="text-lg font-semibold">{thread.title}</h3>
                    <p className="text-sm text-gray-500">by {thread.author}</p>
                    <p className="mt-2">{thread.content}</p>
                    <div className="mt-4 flex items-center space-x-4">
                      <Button variant="outline" size="sm" onClick={() => handleUpvote(thread.id)}>
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
                  </motion.div>
                ))}
              </div>
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