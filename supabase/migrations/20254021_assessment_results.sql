
-- Create a table to store assessment results
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on assessment_results table
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policy for assessment_results
CREATE POLICY "Users can view their own assessment results"
ON public.assessment_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment results"
ON public.assessment_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
