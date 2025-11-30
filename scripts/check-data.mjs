import { drizzle } from "drizzle-orm/mysql2";
import { professores, designersInstrucionais, videoaulas, ofertasDisciplinas } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

console.log('=== VERIFICANDO DADOS DO BANCO ===\n');

// Professores
const profs = await db.select().from(professores).limit(10);
console.log('📚 PROFESSORES (primeiros 10):');
console.log(JSON.stringify(profs, null, 2));
console.log(`\nTotal de professores: ${profs.length}\n`);

// Designers Instrucionais
const dis = await db.select().from(designersInstrucionais).limit(10);
console.log('🎨 DESIGNERS INSTRUCIONAIS (primeiros 10):');
console.log(JSON.stringify(dis, null, 2));
console.log(`\nTotal de DIs: ${dis.length}\n`);

// Ofertas com anos
const ofertas = await db.select().from(ofertasDisciplinas).limit(10);
console.log('📅 OFERTAS DE DISCIPLINAS (primeiras 10):');
console.log(JSON.stringify(ofertas, null, 2));
console.log(`\nTotal de ofertas: ${ofertas.length}\n`);

// Videoaulas sample
const videos = await db.select().from(videoaulas).limit(5);
console.log('🎥 VIDEOAULAS (primeiras 5):');
console.log(JSON.stringify(videos, null, 2));

process.exit(0);
