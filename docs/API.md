# 🔌 Documentação da API

Este documento descreve todos os endpoints da API tRPC do Sistema de Videoaulas Univesp, incluindo parâmetros, retornos e exemplos de uso.

---

## 📋 Visão Geral

A API utiliza **tRPC 11** para comunicação type-safe entre frontend e backend. Todos os endpoints são automaticamente tipados e validados com **Zod**.

### **Base URL**
```
/api/trpc
```

### **Formato de Resposta**
Todas as respostas seguem o formato tRPC padrão com serialização **Superjson** para suporte a tipos complexos (Date, BigInt, etc.).

---

## 🔐 Autenticação

### **auth.me**
Retorna informações do usuário autenticado.

**Tipo**: Query  
**Autenticação**: Não requerida (retorna null se não autenticado)

**Retorno**:
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
} | null
```

**Exemplo de uso (React)**:
```typescript
const { data: user, isLoading } = trpc.auth.me.useQuery();

if (user) {
  console.log(`Bem-vindo, ${user.name}!`);
}
```

---

### **auth.logout**
Realiza logout do usuário atual.

**Tipo**: Mutation  
**Autenticação**: Não requerida

**Retorno**:
```typescript
{
  success: true;
}
```

**Exemplo de uso (React)**:
```typescript
const logoutMutation = trpc.auth.logout.useMutation();

const handleLogout = async () => {
  await logoutMutation.mutateAsync();
  // Redirecionar para home
};
```

---

## 🎓 Cursos

### **cursos.list**
Lista todos os cursos disponíveis.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
Array<{
  id: number;
  eixo: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Exemplo de uso**:
```typescript
const { data: cursos } = trpc.cursos.list.useQuery();

cursos?.forEach(curso => {
  console.log(`${curso.nome} (${curso.eixo})`);
});
```

---

### **cursos.getById**
Obtém detalhes de um curso específico.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  id: number; // ID do curso
}
```

**Retorno**:
```typescript
{
  id: number;
  eixo: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
} | undefined
```

**Exemplo de uso**:
```typescript
const { data: curso } = trpc.cursos.getById.useQuery({ id: 1 });

if (curso) {
  console.log(curso.nome);
}
```

---

### **cursos.getDisciplinas**
Lista todas as disciplinas de um curso.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  cursoId: number; // ID do curso
}
```

**Retorno**:
```typescript
Array<{
  id: number;
  codigo: string;
  nome: string;
  cargaHoraria: number;
  anoCurso: number;
  bimestrePedagogico: number;
  cursoId: number;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Exemplo de uso**:
```typescript
const { data: disciplinas } = trpc.cursos.getDisciplinas.useQuery({ cursoId: 1 });

console.log(`Total de disciplinas: ${disciplinas?.length}`);
```

---

## 📚 Disciplinas

### **disciplinas.list**
Lista todas as disciplinas com filtros opcionais.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros** (todos opcionais):
```typescript
{
  cursoId?: number;
  anoCurso?: number;
  bimestrePedagogico?: number;
}
```

**Retorno**:
```typescript
Array<{
  id: number;
  codigo: string;
  nome: string;
  cargaHoraria: number;
  anoCurso: number;
  bimestrePedagogico: number;
  cursoId: number;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Exemplo de uso**:
```typescript
// Todas as disciplinas
const { data: todas } = trpc.disciplinas.list.useQuery();

// Disciplinas do 1º ano
const { data: primeiroAno } = trpc.disciplinas.list.useQuery({ anoCurso: 1 });

// Disciplinas de um curso específico
const { data: doCurso } = trpc.disciplinas.list.useQuery({ cursoId: 3 });
```

---

### **disciplinas.listComCurso**
Lista disciplinas com informações do curso.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
Array<{
  disciplina: {
    id: number;
    codigo: string;
    nome: string;
    cargaHoraria: number;
    anoCurso: number;
    bimestrePedagogico: number;
    cursoId: number;
    createdAt: Date;
    updatedAt: Date;
  };
  curso: {
    id: number;
    eixo: string;
    nome: string;
  } | null;
}>
```

**Exemplo de uso**:
```typescript
const { data: disciplinas } = trpc.disciplinas.listComCurso.useQuery();

disciplinas?.forEach(item => {
  console.log(`${item.disciplina.nome} - ${item.curso?.nome}`);
});
```

---

### **disciplinas.getById**
Obtém detalhes de uma disciplina específica.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  id: number; // ID da disciplina
}
```

**Retorno**:
```typescript
{
  id: number;
  codigo: string;
  nome: string;
  cargaHoraria: number;
  anoCurso: number;
  bimestrePedagogico: number;
  cursoId: number;
  createdAt: Date;
  updatedAt: Date;
} | undefined
```

---

### **disciplinas.getOfertas**
Lista ofertas de uma disciplina.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  disciplinaId: number; // ID da disciplina
}
```

