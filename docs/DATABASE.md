# 🗄️ Documentação do Banco de Dados

Este documento descreve em detalhes a estrutura do banco de dados do Sistema de Videoaulas Univesp, incluindo todas as tabelas, relacionamentos, índices e regras de negócio.

---

## 📋 Visão Geral

O banco de dados utiliza **MySQL/TiDB** e é gerenciado pelo ORM **Drizzle**. A estrutura foi projetada para:

- Armazenar informações completas sobre videoaulas e seus metadados
- Rastrear ofertas e reofertas de disciplinas por ano e bimestre
- Gerenciar relacionamentos entre cursos, disciplinas, professores e designers instrucionais
- Suportar recursos de acessibilidade (Libras, Audiodescrição, CC)
- Permitir consultas eficientes com índices otimizados

---

## 🏗️ Diagrama ER (Entidade-Relacionamento)

```
┌─────────────┐
│   cursos    │
│─────────────│
│ id (PK)     │
│ eixo        │
│ nome        │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────┴──────────┐
│  disciplinas    │
│─────────────────│
│ id (PK)         │
│ codigo (UNIQUE) │
│ nome            │
│ cargaHoraria    │
│ anoCurso        │
│ bimestrePedagog │
│ cursoId (FK)    │
└──────┬──────────┘
       │ 1
       │
       │ N
┌──────┴────────────────┐
│ ofertas_disciplinas   │
│───────────────────────│
│ id (PK)               │
│ disciplinaId (FK)     │
│ ano                   │
│ bimestreOperacional   │
│ professorId (FK)      │
│ diId (FK)             │
│ tipo                  │
└──────┬────────────────┘
       │ 1
       │
       │ N
┌──────┴──────────┐
│  videoaulas     │
│─────────────────│
│ id (PK)         │
│ ofertaDisciplin │
│ semana          │
│ numeroAula      │
│ titulo          │
│ sinopse         │
│ linkYoutube     │
│ slidesDisponiv  │
│ status          │
│ duracaoMinutos  │
│ linkLibras      │
│ linkAudiodescr  │
│ ccLegenda       │
│ linkDownload    │
└─────────────────┘

┌──────────────┐       ┌─────────────────────────┐
│ professores  │       │ designers_instrucionais │
│──────────────│       │─────────────────────────│
│ id (PK)      │       │ id (PK)                 │
│ nome         │       │ nome                    │
└──────┬───────┘       └──────┬──────────────────┘
       │ 1                    │ 1
       │                      │
       │ N                    │ N
       └──────────────────────┘
         (ofertas_disciplinas)
```

---

## 📊 Tabelas Detalhadas

### 1. **cursos**

Armazena os cursos de graduação oferecidos pela Univesp.

| Coluna      | Tipo      | Restrições           | Descrição                              |
|-------------|-----------|----------------------|----------------------------------------|
| id          | INT       | PK, AUTO_INCREMENT   | Identificador único do curso           |
| eixo        | VARCHAR   | NOT NULL             | Eixo do conhecimento (ex: Exatas)      |
| nome        | VARCHAR   | NOT NULL             | Nome completo do curso                 |
| createdAt   | TIMESTAMP | NOT NULL, DEFAULT NOW | Data de criação do registro            |
| updatedAt   | TIMESTAMP | NOT NULL, ON UPDATE  | Data da última atualização             |

**Índices:**
- PRIMARY KEY (`id`)

**Exemplo de dados:**
```sql
INSERT INTO cursos (eixo, nome) VALUES
('Exatas', 'Bacharelado em Ciência de Dados'),
('Humanas', 'Licenciatura em Pedagogia'),
('Tecnologia', 'Bacharelado em Engenharia de Computação');
```

---

### 2. **disciplinas**

Disciplinas que compõem os cursos, com informações pedagógicas.

| Coluna              | Tipo      | Restrições           | Descrição                                    |
|---------------------|-----------|----------------------|----------------------------------------------|
| id                  | INT       | PK, AUTO_INCREMENT   | Identificador único da disciplina            |
| codigo              | VARCHAR   | NOT NULL, UNIQUE     | Código da disciplina (ex: COM100, MAT101)    |
| nome                | VARCHAR   | NOT NULL             | Nome completo da disciplina                  |
| cargaHoraria        | INT       | NOT NULL             | Carga horária total em horas                 |
| anoCurso            | INT       | NOT NULL             | Ano do curso em que é oferecida (1-4)        |
| bimestrePedagogico  | INT       | NOT NULL             | Bimestre pedagógico (1-4)                    |
| cursoId             | INT       | FK → cursos, NOT NULL| Referência ao curso                          |
| createdAt           | TIMESTAMP | NOT NULL, DEFAULT NOW| Data de criação do registro                  |
| updatedAt           | TIMESTAMP | NOT NULL, ON UPDATE  | Data da última atualização                   |

