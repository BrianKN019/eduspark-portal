import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BrainCircuit, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

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

interface CourseAssessmentProps {
  courseId: string;
  courseName: string;
  field: string;
  level: string;
}

const CourseAssessment: React.FC<CourseAssessmentProps> = ({ 
  courseId, 
  courseName,
  field,
  level
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const handleStartAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          field,
          level,
          difficulty: selectedDifficulty,
          questionCount: selectedDifficulty === 'beginner' ? 5 : selectedDifficulty === 'intermediate' ? 8 : 10
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate assessment');
      }
      
      const result = await response.json();
      
      if (result.assessment) {
        setAssessment(result.assessment);
        setAnswers(new Array(result.assessment.questions.length).fill(-1));
        setShowResults(false);
        setScore(0);
      } else {
        generateStaticAssessment();
      }
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast.error("Failed to connect to AI service. Using local generation instead.");
      generateStaticAssessment();
    } finally {
      setLoading(false);
    }
  };
  
  const generateStaticAssessment = () => {
    const questionCount = selectedDifficulty === 'beginner' ? 5 : 
                          selectedDifficulty === 'intermediate' ? 8 : 10;
    
    const mockQuestions = [...Array(questionCount)].map((_, index) => ({
      id: index + 1,
      text: `Sample question ${index + 1} about ${field} (${selectedDifficulty} level)`,
      options: [
        `Option A for question ${index + 1}`,
        `Option B for question ${index + 1}`,
        `Option C for question ${index + 1}`,
        `Option D for question ${index + 1}`
      ],
      correctAnswer: Math.floor(Math.random() * 4)
    }));
    
    const generatedAssessment = {
      id: `assessment-${courseId}-${selectedDifficulty}`,
      title: `${courseName} Assessment`,
      description: `Test your knowledge of ${field} concepts at the ${selectedDifficulty} level.`,
      difficulty: selectedDifficulty,
      questions: mockQuestions
    };
    
    setAssessment(generatedAssessment);
    setAnswers(new Array(mockQuestions.length).fill(-1));
    setShowResults(false);
    setScore(0);
  };
  
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };
  
  const handleSubmitAssessment = () => {
    if (!assessment) return;
    
    if (answers.includes(-1)) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === assessment.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / assessment.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    saveAssessmentResult(finalScore);
    
    if (finalScore >= 80) {
      toast.success(`Congratulations! You scored ${finalScore}%`);
    } else if (finalScore >= 60) {
      toast.info(`You scored ${finalScore}%. Keep practicing!`);
    } else {
      toast.info(`You scored ${finalScore}%. Review the material and try again.`);
    }
  };
  
  const saveAssessmentResult = async (score: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { error } = await (supabase
        .from('assessment_results' as any)
        .insert({
          user_id: user.id,
          course_id: courseId,
          score,
          difficulty: selectedDifficulty,
          completed_at: new Date().toISOString()
        }));
      
      if (error) {
        console.error("Error saving assessment result:", error);
        toast.error("Failed to save assessment result");
      }
    } catch (error) {
      console.error("Error in saveAssessmentResult:", error);
      toast.error("An error occurred while saving your result");
    }
  };
  
  const handleRestartAssessment = () => {
    setAssessment(null);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
  };
  
  const assessmentDifficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];
  
  return (
    <div className="space-y-6">
      {!assessment ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5" />
              Course Assessment
            </CardTitle>
            <CardDescription>
              Test your knowledge with AI-generated questions based on the course content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Select Difficulty</h3>
                <div className="flex flex-wrap gap-3">
                  {assessmentDifficulties.map((difficulty) => (
                    <button
                      key={difficulty.value}
                      onClick={() => setSelectedDifficulty(difficulty.value as any)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedDifficulty === difficulty.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">About {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Assessments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedDifficulty === 'beginner'
                    ? 'Basic questions to test your understanding of fundamental concepts. Perfect if you\'re new to the subject.'
                    : selectedDifficulty === 'intermediate'
                    ? 'Moderate difficulty questions that require deeper understanding of the course material.'
                    : 'Challenging questions that test advanced concepts and application of knowledge.'}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleStartAssessment} 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Assessment...
                </>
              ) : 'Start Assessment'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {assessment.title} - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Level
            </CardTitle>
            <CardDescription>
              {assessment.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {assessment.questions.map((question, qIndex) => (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg ${
                    showResults 
                      ? answers[qIndex] === question.correctAnswer 
                        ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-start mb-3">
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 h-6 w-6 rounded-full flex items-center justify-center text-sm mr-2">
                      {qIndex + 1}
                    </span>
                    <h3 className="font-medium">{question.text}</h3>
                  </div>
                  
                  <RadioGroup
                    value={answers[qIndex]?.toString() || ""}
                    onValueChange={(value) => handleAnswerSelect(qIndex, parseInt(value))}
                    disabled={showResults}
                  >
                    {question.options.map((option, oIndex) => (
                      <div 
                        key={oIndex} 
                        className={`flex items-center space-x-2 p-2 rounded ${
                          showResults && oIndex === question.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900'
                            : showResults && answers[qIndex] === oIndex && oIndex !== question.correctAnswer
                            ? 'bg-red-100 dark:bg-red-900'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                        <Label htmlFor={`q${qIndex}-o${oIndex}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                        {showResults && oIndex === question.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                        )}
                        {showResults && answers[qIndex] === oIndex && oIndex !== question.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500 ml-2" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {showResults ? (
              <>
                <div className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-center">
                  <h3 className="text-lg font-medium mb-2">Your Score</h3>
                  <div className="text-3xl font-bold mb-2">{score}%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {score >= 80
                      ? 'Excellent! You have a strong understanding of the material.'
                      : score >= 60
                      ? 'Good job! You\'re on the right track, but there\'s room for improvement.'
                      : 'Keep studying! Review the course materials and try again.'}
                  </p>
                </div>
                <Button onClick={handleRestartAssessment} className="w-full">
                  Try Another Assessment
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSubmitAssessment}
                className="w-full"
                disabled={answers.includes(-1)}
              >
                Submit Answers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CourseAssessment;
