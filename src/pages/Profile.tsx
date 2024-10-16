import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Briefcase, Book } from 'lucide-react';

const Profile: React.FC = () => {
  const userProfile = {
    name: "Brian K",
    email: "brian.k@example.com",
    phone: "+1 234 567 8900",
    location: "Nairobi,  Kenya",
    occupation: "Software Developer",
    bio: "Passionate about learning and technology. Always eager to take on new challenges and expand my skillset.",
    courses: ["React Fundamentals", "Advanced JavaScript", "Node.js Basics"],
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold mb-4">User Profile</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="neumorphic-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userProfile.name}`} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold mb-2">{userProfile.name}</h3>
            <p className="text-muted-foreground mb-4">{userProfile.occupation}</p>
            <div className="w-full space-y-2">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {userProfile.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {userProfile.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {userProfile.location}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="neumorphic-card">
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{userProfile.bio}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {userProfile.courses.map((course, index) => (
              <li key={index} className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                {course}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Button className="w-full">Edit Profile</Button>
    </div>
  );
};

export default Profile;