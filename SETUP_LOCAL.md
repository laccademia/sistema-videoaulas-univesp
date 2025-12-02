# Guia de Configuração Local
## Sistema de Videoaulas Univesp

Este guia detalha o processo completo para configurar e executar o projeto localmente no seu computador, incluindo a obtenção de credenciais do Supabase e configuração do banco de dados.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu computador:

### Software Necessário

**Node.js 22.x ou superior** - O projeto utiliza recursos modernos do Node.js. Você pode verificar sua versão com `node --version`. Se não tiver instalado ou sua versão for antiga, baixe a versão LTS mais recente em https://nodejs.org/

**pnpm** - Gerenciador de pacotes utilizado no projeto. Após instalar o Node.js, instale o pnpm globalmente executando `npm install -g pnpm` no terminal.

**Git** - Para clonar o repositório. Verifique se está instalado com `git --version`. Se necessário, baixe em https://git-scm.com/

**Editor de Código** - Recomendamos Visual Studio Code (https://code.visualstudio.com/) com as extensões TypeScript e ESLint instaladas.

### Conhecimentos Recomendados

Familiaridade básica com terminal/linha de comando, conceitos de variáveis de ambiente, e noções de React e TypeScript facilitarão o processo, mas não são estritamente necessários para seguir este guia.

---

## 🚀 Passo 1: Clonar o Repositório

Abra o terminal (no Windows, use PowerShell ou Git Bash) e navegue até a pasta onde deseja instalar o projeto. Execute o comando para clonar o repositório do GitHub:

```bash
git clone https://github.com/laccademia/sistema-videoaulas-univesp.git
cd sistema-videoaulas-univesp
```

Este comando criará uma pasta `sistema-videoaulas-univesp` contendo todo o código-fonte do projeto. O comando `cd` entra nessa pasta para que os próximos comandos sejam executados no contexto correto.

---

## 📦 Passo 2: Instalar Dependências

Com o terminal ainda na pasta do projeto, execute o comando para instalar todas as dependências necessárias:

```bash
pnpm install
```

Este processo pode levar alguns minutos, dependendo da velocidade da sua conexão com a internet. O pnpm irá baixar e instalar todas as bibliotecas listadas no arquivo `package.json`, incluindo React, TypeScript, Express, tRPC, Drizzle ORM, e dezenas de outras dependências.

Você verá uma saída detalhada no terminal mostrando o progresso da instalação. Ao final, deverá ver uma mensagem indicando sucesso, sem erros críticos (avisos em amarelo são normais e podem ser ignorados).

---

## 🗄️ Passo 3: Configurar Banco de Dados Supabase

O projeto utiliza Supabase como plataforma de banco de dados e autenticação. Siga os passos abaixo para criar e configurar seu projeto no Supabase.

### 3.1. Criar Conta no Supabase

Acesse https://supabase.com/ e clique em **"Start your project"**. Você pode criar uma conta usando seu email ou fazer login com GitHub, que é mais rápido e conveniente.

A conta gratuita do Supabase oferece recursos generosos suficientes para desenvolvimento e até pequenas aplicações em produção: 500 MB de armazenamento de banco de dados, 2 GB de transferência de dados por mês, e autenticação ilimitada de usuários.

### 3.2. Criar Novo Projeto

Após fazer login, você será direcionado ao dashboard do Supabase. Clique no botão **"New Project"** para criar um novo projeto.

Preencha as informações solicitadas:

**Nome do Projeto**: Escolha um nome descritivo como "sistema-videoaulas-univesp" ou "videoaulas-dev" se for um ambiente de desenvolvimento.

**Database Password**: Crie uma senha forte e **anote-a em local seguro**. Esta senha será necessária para conectar ao banco de dados. Recomendamos usar um gerenciador de senhas como Bitwarden ou 1Password para armazenar com segurança.

**Região**: Selecione a região geográfica mais próxima de você ou dos seus usuários. Para o Brasil, recomendamos "South America (São Paulo)" se disponível, ou "East US (North Virginia)" como alternativa próxima.

**Plano**: Selecione "Free" para desenvolvimento. Você pode fazer upgrade posteriormente se necessário.

Clique em **"Create new project"** e aguarde alguns minutos enquanto o Supabase provisiona a infraestrutura do seu banco de dados.

### 3.3. Obter Credenciais do Projeto

Após a criação do projeto, você será direcionado ao dashboard. Clique no ícone de **"Settings"** (engrenagem) na barra lateral esquerda, depois em **"API"**.

Nesta página, você encontrará as credenciais necessárias para conectar sua aplicação ao Supabase:

**Project URL** - URL base do seu projeto, no formato `https://xxxxxxxxxxxxx.supabase.co`. Copie este valor, você precisará dele como `VITE_SUPABASE_URL`.

**anon public** - Chave pública que pode ser exposta no frontend. Copie o valor da seção "Project API keys" onde está escrito "anon public". Este será seu `VITE_SUPABASE_ANON_KEY`.

**service_role** - Chave secreta com privilégios administrativos, **nunca deve ser exposta no frontend**. Copie o valor onde está escrito "service_role". Este será seu `SUPABASE_SERVICE_ROLE_KEY`.

Anote todas essas credenciais em local seguro. Você as utilizará no próximo passo.

### 3.4. Criar Tabelas no Banco de Dados

Com o projeto Supabase criado, precisamos criar as tabelas necessárias para o sistema. No dashboard do Supabase, clique em **"SQL Editor"** na barra lateral esquerda.

Clique em **"New query"** para abrir um editor SQL vazio. Copie e cole o conteúdo do arquivo `drizzle/schema.ts` do projeto local, mas precisaremos convertê-lo para SQL puro.

**Opção Automática (Recomendada)**: Execute o comando abaixo no terminal do projeto local para gerar e aplicar as migrations automaticamente:

```bash
pnpm db:push
```

Este comando utiliza o Drizzle ORM para ler o schema TypeScript e criar automaticamente todas as tabelas no banco de dados Supabase. Você verá uma saída detalhando as tabelas criadas.

**Opção Manual**: Se preferir criar as tabelas manualmente via SQL, execute os seguintes comandos no SQL Editor do Supabase:

```sql
-- Criar tabela de cursos
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  eixo VARCHAR(100) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de disciplinas
CREATE TABLE disciplinas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nome VARCHAR(200) NOT NULL,
  carga_horaria INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de relacionamento cursos-disciplinas (many-to-many)
CREATE TABLE cursos_disciplinas (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(curso_id, disciplina_id)
);

-- Criar tabela de professores
CREATE TABLE professores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de designers instrucionais
CREATE TABLE designers_instrucionais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de ofertas de disciplinas
CREATE TABLE ofertas_disciplinas (
  id SERIAL PRIMARY KEY,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  bimestre_operacional INTEGER NOT NULL,
  professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL,
  designer_instrucional_id INTEGER REFERENCES designers_instrucionais(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de videoaulas
CREATE TABLE videoaulas (
  id SERIAL PRIMARY KEY,
  id_tv_cultura VARCHAR(100) UNIQUE,
  titulo VARCHAR(300) NOT NULL,
  sinopse TEXT,
  semana INTEGER,
  numero_aula INTEGER,
  link_youtube VARCHAR(500),
  link_slides VARCHAR(500),
  link_libras VARCHAR(500),
  link_audiodescricao VARCHAR(500),
  cc_legenda BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'publicada',
  oferta_disciplina_id INTEGER REFERENCES ofertas_disciplinas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  open_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(200),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de histórico de importações
CREATE TABLE historico_importacoes (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  nome_arquivo VARCHAR(300) NOT NULL,
  usuario_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  total_linhas INTEGER NOT NULL,
  sucessos INTEGER NOT NULL,
  erros INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_videoaulas_oferta ON videoaulas(oferta_disciplina_id);
CREATE INDEX idx_ofertas_disciplina ON ofertas_disciplinas(disciplina_id);
CREATE INDEX idx_ofertas_professor ON ofertas_disciplinas(professor_id);
CREATE INDEX idx_cursos_disciplinas_curso ON cursos_disciplinas(curso_id);
CREATE INDEX idx_cursos_disciplinas_disciplina ON cursos_disciplinas(disciplina_id);
```

Execute este script clicando em **"Run"** no SQL Editor. Você verá mensagens de sucesso para cada tabela criada.

### 3.5. Desabilitar RLS (Opcional para Desenvolvimento)

Por padrão, o Supabase ativa Row Level Security (RLS) em todas as tabelas, o que bloqueia acesso até que políticas sejam configuradas. Para facilitar o desenvolvimento inicial, você pode desabilitar temporariamente o RLS:

```sql
ALTER TABLE cursos DISABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_disciplinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE professores DISABLE ROW LEVEL SECURITY;
ALTER TABLE designers_instrucionais DISABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas_disciplinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE videoaulas DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE historico_importacoes DISABLE ROW LEVEL SECURITY;
```

**ATENÇÃO**: Em produção, você deve habilitar RLS e configurar políticas de segurança adequadas.

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

Agora que temos as credenciais do Supabase, precisamos configurá-las no projeto local através de variáveis de ambiente.

### 4.1. Criar Arquivo .env

Na raiz do projeto, crie um arquivo chamado `.env` (note o ponto no início). Você pode fazer isso pelo terminal:

```bash
# No macOS/Linux
touch .env

# No Windows (PowerShell)
New-Item .env -ItemType File
```

Ou simplesmente crie o arquivo pelo seu editor de código.

### 4.2. Preencher Variáveis de Ambiente

Abra o arquivo `.env` no seu editor e adicione as seguintes variáveis, substituindo os valores de exemplo pelas suas credenciais reais:

```env
# ============================================
# BANCO DE DADOS
# ============================================
# URL de conexão do Supabase (formato PostgreSQL)
# Substitua: PASSWORD pela senha que você criou no passo 3.2
# Substitua: xxxxxxxxxxxxx pelo ID do seu projeto (parte da Project URL)
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# ============================================
# SUPABASE
# ============================================
# URL base do projeto Supabase (obtida no passo 3.3)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Chave pública anon (obtida no passo 3.3)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Chave secreta service_role (obtida no passo 3.3)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# AUTENTICAÇÃO
# ============================================
# Segredo para assinar tokens JWT (gere uma string aleatória forte)
# Você pode gerar uma com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=sua_chave_secreta_aleatoria_aqui_minimo_32_caracteres

# ============================================
# OAUTH (Opcional - apenas se usar Manus OAuth)
# ============================================
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# ============================================
# APLICAÇÃO
# ============================================
# Título e logo da aplicação
VITE_APP_TITLE=Sistema de Videoaulas Univesp
VITE_APP_LOGO=/logo-univesp.png

# Porta do servidor (padrão: 3000)
PORT=3000

# Ambiente (development, production)
NODE_ENV=development
```

### 4.3. Gerar JWT_SECRET

Para gerar uma chave secreta forte para `JWT_SECRET`, execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie a string gerada e cole no `.env` como valor de `JWT_SECRET`.

### 4.4. Obter DATABASE_URL Completa

A `DATABASE_URL` precisa incluir sua senha do banco de dados. O formato é:

```
postgresql://postgres:SUA_SENHA@db.SEU_PROJECT_ID.supabase.co:5432/postgres
```

Substitua:
- `SUA_SENHA` pela senha que você criou no passo 3.2
- `SEU_PROJECT_ID` pelo ID do seu projeto (é a primeira parte da `VITE_SUPABASE_URL`, por exemplo, se sua URL é `https://abcdefghijk.supabase.co`, o ID é `abcdefghijk`)

**Exemplo completo**:
```
DATABASE_URL=postgresql://postgres:MinhaSenh@123@db.abcdefghijk.supabase.co:5432/postgres
```

---

## 🎬 Passo 5: Importar Dados Iniciais

Com o banco de dados configurado, você pode importar os dados iniciais das videoaulas da Univesp.

### 5.1. Verificar Arquivos CSV

O projeto inclui arquivos CSV na pasta `shared/` ou na raiz do projeto com dados de disciplinas, cursos, professores e videoaulas. Verifique se esses arquivos estão presentes:

```bash
ls *.csv
```

Se os arquivos não estiverem presentes, você pode baixá-los do repositório original ou solicitar ao administrador do projeto.

### 5.2. Executar Script de Importação

O projeto inclui scripts de importação que processam os arquivos CSV e populam o banco de dados. Execute:

```bash
pnpm run seed
```

Este comando executará o arquivo `server/seed.ts`, que lê os CSVs e insere os dados no Supabase. Você verá mensagens no terminal indicando o progresso da importação.

Se houver erros, verifique se:
- As credenciais do `.env` estão corretas
- As tabelas foram criadas corretamente no passo 3.4
- Os arquivos CSV estão no formato esperado

---

## 🚀 Passo 6: Executar o Projeto

Com tudo configurado, você está pronto para executar o projeto localmente!

### 6.1. Iniciar Servidor de Desenvolvimento

Execute o comando:

```bash
pnpm dev
```

Este comando inicia simultaneamente o servidor backend (Express + tRPC) e o servidor de desenvolvimento frontend (Vite). Você verá mensagens no terminal indicando que ambos os servidores estão rodando.

Aguarde alguns segundos até ver mensagens como:

```
Server running on http://localhost:3000
[vite] dev server running at http://localhost:3000
```

### 6.2. Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

Você deverá ver a página inicial do Sistema de Videoaulas Univesp, com o dashboard mostrando estatísticas e gráficos.

### 6.3. Criar Usuário Administrador

Para acessar o painel administrativo, você precisa criar um usuário com role de admin. Acesse a página de cadastro:

```
http://localhost:3000/cadastro
```

Preencha o formulário com:
- **Nome**: Seu nome
- **Email**: Seu email
- **Senha**: Uma senha forte

Após criar a conta, você precisa promover esse usuário para admin manualmente no banco de dados. Acesse o SQL Editor do Supabase e execute:

```sql
UPDATE users SET role = 'admin' WHERE email = 'seu_email@exemplo.com';
```

Substitua `seu_email@exemplo.com` pelo email que você usou no cadastro.

Agora faça logout e login novamente. Você terá acesso ao painel administrativo em:

```
http://localhost:3000/admin
```

---

## 🧪 Passo 7: Executar Testes

O projeto inclui testes unitários para garantir que tudo está funcionando corretamente.

### 7.1. Executar Todos os Testes

```bash
pnpm test
```

Este comando executa todos os testes usando Vitest. Você verá uma saída detalhada mostrando quais testes passaram ou falharam.

### 7.2. Executar Testes em Modo Watch

Para desenvolvimento contínuo, você pode executar os testes em modo watch, que reexecuta automaticamente quando você modifica arquivos:

```bash
pnpm test --watch
```

### 7.3. Gerar Relatório de Cobertura

Para ver quais partes do código estão cobertas por testes:

```bash
pnpm test --coverage
```

Um relatório HTML será gerado na pasta `coverage/`. Abra `coverage/index.html` no navegador para visualizar.

---

## 🔧 Passo 8: Desenvolvimento

Agora que tudo está funcionando, você pode começar a desenvolver!

### 8.1. Estrutura de Pastas

Familiarize-se com a estrutura do projeto:

```
sistema-videoaulas-univesp/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── contexts/    # Contextos React
│   │   └── lib/         # Utilitários e configurações
├── server/              # Backend Node.js
│   ├── _core/           # Infraestrutura (não editar)
│   ├── db.ts            # Helpers de banco de dados
│   └── routers.ts       # Routers tRPC
├── drizzle/             # Schema e migrations
└── shared/              # Código compartilhado
```

### 8.2. Hot Reload

O servidor de desenvolvimento possui hot reload ativado. Quando você modifica arquivos, as mudanças são refletidas automaticamente no navegador sem necessidade de reiniciar o servidor.

### 8.3. Adicionar Novas Funcionalidades

Para adicionar uma nova funcionalidade:

1. **Backend**: Adicione um novo router ou procedure em `server/routers.ts`
2. **Frontend**: Crie componentes em `client/src/components/` ou páginas em `client/src/pages/`
3. **Rotas**: Adicione novas rotas em `client/src/App.tsx`
4. **Testes**: Adicione testes em `server/*.test.ts`

### 8.4. Modificar Schema do Banco

Se precisar adicionar ou modificar tabelas:

1. Edite `drizzle/schema.ts`
2. Execute `pnpm db:push` para aplicar mudanças no Supabase
3. Atualize os helpers em `server/db.ts` se necessário

---

## 📦 Passo 9: Build para Produção

Quando estiver pronto para fazer deploy, gere uma build de produção:

### 9.1. Criar Build

```bash
pnpm build
```

Este comando compila o TypeScript, otimiza o código frontend, e gera arquivos prontos para produção na pasta `dist/`.

### 9.2. Testar Build Localmente

Para testar a build de produção localmente:

```bash
pnpm start
```

Acesse `http://localhost:3000` para verificar se tudo está funcionando corretamente.

---

## 🐛 Solução de Problemas Comuns

### Erro: "Cannot connect to database"

**Causa**: Credenciais incorretas no `.env` ou firewall bloqueando conexão.

**Solução**: 
1. Verifique se `DATABASE_URL` está correta, especialmente a senha
2. Teste a conexão no SQL Editor do Supabase
3. Verifique se seu IP não está bloqueado nas configurações de rede do Supabase

### Erro: "Port 3000 already in use"

**Causa**: Outra aplicação está usando a porta 3000.

**Solução**: 
1. Mude a porta no `.env`: `PORT=3001`
2. Ou encerre o processo que está usando a porta 3000

### Erro: "Module not found"

**Causa**: Dependências não instaladas ou corrompidas.

**Solução**: 
1. Delete a pasta `node_modules`
2. Execute `pnpm install` novamente

### Testes Falhando

**Causa**: Banco de dados não configurado ou dados ausentes.

**Solução**: 
1. Verifique se o `.env` está configurado corretamente
2. Execute `pnpm run seed` para popular dados de teste
3. Verifique se as tabelas foram criadas no Supabase

### Página em Branco no Navegador

**Causa**: Erro JavaScript no frontend.

**Solução**: 
1. Abra o console do navegador (F12) e verifique erros
2. Verifique se o servidor backend está rodando
3. Limpe o cache do navegador (Ctrl+Shift+R)

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev/
- **tRPC**: https://trpc.io/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs/overview
- **Tailwind CSS**: https://tailwindcss.com/docs

### Comunidade

- **GitHub Issues**: https://github.com/laccademia/sistema-videoaulas-univesp/issues
- **Supabase Discord**: https://discord.supabase.com/

---

## ✅ Checklist de Configuração

Use esta checklist para garantir que completou todos os passos:

- [ ] Node.js 22.x instalado
- [ ] pnpm instalado globalmente
- [ ] Repositório clonado do GitHub
- [ ] Dependências instaladas com `pnpm install`
- [ ] Conta Supabase criada
- [ ] Projeto Supabase criado
- [ ] Credenciais Supabase copiadas (URL, anon key, service_role key)
- [ ] Tabelas criadas no banco de dados
- [ ] Arquivo `.env` criado e preenchido
- [ ] `JWT_SECRET` gerado
- [ ] Dados iniciais importados com `pnpm run seed`
- [ ] Servidor de desenvolvimento iniciado com `pnpm dev`
- [ ] Aplicação acessível em http://localhost:3000
- [ ] Usuário administrador criado e promovido
- [ ] Testes executados com sucesso

---

**Parabéns!** Se você completou todos os passos, o Sistema de Videoaulas Univesp está rodando localmente no seu computador e você está pronto para desenvolver novas funcionalidades ou fazer deploy em produção.

Para dúvidas ou problemas não cobertos neste guia, abra uma issue no GitHub ou consulte a documentação oficial das tecnologias utilizadas.
