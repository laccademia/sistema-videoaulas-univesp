# Script de Apresentação
## Sistema de Videoaulas Univesp

---

## 🎯 Introdução (2 minutos)

Bom dia/Boa tarde. Hoje vou apresentar o **Sistema de Videoaulas Univesp**, uma plataforma completa desenvolvida para gestão, visualização e análise do extenso catálogo de videoaulas produzidas pela Universidade Virtual do Estado de São Paulo.

Este sistema foi construído com tecnologias modernas e escaláveis, com destaque especial para a integração com **Supabase**, que revolucionou nossa abordagem de autenticação e gerenciamento de dados. Ao longo desta apresentação, vou demonstrar como essa escolha tecnológica trouxe benefícios concretos em segurança, produtividade e experiência do usuário.

---

## 📊 Visão Geral do Sistema (3 minutos)

O sistema gerencia atualmente um acervo significativo de conteúdo educacional da Univesp, organizado em uma estrutura hierárquica que facilita a navegação e descoberta de conteúdo.

### Dados do Sistema

Nossa plataforma centraliza informações de **1.887 videoaulas** distribuídas em **219 disciplinas** ativas, oferecidas em **9 cursos** de graduação diferentes. Este conteúdo foi produzido com a colaboração de **89 professores** e **22 designers instrucionais**, representando um investimento significativo em educação de qualidade.

### Arquitetura Moderna

A aplicação foi desenvolvida utilizando uma stack tecnológica de ponta. No frontend, utilizamos **React 19** com **TypeScript** para garantir type-safety em toda a aplicação, combinado com **Tailwind CSS 4** para um design responsivo e moderno. O backend é construído em **Node.js** com **Express**, utilizando **tRPC** para comunicação type-safe entre cliente e servidor, eliminando a necessidade de definições duplicadas de tipos e reduzindo drasticamente bugs relacionados a contratos de API.

A camada de dados utiliza **TiDB** (compatível com MySQL) como banco de dados principal, gerenciado através do **Drizzle ORM**, que oferece migrations type-safe e queries otimizadas. Para autenticação e gerenciamento de usuários, integramos o **Supabase**, que se tornou o diferencial estratégico do projeto.

---

## 🔐 Supabase: O Diferencial em Autenticação (5 minutos)

A escolha do Supabase como plataforma de autenticação trouxe benefícios transformadores para o projeto, tanto em termos técnicos quanto de experiência do usuário.

### Autenticação Empresarial Sem Complexidade

Tradicionalmente, implementar um sistema de autenticação robusto demanda semanas de desenvolvimento. É necessário criar tabelas de usuários, implementar hashing seguro de senhas (preferencialmente com bcrypt ou Argon2), desenvolver fluxos de registro e login, gerenciar tokens JWT, implementar refresh tokens, criar sistemas de recuperação de senha, e garantir proteção contra ataques comuns como SQL injection, CSRF e XSS.

Com Supabase, toda essa complexidade foi abstraída. O sistema oferece autenticação pronta para produção com apenas algumas linhas de código. Implementamos login por email e senha utilizando a função `supabase.auth.signInWithPassword()`, que automaticamente gerencia hashing de senhas com bcrypt, criação de sessões seguras, e geração de tokens JWT assinados.

### Sessões Seguras e Automáticas

Um dos maiores benefícios do Supabase é o gerenciamento automático de sessões. Quando um usuário faz login, o Supabase cria automaticamente um token de acesso e um refresh token, armazenados de forma segura no navegador. O sistema monitora a expiração dos tokens e os renova automaticamente em background, garantindo que usuários autenticados nunca sejam desconectados inesperadamente durante o uso da aplicação.

No nosso código, isso se traduz em simplicidade extrema. Para verificar se um usuário está autenticado, basta chamar `supabase.auth.getUser()`. Para fazer logout, uma única linha: `supabase.auth.signOut()`. Toda a complexidade de gerenciamento de tokens, validação de sessões e renovação automática é tratada pela biblioteca cliente do Supabase.

### Segurança de Nível Empresarial

O Supabase implementa as melhores práticas de segurança da indústria. As senhas são hasheadas usando bcrypt com salt automático, tornando praticamente impossível recuperar senhas originais mesmo em caso de vazamento de dados. Os tokens JWT são assinados com chaves secretas fortes e incluem claims de expiração, prevenindo uso não autorizado.

Além disso, o Supabase oferece proteção integrada contra ataques de força bruta através de rate limiting automático, bloqueando tentativas excessivas de login de um mesmo IP. A comunicação entre cliente e servidor é sempre criptografada via HTTPS, e o sistema suporta autenticação de dois fatores (2FA) caso desejemos implementar no futuro.

### Escalabilidade Garantida

Outro benefício crítico é a escalabilidade. O Supabase é construído sobre PostgreSQL e utiliza infraestrutura global da AWS, garantindo alta disponibilidade e performance mesmo com milhares de usuários simultâneos. Não precisamos nos preocupar com configuração de servidores, balanceamento de carga ou replicação de dados - tudo isso é gerenciado automaticamente pela plataforma.

---

