/**
 * Script para popular o banco de dados com dados processados
 * Executa: tsx server/seed.ts
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  insertCurso,
  insertDisciplina,
  insertCursoDisciplina,
  insertProfessor,
  insertDesignerInstrucional,
  insertOfertaDisciplina,
  insertVideoaula,
  getCursoByNome,
  getDisciplinaByCodigo,
  getProfessorByNome,
  getDesignerInstrucionalByNome,
  getOfertaByDisciplinaAnoEBimestre,
} from './db';

const DADOS_DIR = '/home/ubuntu/dados_processados';

async function seedCursos() {
  console.log('📚 Populando cursos...');
  const cursosData = JSON.parse(readFileSync(join(DADOS_DIR, 'cursos.json'), 'utf-8'));
  
  for (const curso of cursosData) {
    await insertCurso({
      eixo: curso.eixo,
      nome: curso.nome,
    });
  }
  
  console.log(`✅ ${cursosData.length} cursos inseridos`);
}

async function seedDisciplinas() {
  console.log('📖 Populando disciplinas únicas...');
  const disciplinasData = JSON.parse(readFileSync(join(DADOS_DIR, 'disciplinas.json'), 'utf-8'));
  
  for (const disciplina of disciplinasData) {
    await insertDisciplina({
      codigo: disciplina.codigo,
      nome: disciplina.nome,
      cargaHoraria: disciplina.carga_horaria,
    });
  }
  
  console.log(`✅ ${disciplinasData.length} disciplinas únicas inseridas`);
}

async function seedCursosDisciplinas() {
  console.log('🔗 Populando associações cursos-disciplinas...');
  const cursosDisciplinasData = JSON.parse(readFileSync(join(DADOS_DIR, 'cursos_disciplinas.json'), 'utf-8'));
  
  let inseridas = 0;
  let erros = 0;
  
  for (const assoc of cursosDisciplinasData) {
    try {
      const curso = await getCursoByNome(assoc.curso);
      if (!curso) {
        console.warn(`⚠️  Curso não encontrado: ${assoc.curso}`);
        erros++;
        continue;
      }
      
      const disciplina = await getDisciplinaByCodigo(assoc.codigo_disciplina);
      if (!disciplina) {
        console.warn(`⚠️  Disciplina não encontrada: ${assoc.codigo_disciplina}`);
        erros++;
        continue;
      }
      
      await insertCursoDisciplina({
        cursoId: curso.id,
        disciplinaId: disciplina.id,
        anoCurso: assoc.ano_curso,
        bimestrePedagogico: assoc.bimestre_pedagogico,
      });
      
      inseridas++;
    } catch (error) {
      console.error(`❌ Erro ao inserir associação ${assoc.curso} - ${assoc.codigo_disciplina}:`, error);
      erros++;
    }
  }
  
  console.log(`✅ ${inseridas} associações inseridas (${erros} erros)`);
}

async function seedProfessores() {
  console.log('👨‍🏫 Populando professores...');
  const professoresData = JSON.parse(readFileSync(join(DADOS_DIR, 'professores.json'), 'utf-8'));
  
  for (const professor of professoresData) {
    await insertProfessor({
      nome: professor.nome,
    });
  }
  
  console.log(`✅ ${professoresData.length} professores inseridos`);
}

async function seedDesignersInstrucionais() {
  console.log('🎨 Populando designers instrucionais...');
  const disData = JSON.parse(readFileSync(join(DADOS_DIR, 'designers_instrucionais.json'), 'utf-8'));
  
  for (const di of disData) {
    await insertDesignerInstrucional({
      nome: di.nome,
    });
  }
  
  console.log(`✅ ${disData.length} designers instrucionais inseridos`);
}

async function seedVideoaulas() {
  console.log('🎥 Populando videoaulas...');
  const videoaulasData = JSON.parse(readFileSync(join(DADOS_DIR, 'videoaulas.json'), 'utf-8'));
  
  let inseridas = 0;
  let erros = 0;
  
  for (const videoaula of videoaulasData) {
    try {
      // Buscar disciplina
      const disciplina = await getDisciplinaByCodigo(videoaula.codigo_disciplina);
      if (!disciplina) {
        console.warn(`⚠️  Disciplina não encontrada: ${videoaula.codigo_disciplina}`);
        erros++;
        continue;
      }
      
      // Buscar professor
      const professor = await getProfessorByNome(videoaula.professor);
      if (!professor) {
        console.warn(`⚠️  Professor não encontrado: ${videoaula.professor}`);
        erros++;
        continue;
      }
      
      // Buscar DI
      const di = await getDesignerInstrucionalByNome(videoaula.di);
      if (!di) {
        console.warn(`⚠️  DI não encontrado: ${videoaula.di}`);
        erros++;
        continue;
      }
      
      // Buscar ou criar oferta
      let oferta = await getOfertaByDisciplinaAnoEBimestre(
        disciplina.id,
        videoaula.ano,
        videoaula.bimestre_operacional
      );
      
      if (!oferta) {
        await insertOfertaDisciplina({
          disciplinaId: disciplina.id,
          ano: videoaula.ano,
          bimestreOperacional: videoaula.bimestre_operacional,
          professorId: professor.id,
          diId: di.id,
          tipo: videoaula.tipo_oferta || 'Oferta',
        });
        
        oferta = await getOfertaByDisciplinaAnoEBimestre(
          disciplina.id,
          videoaula.ano,
          videoaula.bimestre_operacional
        );
      }
      
      if (!oferta) {
        console.warn(`⚠️  Não foi possível criar oferta para disciplina ${disciplina.codigo}`);
        erros++;
        continue;
      }
      
      // Inserir videoaula
      await insertVideoaula({
        ofertaDisciplinaId: oferta.id,
        semana: videoaula.semana,
        numeroAula: videoaula.numero_aula,
        titulo: videoaula.titulo,
        sinopse: videoaula.sinopse,
        linkYoutubeOriginal: videoaula.link_youtube_original,
        slidesDisponivel: videoaula.slides_disponivel === true || videoaula.slides_disponivel === 'true',
        status: videoaula.status || 'Publicada',
        idTvCultura: videoaula.id_tv_cultura,
        duracaoMinutos: videoaula.duracao_minutos,
        linkLibras: videoaula.link_libras,
        linkAudiodescricao: videoaula.link_audiodescricao,
        ccLegenda: videoaula.cc_legenda === true || videoaula.cc_legenda === 'true',
        linkDownload: videoaula.link_download,
      });
      
      inseridas++;
    } catch (error) {
      console.error(`❌ Erro ao inserir videoaula ${videoaula.titulo}:`, error);
      erros++;
    }
  }
  
  console.log(`✅ ${inseridas} videoaulas inseridas (${erros} erros)`);
}

async function main() {
  console.log('🚀 Iniciando seed do banco de dados...\n');
  
  try {
    await seedCursos();
    await seedDisciplinas();
    await seedCursosDisciplinas(); // Nova função para popular associações
    await seedProfessores();
    await seedDesignersInstrucionais();
    await seedVideoaulas();
    
    console.log('\n✅ Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro durante seed:', error);
    process.exit(1);
  }
}

main();
