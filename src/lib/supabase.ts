import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://oyaddcvpllgppxeyyqqu.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YWRkY3ZwbGxncHB4ZXl5cXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTM4ODksImV4cCI6MjA2Mjk4OTg4OX0.QSMxd81BNWfW-Wd-x9zHt-Cs6B8o0bWn0qb6E-k5GXM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});