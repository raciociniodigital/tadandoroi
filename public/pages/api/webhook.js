const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const data = req.body;
  console.log('Dados recebidos:', JSON.stringify(data, null, 2));

  let email, status, productName;

  if (data.event === 'SUBSCRIPTION_CANCELLATION') {
    email = data.data?.subscriber?.email;
    status = 'canceled';
    productName = data.data?.product?.name;
  } else {
    email = data.data?.buyer?.email;
    status = data.data?.purchase?.status?.toLowerCase();
    productName = data.data?.product?.name;
  }

  if (!email || !status || !productName) {
    console.log('Campos obrigatórios ausentes:', { email, status, productName });
    return res.status(400).json({ message: 'Dados insuficientes no corpo da requisição' });
  }

  const plano = productName.includes('Mensal') ? 'mensal' : 'anual';
  const isActive = status === 'approved';

  const { error } = await supabase
    .from('usuarios')
    .upsert(
      { email, assinatura_ativa: isActive, plano, ultima_atualizacao: new Date().toISOString() },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('Erro ao atualizar Supabase:', error);
    return res.status(500).json({ message: 'Erro interno' });
  }

  return res.status(200).json({ message: 'Webhook recebido com sucesso' });
}