**Retorno**:
```typescript
Array<{
  oferta: {
    id: number;
    disciplinaId: number;
    ano: number;
    bimestreOperacional: number;
    professorId: number | null;
    diId: number | null;
    tipo: string;
    createdAt: Date;
    updatedAt: Date;
  };
  professor: {
    id: number;
    nome: string;
  } | null;
  di: {
    id: number;
    nome: string;
  } | null;
}>
```

---

## 🎥 Videoaulas

### **videoaulas.list**
Lista videoaulas com filtros avançados e paginação.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros** (todos opcionais):
```typescript
{
  cursoId?: number;
  disciplinaCodigo?: string;
  ano?: number;
  bimestre?: number;
  professorNome?: string;
  diNome?: string;
  status?: string;
  search?: string; // Busca em título e sinopse
  limit?: number; // Padrão: 50
  offset?: number; // Padrão: 0
}
```

**Retorno**:
```typescript
{
  items: Array<{
    videoaula: {
      id: number;
      ofertaDisciplinaId: number;
      semana: number;
      numeroAula: number;
      titulo: string;
      sinopse: string | null;
      linkYoutubeOriginal: string | null;
      slidesDisponivel: boolean;
      status: string | null;
      idTvCultura: string | null;
      duracaoMinutos: number | null;
      linkLibras: string | null;
      linkAudiodescricao: string | null;
      ccLegenda: boolean;
      linkDownload: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    oferta: { ... } | null;
    disciplina: { ... } | null;
    curso: { ... } | null;
    professor: { ... } | null;
    di: { ... } | null;
  }>;
  total: number;
  offset: number;
  limit: number;
}
```

**Exemplo de uso**:
```typescript
// Todas as videoaulas (paginado)
const { data } = trpc.videoaulas.list.useQuery({ limit: 20, offset: 0 });

// Busca por texto
const { data: busca } = trpc.videoaulas.list.useQuery({ 
  search: 'programação',
  limit: 50 
});

// Filtro por curso e bimestre
const { data: filtrado } = trpc.videoaulas.list.useQuery({ 
  cursoId: 3,
  bimestre: 1,
  ano: 2025
});

console.log(`Exibindo ${data?.items.length} de ${data?.total} videoaulas`);
```

---

### **videoaulas.getById**
Obtém detalhes completos de uma videoaula.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  id: number; // ID da videoaula
}
```

**Retorno**:
```typescript
{
  videoaula: { ... };
  oferta: { ... } | null;
  disciplina: { ... } | null;
  curso: { ... } | null;
  professor: { ... } | null;
  di: { ... } | null;
} | undefined
```

**Exemplo de uso**:
```typescript
const { data: videoaula } = trpc.videoaulas.getById.useQuery({ id: 123 });

if (videoaula) {
  console.log(videoaula.videoaula.titulo);
  console.log(`Professor: ${videoaula.professor?.nome}`);
  console.log(`Curso: ${videoaula.curso?.nome}`);
}
```

---

## 👨‍🏫 Professores

### **professores.list**
Lista todos os professores.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
Array<{
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Exemplo de uso**:
```typescript
const { data: professores } = trpc.professores.list.useQuery();

console.log(`Total de professores: ${professores?.length}`);
```

---

### **professores.getById**
Obtém detalhes de um professor.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  id: number; // ID do professor
}
```

**Retorno**:
```typescript
{
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
} | undefined
```

---