## 📝 Supabase: Edição de Dados Simplificada (4 minutos)

Além da autenticação, o Supabase revolucionou nossa abordagem para edição e gerenciamento de dados, oferecendo ferramentas que aumentam drasticamente a produtividade da equipe.

### Interface Visual de Banco de Dados

O Supabase oferece um painel administrativo web completo onde podemos visualizar e editar dados diretamente no navegador, sem necessidade de ferramentas externas como phpMyAdmin ou DBeaver. A interface é intuitiva e permite filtrar, ordenar e editar registros com cliques, acelerando significativamente tarefas de manutenção e correção de dados.

Durante o desenvolvimento, utilizamos extensivamente essa interface para popular tabelas iniciais, corrigir inconsistências nos dados importados das planilhas originais, e validar resultados de scripts de migração. O que antes levaria minutos escrevendo queries SQL manualmente agora leva segundos com cliques na interface visual.

### API Automática e Type-Safe

Um dos recursos mais poderosos do Supabase é a geração automática de APIs RESTful e GraphQL para todas as tabelas do banco de dados. Assim que criamos uma tabela, endpoints de leitura e escrita são automaticamente disponibilizados, com documentação interativa incluída.

No nosso projeto, utilizamos a biblioteca cliente JavaScript do Supabase, que oferece uma API fluente e type-safe para consultas. Por exemplo, para buscar todas as videoaulas de uma disciplina específica, escrevemos simplesmente: `supabase.from('videoaulas').select('*').eq('disciplina_id', 123)`. A biblioteca automaticamente constrói a query SQL otimizada, executa no servidor, e retorna os resultados tipados corretamente em TypeScript.

### Row Level Security (RLS)

O Supabase implementa um sistema sofisticado de segurança chamado Row Level Security, que permite definir políticas de acesso granulares diretamente no banco de dados. Podemos especificar, por exemplo, que usuários comuns só podem visualizar videoaulas publicadas, enquanto administradores podem ver e editar todas.

Essas políticas são aplicadas automaticamente em todas as queries, tanto via API quanto via interface administrativa, garantindo que regras de negócio de segurança nunca sejam acidentalmente contornadas por bugs no código da aplicação. No nosso caso, configuramos temporariamente permissões públicas para facilitar o desenvolvimento, mas em produção implementaremos políticas restritivas baseadas em roles de usuário.

### Realtime e Colaboração

Embora ainda não implementado no sistema atual, o Supabase oferece suporte nativo a atualizações em tempo real via WebSockets. Isso significa que, no futuro, podemos facilmente adicionar funcionalidades colaborativas onde múltiplos administradores editam dados simultaneamente e veem mudanças instantaneamente, sem necessidade de refresh manual da página.

---

## 🎨 Funcionalidades do Sistema (3 minutos)

Além da infraestrutura robusta de autenticação e dados, o sistema oferece uma interface moderna e intuitiva para usuários finais.

### Dashboard Interativo

A página inicial apresenta um dashboard com estatísticas consolidadas do acervo, incluindo total de videoaulas cadastradas, disciplinas ativas, cursos oferecidos e professores contribuindo. Gráficos interativos construídos com Recharts visualizam a distribuição de videoaulas por curso e por bimestre, permitindo identificar rapidamente padrões de produção.

### Busca e Filtros Avançados

Implementamos um sistema de busca em tempo real que permite aos usuários encontrar videoaulas por título, sinopse, nome do professor ou código da disciplina. Filtros hierárquicos permitem refinar resultados por eixo de conhecimento, curso específico, ano de produção e bimestre operacional. A paginação eficiente garante performance mesmo com milhares de registros.

### Acessibilidade em Primeiro Lugar

Cada videoaula possui indicadores visuais mostrando disponibilidade de recursos de acessibilidade: versão em Libras (Língua Brasileira de Sinais), versão com audiodescrição, e closed captions (legendas). Links diretos permitem acesso imediato a essas versões alternativas, garantindo inclusão de estudantes com diferentes necessidades.

### Tema Claro e Escuro

A interface oferece alternância entre tema claro e escuro, com transições suaves e paleta de cores cuidadosamente escolhida para garantir contraste adequado em ambos os modos. Utilizamos o formato de cor OKLCH do Tailwind CSS 4, que oferece cores perceptualmente uniformes e acessíveis.

---

## 🚀 Painel Administrativo (3 minutos)

Para gestores e administradores, desenvolvemos um painel completo de gerenciamento de conteúdo.

### Gestão de Videoaulas

Administradores podem criar, editar e excluir videoaulas através de formulários intuitivos. Campos incluem título, sinopse, semana e número da aula, disciplina associada, professor responsável, designer instrucional, links para YouTube e versões acessíveis, e status de publicação. Validações garantem integridade dos dados antes da submissão.

### Gerenciamento de Entidades

O sistema permite gerenciar todas as entidades relacionadas: disciplinas (com código, nome, carga horária e associação a múltiplos cursos), professores, designers instrucionais, e cursos (organizados por eixo de conhecimento). A estrutura many-to-many entre cursos e disciplinas reflete corretamente a realidade de disciplinas compartilhadas entre diferentes graduações.

