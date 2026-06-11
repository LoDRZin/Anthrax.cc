# Tarefas de Desenvolvimento do Anthrax.cc

Esta é a lista de tarefas passo a passo para construir a plataforma, dividida em 10 etapas principais para um fluxo de trabalho organizado.

- `[x]` **Tarefa 1: Setup Inicial do Projeto**
  - `[x]` Inicializar Next.js (App Router)
  - `[x]` Configurar Tailwind CSS
  - `[x]` Instalar e inicializar o Shadcn UI
  - `[x]` Criar a estrutura básica de diretórios (`/(dashboard)` e `/(public)`)

- `[x]` **Tarefa 2: Configuração de Banco de Dados**
  - `[x]` Configurar Supabase (ou Vercel Postgres / Neon)
  - `[x]` Inicializar o Prisma ORM
  - `[x]` Escrever o schema do banco (User, Profile, Link, PageView)
  - `[x]` Rodar a migration inicial

- `[x]` **Tarefa 3: Sistema de Autenticação**
  - `[x]` Implementar login e cadastro (Supabase Auth ou Clerk)
  - `[x]` Criar um middleware para proteger as rotas do `/dashboard`
  - `[x]` Associar o usuário recém-criado a um perfil vazio no banco

- `[x]` **Tarefa 4: Dashboard - Layout Base e Configurações**
  - `[x]` Criar o layout lateral do painel (Sidebar)
  - `[x]` Criar a página de "Settings" para o usuário definir seu `username`, `displayName` e `bio`
  - `[x]` Criar Server Actions para atualizar os dados do perfil

- `[x]` **Tarefa 5: Dashboard - Gerenciamento de Links**
  - `[x]` Criar a interface de Links (CRUD)
  - `[x]` Implementar ordenação Drag & Drop (`dnd-kit`)
  - `[x]` Salvar as mudanças de links no banco via Server Actions

- `[x]` **Tarefa 6: Upload e Armazenamento de Mídias**
  - `[x]` Criar a página "Appearance" do painel para inputs de mídia
  - `[x]` Setup base para Avatar, Audio e Background URLs

- `[x]` **Tarefa 7: Rota Dinâmica (Página Pública) e SEO**
  - `[x]` Criar o componente de servidor da rota `/[username]`
  - `[x]` Fazer o fetch do banco com base no slug da URL
  - `[x]` Implementar a injeção de SEO dinâmico (`generateMetadata`) com OpenGraph tags

- `[x]` **Tarefa 8: UI/UX - Glassmorphism e Tema**
  - `[x]` Implementar a estética glassmorphism no perfil público
  - `[x]` Renderizar os links do perfil de forma atraente
  - `[x]` Implementar componente para gerenciar o background

- `[x]` **Tarefa 9: Multimídia - Áudio e Partículas**
  - `[x]` Implementar o componente `AudioGatekeeper` para contornar bloqueio de Autoplay
  - `[x]` Instalar e configurar `@tsparticles/react` para efeitos de neve/matriz

- `[x]` **Tarefa 10: Integrações Avançadas e Finalização**
  - `[x]` Criar o componente de status do Discord com uso da API Lanyard
  - `[x]` Implementar o sistema de contador de Views
  - `[x]` Finalizado para testes gerais
