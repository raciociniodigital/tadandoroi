const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const data = req.body;
  console.log('Dados recebidos:', data); // Adiciona log para depuração

  const email = data.buyer_email || data.buyerEmail || data.email; // Tenta diferentes nomes
  const status = data.status || data.transaction_status;
  const productName = data.product_name || data.productName || data.product;

  if (!email || !status || !productName) {
    return res.status(400).json({ message: 'Dados insuficientes no corpo da requisição' });
  }

  const plano = productName.includes('Mensal') ? 'mensal' : 'anual';

  // Atualiza o status da assinatura no Supabase
  const { error } = await supabase
    .from('usuarios')
    .upsert(
      { email, assinatura_ativa: status === 'approved', plano, ultima_atualizacao: new Date().toISOString() },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('Erro ao atualizar Supabase:', error);
    return res.status(500).json({ message: 'Erro interno' });
  }

  return res.status(200).json({ message: 'Webhook recebido com sucesso' });
}