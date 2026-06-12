# Checklist de Implementação - Dashboard UI/UX

Este é o acompanhamento passo a passo da reestruturação visual completa do painel de administração e da página de aparência do Anthrax.cc.

- `[x]` **FASE 1: Sidebar + Layout Base**
  - `[x]` Criar estrutura com sidebar fixa à esquerda + conteúdo principal à direita (`src/app/(dashboard)/layout.tsx`)
  - `[x]` Implementar a sidebar com vidro fosco e largura fixa de 256px (`src/components/dashboard/Sidebar.tsx`)
  - `[x]` Adicionar 5 itens de navegação com ícones da biblioteca Lucide
  - `[x]` Implementar transição suave de itens ativos com Framer Motion (`layoutId="active-sidebar-item"`)
  - `[x]` Criar rodapé com informações do usuário em card estilizado
  - `[x]` Desenvolver menu gaveta animado para visualização em dispositivos móveis (`src/components/dashboard/MobileMenu.tsx`)
- `[x]` **FASE 2: Componentes Base**
  - `[x]` Implementar `StyledInput` com ring animado no foco
  - `[x]` Implementar `StyledButton` com gradiente roxo/azul premium
  - `[x]` Implementar `ToggleSwitch` animado com Framer Motion
  - `[x]` Implementar `SectionCard` com glassmorphism real (`backdrop-blur-3xl bg-black/40`)
- `[x]` **FASE 3: Sistema de Estado (Context/Store)**
  - `[x]` Criar Contexto/Store React para sincronização em tempo real entre formulário e preview
- `[x]` **FASE 4: LiveProfilePreview (Mock de Celular)**
  - `[x]` Desenvolver o preview de celular interativo e reativo no dashboard
- `[x]` **FASE 5: Refatoração da Página de Aparência**
  - `[x]` Reestruturar layout da página de aparência para split-screen (formulário à esquerda, celular à direita)
- `[x]` **FASE 6: Polimentos e Efeitos Visuais**
  - `[x]` Adicionar glows de fundo dinâmicos (ambient glow)
  - `[x]` Adicionar textura com noise overlay
  - `[x]` Implementar micro-animações de entrada e transições de layout
- `[x]` **FASE 7: Estilização Premium da Página de Entrada (Landing Page)**
  - `[x]` Integrar fundo interativo 3D/partículas (ex: `WebGLBackground` estrelado ou efeito de grid)
  - `[x]` Aplicar tipografia com gradientes sofisticados, bordas de neon suave e efeitos dinâmicos de texto
  - `[x]` Implementar animações de entrada com Framer Motion na estrutura principal
  - `[x]` Estilizar os botões de ação e modais de login/cadastro para seguir o design system do painel
- `[ ]` **FASE 8: Depuração e Resolução do Erro no Vercel (Página /appearance)**
  - `[ ]` Analisar logs de runtime da Vercel para identificar a causa raiz do erro "This page couldn't load"
  - `[ ]` Revisar e garantir compatibilidade completa de SSR (Server-Side Rendering) no `LiveProfilePreview` e `AppearanceForm`
  - `[ ]` Testar localmente simulando produção (`npm run build && npm run start`)
  - `[ ]` Validar a integridade das variáveis de ambiente de produção (Clerk e Banco de Dados)
