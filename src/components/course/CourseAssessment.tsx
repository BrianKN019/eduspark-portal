import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { generateAssessment } from '@/lib/api';
import { CheckCircle, X, AlertTriangle, Trophy, Loader2, Brain, BrainCircuit, Medal, CalendarDays } from 'lucide-react';
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
  explanation?: string;
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  useEffect(() => {
    fetchPreviousAssessments();
  }, [courseId]);
  
  const fetchPreviousAssessments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
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
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    
    try {
      const result = await supabase.functions.invoke('generate-assessment', {
        body: {
          courseId,
          courseName,
          field,
          level,
          difficulty: selectedDifficulty,
          questionCount: selectedDifficulty === 'beginner' ? 5 : 
                         selectedDifficulty === 'intermediate' ? 8 : 10
        }
      });
      
      if (result.error) {
        console.error("Error from generate-assessment function:", result.error);
        throw new Error(result.error);
      }
      
      if (!result.data || !result.data.assessment) {
        throw new Error("No assessment data returned from function");
      }
      
      setAssessment(result.data.assessment);
      toast.success("Assessment generated successfully!");
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast.error(`Failed to generate assessment: ${error.message}`);
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
    
    const allAnswered = assessment.questions.every(q => answers[q.id] !== undefined);
    
    if (!allAnswered) {
      toast.warning("Please answer all questions before submitting");
      return;
    }
    
    let correctAnswers = 0;
    assessment.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / assessment.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    setShowExplanation(true);
    
    saveAssessmentResult(calculatedScore);
  };
  
  const saveAssessmentResult = async (score: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
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
      
      const currentProgress = progressData?.progress_percentage || 0;
      const currentAssessmentScore = progressData?.assessment_score || 0;
      
      if (score > currentAssessmentScore) {
        const lessonsProgress = progressData?.completed_lessons?.length 
          ? (progressData.completed_lessons.length / 10) * 70
          : 0;
        
        const assessmentProgress = (score / 100) * 30;
        
        const totalProgress = Math.round(lessonsProgress + assessmentProgress);
        
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
        fetchPreviousAssessments();
      }
      
    } catch (e) {
      console.error("Exception in saveAssessmentResult:", e);
      toast.error("An error occurred");
    }
  };
  
  const handleNextQuestion = () => {
    if (!assessment) return;
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const renderAssessmentQuestion = (question: Question) => {
    if (!assessment) return null;
    
    const isCurrentQuestion = question.id === assessment.questions[currentQuestionIndex].id;
    if (!isCurrentQuestion && !isSubmitted) return null;
    
    const isCorrect = isSubmitted && answers[question.id] === question.correctAnswer;
    const isIncorrect = isSubmitted && answers[question.id] !== question.correctAnswer;
    
    return (
      <div key={question.id} className={`transition-all duration-300 ${isSubmitted ? '' : isCurrentQuestion ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}>
        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">
              {question.id}
            </div>
            <div className="flex-1">
              <p className="font-medium text-lg text-gray-800 dark:text-gray-100">{question.text}</p>
              {isSubmitted && (
                isCorrect ? 
                  <div className="flex items-center mt-1.5 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    <span className="text-sm font-medium">Correct</span>
                  </div> : 
                  isIncorrect ? 
                  <div className="flex items-center mt-1.5 text-red-600 dark:text-red-400">
                    <X className="h-4 w-4 mr-1.5" />
                    <span className="text-sm font-medium">Incorrect</span>
                  </div> : null
              )}
            </div>
          </div>
          
          <RadioGroup 
            value={answers[question.id]?.toString()} 
            onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
            className="ml-11 space-y-3"
            disabled={isSubmitted}
          >
            {question.options.map((option, index) => {
              const isOptionCorrect = isSubmitted && index === question.correctAnswer;
              const isOptionSelected = answers[question.id] === index;
              const isWrongSelection = isSubmitted && isOptionSelected && !isOptionCorrect;
              
              return (
                <div 
                  key={index} 
                  className={`flex items-start space-x-3 p-3 rounded-md border transition-all ${
                    isSubmitted ? (
                      isOptionCorrect ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 
                      isWrongSelection ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
                      'border-gray-200 dark:border-gray-700'
                    ) : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-700'
                  }`}
                >
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`q${question.id}-option${index}`} 
                    className={`
                      ${isOptionCorrect ? 'text-green-600 border-green-600' : ''}
                      ${isWrongSelection ? 'text-red-600 border-red-600' : ''}
                    `}
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`q${question.id}-option${index}`}
                      className={`font-medium ${
                        isOptionCorrect ? 'text-green-700 dark:text-green-400' : 
                        isWrongSelection ? 'text-red-700 dark:text-red-400' : 
                        'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option}
                    </Label>
                  </div>
                  {isSubmitted && isOptionCorrect && (
                    <CheckCircle className="text-green-600 h-5 w-5 flex-shrink-0" />
                  )}
                  {isSubmitted && isWrongSelection && (
                    <X className="text-red-600 h-5 w-5 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </RadioGroup>
          
          {isSubmitted && showExplanation && question.explanation && (
            <div className="ml-11 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center mb-2">
                <BrainCircuit className="h-4 w-4 mr-1.5" />
                Explanation
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderAssessmentResults = () => {
    if (!isSubmitted || !assessment) return null;
    
    const percentageScore = score;
    const isPassing = percentageScore >= 70;
    
    return (
      <Card className="mb-6 overflow-hidden">
        <CardHeader className={isPassing ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30" : "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"}>
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
          <CardDescription className="text-gray-700 dark:text-gray-300">
            {isPassing 
              ? "Congratulations! You've successfully passed this assessment and demonstrated your understanding of the material."
              : "You didn't meet the passing threshold of 70%. Consider reviewing the course material and trying again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Your Score:</span>
            <div className="flex items-center">
              {isPassing ? (
                <Medal className="h-5 w-5 mr-2 text-yellow-500" />
              ) : null}
              <span className={`text-2xl font-bold ${
                percentageScore >= 70 ? 'text-green-600 dark:text-green-400' : 
                percentageScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 
                'text-red-600 dark:text-red-400'
              }`}>{percentageScore}%</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden mt-4">
            <div 
              className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white transition-all duration-1000 ${
                percentageScore >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                percentageScore >= 70 ? 'bg-gradient-to-r from-green-500 to-teal-500' : 
                percentageScore >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 
                'bg-gradient-to-r from-red-500 to-rose-500'
              }`} 
              style={{ width: `${percentageScore}%` }}
            >
              {percentageScore >= 30 ? `${percentageScore}%` : ''}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {assessment.questions.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Questions</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round((percentageScore / 100) * assessment.questions.length)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Correct</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Difficulty</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={handleGenerateAssessment}
              variant={isPassing ? "outline" : "default"}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
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
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200 flex items-center">
          <Medal className="h-5 w-5 mr-2 text-yellow-500" />
          Previous Assessment Results
        </h3>
        <div className="space-y-3">
          {previousAssessments.slice(0, 5).map((result, index) => (
            <div 
              key={index} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)} Level
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  {new Date(result.completed_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className={`text-lg font-bold flex items-center ${
                result.score >= 70 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {result.score >= 70 && <Trophy className="h-4 w-4 mr-1.5" />}
                {result.score}%
              </div>
            </div>
          ))}
          
          {previousAssessments.length > 5 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              + {previousAssessments.length - 5} more assessment results
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-500 hover:bg-green-600';
      case 'intermediate': return 'bg-blue-500 hover:bg-blue-600';
      case 'advanced': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Course Assessment
          </CardTitle>
          <CardDescription>
            Test your knowledge and understanding of the course material with an interactive assessment.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {!assessment || isSubmitted ? (
        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Start an Assessment</CardTitle>
            <CardDescription>
              Select a difficulty level and start the assessment to test your knowledge of {courseName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              {renderAssessmentResults()}
              
              {!isSubmitted && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="difficulty" className="text-base font-medium block mb-3 text-gray-800 dark:text-gray-200">
                      Select Difficulty Level
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                        <Button
                          key={difficulty}
                          onClick={() => setSelectedDifficulty(difficulty)}
                          variant={selectedDifficulty === difficulty ? "default" : "outline"}
                          className={`h-auto py-6 flex flex-col items-center gap-2 ${
                            selectedDifficulty === difficulty ? 
                              getDifficultyColor(difficulty) : 
                              'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {difficulty === 'beginner' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                              <line x1="9" y1="9" x2="9.01" y2="9"></line>
                              <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                          )}
                          {difficulty === 'intermediate' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.69 2.69"></path>
                              <path d="M8 14.5 16 8"></path>
                              <path d="M8 10.8v4.7"></path>
                              <path d="M12 10.8v4.7"></path>
                              <path d="M16 13v2.5"></path>
                            </svg>
                          )}
                          {difficulty === 'advanced' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m18 15 5-5-5-5"></path>
                              <path d="M6 15 1 10 6 5"></path>
                              <path d="M12 3v18"></path>
                            </svg>
                          )}
                          <span className="capitalize font-medium">{difficulty}</span>
                          <span className="text-xs text-center">
                            {difficulty === 'beginner' && '5 questions • Basic concepts'}
                            {difficulty === 'intermediate' && '8 questions • Applied knowledge'}
                            {difficulty === 'advanced' && '10 questions • Expert challenges'}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateAssessment} 
                    disabled={isLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-6 px-8 rounded-lg shadow-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating AI Assessment...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Brain className="mr-2 h-5 w-5" />
                        Start AI-Powered Assessment
                      </span>
                    )}
                  </Button>
                </div>
              )}
              
              {renderPreviousAssessments()}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>
                  {assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)} level assessment | {assessment.questions.length} questions
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                <span>Question</span>
                <span className="font-bold">{currentQuestionIndex + 1}</span>
                <span>of</span>
                <span className="font-bold">{assessment.questions.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <div className="mb-6">
                <p className="mb-2 text-gray-700 dark:text-gray-300">{assessment.description}</p>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-4">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {!isSubmitted ? (
                assessment.questions.map(renderAssessmentQuestion)
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Review Your Answers</h3>
                  {assessment.questions.map(renderAssessmentQuestion)}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
            {!isSubmitted ? (
              <>
                <Button 
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                
                {currentQuestionIndex < assessment.questions.length - 1 ? (
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={answers[assessment.questions[currentQuestionIndex]?.id] === undefined}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Submit Assessment
                  </Button>
                )}
              </>
            ) : (
              <div className="w-full flex justify-center">
                <Button 
                  onClick={handleGenerateAssessment}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Take Another Assessment
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CourseAssessment;
