import { drizzle } from 'drizzle-orm/mysql2';
import { count, eq } from 'drizzle-orm';
import { cursos, cursosDisciplinas } from '../drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

console.log('📊 Disciplinas por Curso (usando cursosDisciplinas):');

const todosCursos = await db.select().from(cursos);

for (const curso of todosCursos) {
  const result = await db
    .select({ count: count() })
    .from(cursosDisciplinas)
    .where(eq(cursosDisciplinas.cursoId, curso.id));
  
  const total = result[0]?.count || 0;
  console.log(`${curso.nome}: ${total} disciplinas`);
}

process.exit(0);
