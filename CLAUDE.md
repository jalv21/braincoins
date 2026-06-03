# BrainCoins — CLAUDE.md (Resumido)

Guia rápido para trabalhar neste repositório com Claude Code.

---

## Visão Geral

**BrainCoins** é um sistema gamificado de moeda estudantil com 4 atores:
- **Instituição**: administra cotas semestrais
- **Professor**: distribui moedas para alunos
- **Aluno**: recebe e resgata moedas por vantagens
- **Empresa**: oferece vantagens aceitando moedas

Monorepo: **Java 21 + Spring Boot 4.0.6** (backend) + **React 19 + Vite** (frontend) + **PostgreSQL 17** (BD).

---

## Stack Tecnológico

**Backend**: Java 21, Spring Boot 4.0.6, JPA/Hibernate, Spring Security, Spring Mail (Mailtrap), PostgreSQL 17
**Frontend**: React 19, TypeScript, Vite 8, TailwindCSS 4, TanStack Router 1, Radix UI, Recharts
**Design System**: **Amber Intelligence** (substituiu o tema glassmorphism púrpura) — tokens semânticos via `@theme inline` em `src/styles.css`
**Tipografia**: Syne (display), Plus Jakarta Sans (sans), JetBrains Mono (mono)
**Infraestrutura**: Docker, Docker Compose

---

## Estrutura

```
braincoins/
├── docker-compose.yml
├── .env / .env.example
├── BrainCoins_API.postman_collection.json
├── docs/                               # Diagramas (UML, ER, Casos de Uso)
└── code/
    ├── backend/moeda/                  # Spring Boot (9 controllers, 10 services, 7 repos, 9 entities)
    └── frontend/moeda-estudantil/      # React + Vite (25 rotas, 50+ componentes Radix UI)
```

---

## Como Executar

### Variáveis de Ambiente (`.env`)
```dotenv
DATABASE_URL="postgresql://usuario:senha@localhost:5432/banco"
NEXTAUTH_SECRET="chave-aleatoria"

# Mailtrap (envio de e-mails — notificações de transação e resgate)
MAIL_HOST=live.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=api
MAIL_PASSWORD=seu-token-mailtrap-aqui
MAIL_FROM=email-remetente-verificado@dominio.com
```

Frontend (`.env.local`):
```dotenv
VITE_API_URL=http://localhost:8080/api
```

### Startup

**Banco de dados:**
```bash
docker-compose up -d
```

**Backend:**
```bash
cd code/backend/moeda
./mvnw clean install
./mvnw spring-boot:run
```
→ `http://localhost:8080`

**Frontend:**
```bash
cd code/frontend/moeda-estudantil
npm install
npm run dev
```
→ `http://localhost:5173`

---

## Arquitetura Backend

Camadas: `Controller → Service (@Transactional) → Repository (JPA) → Entity`

**Hierarquia de entidades:**
```
UsuarioEntity (base)
└── UsuarioAcademicoEntity
    ├── AlunoEntity
    └── ProfessorEntity
EmpresaEntity, InstituicaoEntity (separadas)
```

---

## Endpoints Principais

Base: `http://localhost:8080/api`

| Rota | Método | Descrição |
|------|--------|-----------|
| `/login/{role}` | POST | Login (aluno/professor/empresa/instituicao) |
| `/alunos`, `/professores`, `/empresas`, `/instituicoes` | GET/POST/PUT/DELETE | CRUD |
| `/transacoes` | POST | Professor distribui moedas |
| `/vantagens`, `/vantagens/resgatar` | GET/POST/DELETE/PATCH | Gerenciar vantagens e resgates |
| `/resgates` | GET/PATCH | Listar e confirmar resgates |

Documentação completa: `BrainCoins_API.postman_collection.json`

---

## Modelo de Dados

| Entidade | Campos-chave | Relacionamento |
|----------|-------------|-----------------|
| `AlunoEntity` | id, email (unique), cpf (unique), saldo, curso | 1:N Transacao |
| `ProfessorEntity` | id, email (unique), cpf (unique), saldo, disciplina | 1:N Transacao |
| `EmpresaEntity` | id, email (unique), cnpj (unique) | 1:N Vantagem |
| `VantagemEntity` | id, empresa_id (FK), custo, estoque, ativo | N:M Aluno (via Resgate) |
| `ResgateEntity` | id, aluno_id (FK), vantagem_id (FK), codigoCupom (unique), status | — |

Status de resgate: `ATIVO → PENDENTE → {APROVADO, REJEITADO}`

---

## Rotas Frontend (TanStack Router)

| Rota | Descrição |
|------|-----------|
| `/` | Landing |
| `/auth/$role` | Login dinâmico |
| `/aluno/*` | Dashboard, perfil, extrato, vantagens, resgates |
| `/professor/*` | Dashboard, distribuir moedas, extrato |
| `/empresa/*` | Dashboard, vantagens, resgates |
| `/instituicao/*` | Dashboard admin, gerenciar professores, upload |

---

## Padrões e Convenções

**Backend (Java)**:
- Nomes: `PascalCase` (classes), `camelCase` (métodos/variáveis)
- Sufixos: `*Controller`, `*Service`, `*Repository`, `*Entity`, `*RequestDTO`, `*ResponseDTO`
- DI: Construtor (`@RequiredArgsConstructor`)
- Senhas: `BCryptPasswordEncoder` — nunca em texto plano
- Transações: `@Transactional` em services que alteram dados

