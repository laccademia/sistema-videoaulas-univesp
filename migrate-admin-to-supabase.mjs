/**
 * Script para migrar usuário admin existente para Supabase Auth
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('Necessário: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateAdmin() {
  console.log('🔄 Migrando usuário admin para Supabase Auth...\n');

  const adminEmail = 'admin@univesp.br';
  const adminPassword = '123456';
  const adminName = 'Administrador';

  try {
    // 1. Verificar se já existe no Supabase Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail);

    if (existingUser) {
      console.log('✅ Usuário admin já existe no Supabase Auth');
      console.log('   ID:', existingUser.id);
      console.log('   Email:', existingUser.email);
      return;
    }

    // 2. Criar usuário no Supabase Auth
    console.log('📝 Criando usuário no Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name: adminName
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário no Supabase Auth:', authError);
      process.exit(1);
    }

    console.log('✅ Usuário criado no Supabase Auth');
    console.log('   ID:', authData.user.id);
    console.log('   Email:', authData.user.email);

    // 3. Atualizar registro na tabela users
    console.log('\n📝 Atualizando registro na tabela users...');
    const { error: updateError } = await supabase
      .from('users')
      .update({
        openId: authData.user.id,
        loginMethod: 'email'
      })
      .eq('email', adminEmail);

    if (updateError) {
      console.error('❌ Erro ao atualizar tabela users:', updateError);
      process.exit(1);
    }

    console.log('✅ Registro atualizado na tabela users');
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('\n📋 Credenciais de login:');
    console.log('   Email:', adminEmail);
    console.log('   Senha:', adminPassword);

  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    process.exit(1);
  }
}

migrateAdmin();