**Índices:**
- PRIMARY KEY (`id`)
- UNIQUE KEY (`codigo`)
- FOREIGN KEY (`cursoId`) REFERENCES `cursos(id)` ON DELETE CASCADE

**Regras de Negócio:**
- `anoCurso` deve estar entre 1 e 4
- `bimestrePedagogico` deve estar entre 1 e 4
- `cargaHoraria` deve ser maior que 0
- `codigo` deve ser único em todo o sistema

**Exemplo de dados:**
```sql
INSERT INTO disciplinas (codigo, nome, cargaHoraria, anoCurso, bimestrePedagogico, cursoId) VALUES
('COM100', 'Introdução à Computação', 60, 1, 1, 3),
('MAT101', 'Cálculo Diferencial e Integral I', 80, 1, 1, 1);
```

---

### 3. **professores**

Cadastro de professores responsáveis pelas videoaulas.

| Coluna      | Tipo      | Restrições           | Descrição                              |
|-------------|-----------|----------------------|----------------------------------------|
| id          | INT       | PK, AUTO_INCREMENT   | Identificador único do professor       |
| nome        | VARCHAR   | NOT NULL             | Nome completo do professor             |
| createdAt   | TIMESTAMP | NOT NULL, DEFAULT NOW| Data de criação do registro            |
| updatedAt   | TIMESTAMP | NOT NULL, ON UPDATE  | Data da última atualização             |

**Índices:**
- PRIMARY KEY (`id`)

**Exemplo de dados:**
```sql
INSERT INTO professores (nome) VALUES
('Prof. Dr. João Silva'),
('Profa. Dra. Maria Santos');
```

---

### 4. **designers_instrucionais**

Cadastro de designers instrucionais que colaboram na produção das videoaulas.

| Coluna      | Tipo      | Restrições           | Descrição                              |
|-------------|-----------|----------------------|----------------------------------------|
| id          | INT       | PK, AUTO_INCREMENT   | Identificador único do DI              |
| nome        | VARCHAR   | NOT NULL             | Nome completo do designer instrucional |
| createdAt   | TIMESTAMP | NOT NULL, DEFAULT NOW| Data de criação do registro            |
| updatedAt   | TIMESTAMP | NOT NULL, ON UPDATE  | Data da última atualização             |

**Índices:**
- PRIMARY KEY (`id`)

**Exemplo de dados:**
```sql
INSERT INTO designers_instrucionais (nome) VALUES
('Ana Paula Costa'),
('Carlos Eduardo Lima');
```

---

### 5. **ofertas_disciplinas**

Ofertas e reofertas de disciplinas por ano e bimestre operacional, vinculando professores e designers instrucionais.

| Coluna               | Tipo      | Restrições                    | Descrição                                    |
|----------------------|-----------|-------------------------------|----------------------------------------------|
| id                   | INT       | PK, AUTO_INCREMENT            | Identificador único da oferta                |
| disciplinaId         | INT       | FK → disciplinas, NOT NULL    | Referência à disciplina                      |
| ano                  | INT       | NOT NULL                      | Ano da oferta (ex: 2025)                     |
| bimestreOperacional  | INT       | NOT NULL                      | Bimestre operacional (1-4)                   |
| professorId          | INT       | FK → professores, NULLABLE    | Professor responsável (pode ser NULL)        |
| diId                 | INT       | FK → designers_instrucionais, NULLABLE | Designer instrucional (pode ser NULL) |
| tipo                 | VARCHAR   | NOT NULL                      | "Oferta" ou "Reoferta"                       |
| createdAt            | TIMESTAMP | NOT NULL, DEFAULT NOW         | Data de criação do registro                  |
| updatedAt            | TIMESTAMP | NOT NULL, ON UPDATE           | Data da última atualização                   |