**Frontend (React + TypeScript)**:
- Nomes: `PascalCase` (componentes `.tsx`), `kebab-case` (rotas com ponto: `aluno.perfil.tsx`)
- Alias: `@/` → `src/`
- API: Centralizada em `src/api/` (Axios)
- Componentes: Radix UI em `src/components/ui/`; componentes custom do tema em `src/components/ui-bits.tsx` (exporta `StatusKind`)
- Layout autenticado: `src/components/dashboard-layout.tsx` (sidebar redesenhada no tema Amber Intelligence)
- Formulários: React Hook Form
- Estilo: utilitários Tailwind via tokens semânticos (`bg-card`, `text-coin`, `font-display`, etc.) — evite cores hardcoded

---

## Segurança e Validações

- Senhas: `BCryptPasswordEncoder`
- CORS: `CorsConfig.java` libera qualquer `http://localhost:*` (via `allowedOriginPatterns`) — cobre 5173 e o fallback automático do Vite (5174, etc.)
- Spring Security ativo — revisar `SecurityConfig.java` para rotas públicas
- Validações por DTO (Bean Validation):
  - **CPF** (Aluno/Professor): regex 11 dígitos ou `XXX.XXX.XXX-XX`
  - **CNPJ** (Instituição/Empresa): regex 14 dígitos ou `XX.XXX.XXX/XXXX-XX`
  - **Telefone**: regex BR `(XX) 9XXXX-XXXX`
  - **Email**: `@Email` + unicidade via constraint JPA
  - **Senha**: mínimo 6 caracteres
  - **Moedas** (distribuição/vantagens): inteiro positivo, validado no front e back
- `GlobalExceptionHandler` (`config/`) centraliza respostas de erro:
  - `MethodArgumentNotValidException` → 400 com mapa `field → message`
  - `DataIntegrityViolationException` → 409 detectando conflito de `cnpj`/`email`/`cpf`
  - `NoSuchElementException` → 404
  - `IllegalStateException` → 400
- `AuthController` tem handlers próprios para login:
  - `NoSuchElementException` → 404 ("Usuário não encontrado.")
  - `SenhaIncorretaException` → 401 ("Senha incorreta.")
- Exceções de domínio: `SaldoInsuficienteException`, `EstoqueEsgotadoException`, `SenhaIncorretaException`

---

## Testes

**Backend:**
```bash
cd code/backend/moeda
./mvnw test
```

**Frontend**: Manual no navegador (sem suite automatizada)

**API**: Postman (`BrainCoins_API.postman_collection.json`)

---

## Decisões Arquiteturais

- Hierarquia JPA (`UsuarioEntity → UsuarioAcademicoEntity`) para reaproveitamento
- Saldo como campo direto (não calculado) — simplifica queries, requer atenção a concorrência
- TanStack Router: type-safe, tipagem automática de rotas
- Radix UI: headless, totalmente customizável com Tailwind
- `@EnableAsync` e `@EnableScheduling`: Reset semestral + expiração de resgates
- **Envio de e-mails** via Spring Mail + Mailtrap: notificações disparadas em `TransacaoService` (recebimento de moedas) e `ResgateService` (cupom de vantagem) — chamadas `@Async` para não bloquear a request
- Design tokens centralizados em `styles.css` (`@theme inline`) — toda paleta/tipografia consumida via utilitários Tailwind, não hardcoded
- `DataSeeder` (`config/`) cria automaticamente uma Instituição "PUC Minas" no boot se a tabela estiver vazia — usada pelo botão "Entrar (demo)" da Instituição na landing
- `AuthController` invalida sessão stale: ao acessar `/auth/$role` com outra role já logada, o `AuthPage` chama `store.logout()` antes do novo login

---

## Limitações Conhecidas

- Sem JWT/tokens — autenticação verifica credenciais a cada request
- Sem rate limiting — adicionar antes de expor à internet
- Sem CI/CD — testes e deploy manuais
- `App.jsx` vazio (roteamento em `main.jsx`)
- `prisma.config.ts` (resquício, pode remover)
- Envio de e-mail depende de Mailtrap configurado no `.env` — sem credenciais válidas, as ações continuam funcionando mas o e-mail falha silenciosamente (log do `EmailServiceImpl`)
- Suíte de testes em `src/test/java` está desatualizada (DTOs mudaram) e não compila — use `./mvnw spring-boot:run -Dmaven.test.skip=true` para subir o backend

---

## Deploy

### Build Manual

```bash
# Backend JAR
cd code/backend/moeda
./mvnw clean package -DskipTests

# Frontend
cd code/frontend/moeda-estudantil
npm run build
```

### Ambientes

| Ambiente | Backend | Frontend | BD |
|----------|---------|----------|-----|
| Dev | localhost:8080 | localhost:5173 | Docker (postgres:5432) |
| Prod | (a definir) | (a definir) | (a definir) |

---

## Documentação

- **Diagramas**: `docs/` (Classes, ER, Componentes, Casos de Uso)
- **Postman**: `BrainCoins_API.postman_collection.json`
- **README principal**: `README.md`
- **Repositório**: https://github.com/jalv21/braincoins

---

## Glossário Rápido

| Termo | Significado |
|-------|-------------|
| **Moeda/BrainCoin** | Unidade virtual de reconhecimento |
| **Cota** | Limite de moedas/semestre por professor |
| **Vantagem** | Produto/serviço da empresa por moedas |
| **Resgate** | Troca de moedas por vantagem (gera cupom) |
| **Cupom** | Código único para retirar a vantagem |