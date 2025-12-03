import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de nomes inválidos (números e timestamps)
const invalidNames = [
  '0',
  '00:05:00',
  '00:08:30',
  '00:10:01',
  '00:11:19',
  '00:11:21',
  '00:12:11',
  '00:12:13',
  '00:13:16',
  '00:13:20',
  '00:14:37',
  '00:14:43',
  '00:15:04',
  '00:16:46',
  '00:17:31',
  '00:18:23',
  '00:20:29',
  '00:20:55',
  '00:22:25',
  '00:25:17'
];

async function cleanInvalidProfessors() {
  console.log('🔍 Buscando professores inválidos...');
  
  // Buscar professores com nomes inválidos
  const { data: invalidProfs, error: fetchError } = await supabase
    .from('professores')
    .select('id, nome')
    .in('nome', invalidNames);
  
  if (fetchError) {
    console.error('❌ Erro ao buscar professores:', fetchError);
    return;
  }
  
  if (!invalidProfs || invalidProfs.length === 0) {
    console.log('✅ Nenhum professor inválido encontrado!');
    return;
  }
  
  console.log(`📋 Encontrados ${invalidProfs.length} professores inválidos:`);
  invalidProfs.forEach(p => console.log(`  - ID ${p.id}: "${p.nome}"`));
  
  // Deletar professores inválidos
  const { error: deleteError } = await supabase
    .from('professores')
    .delete()
    .in('nome', invalidNames);
  
  if (deleteError) {
    console.error('❌ Erro ao deletar professores:', deleteError);
    return;
  }
  
  console.log(`✅ ${invalidProfs.length} professores inválidos deletados com sucesso!`);
}

cleanInvalidProfessors();
