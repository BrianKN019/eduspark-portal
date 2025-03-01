
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Award } from 'lucide-react';

interface CourseProgressProps {
  isEnrolled: boolean;
  userProgress: number;
  hasCompletedCourse: boolean;
  hasCertificate: boolean;
  onEnroll: () => Promise<void>;
  onViewCertificate: () => void;
  onContinueLearning: () => void;
}

const CourseProgress: React.FC<CourseProgressProps> = ({
  isEnrolled,
  userProgress,
  hasCompletedCourse,
  hasCertificate,
  onEnroll,
  onViewCertificate,
  onContinueLearning
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {isEnrolled ? (
          <>
            <Progress value={userProgress} className="h-2" />
            <p className="text-sm mt-2">{userProgress}% completed</p>
            {hasCompletedCourse && (
              <div className="mt-4 flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                Course completed
              </div>
            )}
          </>
        ) : (
          <p className="text-sm">Enroll to track your progress</p>
        )}
      </CardContent>
      <CardFooter>
        {!isEnrolled ? (
          <Button onClick={onEnroll} className="w-full">
            Enroll Now
          </Button>
        ) : hasCompletedCourse ? (
          <Button 
            onClick={onViewCertificate} 
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600"
          >
            <Award className="mr-2 h-4 w-4" /> View Certificate
          </Button>
        ) : (
          <Button 
            onClick={onContinueLearning} 
            className="w-full"
          >
            Continue Learning
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseProgress;
