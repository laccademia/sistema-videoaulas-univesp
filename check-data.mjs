import { supabase } from './server/supabase-db.ts';

// Contar videoaulas
const { count: totalVideoaulas } = await supabase
  .from('videoaulas')
  .select('*', { count: 'exact', head: true });

console.log('Total de videoaulas:', totalVideoaulas);

// Buscar amostra de videoaulas
const { data: amostra } = await supabase
  .from('videoaulas')
  .select('id, semana, numeroAula, linkLibras, linkAudiodescricao, ccLegenda')
  .limit(5);

console.log('\nAmostra de videoaulas:');
amostra?.forEach(v => {
  console.log(`ID: ${v.id}, Semana: ${v.semana}, Aula: ${v.numeroAula}, Libras: ${v.linkLibras ? 'Sim' : 'Não'}, Audio: ${v.linkAudiodescricao ? 'Sim' : 'Não'}, CC: ${v.ccLegenda}`);
});

// Contar com acessibilidade
const { data: comLibras } = await supabase
  .from('videoaulas')
  .select('id')
  .not('linkLibras', 'is', null)
  .not('linkLibras', 'eq', '');

const { data: comAudio } = await supabase
  .from('videoaulas')
  .select('id')
  .not('linkAudiodescricao', 'is', null)
  .not('linkAudiodescricao', 'eq', '');

const { data: comCC } = await supabase
  .from('videoaulas')
  .select('id')
  .eq('ccLegenda', true);

console.log('\nAcessibilidade:');
console.log('Com Libras:', comLibras?.length || 0);
console.log('Com Audiodescrição:', comAudio?.length || 0);
console.log('Com CC:', comCC?.length || 0);
