
import { supabase } from '@/integrations/supabase/client';

export const fetchDiscussionTopics = async () => {
  const { data: discussions } = await supabase
    .from('forum_discussions')
    .select(`
      *,
      profiles:user_id(username, avatar_url),
      replies:forum_replies(count)
    `)
    .order('created_at', { ascending: false });

  return discussions || [];
};

export const createForumPost = async (title: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('forum_discussions')
    .insert([
      { title, content, user_id: user.id }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Set up real-time subscriptions
supabase
  .channel('public:forum_discussions')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_discussions' }, payload => {
    console.log('Forum discussion change received!', payload);
  })
  .subscribe();