### Importação em Massa

Para facilitar migrações e atualizações em lote, implementamos endpoints de importação que aceitam arrays de dados em formato JSON. Isso permite processar centenas de registros de uma vez, com tratamento robusto de erros e relatórios detalhados de sucessos e falhas.

### Histórico de Importações

Todas as operações de importação são registradas em uma tabela de histórico, armazenando tipo de importação, nome do arquivo original, usuário responsável, total de linhas processadas, sucessos e erros. Isso garante rastreabilidade completa e facilita auditorias.

---

## 📈 Benefícios Mensuráveis (2 minutos)

A escolha do Supabase trouxe benefícios concretos e mensuráveis para o projeto.

### Redução de Tempo de Desenvolvimento

Estimamos que a integração com Supabase economizou aproximadamente **40 horas de desenvolvimento** que seriam gastas implementando autenticação do zero, incluindo registro de usuários, login, recuperação de senha, gerenciamento de sessões, e proteção contra ataques comuns. Esse tempo foi redirecionado para desenvolvimento de funcionalidades de negócio que agregam valor direto aos usuários.

### Segurança Aprimorada

Ao utilizar uma plataforma de autenticação testada e auditada por milhares de empresas globalmente, reduzimos drasticamente o risco de vulnerabilidades de segurança. O Supabase passa por auditorias regulares de segurança e implementa patches rapidamente quando vulnerabilidades são descobertas, garantindo que nosso sistema esteja sempre protegido contra ameaças emergentes.

### Produtividade da Equipe

A interface administrativa do Supabase permite que membros não-técnicos da equipe realizem tarefas de gerenciamento de dados sem necessidade de conhecimento SQL ou acesso direto ao banco de dados. Isso democratiza o acesso aos dados e reduz dependência de desenvolvedores para tarefas operacionais simples.

### Escalabilidade Sem Custos Iniciais

A infraestrutura do Supabase escala automaticamente conforme a demanda cresce. Não precisamos provisionar servidores adicionais, configurar load balancers ou gerenciar replicação de dados. O modelo de precificação baseado em uso significa que pagamos apenas pelo que consumimos, sem custos fixos elevados de infraestrutura.

---

## 🔮 Próximos Passos (2 minutos)

Com a base sólida estabelecida, planejamos expandir o sistema com funcionalidades adicionais que aproveitem ainda mais as capacidades do Supabase.

### Autenticação Social

O Supabase oferece integração nativa com provedores OAuth como Google, GitHub e Microsoft. Planejamos implementar login social para facilitar o acesso de estudantes, permitindo que façam login com suas contas institucionais sem necessidade de criar senhas adicionais.

### Sistema de Permissões Granulares

Atualmente, o sistema possui apenas dois níveis de acesso: usuário comum e administrador. Planejamos implementar roles adicionais (editor, revisor, visualizador) com permissões específicas, aproveitando o sistema de Row Level Security do Supabase para aplicar essas regras diretamente no banco de dados.

### Notificações em Tempo Real

Utilizando a funcionalidade de Realtime do Supabase, implementaremos notificações instantâneas quando novas videoaulas forem publicadas em disciplinas que o usuário está acompanhando, ou quando videoaulas forem atualizadas com novos recursos de acessibilidade.

### Auditoria Completa

Aproveitando os triggers do PostgreSQL disponíveis no Supabase, criaremos um sistema de auditoria que registra automaticamente todas as modificações em dados críticos, incluindo quem fez a mudança, quando, e quais valores foram alterados. Isso garante rastreabilidade completa e facilita investigações em caso de problemas.

---

## 💡 Conclusão (2 minutos)

O Sistema de Videoaulas Univesp representa uma solução moderna e escalável para gestão de conteúdo educacional, construída sobre tecnologias de ponta que garantem segurança, performance e facilidade de manutenção.

A integração com Supabase foi decisiva para o sucesso do projeto, oferecendo autenticação de nível empresarial sem complexidade de implementação, ferramentas visuais que aumentam a produtividade da equipe, e APIs automáticas que aceleram o desenvolvimento de novas funcionalidades. Os benefícios vão além do técnico: redução de custos de desenvolvimento, menor risco de vulnerabilidades de segurança, e escalabilidade garantida conforme a plataforma cresce.

Com uma base sólida estabelecida, estamos prontos para expandir o sistema com funcionalidades adicionais que aproveitam ainda mais as capacidades do Supabase, sempre mantendo o foco em oferecer a melhor experiência possível para estudantes, professores e administradores da Univesp.

O código completo do projeto está disponível publicamente no GitHub em **https://github.com/laccademia/sistema-videoaulas-univesp**, demonstrando nosso compromisso com transparência e colaboração na construção de ferramentas educacionais de qualidade.

---

## 🙏 Agradecimentos

Agradeço pela atenção e fico à disposição para responder perguntas e demonstrar o sistema em funcionamento.

---

**Tempo Total Estimado:** 25 minutos  
**Slides Recomendados:** 15-20 slides  
**Demonstração ao Vivo:** Reservar 10-15 minutos adicionais
