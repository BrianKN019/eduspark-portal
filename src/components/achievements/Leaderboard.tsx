import React from 'react';
import { LeaderboardEntry } from '@/types/achievements';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Badges</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry, index) => (
          <TableRow key={entry.userId}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{entry.username}</TableCell>
            <TableCell>{entry.badgeCount}</TableCell>
            <TableCell className="text-right">{entry.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Leaderboard;