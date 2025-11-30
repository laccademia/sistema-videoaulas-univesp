import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

console.log('🗑️  Limpando banco de dados...');

await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
await db.execute(sql`TRUNCATE TABLE videoaulas`);
await db.execute(sql`TRUNCATE TABLE ofertas_disciplinas`);
await db.execute(sql`TRUNCATE TABLE professores`);
await db.execute(sql`TRUNCATE TABLE designers_instrucionais`);
await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

console.log('✅ Banco de dados limpo!');
process.exit(0);
