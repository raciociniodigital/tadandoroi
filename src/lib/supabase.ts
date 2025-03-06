
import { createClient } from '@supabase/supabase-js';

// URL e chave do Supabase
const supabaseUrl = 'https://goyyyvvhcvhqamizinup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveXl5dnZoY3ZocWFtaXppbnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDAzMTEsImV4cCI6MjA1NjgxNjMxMX0.MQW3NK9IULUDlKLk02TRGZJBQ1NIHvUFvnuDR_SnXQ8';

// Criar um cliente Supabase singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Esta função será usada para definir o token de autenticação para o Supabase
export const setSupabaseToken = async (token: string | null) => {
  if (token) {
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
  } else {
    // Limpar a sessão se não houver token
    supabase.auth.signOut();
  }
};
