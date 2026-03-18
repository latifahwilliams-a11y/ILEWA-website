
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ndzxtkunlpgrkicwrbpm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kenh0a3VubHBncmtpY3dyYnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNjQwNjEsImV4cCI6MjA3Njk0MDA2MX0.1CNQe8sXSmimoQQEY2IBI-djFzdxAQuxhUWUQ8t0UZc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
