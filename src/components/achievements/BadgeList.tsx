import React from 'react';
import { Badge } from '@/types/achievements';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from 'lucide-react';

interface BadgeListProps {
  badges: Badge[];
}

const BadgeList: React.FC<BadgeListProps> = ({ badges }) => {
  const handleShare = (badge: Badge) => {
    // Implement sharing functionality
    console.log('Sharing badge:', badge.name);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <Card key={badge.id} className="neumorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{badge.name}</span>
              <span className={`text-sm ${badge.tier === 'gold' ? 'text-yellow-500' : badge.tier === 'silver' ? 'text-gray-400' : 'text-orange-600'}`}>
                {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img src={badge.imageUrl} alt={badge.name} className="w-24 h-24 mx-auto mb-4" />
            <p className="text-sm text-center mb-4">{badge.description}</p>
            <Button onClick={() => handleShare(badge)} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share Badge
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BadgeList;