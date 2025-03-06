
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

    // Create improved prompt for OpenAI with more detailed instructions
    const prompt = `
      Create a comprehensive, professional ${difficulty} level assessment for a ${level} course on ${field} titled "${courseName}".
      
      Follow these guidelines precisely:
      1. Generate exactly ${questionCount} challenging multiple-choice questions with 4 options each
      2. For each question, provide detailed question text that tests deep conceptual understanding
      3. Make options realistic and non-obvious - ensure all options are plausible and similarly structured
      4. Include at least 30% practical scenario-based questions that apply theoretical knowledge
      5. For coding-related topics, include code interpretation questions with proper syntax highlighting
      6. Indicate which option (0-3) is correct for each question
      7. Provide thorough, educational explanations (3-4 sentences minimum) for why the correct answer is right and why the other options are incorrect
      8. Vary question difficulty to test both foundational knowledge and advanced applications
      9. Use clear, concise professional language appropriate for ${level} students
      10. Ensure questions cover the full breadth of topics in ${field}, with appropriate distribution
      
      Format the response as a valid JSON object with this structure:
      {
        "title": "${courseName} Assessment",
        "description": "Comprehensive ${difficulty} level assessment to evaluate mastery of key ${field} concepts and applications.",
        "difficulty": "${difficulty}",
        "questions": [
          {
            "id": 1,
            "text": "Question text goes here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Detailed explanation of why this answer is correct and why others are incorrect"
          },
          ...
        ]
      }
    `;

    try {
      // Call OpenAI API with improved parameters for higher quality content
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',  // Using the latest and most capable model
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert educational content creator with advanced degrees in instructional design and subject matter expertise. You create assessments that are challenging yet fair, with educational value beyond just testing knowledge. Your questions should promote critical thinking and help students understand complex concepts more deeply.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

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
    } catch (openaiError) {
      console.error('Error calling OpenAI API:', openaiError);
      throw new Error(`Error generating assessment with OpenAI: ${openaiError.message}`);
    }
  } catch (error) {
    console.error('Error in generate-assessment function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
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
  const assessments = {
    "python": [
      {
        id: 1,
        text: "What is the output of the following code?\n\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)\n```",
        options: [
          "[1, 2, 3]",
          "[1, 2, 3, 4]",
          "[1, 2, 3, [4]]",
          "Error"
        ],
        correctAnswer: 1,
        explanation: "In Python, assignment operations create references to the same object, not copies. When y = x is executed, both variables point to the same list. So when y.append(4) is called, it modifies the shared list object. Therefore, printing x shows [1, 2, 3, 4]."
      },
      {
        id: 2,
        text: "Which of the following is NOT a built-in data type in Python?",
        options: [
          "list",
          "dictionary",
          "array", 
          "tuple"
        ],
        correctAnswer: 2,
        explanation: "Array is not a built-in data type in Python. While Python has the array module in its standard library, arrays are not built-in types like lists, dictionaries, and tuples. Instead, lists serve as the most commonly used sequence type."
      },
      {
        id: 3,
        text: "What is the purpose of the 'self' parameter in Python class methods?",
        options: [
          "To refer to the class itself",
          "To refer to the instance of the class",
          "To make the method private",
          "To make the method static"
        ],
        correctAnswer: 1,
        explanation: "In Python class methods, 'self' refers to the instance of the class. It's a convention that allows instance methods to reference and modify instance attributes. When a method is called on an object, the reference to that object is automatically passed as the first parameter (self)."
      },
      {
        id: 4,
        text: "What is the difference between '==' and 'is' operators in Python?",
        options: [
          "'==' compares values while 'is' compares types",
          "'==' compares references while 'is' compares values",
          "'==' compares values while 'is' compares memory locations",
          "They are completely interchangeable"
        ],
        correctAnswer: 2,
        explanation: "In Python, '==' checks if two objects have the same value, while 'is' checks if two variables point to the same object in memory (identical memory location). For example, two different lists with the same elements would be equal (==) but not identical (is)."
      },
      {
        id: 5,
        text: "What is the output of the following code?\n\n```python\ndef func(x=[]):\n    x.append(1)\n    return x\n\nprint(func())\nprint(func())\n```",
        options: [
          "[1] and [1]",
          "[1] and [1, 1]",
          "[] and [1]",
          "[1] and []"
        ],
        correctAnswer: 1,
        explanation: "This question tests understanding of mutable default arguments in Python. Default arguments are evaluated only once when the function is defined, not each time it's called. The list x is created once when the function is defined, so each call to func() uses the same list, appending to it each time. That's why the output is [1] after the first call and [1, 1] after the second call."
      },
      {
        id: 6,
        text: "Which of the following is true about Python's Global Interpreter Lock (GIL)?",
        options: [
          "It allows multiple threads to execute Python bytecode simultaneously",
          "It prevents multiple threads from executing Python bytecode simultaneously",
          "It only affects multiprocessing, not multithreading",
          "It was removed in Python 3.x"
        ],
        correctAnswer: 1,
        explanation: "The Global Interpreter Lock (GIL) in Python prevents multiple threads from executing Python bytecode simultaneously within a single process. It's a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. This is why CPU-bound threading in Python doesn't utilize multiple cores effectively."
      },
      {
        id: 7,
        text: "What is the primary purpose of Python decorators?",
        options: [
          "To add comments to functions",
          "To modify or extend the behavior of functions or methods without changing their code",
          "To optimize function performance",
          "To make functions private"
        ],
        correctAnswer: 1,
        explanation: "Python decorators are a powerful feature that allows you to modify or extend the behavior of functions or methods without directly changing their source code. They wrap a function, modifying its behavior, and are denoted by the @decorator_name syntax. Common uses include adding logging, enforcing access control, or measuring execution time."
      },
      {
        id: 8,
        text: "In the context of Python's memory management, what does garbage collection do?",
        options: [
          "It immediately frees memory when variables go out of scope",
          "It reclaims memory occupied by objects that are no longer in use",
          "It defragments memory to optimize performance",
          "It forces the developer to manually manage memory"
        ],
        correctAnswer: 1,
        explanation: "Garbage collection in Python reclaims memory occupied by objects that are no longer in use or referenced. Python uses both reference counting and a generational garbage collector to detect and clean up unreachable objects. This automatic memory management helps prevent memory leaks without requiring manual memory allocation and deallocation."
      },
      {
        id: 9,
        text: "What is the purpose of the '__init__' method in Python classes?",
        options: [
          "To initialize class variables when an instance is created",
          "To make the class inherited",
          "To make the class singleton",
          "To define class methods"
        ],
        correctAnswer: 0,
        explanation: "The '__init__' method in Python classes is a special method that gets called automatically when a new instance of the class is created. Its primary purpose is to initialize the object's attributes. It's similar to constructors in other object-oriented programming languages, allowing you to set up the initial state of an object."
      },
      {
        id: 10,
        text: "What will the following code output?\n\n```python\ntry:\n    print(1/0)\nexcept ZeroDivisionError:\n    print('Error')\nfinally:\n    print('Done')\n```",
        options: [
          "Error\\nDone",
          "Done",
          "Error",
          "Nothing, it will crash"
        ],
        correctAnswer: 0,
        explanation: "The code attempts to divide 1 by 0, which raises a ZeroDivisionError. The exception is caught by the 'except ZeroDivisionError:' block, which prints 'Error'. The 'finally' block is always executed, regardless of whether an exception occurred or was caught, so it prints 'Done'. The complete output is 'Error' followed by 'Done' on a new line."
      }
    ],
    "javascript": [
      {
        id: 1,
        text: "What is the output of the following code?\n\n```javascript\nconsole.log(typeof null);\n```",
        options: [
          "null",
          "object",
          "undefined",
          "number"
        ],
        correctAnswer: 1,
        explanation: "In JavaScript, typeof null returns 'object'. This is actually a long-standing bug in JavaScript that hasn't been fixed for legacy reasons. Null is not an object; it's a primitive value, but typeof null returns 'object' due to this historical quirk."
      },
      {
        id: 2,
        text: "Which of the following correctly creates a Promise that resolves after a timeout?",
        options: [
          "new Promise(setTimeout(resolve, 1000))",
          "new Promise(resolve => setTimeout(resolve, 1000))",
          "new Promise(function(resolve) { setTimeout(1000, resolve); })",
          "Promise.timeout(1000)"
        ],
        correctAnswer: 1,
        explanation: "To create a Promise that resolves after a timeout, you need to pass a function to the Promise constructor that takes resolve and reject parameters. The correct syntax is 'new Promise(resolve => setTimeout(resolve, 1000))'. This creates a Promise that will resolve after 1000 milliseconds (1 second)."
      },
      {
        id: 3,
        text: "What is the difference between '==' and '===' operators in JavaScript?",
        options: [
          "'==' checks for equality, '===' checks for equality and type",
          "'===' checks for equality, '==' checks for equality and type",
          "'==' is for assignment, '===' is for comparison",
          "They are interchangeable"
        ],
        correctAnswer: 0,
        explanation: "In JavaScript, '==' is the equality operator that performs type coercion before comparison, while '===' is the strict equality operator that checks both value and type without coercion. For example, '1' == 1 is true because the string '1' is coerced to a number, but '1' === 1 is false because they have different types."
      },
      {
        id: 4,
        text: "What will the following code output?\n\n```javascript\nvar x = 10;\nfunction foo() {\n  console.log(x);\n  var x = 20;\n}\nfoo();\n```",
        options: [
          "10",
          "20",
          "undefined",
          "ReferenceError"
        ],
        correctAnswer: 2,
        explanation: "This question tests understanding of hoisting in JavaScript. When the function foo is executed, the variable declaration 'var x' inside the function is hoisted to the top of the function scope, but the initialization to 20 happens in place. So when console.log(x) runs, x is defined but not yet initialized, resulting in 'undefined' being logged."
      },
      {
        id: 5,
        text: "What is the purpose of the 'use strict' directive in JavaScript?",
        options: [
          "To make the code execute faster",
          "To enable newer JavaScript features",
          "To enforce stricter parsing and error handling",
          "To disable certain JavaScript features"
        ],
        correctAnswer: 2,
        explanation: "The 'use strict' directive activates strict mode in JavaScript, which enforces stricter parsing and error handling. It helps catch common coding mistakes and 'unsafe' actions like using undeclared variables. Strict mode also prevents some error-prone features from being used and can make the code more optimizable by the JavaScript engine."
      },
      {
        id: 6,
        text: "What is a closure in JavaScript?",
        options: [
          "A way to close browser windows programmatically",
          "A function bundled with references to its surrounding state",
          "A method to close database connections",
          "A design pattern for creating singleton objects"
        ],
        correctAnswer: 1,
        explanation: "A closure in JavaScript is a function that has access to variables from its outer (enclosing) function's scope, even after the outer function has finished executing. It 'remembers' the environment in which it was created. Closures are powerful for data encapsulation, creating private variables, and maintaining state between function calls."
      },
      {
        id: 7,
        text: "What is the output of the following code?\n\n```javascript\nconsole.log([1, 2, 3] + [4, 5, 6]);\n```",
        options: [
          "[1, 2, 3, 4, 5, 6]",
          "[1,2,3,4,5,6]",
          "1,2,34,5,6",
          "1,2,34,5,6"
        ],
        correctAnswer: 2,
        explanation: "In JavaScript, when using the + operator with arrays, they are first converted to strings using their toString() method, then concatenated. [1, 2, 3].toString() gives '1,2,3' and [4, 5, 6].toString() gives '4,5,6'. So the result of [1, 2, 3] + [4, 5, 6] is the string '1,2,34,5,6'."
      },
      {
        id: 8,
        text: "Which of the following is NOT a valid way to create an object in JavaScript?",
        options: [
          "let obj = new Object();",
          "let obj = {};",
          "let obj = Object.create(null);",
          "let obj = Object()"
        ],
        correctAnswer: 3,
        explanation: "All of these are valid ways to create objects in JavaScript except for 'let obj = Object()'. The correct syntax would be 'let obj = new Object()' when using the Object constructor, 'let obj = {}' for object literal notation, or 'let obj = Object.create(null)' to create an object with no prototype."
      },
      {
        id: 9,
        text: "What does the 'this' keyword refer to in JavaScript?",
        options: [
          "It always refers to the global object",
          "It refers to the object that the function is a property of",
          "It refers to the object that is currently executing the code",
          "It depends on how the function is called"
        ],
        correctAnswer: 3,
        explanation: "In JavaScript, the value of 'this' depends on how a function is called. In a method, 'this' refers to the owner object. Alone, 'this' refers to the global object. In a function, 'this' refers to the global object (in non-strict mode) or is undefined (in strict mode). In an event, 'this' refers to the element that received the event. Methods like call(), apply(), and bind() can also set the value of 'this'."
      },
      {
        id: 10,
        text: "What is the purpose of the 'async' and 'await' keywords in JavaScript?",
        options: [
          "To make functions run faster",
          "To handle errors in promises",
          "To work with non-blocking code in a more synchronous style",
          "To prevent race conditions"
        ],
        correctAnswer: 2,
        explanation: "The 'async' and 'await' keywords in JavaScript are syntactic sugar built on top of Promises, making asynchronous code easier to write and understand. 'async' declares that a function returns a Promise, and 'await' pauses the execution of an async function until a Promise is settled. This allows you to write asynchronous code that looks and behaves more like synchronous code, improving readability and maintainability."
      }
    ],
    "react": [
      {
        id: 1,
        text: "What is the virtual DOM in React?",
        options: [
          "A faster version of the DOM API",
          "A lightweight copy of the actual DOM in memory",
          "A DOM implementation for server-side rendering",
          "A way to directly manipulate the browser's DOM"
        ],
        correctAnswer: 1,
        explanation: "The Virtual DOM in React is a lightweight JavaScript representation of the actual DOM. React creates and maintains this virtual representation, and when state changes occur, it first updates this virtual DOM. React then efficiently compares the updated virtual DOM with the previous version (a process called 'reconciliation') to determine the minimal set of actual DOM changes needed, which improves performance."
      },
      {
        id: 2,
        text: "Which of the following is a correct way to create a functional component in React?",
        options: [
          "function MyComponent() { return <div>Hello</div>; }",
          "class MyComponent { render() { return <div>Hello</div>; } }",
          "const MyComponent = createElement('div', null, 'Hello');",
          "const MyComponent = new Component(<div>Hello</div>);"
        ],
        correctAnswer: 0,
        explanation: "A functional component in React is a JavaScript function that returns a React element (JSX). The correct syntax is 'function MyComponent() { return <div>Hello</div>; }'. This creates a component named MyComponent that renders a div with the text 'Hello'. Functional components are simpler than class components and are preferred in modern React development, especially with hooks."
      },
      {
        id: 3,
        text: "What is the purpose of the 'key' prop when rendering a list of elements in React?",
        options: [
          "It's used for styling purposes",
          "It helps React identify which items have changed, been added, or been removed",
          "It's required for all React elements",
          "It determines the order of elements in the list"
        ],
        correctAnswer: 1,
        explanation: "In React, the 'key' prop is a special attribute that helps React identify which items in a list have changed, been added, or been removed. When rendering a list of elements, each element should have a unique 'key' to help React optimize rendering by recycling DOM elements and maintaining component state. Without keys, React would need to re-render the entire list when it changes."
      },
      {
        id: 4,
        text: "What is the purpose of React Hooks?",
        options: [
          "To add lifecycle methods to functional components",
          "To connect React to external APIs",
          "To optimize rendering performance",
          "To add state and other React features to functional components without writing a class"
        ],
        correctAnswer: 3,
        explanation: "React Hooks are functions that let you 'hook into' React state and lifecycle features from functional components. Before Hooks, these features were only available in class components. Hooks like useState, useEffect, useContext, and others allow developers to use state, side effects, context, and other React features without writing classes, making code more concise and easier to understand."
      },
      {
        id: 5,
        text: "What happens when you call setState() in React?",
        options: [
          "The state is updated immediately and the component re-renders",
          "The state update is scheduled, then batched and applied, potentially asynchronously",
          "Nothing happens until you call forceUpdate()",
          "The component unmounts and remounts with the new state"
        ],
        correctAnswer: 1,
        explanation: "When you call setState() in React, the state update is scheduled, not applied immediately. React batches multiple setState() calls for performance reasons and applies them before the next render. This means state updates may be asynchronous, and you shouldn't rely on the state value being updated immediately after calling setState(). If you need to perform an action after the state has updated, use the second form of setState with a callback or useEffect."
      },
      {
        id: 6,
        text: "What is the difference between controlled and uncontrolled components in React?",
        options: [
          "Controlled components use hooks, uncontrolled components don't",
          "Controlled components are functional, uncontrolled are class-based",
          "Controlled components have their state managed by React, uncontrolled components maintain their own state internally",
          "Controlled components can be updated, uncontrolled components are read-only"
        ],
        correctAnswer: 2,
        explanation: "In React, a controlled component is one where form data is handled by the component's state. React manages the input's state, and updates happen through handlers like onChange. An uncontrolled component stores its own state internally in the DOM, and you access values using refs. Controlled components offer more control and validation capabilities, while uncontrolled components can be simpler for basic forms."
      },
      {
        id: 7,
        text: "What is the purpose of the 'useEffect' hook in React?",
        options: [
          "To handle user events",
          "To create global state",
          "To perform side effects in functional components",
          "To optimize rendering performance"
        ],
        correctAnswer: 2,
        explanation: "The useEffect hook in React is used to perform side effects in functional components. Side effects include data fetching, subscriptions, manual DOM manipulations, logging, etc. useEffect runs after every render by default, but you can control when it runs by providing a dependency array. It replaces lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount in class components."
      },
      {
        id: 8,
        text: "What is React Context used for?",
        options: [
          "To replace Redux entirely",
          "To handle form submissions",
          "To pass data through the component tree without having to pass props down manually at every level",
          "To manage component lifecycle methods"
        ],
        correctAnswer: 2,
        explanation: "React Context provides a way to pass data through the component tree without having to pass props down manually at every level (prop drilling). It's designed for sharing data that can be considered 'global' for a tree of React components, such as the current authenticated user, theme, or preferred language. Context is not specifically designed to replace state management libraries like Redux, though it can be used for simpler state management cases."
      },
      {
        id: 9,
        text: "What is the correct way to pass a parameter to an event handler in React?",
        options: [
          "<button onClick={handleClick(param)}>Click</button>",
          "<button onClick={handleClick}>Click</button>",
          "<button onClick={(e) => handleClick(param, e)}>Click</button>",
          "<button onClick={param => handleClick}>Click</button>"
        ],
        correctAnswer: 2,
        explanation: "To pass a parameter to an event handler in React, you should use an arrow function that calls your handler with the parameter. The correct syntax is '<button onClick={(e) => handleClick(param, e)}>Click</button>'. This creates a new function that calls handleClick with your parameter and the event object. Using onClick={handleClick(param)} would call the function immediately during render instead of on click."
      },
      {
        id: 10,
        text: "What is the purpose of the 'useMemo' hook in React?",
        options: [
          "To remember the previous state value",
          "To memoize expensive calculations so they only recompute when dependencies change",
          "To memorize component instances",
          "To handle side effects"
        ],
        correctAnswer: 1,
        explanation: "The useMemo hook in React is used to memoize expensive calculations or values. It computes a value and caches it, only recomputing when one of its dependencies changes. This optimization helps prevent unnecessary recalculations on each render, which can be particularly useful for computationally expensive operations. useMemo returns the memoized value itself, unlike useCallback which returns a memoized callback function."
      }
    ]
  };
  
  // Find assessment based on field or default to a general assessment
  let fieldLower = field ? field.toLowerCase() : '';
  let questions = [];
  
  if (fieldLower.includes('python')) {
    questions = assessments.python;
  } else if (fieldLower.includes('javascript') || fieldLower.includes('js')) {
    questions = assessments.javascript;
  } else if (fieldLower.includes('react')) {
    questions = assessments.react;
  }
  
  // If no matching field, create generic questions
  if (questions.length === 0) {
    questions = new Array(questionCount).fill(0).map((_, index) => ({
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
  }
  
  // Ensure we only return the requested number of questions
  questions = questions.slice(0, questionCount);
  
  return {
    id: `static-assessment-${courseName.replace(/\s+/g, '-').toLowerCase()}-${difficulty}`,
    title: `${courseName} Assessment`,
    description: `Test your knowledge of ${field} concepts at the ${difficulty} level.`,
    difficulty,
    questions
  };
}
