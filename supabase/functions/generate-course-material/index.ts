
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseId, title, field, level, lessonIndex, lessonType, customPrompt } = await req.json();
    
    console.log(`Generating material for course ${courseId}, lesson ${lessonIndex}, type ${lessonType}`);
    
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    // Define the 6-step learning approach
    const sixStepLearning = [
      "Knowledge Assessment",
      "Learning Path Design",
      "Resource Curation",
      "Practice Framework",
      "Progress Tracking System",
      "Study Schedule Suggestion"
    ];

    // Get the appropriate step for this lesson
    const stepNumber = lessonIndex < sixStepLearning.length ? lessonIndex + 1 : 1;
    const currentStep = sixStepLearning[lessonIndex % sixStepLearning.length];

    // Construct the prompt based on course info and lesson type
    let systemPrompt = `
      You are an expert course creator for ${field} at the ${level} level.
      You're creating content for Step ${stepNumber}: ${currentStep} in a structured 6-step learning approach.
      Your content should be comprehensive, effective, and engaging for students.
      Format your output in clean markdown with proper headings, lists, and code blocks where appropriate.
      Use realistic examples and practical applications wherever possible.
      Include visual descriptions where appropriate to enhance learning.
    `;
    
    let userPrompt = "";
    
    if (customPrompt) {
      // If a custom prompt is provided, use it
      userPrompt = customPrompt;
    } else {
      // Create a more detailed course outline template
      const courseLearningTemplate = `
      # ${title} - ${level} Level Course
      
      ## Step ${stepNumber}: ${currentStep}
      
      ### Overview
      - What this step covers and why it's important for ${field}
      - How this fits into the overall learning journey
      - What students will be able to do after this section
      
      ### Core Concepts
      1. First key concept in ${currentStep}
      2. Second key concept
      3. Third key concept
      
      ### Detailed Exploration
      [Detailed content goes here]
      
      ### Practical Application
      [Exercises and examples go here]
      
      ### Key Takeaways
      - Main point 1
      - Main point 2
      - Main point 3
      
      ### Next Steps
      What comes next in the learning journey
      `;

      // Content type-specific prompts based on lesson type
      if (lessonType === 'video') {
        userPrompt = `
          Create a comprehensive video script introducing "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Format your response in markdown with clear sections for:
          1. INTRODUCTION (hook, overview of what will be covered)
          2. MAIN CONTENT (divided into logical sections with clear explanations)
          3. VISUALS (descriptions of what should be shown on screen at key points)
          4. CONCLUSION (summary and next steps)
          
          Make the content engaging, visual, and suitable for a 10-15 minute educational video.
          Include real-world examples and applications specific to ${field} that students can relate to.
          Ensure the material is technically accurate and up-to-date.
        `;
      } else if (lessonType === 'text') {
        userPrompt = `
          Create detailed educational text content about "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Format your response in markdown with:
          - Clear headings and subheadings
          - Concise paragraphs explaining key concepts
          - Bullet points for lists of important information
          - Bold text for key terms and definitions
          - Code blocks for any technical examples
          - Real-world examples and applications
          
          The content should be comprehensive but easy to read and understand.
          Cover all necessary theoretical foundations while focusing on practical applications.
          Include analogies or comparisons that help clarify complex concepts.
          Address common misconceptions or challenges that students typically face.
        `;
      } else if (lessonType === 'code') {
        userPrompt = `
          Provide practical code examples and explanations for "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Format your response in markdown with:
          - A brief introduction to the coding concepts
          - Multiple code examples with increasing complexity
          - Detailed line-by-line explanations
          - Common pitfalls and best practices
          - Exercises for the student to try
          
          Make sure all code is correct, well-commented, and follows best practices.
          Include edge cases and error handling where appropriate.
          Show both the "simple way" and the "best practice way" when relevant.
          Explain the reasoning behind coding decisions, not just how to write the code.
          For ${field}, focus particularly on industry-standard approaches and tools.
        `;
      } else if (lessonType === 'exercise') {
        userPrompt = `
          Design 3-5 practical exercises for "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Format each exercise in markdown with:
          - Clear objective
          - Detailed instructions
          - Any starter code or materials needed
          - Expected outcome
          - Hints for students who get stuck
          - Solution (in a collapsed section if possible)
          
          Make the exercises progressive in difficulty and relevant to real-world applications.
          Include a mix of guided practice and open-ended challenges.
          Design exercises that reinforce the key learning outcomes.
          For each exercise, explain what skills or concepts it is meant to develop.
          Make sure the exercises are appropriate for the ${level} level in ${field}.
        `;
      } else {
        userPrompt = `
          Create a comprehensive summary of "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Format your response in markdown with:
          - Recap of key concepts covered
          - How these concepts connect to real-world applications
          - Common misconceptions and clarifications
          - Resources for further learning
          - Next steps in the learning journey
          
          Make this conclusion tie together all the key points and provide a clear path forward.
          Emphasize practical applications and how the knowledge can be applied.
          Include motivational elements that encourage continuing the learning journey.
          Suggest specific next steps or additional resources to explore.
          Connect this module to upcoming modules or broader ${field} concepts.
        `;
      }
    }

    console.log("Calling OpenAI API for course material generation");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Successfully generated course material');
    
    return new Response(
      JSON.stringify({ 
        content: generatedContent,
        title: `${title} - Step ${stepNumber}: ${currentStep}`,
        type: lessonType,
        step: {
          number: stepNumber,
          name: currentStep
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error in generate-course-material function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
