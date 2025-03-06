
import { supabase } from './supabase';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';

// Interface for user data
export interface User {
  id: string;
  user_id: string;
  email: string;
  created_at?: string;
}

// Function to get the current user from Supabase
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { userId, getToken } = useClerkAuth();
    
    if (!userId) return null;
    
    // First check if user exists
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // User not found, create user
        return createUser();
      }
      throw error;
    }
    
    return data as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Function to create a new user in Supabase
export const createUser = async (): Promise<User | null> => {
  try {
    const { userId, getToken } = useClerkAuth();
    const userDetails = await getToken();
    
    if (!userId || !userDetails) return null;
    
    // Extract email from JWT claims if available
    const email = 'email@example.com'; // Replace with actual email extraction
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          user_id: userId,
          email: email
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};