**Índices:**
- PRIMARY KEY (`id`)
- FOREIGN KEY (`disciplinaId`) REFERENCES `disciplinas(id)` ON DELETE CASCADE
- FOREIGN KEY (`professorId`) REFERENCES `professores(id)` ON DELETE SET NULL
- FOREIGN KEY (`diId`) REFERENCES `designers_instrucionais(id)` ON DELETE SET NULL
- INDEX (`ano`, `bimestreOperacional`) - Para consultas por período

**Regras de Negócio:**
- `bimestreOperacional` deve estar entre 1 e 4
- `tipo` deve ser "Oferta" ou "Reoferta"
- Uma disciplina pode ter múltiplas ofertas no mesmo ano (diferentes bimestres)
- Professor e DI são opcionais (podem ser NULL)

**Exemplo de dados:**
```sql
INSERT INTO ofertas_disciplinas (disciplinaId, ano, bimestreOperacional, professorId, diId, tipo) VALUES
(1, 2025, 1, 1, 1, 'Oferta'),
(1, 2025, 3, 2, 2, 'Reoferta');
```

---

### 6. **videoaulas**

Dados completos das videoaulas produzidas, incluindo links, status e recursos de acessibilidade.

| Coluna               | Tipo      | Restrições                         | Descrição                                    |
|----------------------|-----------|------------------------------------|----------------------------------------------|
| id                   | INT       | PK, AUTO_INCREMENT                 | Identificador único da videoaula             |
| ofertaDisciplinaId   | INT       | FK → ofertas_disciplinas, NOT NULL | Referência à oferta da disciplina            |
| semana               | INT       | NOT NULL                           | Semana da disciplina (1-16)                  |
| numeroAula           | INT       | NOT NULL                           | Número sequencial da aula                    |
| titulo               | VARCHAR   | NOT NULL                           | Título da videoaula                          |
| sinopse              | TEXT      | NULLABLE                           | Descrição detalhada do conteúdo              |
| linkYoutubeOriginal  | TEXT      | NULLABLE                           | URL do vídeo no YouTube (versão original)    |
| slidesDisponivel     | BOOLEAN   | NOT NULL, DEFAULT FALSE            | Indica se há slides disponíveis              |
| status               | VARCHAR   | NULLABLE                           | Status da produção (ex: "Publicado")         |
| idTvCultura          | VARCHAR   | NULLABLE                           | Identificador na TV Cultura                  |
| duracaoMinutos       | INT       | NULLABLE                           | Duração do vídeo em minutos                  |
| linkLibras           | TEXT      | NULLABLE                           | URL da versão com Libras                     |
| linkAudiodescricao   | TEXT      | NULLABLE                           | URL da versão com Audiodescrição             |
| ccLegenda            | BOOLEAN   | NOT NULL, DEFAULT FALSE            | Indica se há closed caption                  |
| linkDownload         | TEXT      | NULLABLE                           | URL para download do vídeo                   |
| createdAt            | TIMESTAMP | NOT NULL, DEFAULT NOW              | Data de criação do registro                  |
| updatedAt            | TIMESTAMP | NOT NULL, ON UPDATE                | Data da última atualização                   |

**Índices:**
- PRIMARY KEY (`id`)
- FOREIGN KEY (`ofertaDisciplinaId`) REFERENCES `ofertas_disciplinas(id)` ON DELETE CASCADE
- INDEX (`semana`, `numeroAula`) - Para ordenação por semana/aula
- INDEX (`status`) - Para filtros por status
- INDEX (`linkLibras`) - Para consultas de acessibilidade (primeiros 255 chars)
- INDEX (`linkAudiodescricao`) - Para consultas de acessibilidade (primeiros 255 chars)

**Regras de Negócio:**
- `semana` geralmente varia de 1 a 16 (um semestre)
- `numeroAula` é sequencial dentro de cada semana
- Pelo menos um dos links (YouTube, Libras, Audiodescrição) deve estar preenchido
- `duracaoMinutos` deve ser maior que 0 quando preenchido
- `status` pode ser: "Publicado", "Em Produção", "Revisão", "Aguardando Aprovação", etc.

