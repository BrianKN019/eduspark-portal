
import { supabase } from '@/integrations/supabase/client';

export const fetchUpcomingEvents = async () => {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', new Date().toISOString())
    .order('start_date');

  return events || [];
};

export const joinEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { error } = await supabase
    .from('event_participants')
    .insert([
      { event_id: eventId, user_id: user.id }
    ]);

  if (error) throw error;
};

// Set up real-time subscriptions
supabase
  .channel('public:events')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
    console.log('Event change received!', payload);
  })
  .subscribe();
