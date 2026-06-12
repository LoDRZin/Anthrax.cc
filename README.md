# ☣️ Anthrax.cc

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.dot.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)

**Anthrax.cc** é uma plataforma ultra-premium de **Link-in-Bio** altamente interativa e rica em efeitos visuais. Desenvolvida para criadores que buscam uma identidade digital impressionante, ela vai muito além do básico, oferecendo efeitos de Glassmorphism, fundos tridimensionais (WebGL/Three.js), widgets interativos e feedback em tempo real.

---

## ✨ Recursos Principais

### 🎨 Personalização de Perfil de Elite
*   **Fundo Dinâmico:** Suporte para imagens estáticas, vídeos em loop e **Cenas Interativas WebGL 3D** (como poeira estelar, grade neon e partículas reativas).
*   **Estilização Premium:** Controle total sobre opacidades, efeito de ruído físico (*Noise Overlay*), bordas neon brilhantes e cores gradientes personalizadas.
*   **Elementos Premium:** Cursor interativo que segue o mouse, menu de contexto customizado, botões magnéticos com efeito físico e animações de texto com efeito typewriter.
*   **Audio Gatekeeper:** Opção de adicionar música de fundo que é ativada dinamicamente mediante a primeira interação do visitante.

### 🧩 Ecossistema de Widgets
O Anthrax.cc possui suporte nativo a uma vasta gama de widgets para enriquecer o perfil:
*   **Countdown:** Contador regressivo animado para eventos.
*   **Spotify & SoundCloud:** Integração e players de música diretamente no perfil.
*   **Discord Presence:** Mostra seu status e atividade em tempo real no Discord.
*   **GitHub:** Exibe estatísticas de repositórios ou profile.
*   **Crypto Ticker:** Acompanhamento de preços de criptomoedas em tempo real.
*   **Weather:** Previsão do tempo local em formato minimalista.
*   **Notion:** Renderização de notas/páginas do Notion.
*   **Twitch & YouTube:** Incorporação de lives e vídeos.
*   **Custom HTML:** Widget sandbox para inserção de código HTML personalizado.

### 📊 Painel de Administração Premium
*   **Live Profile Preview:** Uma réplica de smartphone interativa no lado direito da tela que atualiza em tempo real conforme você altera as opções no painel esquerdo.
*   **Navegação Fluida:** Sidebar fixa com vidro fosco e transições ultra-suaves de abas gerenciadas via **Framer Motion**.
*   **Dashboard responsivo:** Totalmente adaptado para dispositivos móveis com drawer de navegação animado.

### 💬 Interação com Visitantes
*   **Guestbook (Livro de Visitas):** Área para visitantes deixarem mensagens assinadas diretamente no perfil.
*   **Profile Rating:** Sistema de avaliação por estrelas integrado com proteção por hash de IP para evitar spam.
*   **Contador de Visualizações:** Analytics básico integrado para monitorar cliques e visualizações de perfil únicas.

---

## 🛠️ Stack Tecnológica

### Core
*   **React 19** & **Next.js 16 (App Router)**
*   **TypeScript**

### Estilização e Animação
*   **Tailwind CSS v4**
*   **Framer Motion** (animações de interface física e transições suaves)
*   **Three.js** & **React Three Fiber (R3F)** (para renderização 3D WebGL)
*   **TSParticles** (gerenciamento de partículas de alta performance)

### Banco de Dados & Infra
*   **Prisma ORM** para modelagem de dados e comunicação
*   **PostgreSQL** (Neon DB)
*   **UploadThing** (gerenciamento seguro de uploads de arquivos/imagens)
*   **Clerk Auth** (gerenciamento seguro de sessões, login social e usuários)

---

## 📂 Estrutura do Projeto

```text
src/
├── app/                  # Rotas do Next.js (App Router)
│   ├── (dashboard)/      # Painel de administração
│   ├── (public)/         # Rotas públicas
│   └── [username]/       # Renderização dinâmica do perfil de cada usuário
├── components/           # Componentes reutilizáveis
│   ├── dashboard/        # Componentes do painel administrativo
│   ├── public/           # Componentes do perfil público (WebGL, áudio, widgets)
│   ├── ui/               # Componentes de UI base (inputs, botões estilizados, etc)
│   └── widgets/          # Widgets integrados (Spotify, Github, Crypto, etc)
├── lib/                  # Utilitários globais e instâncias de banco (Prisma, etc)
├── server/               # Lógica e rotas de API server-side
└── store/                # Gerenciamento de estado global (Zustand/Context)
```

---

## 🚀 Como Executar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/Anthrax.cc.git
cd Anthrax.cc
```

### 2. Instalar as Dependências
Certifique-se de estar usando uma versão do Node compatível (recomendado v18+ ou v20+).
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (use o `.env.example` ou copie a lista abaixo):

```env
# Banco de Dados (PostgreSQL)
DATABASE_URL="sua-url-de-conexao-do-postgresql"

# Autenticação (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="sua-chave-publica-do-clerk"
CLERK_SECRET_KEY="sua-chave-secreta-do-clerk"

# Upload de Arquivos (UploadThing)
UPLOADTHING_SECRET="seu-secret-do-uploadthing"
UPLOADTHING_APP_ID="seu-app-id-do-uploadthing"
```

### 4. Sincronizar o Banco de Dados
Gere as definições de tipo do Prisma Client e rode as migrações/push:
```bash
npx prisma generate
npx prisma db push
```

### 5. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação rodando!

---

## 🔒 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
