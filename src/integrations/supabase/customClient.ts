
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://jwmjkhwolycsunijaugo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWpraHdvbHljc3VuaWphdWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTc1ODYsImV4cCI6MjA1OTI5MzU4Nn0.bdiLc43rUggCxJVKpKAFKLaX9SZXicgnVQMqCbBki6o";

// Create a typed Supabase client
export const typedSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
