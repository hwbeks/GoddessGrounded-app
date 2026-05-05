import { createClient } from "@supabase/supabase-js";

// GoddessGrounded uses a SEPARATE Supabase project from GoddessAlert
// Replace these placeholders with GoddessGrounded Supabase project credentials
// when Supabase Project B is created
const supabaseUrl = "https://upqboifuvcqcxhxiqtfk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcWJvaWZ1dmNxY3hoeGlxdGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODU1NTQsImV4cCI6MjA5MzU2MTU1NH0.YYfQj88-rH7WdEHLvwNz2VOTYvnpRHI5psZvwUUSQxE";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
