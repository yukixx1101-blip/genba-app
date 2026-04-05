import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://boqyudxlemnvytxdhsop.supabase.co";
const supabaseAnonKey = "sb_publishable_WM3QpiBvIWNDR4d4yPEy_Q_3FVbf4BA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
