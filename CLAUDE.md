# BrainCoins — CLAUDE.md (Resumido)

Guia rápido para trabalhar neste repositório com Claude Code.

---

## Regras Git

- **Nunca faça commits sem perguntar antes.** Sempre apresente as mudanças e aguarde confirmação explícita.
- **Commits devem ter apenas o usuário do GitHub como autor.** Nunca use Claude, Anthropic ou qualquer nome gerado como autor ou co-autor.

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

**Backend**: Java 21, Spring Boot 4.0.6, JPA/Hibernate, Spring Security, Spring Mail (Mailtrap), PostgreSQL 17, RabbitMQ 3
**Frontend**: React 19, TypeScript, Vite 8, TailwindCSS 4, TanStack Router 1, Radix UI, Recharts
**Design System**: **Amber Intelligence** (substituiu o tema glassmorphism púrpura) — tokens semânticos via `@theme inline` em `src/styles.css`
**Tipografia**: Syne (display), Plus Jakarta Sans (sans), JetBrains Mono (mono)
**Infraestrutura**: Docker, Docker Compose (PostgreSQL 17 + RabbitMQ 3-management)

---

## Estrutura

```
braincoins/
├── docker-compose.yml
├── .env / .env.example
├── BrainCoins_API.postman_collection.json
├── docs/                               # Diagramas (UML, ER, Casos de Uso)
└── code/
    ├── backend/moeda/                  # Spring Boot (10 controllers, 11 services, 8 repos, 10 entities)
    └── frontend/moeda-estudantil/      # React + Vite (26 rotas, 50+ componentes Radix UI)
```

---

## Como Executar

### Variáveis de Ambiente (`.env`)
```dotenv
DATABASE_URL="postgresql://usuario:senha@localhost:5432/banco"
NEXTAUTH_SECRET="chave-aleatoria"

# SMTP (envio de e-mails — notificações de transação e resgate)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app
MAIL_FROM=seu-email@gmail.com
```

Frontend (`.env.local`):
```dotenv
VITE_API_URL=http://localhost:8080/api
```

### Startup

**Banco de dados + RabbitMQ (obrigatório antes do backend):**
```bash
docker compose up -d
```
> Sobe PostgreSQL 17 (porta 5432) e RabbitMQ 3 (portas 5672 e 15672). O backend falha ao iniciar sem o RabbitMQ.

**Backend:**
```bash
cd code/backend/moeda
./mvnw spring-boot:run -Dmaven.test.skip=true
```
→ `http://localhost:8080`
> A flag `-Dmaven.test.skip=true` é necessária porque a suíte de testes está desatualizada e não compila.

**Frontend:**
```bash
cd code/frontend/moeda-estudantil
npm install
npm run dev
```
→ `http://localhost:5173` (Vite usa 5174 se 5173 já estiver ocupada)

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
| `/trocas` | POST | Criar solicitação de troca entre alunos |
| `/trocas/alunos-disponiveis/{alunoId}` | GET | Listar alunos com resgates ativos (excluindo o próprio) |
| `/trocas/recebidas/{alunoId}` | GET | Listar trocas recebidas pelo aluno |
| `/trocas/enviadas/{alunoId}` | GET | Listar trocas enviadas pelo aluno |
| `/trocas/{id}/aceitar` | PATCH | Aceitar troca (transfere posse dos resgates) |
| `/trocas/{id}/recusar` | PATCH | Recusar troca |
| `/trocas/{id}/cancelar` | PATCH | Cancelar troca pendente (pelo solicitante) |

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
| `TrocaEntity` | id, aluno_solicitante_id (FK), aluno_destinatario_id (FK), resgate_oferecido_id (FK), resgate_desejado_id (FK), dataSolicitacao, status | N:M AlunoEntity (via resgates trocados) |

Status de resgate: `ATIVO → PENDENTE → {APROVADO, REJEITADO}`
Status de troca: `PENDENTE → PROCESSANDO → ACEITA` (via fila RabbitMQ) | `PENDENTE → {RECUSADA, CANCELADA, EXPIRADA}` (expiração automática após 15 dias)

---

## Rotas Frontend (TanStack Router)

| Rota | Descrição |
|------|-----------|
| `/` | Landing |
| `/auth/$role` | Login dinâmico |
| `/aluno/*` | Dashboard, perfil, extrato, vantagens, resgates, trocas |
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
- `@EnableAsync` e `@EnableScheduling`: Reset semestral + expiração de resgates (`ResgateScheduler`) + expiração de trocas pendentes (`TrocaScheduler`, cron diário à meia-noite, 15 dias)
- **RabbitMQ** (fila `fila.aceite.troca`, durable): aceitar troca é assíncrono — `TrocaService.aceitar()` seta status `PROCESSANDO` e publica `TrocaAceitaEventDTO` na fila; `TrocaConsumerService` (@RabbitListener) transfere `aluno_id` dos resgates e seta `ACEITA`. Serialização via `GsonMessageConverter` (header `__TypeId__`). Config em `RabbitConfig.java`.
- **Envio de e-mails** via Spring Mail + SMTP: todas as notificações são `@Async` (não bloqueiam a request) e falham silenciosamente com log de erro quando o SMTP não está configurado. Eventos cobertos por serviço:
  - `TransacaoService`: aluno recebe moedas; professor confirma envio
  - `ResgateService`: aluno recebe cupom; empresa é notificada de novo resgate; aluno é notificado quando resgate expira (reembolso automático)
  - `TrocaService`: destinatário recebe nova solicitação; solicitante recebe aceite; aceitante confirma aceite; solicitante recebe recusa; destinatário recebe cancelamento (pelo solicitante); solicitante recebe notificação de expiração por prazo
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
- Envio de e-mail depende de SMTP configurado no `.env` — sem credenciais válidas, as ações continuam funcionando mas o e-mail falha silenciosamente (log do `EmailServiceImpl`)
- Suíte de testes em `src/test/java` está desatualizada (DTOs mudaram) e não compila — use `./mvnw spring-boot:run -Dmaven.test.skip=true` para subir o backend
- Se `target/` ou `~/.m2/` estiverem com ownership de `root` (ocorre ao buildar com sudo), o Maven não consegue escrever — use `sudo chown -R $USER:$USER target/ ~/.m2/` para corrigir; alternativamente execute o JAR diretamente: `java -jar target/moeda-0.0.1-SNAPSHOT.jar`
- RabbitMQ precisa estar rodando antes do backend — `docker compose up -d` sobe PostgreSQL + RabbitMQ juntos

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
| **Troca** | Permuta de resgates ativos entre dois alunos (sem troca de moedas) |