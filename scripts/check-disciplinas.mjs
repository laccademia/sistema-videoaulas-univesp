import { drizzle } from 'drizzle-orm/mysql2';
import { cursos, disciplinas } from '../drizzle/schema.ts';
import { eq, count } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const cursosData = await db.select().from(cursos);

console.log('\n📊 Disciplinas por Curso no Banco de Dados:\n');

for (const curso of cursosData) {
  const result = await db
    .select({ count: count() })
    .from(disciplinas)
    .where(eq(disciplinas.cursoId, curso.id));
  
  const total = result[0]?.count || 0;
  console.log(`${curso.nome}: ${total} disciplinas`);
}

process.exit(0);
