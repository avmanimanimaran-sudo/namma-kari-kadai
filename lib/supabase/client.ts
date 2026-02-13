import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log(
    'Supabase URL:',
    process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
