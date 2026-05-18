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

**Backend**: Java 21, Spring Boot 4.0.6, JPA/Hibernate, Spring Security, PostgreSQL 17
**Frontend**: React 19, TypeScript, Vite 8, TailwindCSS 4, TanStack Router 1, Radix UI, Recharts
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
DB_USERNAME=postgres
DB_PASSWORD=admin2513
NEXTAUTH_SECRET=secret_chave_aleatoria_123
NEXTAUTH_URL=http://localhost:3000
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
- Componentes: Radix UI em `src/components/ui/`
- Formulários: React Hook Form

---

## Segurança

- Senhas: `BCryptPasswordEncoder`
- CORS: Configurado em `CorsConfig.java`
- Spring Security ativo — revisar `SecurityConfig.java` para rotas públicas
- Validações: Unicidade de email/cpf/rg/cnpj via constraints JPA
- Exceções: `SaldoInsuficienteException`, `EstoqueEsgotadoException`

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

---

## Limitações Conhecidas

- Sem JWT/tokens — autenticação verifica credenciais a cada request
- Sem rate limiting — adicionar antes de expor à internet
- Sem CI/CD — testes e deploy manuais
- `App.jsx` vazio (roteamento em `main.jsx`)
- `prisma.config.ts` (resquício, pode remover)

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