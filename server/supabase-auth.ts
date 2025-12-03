/**
 * Helpers de autenticação usando Supabase Auth
 */

import { supabase } from './supabase-db';

export interface SupabaseUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

/**
 * Fazer login com email e senha
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Buscar role do usuário na tabela users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, name')
    .eq('openId', data.user.id)
    .single();

  if (userError) {
    // Se usuário não existe na tabela, criar com role 'user'
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        openId: data.user.id,
        email: data.user.email,
        name: data.user.email?.split('@')[0],
        role: 'user',
        loginMethod: 'email',
      })
      .select()
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: 'user' as const,
        name: newUser?.name,
      },
      session: data.session,
    };
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      role: userData.role as 'admin' | 'user',
      name: userData.name,
    },
    session: data.session,
  };
}

/**
 * Criar nova conta
 */
export async function signUp(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
      emailRedirectTo: undefined,
    },
  });

  if (error) throw error;

  // Criar registro na tabela users do Supabase
  if (data.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        openId: data.user.id,
        email: data.user.email || email,
        name: name || email.split('@')[0],
        role: 'user',
        loginMethod: 'email',
      });

    if (insertError) {
      console.error('[SIGNUP] Erro ao salvar no Supabase:', insertError);
    }
  }

  return data;
}

/**
 * Fazer logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obter usuário atual da sessão
 */
export async function getCurrentUser(): Promise<SupabaseUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;

  // Buscar role do usuário
  const { data: userData } = await supabase
    .from('users')
    .select('role, name')
    .eq('openId', session.user.id)
    .single();

  return {
    id: session.user.id,
    email: session.user.email!,
    role: userData?.role || 'user',
    name: userData?.name,
  };
}

/**
 * Verificar se usuário é admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('openId', userId)
    .single();

  return data?.role === 'admin';
}

/**
 * Promover usuário para admin
 */
export async function promoteToAdmin(email: string) {
  const { error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', email);

  if (error) throw error;
}


/**
 * Buscar usuário por openId
 */
export async function getUserByOpenId(openId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('openId', openId)
    .single();

  if (error) return null;
  
  return {
    id: data.id,
    openId: data.openId,
    email: data.email,
    name: data.name,
    role: data.role as 'admin' | 'user',
    createdAt: new Date(data.createdAt),
  };
}

/**
 * Criar ou atualizar usuário
 */
export async function upsertUser(userData: {
  openId: string;
  name?: string | null;
  email?: string | null;
  role?: 'admin' | 'user';
}) {
  const { error } = await supabase
    .from('users')
    .upsert({
      openId: userData.openId,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'user',
      loginMethod: 'oauth',
    }, {
      onConflict: 'openId'
    });

  if (error) {
    console.error('[UPSERT_USER] Erro:', error);
    throw error;
  }
}