### **professores.getByNome**
Busca professor por nome (parcial, case-insensitive).

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  nome: string; // Nome ou parte do nome
}
```

**Retorno**:
```typescript
Array<{
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Exemplo de uso**:
```typescript
const { data: professores } = trpc.professores.getByNome.useQuery({ 
  nome: 'Silva' 
});

// Retorna todos os professores com "Silva" no nome
```

---

## 🎨 Designers Instrucionais

### **dis.list**
Lista todos os designers instrucionais.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
Array<{
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

---

### **dis.getById**
Obtém detalhes de um designer instrucional.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  id: number; // ID do DI
}
```

**Retorno**:
```typescript
{
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
} | undefined
```

---

### **dis.getByNome**
Busca designer instrucional por nome.

**Tipo**: Query  
**Autenticação**: Não requerida

**Parâmetros**:
```typescript
{
  nome: string; // Nome ou parte do nome
}
```

**Retorno**:
```typescript
Array<{
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}>
```

---

## 📊 Estatísticas

### **stats.overview**
Retorna estatísticas gerais do sistema.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
{
  totalVideoaulas: number;
  totalDisciplinas: number;
  totalCursos: number;
  totalProfessores: number;
  acessibilidade: {
    comLibras: number;
    comAudiodescricao: number;
    comCC: number;
    completas: number;
  };
}
```

**Exemplo de uso**:
```typescript
const { data: stats } = trpc.stats.overview.useQuery();

console.log(`Total de videoaulas: ${stats?.totalVideoaulas}`);
console.log(`Com Libras: ${stats?.acessibilidade.comLibras}`);
```

---

### **stats.porCurso**
Estatísticas de videoaulas por curso.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
Array<{
  curso: {
    id: number;
    nome: string;
    eixo: string;
  };
  total: number;
  comLibras: number;
  comAudiodescricao: number;
  comCC: number;
}>
```

**Exemplo de uso**:
```typescript
const { data: porCurso } = trpc.stats.porCurso.useQuery();

porCurso?.forEach(stat => {
  console.log(`${stat.curso.nome}: ${stat.total} videoaulas`);
});
```

---

### **stats.porBimestre**
Estatísticas de videoaulas por bimestre (2025).

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
Array<{
  bimestre: number;
  total: number;
  comLibras: number;
  comAudiodescricao: number;
  comCC: number;
}>
```

**Exemplo de uso**:
```typescript
const { data: porBimestre } = trpc.stats.porBimestre.useQuery();

// Dados prontos para gráficos
```

---

### **stats.porStatus**
Estatísticas de videoaulas por status.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
Array<{
  status: string;
  total: number;
}>
```

**Exemplo de uso**:
```typescript
const { data: porStatus } = trpc.stats.porStatus.useQuery();

porStatus?.forEach(stat => {
  console.log(`${stat.status}: ${stat.total}`);
});
```

---

### **stats.acessibilidade**
Estatísticas detalhadas de acessibilidade.

**Tipo**: Query  
**Autenticação**: Não requerida

**Retorno**:
```typescript
{
  total: number;
  comLibras: number;
  comAudiodescricao: number;
  comCC: number;
  completas: number; // Com todos os recursos
}
```

**Exemplo de uso**:
```typescript
const { data: acessibilidade } = trpc.stats.acessibilidade.useQuery();

const percentualLibras = (acessibilidade.comLibras / acessibilidade.total) * 100;
console.log(`${percentualLibras.toFixed(1)}% com Libras`);
```

---

## 🔧 Uso no Frontend

### **Configuração do Cliente tRPC**

```typescript
// client/src/lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();
```

### **Exemplo Completo de Componente**

```typescript
import { trpc } from "@/lib/trpc";

function VideoaulasList() {
  const [search, setSearch] = useState("");
  
  const { data, isLoading, error } = trpc.videoaulas.list.useQuery({
    search,
    limit: 20,
    offset: 0,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar videoaulas..."
      />
      
      <p>Exibindo {data.items.length} de {data.total} videoaulas</p>
      
      {data.items.map(item => (
        <div key={item.videoaula.id}>
          <h3>{item.videoaula.titulo}</h3>
          <p>{item.curso?.nome} - {item.disciplina?.nome}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🚀 Performance

### **Otimizações Implementadas**
- Queries com JOINs otimizados
- Paginação server-side
- Caching automático com TanStack Query
- Serialização eficiente com Superjson

### **Boas Práticas**
- Use `limit` e `offset` para grandes listas
- Implemente debouncing em campos de busca
- Use `enabled: false` para queries condicionais
- Aproveite o cache do TanStack Query

---

## 📝 Notas Técnicas

### **Type Safety**
Todos os endpoints são completamente tipados. O TypeScript garante:
- Parâmetros corretos
- Retornos tipados
- Autocomplete no IDE
- Detecção de erros em tempo de compilação

### **Validação**
Todos os inputs são validados com Zod antes de chegar no banco de dados.

### **Erros**
Erros seguem o padrão tRPC:
```typescript
{
  code: 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR' | ...,
  message: string;
}
```

---

**Última atualização**: Novembro 2025  
**Versão da API**: 1.0.0