**Exemplo de dados:**
```sql
INSERT INTO videoaulas (
  ofertaDisciplinaId, semana, numeroAula, titulo, sinopse,
  linkYoutubeOriginal, slidesDisponivel, status, duracaoMinutos,
  linkLibras, linkAudiodescricao, ccLegenda
) VALUES (
  1, 1, 1, 'Introdução à Programação',
  'Conceitos básicos de programação e lógica computacional',
  'https://youtube.com/watch?v=abc123', TRUE, 'Publicado', 45,
  'https://youtube.com/watch?v=abc123-libras',
  'https://youtube.com/watch?v=abc123-ad', TRUE
);
```

---

### 7. **users**

Usuários do sistema com autenticação OAuth.

| Coluna        | Tipo      | Restrições                  | Descrição                                    |
|---------------|-----------|-----------------------------|----------------------------------------------|
| id            | INT       | PK, AUTO_INCREMENT          | Identificador único do usuário               |
| openId        | VARCHAR   | NOT NULL, UNIQUE            | ID OAuth da plataforma Manus                 |
| name          | TEXT      | NULLABLE                    | Nome completo do usuário                     |
| email         | VARCHAR   | NULLABLE                    | Email do usuário                             |
| loginMethod   | VARCHAR   | NULLABLE                    | Método de login (ex: "manus", "google")      |
| role          | ENUM      | NOT NULL, DEFAULT 'user'    | Papel: 'user' ou 'admin'                     |
| createdAt     | TIMESTAMP | NOT NULL, DEFAULT NOW       | Data de criação da conta                     |
| updatedAt     | TIMESTAMP | NOT NULL, ON UPDATE         | Data da última atualização                   |
| lastSignedIn  | TIMESTAMP | NOT NULL, DEFAULT NOW       | Data do último login                         |

**Índices:**
- PRIMARY KEY (`id`)
- UNIQUE KEY (`openId`)

**Regras de Negócio:**
- `openId` é fornecido pelo sistema OAuth e deve ser único
- `role` define permissões: 'user' (padrão) ou 'admin' (acesso total)
- `lastSignedIn` é atualizado a cada login bem-sucedido

---

## 🔗 Relacionamentos

### **1:N (Um para Muitos)**

#### cursos → disciplinas
- Um curso possui várias disciplinas
- Uma disciplina pertence a um único curso
- **ON DELETE CASCADE**: Se um curso for deletado, todas as suas disciplinas são removidas

#### disciplinas → ofertas_disciplinas
- Uma disciplina pode ter várias ofertas (diferentes anos/bimestres)
- Uma oferta pertence a uma única disciplina
- **ON DELETE CASCADE**: Se uma disciplina for deletada, todas as suas ofertas são removidas

#### professores → ofertas_disciplinas
- Um professor pode estar em várias ofertas
- Uma oferta pode ter um professor (ou nenhum)
- **ON DELETE SET NULL**: Se um professor for deletado, o campo `professorId` nas ofertas vira NULL

#### designers_instrucionais → ofertas_disciplinas
- Um DI pode estar em várias ofertas
- Uma oferta pode ter um DI (ou nenhum)
- **ON DELETE SET NULL**: Se um DI for deletado, o campo `diId` nas ofertas vira NULL

#### ofertas_disciplinas → videoaulas
- Uma oferta pode ter várias videoaulas
- Uma videoaula pertence a uma única oferta
- **ON DELETE CASCADE**: Se uma oferta for deletada, todas as suas videoaulas são removidas

---

## 🔍 Consultas Comuns

### **1. Listar todas as videoaulas com informações completas**

```sql
SELECT 
  v.*,
  d.codigo AS disciplina_codigo,
  d.nome AS disciplina_nome,
  c.nome AS curso_nome,
  p.nome AS professor_nome,
  di.nome AS di_nome,
  od.ano,
  od.bimestreOperacional
FROM videoaulas v
INNER JOIN ofertas_disciplinas od ON v.ofertaDisciplinaId = od.id
INNER JOIN disciplinas d ON od.disciplinaId = d.id
INNER JOIN cursos c ON d.cursoId = c.id
LEFT JOIN professores p ON od.professorId = p.id
LEFT JOIN designers_instrucionais di ON od.diId = di.id
ORDER BY od.ano DESC, od.bimestreOperacional, v.semana, v.numeroAula;
```

### **2. Estatísticas de acessibilidade**

