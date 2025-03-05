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
    let systemPrompt = `You are an expert course creator for ${field} at the ${level} level.`;
    let userPrompt = "";
    
    if (customPrompt) {
      // If a custom prompt is provided, use it
      userPrompt = customPrompt;
    } else {
      // Otherwise use default prompts based on lesson type
      if (lessonType === 'video') {
        userPrompt = `Write a comprehensive script for a video introduction lesson about "${title}". Include key concepts, core ideas, and why this topic matters. Format it in markdown with clear sections.`;
      } else if (lessonType === 'text') {
        userPrompt = `Create detailed educational text content about "${title}" at a ${level} level. Include explanations, examples, and key concepts. Format it in markdown with clear sections and bullet points where appropriate.`;
      } else if (lessonType === 'code') {
        userPrompt = `Provide practical code examples and explanations for "${title}" at a ${level} level. Include comments explaining what each part does. For non-programming subjects, provide practical frameworks, templates or models instead. Format in markdown with code blocks.`;
      } else if (lessonType === 'exercise') {
        userPrompt = `Design 3-5 practical exercises for "${title}" at a ${level} level. Include instructions, expected outcomes, and hints. Format in markdown with clear sections for each exercise.`;
      } else {
        userPrompt = `Summarize the key learnings about "${title}" at a ${level} level. Include major concepts covered and how they connect to real-world applications. Format in markdown.`;
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
        max_tokens: 2000,
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
