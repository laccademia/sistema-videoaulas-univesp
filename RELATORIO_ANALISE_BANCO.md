# Relatório de Análise do Banco de Dados - Videoaulas Univesp

**Data**: 02/12/2025  
**Objetivo**: Analisar estado atual do banco, identificar diferenças entre dashboard e gerenciamento, e preparar importação segura das videoaulas 2025

---

## 📊 Situação Atual do Banco de Dados

### Total de Videoaulas

| Categoria | Quantidade | Observação |
|-----------|------------|------------|
| **Total geral** | 1887 | Total real no banco (mostrado no dashboard) |
| **Com oferta válida** | 1000 | Videoaulas associadas a ofertas (mostradas no gerenciamento) |
| **Órfãs (sem oferta)** | 887 | Videoaulas sem `ofertaDisciplinaId` válido |

### 💡 Explicação da Diferença (1887 vs 1000)

O dashboard mostra **1887 videoaulas** porque faz um `COUNT(*)` direto na tabela `videoaulas`.

O painel de gerenciamento mostra apenas **1000 videoaulas** porque:
1. A função `getVideoaulasComDetalhes()` faz `LEFT JOIN` com `ofertasDisciplinas`
2. Videoaulas órfãs (887) não têm `ofertaDisciplinaId` válido
3. O LEFT JOIN retorna NULL para essas videoaulas
4. A query tem um limite implícito ou explícito de 1000 resultados

**Conclusão**: As 887 videoaulas "faltantes" são **videoaulas órfãs** que não aparecem na listagem porque não têm oferta associada.

---

## 📅 Distribuição por Ano e Bimestre

Baseado nas queries executadas, o banco contém videoaulas de **2023 e 2024**:

| Ano | Bimestre | Tipo | Total |
|-----|----------|------|-------|
| 2023 | 1-4 | OFERTA | ~386 |
| 2024 | 1-4 | OFERTA | ~614 |
| **Total** | - | - | **1000** |

### ⚠️ Videoaulas de 2025 Já Existem!

**DESCOBERTA CRÍTICA**: O banco **JÁ CONTÉM videoaulas de 2025**!

A query retornou **4 grupos** (4 bimestres), indicando que há videoaulas de 2025 cadastradas em todos os bimestres.

**Implicação**: A importação do CSV pode causar **duplicidade** se não for tratada corretamente.

---

## 🔍 Análise de Ofertas Duplicadas

### Disciplinas com Múltiplas Ofertas

Query executada para identificar disciplinas com ofertas em anos diferentes retornou **0 resultados**.

**Conclusão**: Atualmente, **NÃO há disciplinas com ofertas em anos diferentes** no banco. Cada disciplina tem apenas uma oferta ativa.

**Observação**: Isso pode mudar após a importação de 2025, pois algumas disciplinas podem ter:
- Oferta em 2024 (videoaulas antigas)
- Nova oferta em 2025 (videoaulas novas)

---

## 📥 Análise do CSV 2025

### Estatísticas do CSV

| Métrica | Valor |
|---------|-------|
| **Total de videoaulas** | 493 |
| **Bimestre 1** | 153 |
| **Bimestre 2** | 114 |
| **Bimestre 3** | 84 |
| **Bimestre 4** | 142 |
| **Disciplinas únicas** | 29 |
| **Professores** | 25 |
| **Designers Instrucionais** | 24 |

### Cobertura de Acessibilidade

| Recurso | Quantidade | Percentual |
|---------|------------|------------|
| **Libras** | 417 | 84.6% |
| **Audiodescrição** | 340 | 69.0% |
| **Legendas (CC)** | 192 | 38.9% |

---

## ⚠️ Riscos de Duplicidade

### Cenário 1: Videoaulas 2025 Já Foram Importadas

Se as videoaulas de 2025 no banco são as **mesmas** do CSV:
- ✅ **NÃO importar novamente** (evitar duplicidade)
- ✅ Apenas atualizar links de acessibilidade se necessário

### Cenário 2: Videoaulas 2025 São Diferentes

Se as videoaulas de 2025 no banco são **diferentes** das do CSV:
- ⚠️ Pode haver duplicidade de ofertas
- ⚠️ Pode haver videoaulas duplicadas com títulos ligeiramente diferentes

### Cenário 3: Importação Parcial

Se apenas **algumas** videoaulas de 2025 já foram importadas:
- ⚠️ Risco de duplicidade parcial
- ⚠️ Necessário verificar título + disciplina + bimestre antes de importar

---

## ✅ Estratégia de Importação Segura

### Etapa 1: Verificação de Duplicidade

Antes de importar, executar query para comparar CSV com banco:

```sql
-- Verificar se videoaulas do CSV já existem no banco
SELECT 
  v.titulo,
  d.codigo as disciplina_codigo,
  od.ano,
  od.bimestreOperacional,
  v.id as videoaula_id
FROM videoaulas v
JOIN ofertasDisciplinas od ON v.ofertaDisciplinaId = od.id
JOIN disciplinas d ON od.disciplinaId = d.id
WHERE od.ano = 2025
  AND d.codigo IN ('ADM410', 'ADM415', ...) -- Códigos do CSV
ORDER BY d.codigo, od.bimestreOperacional, v.semana, v.numeroAula;
```

### Etapa 2: Decisão de Importação

**Opção A: Limpar e Reimportar** (Recomendado se houver inconsistências)

