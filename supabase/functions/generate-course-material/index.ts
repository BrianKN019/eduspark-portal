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

    // Construct the prompt based on course info and lesson type
    let systemPrompt = `You are an expert course creator for ${field} at the ${level} level. Follow a structured 6-step learning approach for all content creation to ensure comprehensive, effective learning.`;
    let userPrompt = "";
    
    if (customPrompt) {
      // If a custom prompt is provided, use it
      userPrompt = customPrompt;
    } else {
      // Create a general course outline template
      const courseLearningTemplate = `
      # ${title} - ${level} Level Course
      
      ## Step 1: Knowledge Assessment
      1. Break down ${title} into core components
      2. Evaluate complexity levels of each component
      3. Map prerequisites and dependencies
      4. Identify foundational concepts
      
      ## Step 2: Learning Path Design
      1. Create progression milestones based on ${level} level
      2. Structure topics in optimal learning sequence
      3. Estimate time requirements per topic
      4. Align with typical learning constraints
      
      ## Step 3: Resource Curation
      1. Identify learning materials matching different learning styles:
         - Video resources
         - Reading materials
         - Interactive exercises
         - Practice projects
      2. Rank resources by effectiveness
      3. Create resource playlist
      
      ## Step 4: Practice Framework
      1. Design exercises for each topic
      2. Create real-world application scenarios
      3. Develop progress checkpoints
      4. Structure review intervals
      
      ## Step 5: Progress Tracking System
      1. Define measurable progress indicators
      2. Create assessment criteria
      3. Design feedback loops
      4. Establish milestone completion metrics
      
      ## Step 6: Study Schedule Suggestion
      1. Break down learning into manageable tasks
      2. Incorporate rest and review periods
      3. Add checkpoint assessments
      4. Balance theory and practice
      `;

      // Otherwise use default prompts based on lesson type
      if (lessonType === 'video') {
        userPrompt = `Write a comprehensive script for a video introduction lesson about "${title}" at a ${level} level. 
        
        ${courseLearningTemplate}
        
        Format your response in markdown with clear sections, and focus on what would be said in the video.`;
      } else if (lessonType === 'text') {
        userPrompt = `Create detailed educational text content about "${title}" at a ${level} level. 
        
        ${courseLearningTemplate}
        
        Include explanations, examples, and key concepts. Format it in markdown with clear sections and bullet points where appropriate.`;
      } else if (lessonType === 'code') {
        userPrompt = `Provide practical code examples and explanations for "${title}" at a ${level} level. 
        
        ${courseLearningTemplate}
        
        Include comments explaining what each part does. For non-programming subjects, provide practical frameworks, templates or models instead. Format in markdown with code blocks.`;
      } else if (lessonType === 'exercise') {
        userPrompt = `Design 3-5 practical exercises for "${title}" at a ${level} level.
        
        ${courseLearningTemplate}
        
        Include instructions, expected outcomes, and hints. Format in markdown with clear sections for each exercise.`;
      } else {
        userPrompt = `Summarize the key learnings about "${title}" at a ${level} level. 
        
        ${courseLearningTemplate}
        
        Include major concepts covered and how they connect to real-world applications. Format in markdown.`;
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
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
        title: title,
        type: lessonType
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
