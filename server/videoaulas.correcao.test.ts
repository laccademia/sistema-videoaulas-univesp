import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Testes para validar correção dos dados de professores, DIs e videoaulas
 */

function createMockContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Correção de Dados - Professores", () => {
  it("deve retornar professores com nomes reais (não fórmulas VLOOKUP)", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.professores.list();

    expect(result.length).toBeGreaterThan(0);
    
    // Verificar que nenhum professor tem fórmula VLOOKUP
    const comFormula = result.filter(p => p.nome.includes('VLOOKUP'));
    expect(comFormula.length).toBe(0);
    
    // Verificar que todos têm nomes válidos
    result.forEach(prof => {
      expect(prof.nome).toBeTruthy();
      expect(prof.nome.length).toBeGreaterThan(2);
    });
  });

  it("deve ter pelo menos 20 professores únicos", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.professores.list();

    expect(result.length).toBeGreaterThanOrEqual(20);
  });
});

describe("Correção de Dados - Designers Instrucionais", () => {
  it("deve retornar DIs com nomes válidos (não apenas números)", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dis.list();

    expect(result.length).toBeGreaterThan(0);
    
    // Verificar que não há DIs com nomes inválidos
    const invalidos = result.filter(di => 
      di.nome === 'começar por aqui' || 
      di.nome === '0' ||
      di.nome === 'nan'
    );
    expect(invalidos.length).toBe(0);
  });

  it("deve ter pelo menos 10 designers instrucionais", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dis.list();

    expect(result.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Correção de Dados - Videoaulas", () => {
  it("deve retornar videoaulas do ano 2025", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.videoaulas.list({
      page: 1,
      pageSize: 50,
    });

    expect(result.items.length).toBeGreaterThan(0);
    
    // Verificar que todas são de 2025
    result.items.forEach(v => {
      expect(v.oferta?.ano).toBe(2025);
    });
  });

  it("deve ter videoaulas com professores válidos", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.videoaulas.list({
      page: 1,
      pageSize: 50,
    });

    const comProfessor = result.items.filter(v => v.professor);
    
    // Pelo menos 80% devem ter professor
    const percentual = (comProfessor.length / result.items.length) * 100;
    expect(percentual).toBeGreaterThan(80);
    
    // Nenhum deve ter fórmula VLOOKUP
    const comFormula = result.items.filter(v => 
      v.professor?.nome && v.professor.nome.includes('VLOOKUP')
    );
    expect(comFormula.length).toBe(0);
  });

  it("deve ter videoaulas distribuídas pelos 4 bimestres", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.stats.porBimestre();

    expect(stats.length).toBe(4);
    
    // Cada bimestre deve ter pelo menos 50 videoaulas
    stats.forEach(stat => {
      expect(stat.total).toBeGreaterThan(50);
      expect(stat.bimestre).toBeGreaterThanOrEqual(1);
      expect(stat.bimestre).toBeLessThanOrEqual(4);
    });
  });

  it("deve ter alta cobertura de links de acessibilidade", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.stats.acessibilidade();

    // Pelo menos 80% com Libras
    expect(stats.comLibras / stats.total * 100).toBeGreaterThan(80);
    
    // Pelo menos 60% com Audiodescrição
    expect(stats.comAudiodescricao / stats.total * 100).toBeGreaterThan(60);
  });
});

describe("Integridade dos Dados", () => {
  it("deve ter coerência entre videoaulas e ofertas", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const videoaulas = await caller.videoaulas.list({
      page: 1,
      pageSize: 100,
    });

    // Todas as videoaulas devem ter oferta válida
    videoaulas.items.forEach(v => {
      expect(v.oferta).toBeTruthy();
      expect(v.oferta?.id).toBeGreaterThan(0);
    });
  });

  it("deve ter disciplinas associadas a cursos válidos", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const disciplinas = await caller.disciplinas.list();

    expect(disciplinas.length).toBeGreaterThan(0);
    
    // Todas as disciplinas devem ter curso válido
    disciplinas.forEach(d => {
      expect(d.cursoId).toBeTruthy();
      expect(d.cursoId).toBeGreaterThan(0);
    });
  });
});
