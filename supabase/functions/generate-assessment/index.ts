
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseName, field, level, difficulty, questionCount = 10 } = await req.json();
    
    if (!openAIApiKey) {
      console.log("OpenAI API key not found, using static assessment");
      // Return static assessment if OpenAI API key is not available
      return new Response(
        JSON.stringify({ 
          assessment: generateStaticAssessment(courseName, field, difficulty, questionCount)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${difficulty} assessment for ${courseName} (${field}, ${level})`);

    // Create improved prompt for OpenAI
    const prompt = `
      Create a comprehensive ${difficulty} level assessment for a ${level} course on ${field} titled "${courseName}".
      
      Follow these guidelines:
      1. Generate exactly ${questionCount} challenging multiple-choice questions with 4 options each
      2. For each question, provide a clear question text that tests conceptual understanding
      3. Make options realistic and non-obvious - avoid very clear wrong answers
      4. Include practical scenario questions where appropriate
      5. For coding-related topics, include code interpretation questions
      6. Indicate which option (0-3) is correct for each question
      7. Add a brief but thorough explanation for why each correct answer is right (to be shown after answering)
      8. Provide varied difficulty levels within the assessment to test different skills
      
      Format the response as a valid JSON object with this structure:
      {
        "title": "${courseName} Assessment",
        "description": "Comprehensive ${difficulty} level assessment to test your knowledge of ${field} concepts.",
        "difficulty": "${difficulty}",
        "questions": [
          {
            "id": 1,
            "text": "Question text goes here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Brief explanation of why this answer is correct"
          },
          ...
        ]
      }
    `;

    // Call OpenAI API with improved parameters
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert educational assessment creator specializing in creating challenging, fair, and educational multiple-choice questions. Your assessments should be appropriate for the specified difficulty level and subject area, and should provide valuable learning experiences for students.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      console.error('Invalid response from OpenAI API:', data);
      throw new Error('Invalid response from OpenAI API');
    }
    
    const generatedText = data.choices[0].message.content;
    console.log("Generated assessment successfully");
    
    // Parse the JSON response from OpenAI
    try {
      // Extract the JSON object from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No valid JSON found in response');
        throw new Error('No valid JSON found in response');
      }
      
      const assessmentData = JSON.parse(jsonMatch[0]);
      
      // Add an ID to the assessment
      assessmentData.id = `ai-assessment-${courseName.replace(/\s+/g, '-').toLowerCase()}-${difficulty}-${Date.now()}`;
      
      return new Response(
        JSON.stringify({ assessment: assessmentData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fall back to static assessment if parsing fails
      return new Response(
        JSON.stringify({ 
          assessment: generateStaticAssessment(courseName, field, difficulty, questionCount),
          error: 'Failed to parse AI-generated assessment'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-assessment function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        assessment: null
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Fallback function to generate static assessments
function generateStaticAssessment(courseName: string, field: string, difficulty: string, questionCount: number) {
  const mockQuestions = [...Array(questionCount)].map((_, index) => ({
    id: index + 1,
    text: `Sample question ${index + 1} about ${field} (${difficulty} level)`,
    options: [
      `Option A for question ${index + 1}`,
      `Option B for question ${index + 1}`,
      `Option C for question ${index + 1}`,
      `Option D for question ${index + 1}`
    ],
    correctAnswer: Math.floor(Math.random() * 4), // Random correct answer
    explanation: `This is the explanation for question ${index + 1}`
  }));
  
  return {
    id: `static-assessment-${courseName.replace(/\s+/g, '-').toLowerCase()}-${difficulty}`,
    title: `${courseName} Assessment`,
    description: `Test your knowledge of ${field} concepts at the ${difficulty} level.`,
    difficulty,
    questions: mockQuestions
  };
}
