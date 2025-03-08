const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const data = req.body; // Dados enviados pela Hotmart
  const email = data.buyer_email; // Email do comprador
  const status = data.status; // Status do pagamento (ex: "approved")
  const plano = data.product_name.includes('Mensal') ? 'mensal' : 'anual'; // Detecta o plano

  // Atualiza o status da assinatura no Supabase
  const { error } = await supabase
    .from('usuarios') // Nome da tabela no Supabase
    .update({
      assinatura_ativa: status === 'approved',
      plano: plano,
      ultima_atualizacao: new Date().toISOString(),
    })
    .eq('email', email);

  if (error) {
    console.error('Erro ao atualizar Supabase:', error);
    return res.status(500).json({ message: 'Erro interno' });
  }

  return res.status(200).json({ message: 'Webhook recebido com sucesso' });
}