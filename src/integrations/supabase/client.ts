// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yfxbkwpsezvxjgfpuppe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmeGJrd3BzZXp2eGpnZnB1cHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjUwNjQsImV4cCI6MjA2NTgwMTA2NH0.bhmBxTdyTHdRPGPBmrVP7ktjmZwit-cGkf5VWA6BsWs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);