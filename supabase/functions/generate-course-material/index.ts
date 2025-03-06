
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

    // Construct a more detailed system prompt based on course info and lesson type
    let systemPrompt = `
      You are an expert course creator for ${field} at the ${level} level with years of teaching experience.
      You're creating premium educational content for Step ${stepNumber}: ${currentStep} in a structured 6-step learning approach.
      Your content should be comprehensive, engaging, and pedagogically sound to maximize student learning.
      
      Guidelines for exceptional content:
      1. Begin with a clear introduction that establishes relevance and learning objectives
      2. Use a conversational yet professional tone throughout
      3. Break complex concepts into digestible chunks with clear explanations
      4. Include real-world examples that demonstrate practical applications
      5. Embed thought-provoking questions to encourage active learning
      6. Use analogies and metaphors to connect new concepts to familiar ideas
      7. Incorporate visual descriptions that can be easily transformed into diagrams
      8. Conclude with a summary that reinforces key takeaways
      
      Format your output in clean, semantic markdown with:
      - Proper hierarchy of headings (H1, H2, H3, etc.)
      - Well-structured lists and bullet points
      - Code blocks with appropriate syntax highlighting
      - Blockquotes for important notes or callouts
      - Tables for comparative information where relevant
      - Consistent formatting throughout
    `;
    
    let userPrompt = "";
    
    if (customPrompt) {
      // If a custom prompt is provided, use it
      userPrompt = customPrompt;
    } else {
      // Create a more detailed course outline template with specific learning goals
      const courseLearningTemplate = `
      # ${title} - ${level} Level Course
      
      ## Step ${stepNumber}: ${currentStep}
      
      ### Learning Objectives
      - By the end of this section, students will be able to [specific measurable outcome]
      - Students will understand the core principles of [key concept]
      - Students will apply [technique/concept] to solve real-world problems
      
      ### Core Concepts
      1. [First key concept] and its importance in ${field}
      2. [Second key concept] and its relationship to [first concept]
      3. [Third key concept] and its practical applications
      
      ### Detailed Content Structure
      [Comprehensive, well-structured content goes here]
      
      ### Practical Applications
      [Hands-on exercises, case studies, and real-world examples]
      
      ### Self-Assessment
      [Questions, problems, or activities for students to test their understanding]
      
      ### Key Takeaways
      - Main insight 1 and why it matters
      - Main insight 2 and how it connects to broader concepts
      - Main insight 3 and its practical implications
      
      ### Further Resources
      [Additional materials, readings, tools, or references]
      `;

      // Content type-specific prompts based on lesson type with detailed instructions
      if (lessonType === 'video') {
        userPrompt = `
          Create a comprehensive video script for "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Script Requirements:
          1. INTRODUCTION (1-2 minutes)
             - Begin with an attention-grabbing hook related to ${field}
             - Clearly state what viewers will learn and why it matters
             - Provide a roadmap of the content to come
          
          2. MAIN CONTENT (8-10 minutes)
             - Divide content into 3-5 clearly defined sections
             - Include precise explanations with scaffolded complexity
             - Use concrete examples that demonstrate real-world application
             - Address common misconceptions or challenges
          
          3. VISUALS & DEMONSTRATIONS
             - Describe specific visuals that should appear at key moments
             - Include annotations for diagrams, charts, or code examples
             - Specify moments where demonstrations would enhance understanding
          
          4. ENGAGEMENT POINTS
             - Insert 2-3 questions for viewers to consider throughout
             - Include moments for reflection or brief activities
             - Create smooth transitions between concepts
          
          5. CONCLUSION (1-2 minutes)
             - Summarize key points clearly and concisely
             - Connect back to the learning objectives
             - Provide a preview of what comes next in the learning journey
             - End with a motivational call to action
          
          Make this script engaging and visually descriptive while maintaining educational rigor and depth.
          Include timestamp suggestions for each section to guide production.
        `;
      } else if (lessonType === 'text') {
        userPrompt = `
          Create comprehensive educational text content about "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Content Requirements:
          1. INTRODUCTION
             - Begin with a relevant scenario or question that highlights the importance of this topic
             - Clearly state learning objectives in student-centered language
             - Provide context for how this content connects to previous knowledge
          
          2. MAIN CONTENT
             - Develop 3-5 key concepts with detailed explanations and examples
             - Use progressive disclosure: start with fundamentals and build complexity
             - Include analogies or metaphors that make abstract concepts concrete
             - Incorporate historical context or evolution of ideas where relevant
          
          3. VISUAL ELEMENTS
             - Describe diagrams, charts, or illustrations that should accompany the text
             - Include tables for comparative information
             - Suggest callout boxes for definitions, tips, or important notes
          
          4. INTERACTIVE ELEMENTS
             - Insert reflective questions throughout to encourage active reading
             - Include 2-3 "Check Your Understanding" mini-exercises 
             - Suggest discussion points or thought experiments
          
          5. CONCLUSION & APPLICATION
             - Summarize key takeaways and their significance
             - Explain how this knowledge can be applied practically
             - Connect to upcoming topics or broader field implications
             - Suggest next steps for further exploration
          
          Format your content in clear, semantic markdown with proper headings, lists, emphasis, and other formatting to enhance readability and comprehension.
        `;
      } else if (lessonType === 'code') {
        userPrompt = `
          Provide detailed coding instruction and examples for "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Code Content Requirements:
          1. CONCEPTUAL FOUNDATION
             - Begin with a clear explanation of the programming concept or technique
             - Explain the problem this code solves and why it matters
             - Discuss when and why to use this approach
          
          2. CODE EXAMPLES (provide at least 3 examples with increasing complexity)
             - Start with a simple, focused example that demonstrates the core concept
             - Follow with a more complex implementation showing real-world application
             - Conclude with an advanced example that integrates with other concepts
             - Ensure all code is fully functional, optimized, and follows best practices
          
          3. LINE-BY-LINE EXPLANATIONS
             - Provide detailed comments explaining the purpose of each significant line
             - Highlight key programming patterns or techniques
             - Explain the "why" behind implementation choices, not just the "how"
          
          4. COMMON PITFALLS AND SOLUTIONS
             - Identify 3-5 common mistakes or bugs students might encounter
             - Provide debugging strategies and solutions
             - Contrast incorrect approaches with correct implementations
          
          5. OPTIMIZATION AND BEST PRACTICES
             - Discuss performance considerations
             - Explain design patterns or principles being applied
             - Highlight security considerations if relevant
          
          6. EXERCISES FOR PRACTICE (minimum 3)
             - Provide progressively challenging coding exercises
             - Include clear requirements and expected outputs
             - Offer hints and partial solutions
          
          Use proper markdown code blocks with appropriate language syntax highlighting.
          Include both code snippets and complete, runnable examples.
          For ${field}, focus particularly on [specific area/library/framework] techniques.
        `;
      } else if (lessonType === 'exercise') {
        userPrompt = `
          Design a comprehensive set of practical exercises for "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Exercise Requirements:
          1. SKILL-BUILDING PROGRESSION
             - Create 5-7 exercises that progress from basic to advanced application
             - Ensure each exercise builds on skills developed in previous ones
             - Target different cognitive levels (recall, application, analysis, creation)
          
          2. EXERCISE STRUCTURE (for each exercise, include):
             - Clear, specific learning objective
             - Detailed scenario or context that makes the exercise relevant
             - Step-by-step instructions with appropriate scaffolding
             - Resources or references students may need
             - Time estimate for completion
             - Specific deliverables or success criteria
          
          3. SUPPORT MATERIALS
             - Provide starter code, templates, or data files where appropriate
             - Include examples of expected output or completed work
             - Offer hints for students who get stuck at common points
          
          4. EXTENSION CHALLENGES
             - For each exercise, include an optional "stretch goal" for advanced students
             - Suggest ways to modify the exercise for different applications
          
          5. ASSESSMENT GUIDANCE
             - Provide detailed rubrics or assessment criteria
             - Include self-check questions for students to evaluate their work
             - Offer sample solutions with explanations (in collapsed sections)
          
          Design exercises that are practical, engaging, and directly applicable to real-world ${field} scenarios.
          Make them challenging but achievable for ${level} students with clear pathways to success.
        `;
      } else {
        userPrompt = `
          Create a comprehensive conclusion module for "${title}" at a ${level} level, focusing on Step ${stepNumber}: ${currentStep}.
          
          ${courseLearningTemplate}
          
          Conclusion Module Requirements:
          1. KNOWLEDGE SYNTHESIS
             - Summarize the key concepts covered throughout the course
             - Show connections between seemingly separate topics
             - Create a conceptual framework that integrates all major course elements
          
          2. PRACTICAL APPLICATION ROADMAP
             - Provide guidance on how to apply course knowledge in real-world contexts
             - Include specific scenarios where these skills are valuable
             - Suggest immediate next steps to implement what was learned
          
          3. COMMON MISCONCEPTIONS
             - Address 3-5 persistent misconceptions in ${field}
             - Provide clarifying examples and correct mental models
             - Explain why these misconceptions occur and how to avoid them
          
          4. MASTERY CHECKLIST
             - Create a self-assessment tool for students to evaluate their understanding
             - Include questions that test both knowledge and application
             - Provide benchmarks for different levels of mastery
          
          5. CONTINUING EDUCATION PATHWAYS
             - Recommend specific next courses or areas of study
             - Suggest resources for deepening knowledge in areas of interest
             - Outline potential specialization paths within ${field}
          
          6. INSPIRATIONAL ELEMENTS
             - Share success stories or case studies that motivate continued learning
             - Connect course material to cutting-edge developments in the field
             - Provide a vision of what mastery in this area enables
          
          Format this conclusion to serve as both a capstone for the course and a bridge to future learning.
          Make it reflective, forward-looking, and empowering for students completing the course.
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
        model: 'gpt-4o',  // Using the most capable model for high-quality content
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