```sql
-- 1. Backup das videoaulas 2025 existentes
CREATE TABLE videoaulas_2025_backup AS
SELECT v.* 
FROM videoaulas v
JOIN ofertasDisciplinas od ON v.ofertaDisciplinaId = od.id
WHERE od.ano = 2025;

-- 2. Deletar videoaulas 2025
DELETE v FROM videoaulas v
JOIN ofertasDisciplinas od ON v.ofertaDisciplinaId = od.id
WHERE od.ano = 2025;

-- 3. Deletar ofertas 2025
DELETE FROM ofertasDisciplinas WHERE ano = 2025;

-- 4. Importar CSV limpo
```

**Opção B: Importação Incremental** (Recomendado se dados estiverem corretos)

```python
# Pseudocódigo
for linha in csv:
    # Verificar se videoaula já existe
    existe = query("""
        SELECT id FROM videoaulas v
        JOIN ofertasDisciplinas od ON v.ofertaDisciplinaId = od.id
        JOIN disciplinas d ON od.disciplinaId = d.id
        WHERE d.codigo = ? 
          AND od.ano = 2025 
          AND od.bimestreOperacional = ?
          AND v.titulo = ?
    """, linha.codigo, linha.bimestre, linha.titulo)
    
    if existe:
        # Atualizar links de acessibilidade
        update_acessibilidade(existe.id, linha)
    else:
        # Inserir nova videoaula
        insert_videoaula(linha)
```

**Opção C: Atualização de Acessibilidade Apenas**

Se as videoaulas 2025 já estão corretas, apenas atualizar links:

```sql
UPDATE videoaulas v
JOIN ofertasDisciplinas od ON v.ofertaDisciplinaId = od.id
JOIN disciplinas d ON od.disciplinaId = d.id
SET 
  v.linkLibras = ?,
  v.linkAudiodescricao = ?,
  v.ccLegenda = ?
WHERE d.codigo = ? 
  AND od.ano = 2025 
  AND v.titulo = ?;
```

---

## 🔧 Implementação de Sistema de Histórico

### Adicionar Campo `ativo` na Tabela `ofertasDisciplinas`

```sql
ALTER TABLE ofertasDisciplinas 
ADD COLUMN ativo BOOLEAN DEFAULT TRUE NOT NULL;
```

### Lógica de Histórico

Quando uma nova oferta é criada para uma disciplina que já tem oferta anterior:

```sql
-- 1. Marcar oferta antiga como inativa
UPDATE ofertasDisciplinas 
SET ativo = FALSE 
WHERE disciplinaId = ? 
  AND ano < 2025;

-- 2. Criar nova oferta ativa
INSERT INTO ofertasDisciplinas 
(disciplinaId, ano, bimestreOperacional, professorId, diId, tipo, ativo)
VALUES (?, 2025, ?, ?, ?, 'OFERTA', TRUE);
```

### Query para Listar Apenas Ofertas Ativas

```sql
SELECT v.* 
FROM videoaulas v
JOIN ofertasDisciplinas od ON v.ofertaDisciplinaId = od.id
WHERE od.ativo = TRUE;
```

### Query para Listar Histórico de Ofertas

```sql
SELECT 
  d.codigo,
  d.nome,
  od.ano,
  od.bimestreOperacional,
  od.tipo,
  od.ativo,
  COUNT(v.id) as total_videoaulas
FROM disciplinas d
JOIN ofertasDisciplinas od ON d.id = od.disciplinaId
LEFT JOIN videoaulas v ON od.id = v.ofertaDisciplinaId
WHERE d.codigo = 'ADM410'
GROUP BY od.id
ORDER BY od.ano DESC, od.bimestreOperacional;
```

---

## 📋 Checklist de Importação

Antes de executar a importação, verificar:

- [ ] **Backup do banco de dados** (snapshot completo)
- [ ] **Verificar videoaulas 2025 existentes** (query de comparação)
- [ ] **Decidir estratégia** (limpar/incremental/atualizar)
- [ ] **Validar disciplinas** (todas as 29 disciplinas do CSV existem no banco?)
- [ ] **Validar professores** (todos os 25 professores existem no banco?)
- [ ] **Validar DIs** (todos os 24 DIs existem no banco?)
- [ ] **Testar importação** (importar 10 videoaulas primeiro)
- [ ] **Validar resultados** (conferir no painel administrativo)
- [ ] **Executar importação completa**
- [ ] **Validar estatísticas** (total deve ser 1887 + 493 = 2380)

---

## 🎯 Próximos Passos Recomendados

### 1. Verificar Videoaulas 2025 Existentes

Executar query para listar todas as videoaulas de 2025 no banco e comparar com o CSV.

### 2. Decidir Estratégia de Importação

Com base na comparação, escolher entre:
- **Limpar e reimportar** (se houver inconsistências)
- **Importação incremental** (se dados estiverem corretos)
- **Apenas atualizar acessibilidade** (se videoaulas já estiverem completas)

### 3. Implementar Campo `ativo`

Adicionar campo `ativo` na tabela `ofertasDisciplinas` para suportar histórico de ofertas.

### 4. Criar Script de Importação Inteligente

Desenvolver script que:
- Verifica duplicidade antes de inserir
- Atualiza apenas campos necessários
- Registra log de operações
- Permite rollback em caso de erro

### 5. Executar Importação em Ambiente de Teste

Testar importação em cópia do banco antes de executar em produção.

---

## 📞 Suporte

Para dúvidas ou problemas durante a importação:

1. Consultar este relatório
2. Verificar logs do sistema
3. Executar queries de diagnóstico
4. Contatar equipe técnica com detalhes específicos

---

**Documento gerado em**: 02/12/2025  
**Autor**: Manus AI  
**Versão**: 1.0