```sql
SELECT 
  COUNT(*) AS total,
  SUM(CASE WHEN linkLibras IS NOT NULL THEN 1 ELSE 0 END) AS com_libras,
  SUM(CASE WHEN linkAudiodescricao IS NOT NULL THEN 1 ELSE 0 END) AS com_audiodescricao,
  SUM(CASE WHEN ccLegenda = TRUE THEN 1 ELSE 0 END) AS com_cc,
  SUM(CASE WHEN linkLibras IS NOT NULL AND linkAudiodescricao IS NOT NULL AND ccLegenda = TRUE THEN 1 ELSE 0 END) AS completas
FROM videoaulas;
```

### **3. Videoaulas por curso**

```sql
SELECT 
  c.nome AS curso,
  COUNT(v.id) AS total_videoaulas
FROM cursos c
INNER JOIN disciplinas d ON c.id = d.cursoId
INNER JOIN ofertas_disciplinas od ON d.id = od.disciplinaId
INNER JOIN videoaulas v ON od.id = v.ofertaDisciplinaId
GROUP BY c.id, c.nome
ORDER BY total_videoaulas DESC;
```

### **4. Videoaulas por bimestre (2025)**

```sql
SELECT 
  od.bimestreOperacional AS bimestre,
  COUNT(v.id) AS total,
  SUM(CASE WHEN v.linkLibras IS NOT NULL THEN 1 ELSE 0 END) AS com_libras,
  SUM(CASE WHEN v.linkAudiodescricao IS NOT NULL THEN 1 ELSE 0 END) AS com_audiodescricao
FROM videoaulas v
INNER JOIN ofertas_disciplinas od ON v.ofertaDisciplinaId = od.id
WHERE od.ano = 2025
GROUP BY od.bimestreOperacional
ORDER BY od.bimestreOperacional;
```

---

## 🚀 Migrations

O sistema usa **Drizzle Kit** para gerenciar migrations:

```bash
# Gerar migration a partir do schema
pnpm drizzle-kit generate

# Aplicar migrations ao banco
pnpm drizzle-kit migrate

# Comando combinado (usado no projeto)
pnpm db:push
```

### **Histórico de Migrations**

1. **Initial Schema** - Criação de todas as tabelas
2. **Add Indexes** - Índices para otimização de consultas
3. **Add Acessibility Fields** - Campos de acessibilidade em videoaulas

---

## 🔒 Segurança e Boas Práticas

### **Proteção contra SQL Injection**
- Todas as queries usam **prepared statements** via Drizzle ORM
- Inputs são validados com **Zod** antes de chegar no banco

### **Integridade Referencial**
- Foreign keys garantem consistência entre tabelas
- Cascades automáticos evitam registros órfãos

### **Backup e Recuperação**
- Backups automáticos diários (gerenciado pela plataforma)
- Point-in-time recovery disponível

### **Performance**
- Índices em colunas frequentemente consultadas
- Queries otimizadas com JOINs eficientes
- Paginação server-side para grandes resultados

---

## 📈 Estatísticas do Banco

### **Volumes Atuais** (Novembro 2025)
- **Cursos**: 9 registros
- **Disciplinas**: 372 registros
- **Professores**: 20 registros
- **Designers Instrucionais**: 22 registros
- **Ofertas de Disciplinas**: ~500 registros
- **Videoaulas**: 485 registros

### **Crescimento Esperado**
- ~100 novas videoaulas por bimestre
- ~50 novas disciplinas por ano
- ~5 novos professores por ano

---

## 🛠️ Manutenção

### **Limpeza de Dados**
```sql
-- Remover videoaulas sem oferta (órfãs)
DELETE FROM videoaulas 
WHERE ofertaDisciplinaId NOT IN (SELECT id FROM ofertas_disciplinas);

-- Remover ofertas sem videoaulas (antigas)
DELETE FROM ofertas_disciplinas 
WHERE id NOT IN (SELECT DISTINCT ofertaDisciplinaId FROM videoaulas)
AND ano < YEAR(CURDATE()) - 2;
```

### **Otimização**
```sql
-- Analisar tabelas para otimizar índices
ANALYZE TABLE videoaulas, ofertas_disciplinas, disciplinas;

-- Reindexar tabelas grandes
OPTIMIZE TABLE videoaulas;
```

---

## 📞 Suporte

Para questões sobre o banco de dados:
- Consulte este documento primeiro
- Verifique os logs do Drizzle ORM
- Abra uma issue no repositório do projeto

---

**Última atualização**: Novembro 2025  
**Versão do Schema**: 1.0.0
