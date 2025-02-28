
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAssessment } from '@/lib/api';
import { CheckCircle, X, AlertTriangle, Trophy } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface CourseAssessmentProps {
  courseId: string;
  courseName: string;
  field: string;
  level: string;
  onAssessmentComplete?: (score: number) => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
}

const CourseAssessment: React.FC<CourseAssessmentProps> = ({ 
  courseId, 
  courseName,
  field,
  level,
  onAssessmentComplete = () => {} // Provide default empty function
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [previousAssessments, setPreviousAssessments] = useState<any[]>([]);
  
  useEffect(() => {
    fetchPreviousAssessments();
  }, [courseId]);
  
  const fetchPreviousAssessments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Use a type assertion since we just created this table
      // and TypeScript doesn't know about it yet
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching previous assessments:", error);
        return;
      }
      
      setPreviousAssessments(data || []);
    } catch (e) {
      console.error("Exception in fetchPreviousAssessments:", e);
    }
  };
  
  const handleGenerateAssessment = async () => {
    setIsLoading(true);
    setIsSubmitted(false);
    setAnswers({});
    
    try {
      const assessment = await generateAssessment(courseId, selectedDifficulty, courseName);
      setAssessment(assessment);
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast.error("Failed to generate assessment");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  const handleSubmit = () => {
    if (!assessment) return;
    
    // Check if all questions are answered
    const allAnswered = assessment.questions.every(q => answers[q.id] !== undefined);
    
    if (!allAnswered) {
      toast.warning("Please answer all questions before submitting");
      return;
    }
    
    // Calculate score
    let correctAnswers = 0;
    assessment.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / assessment.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    // Save the assessment result
    saveAssessmentResult(calculatedScore);
  };
  
  const saveAssessmentResult = async (score: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Get the current course progress
      const { data: progressData, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      if (progressError && !progressError.message.includes('No rows found')) {
        console.error("Error fetching course progress:", progressError);
        toast.error("Failed to save assessment result");
        return;
      }
      
      // Check if this is a better score than the previous one
      const currentProgress = progressData?.progress_percentage || 0;
      const currentAssessmentScore = progressData?.assessment_score || 0;
      
      if (score > currentAssessmentScore) {
        // Calculate new progress
        // Assessment contributes 30% to the overall progress
        // Course material contributes 70%
        
        // Calculate course material progress (70% of total)
        const lessonsProgress = progressData?.completed_lessons?.length 
          ? (progressData.completed_lessons.length / 10) * 70 // Assuming 10 lessons per course
          : 0;
        
        // Calculate assessment progress (30% of total)
        const assessmentProgress = (score / 100) * 30;
        
        // Calculate total progress
        const totalProgress = Math.round(lessonsProgress + assessmentProgress);
        
        // If the new total progress is higher, update the progress
        if (totalProgress > currentProgress) {
          const { error: updateError } = await supabase
            .from('course_progress')
            .update({
              progress_percentage: totalProgress,
              assessment_score: score,
              last_accessed: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('course_id', courseId);
            
          if (updateError) {
            console.error("Error updating course progress:", updateError);
            toast.error("Failed to update progress");
          } else {
            toast.success("Course progress updated!");
            onAssessmentComplete(totalProgress);
          }
        } else {
          // Just save the assessment score without updating progress
          const { error: updateError } = await supabase
            .from('course_progress')
            .update({
              assessment_score: score,
              last_accessed: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('course_id', courseId);
            
          if (updateError) {
            console.error("Error updating assessment score:", updateError);
            toast.error("Failed to update assessment score");
          } else {
            toast.success("Assessment score updated!");
            onAssessmentComplete(currentProgress);
          }
        }
      }
      
      // Save the assessment result
      const { error } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          course_id: courseId,
          score,
          difficulty: selectedDifficulty,
          completed_at: new Date().toISOString()
        });
      
      if (error) {
        console.error("Error saving assessment result:", error);
        toast.error("Failed to save assessment result");
      } else {
        // Refresh the list of previous assessments
        fetchPreviousAssessments();
      }
      
    } catch (e) {
      console.error("Exception in saveAssessmentResult:", e);
      toast.error("An error occurred");
    }
  };
  
  const renderAssessmentQuestion = (question: Question) => {
    const isCorrect = isSubmitted && answers[question.id] === question.correctAnswer;
    const isIncorrect = isSubmitted && answers[question.id] !== question.correctAnswer;
    
    return (
      <div key={question.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-start gap-2 mb-3">
          <span className="font-medium text-lg">{question.id}.</span>
          <span className="flex-1">{question.text}</span>
          {isSubmitted && (
            isCorrect ? 
              <CheckCircle className="text-green-500 h-5 w-5 mt-1" /> : 
              isIncorrect ? <X className="text-red-500 h-5 w-5 mt-1" /> : null
          )}
        </div>
        
        <RadioGroup 
          value={answers[question.id]?.toString()} 
          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
          className="ml-7 space-y-2"
          disabled={isSubmitted}
        >
          {question.options.map((option, index) => {
            const isOptionCorrect = isSubmitted && index === question.correctAnswer;
            const isOptionSelected = answers[question.id] === index;
            
            return (
              <div 
                key={index} 
                className={`flex items-start space-x-2 ${
                  isSubmitted ? (
                    isOptionCorrect ? 'text-green-600 dark:text-green-400' : 
                    isOptionSelected ? 'text-red-600 dark:text-red-400' : ''
                  ) : ''
                }`}
              >
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`q${question.id}-option${index}`} 
                  className={isOptionCorrect ? 'border-green-500 text-green-500' : ''}
                />
                <Label 
                  htmlFor={`q${question.id}-option${index}`}
                  className="font-normal"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    );
  };
  
  const renderAssessmentResults = () => {
    if (!isSubmitted || !assessment) return null;
    
    const percentageScore = score;
    const isPassing = percentageScore >= 70;
    
    return (
      <Card className="mb-6">
        <CardHeader className={isPassing ? "bg-green-100 dark:bg-green-900/20" : "bg-amber-100 dark:bg-amber-900/20"}>
          <CardTitle className="flex items-center gap-2">
            {isPassing ? (
              <>
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span>Assessment Completed Successfully!</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                <span>Assessment Needs Improvement</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isPassing 
              ? "Congratulations! You've successfully passed this assessment."
              : "You didn't meet the passing threshold of 70%. Consider reviewing the material and trying again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg">Your Score:</span>
            <span className="text-2xl font-bold">{percentageScore}%</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
            <div 
              className={`h-4 rounded-full ${
                percentageScore >= 70 
                  ? 'bg-green-500' 
                  : percentageScore >= 50 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'
              }`} 
              style={{ width: `${percentageScore}%` }}
            ></div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={handleGenerateAssessment}
              variant={isPassing ? "outline" : "default"}
            >
              {isPassing ? "Take Another Assessment" : "Try Again"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderPreviousAssessments = () => {
    if (previousAssessments.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Previous Assessment Results</h3>
        <div className="space-y-2">
          {previousAssessments.map((result, index) => (
            <div 
              key={index} 
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)} Level
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(result.completed_at).toLocaleDateString()}
                </div>
              </div>
              <div className={`text-lg font-bold ${
                result.score >= 70 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {result.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">Course Assessment</CardTitle>
          <CardDescription>
            Test your knowledge of the course material with an assessment.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {!assessment || isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Start an Assessment</CardTitle>
            <CardDescription>
              Select a difficulty level and start the assessment to test your knowledge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={selectedDifficulty} 
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger id="difficulty" className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {renderAssessmentResults()}
              
              {!isSubmitted && (
                <Button 
                  onClick={handleGenerateAssessment} 
                  disabled={isLoading}
                  className="md:w-[200px]"
                >
                  {isLoading ? "Generating..." : "Start Assessment"}
                </Button>
              )}
              
              {renderPreviousAssessments()}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{assessment.title}</CardTitle>
            <CardDescription>
              {assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)} level assessment | {assessment.questions.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="mb-6">{assessment.description}</p>
              
              {assessment.questions.map(renderAssessmentQuestion)}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit}
              className="ml-auto"
            >
              Submit Assessment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CourseAssessment;

