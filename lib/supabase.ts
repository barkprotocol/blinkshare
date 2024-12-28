import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and Anon key (replace with your actual values)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
