# Plano de Deploy 100% Gratuito — BrainCoins

## Contexto

O objetivo é tornar o BrainCoins publicamente acessível e profissional **sem gastar nada e sem cadastrar cartão de crédito**. Hoje a aplicação só roda em `localhost` com Docker (PostgreSQL + RabbitMQ). Três obstáculos impedem o deploy gratuito, todos confirmados lendo o código:

1. **Não existe RabbitMQ gerenciado grátis.** Mas o RabbitMQ é usado em **um único fluxo** (aceitar troca) e o consumidor tem só ~15 linhas de lógica — é trivial torná-lo síncrono e remover a dependência.
2. **Config travada em `localhost`**: o frontend tem `http://localhost:8080` *hardcoded* em vários arquivos de API; o backend tem `spring.datasource.url`, CORS e porta fixos.
3. **Uploads vão para disco local** (`./uploads`) — em plataforma grátis o disco é efêmero. Decisão: **aceitar que sumam** (OK para portfólio/demonstração acadêmica).

### Stack escolhida (tudo grátis, sem cartão, permanente)

```
┌──────────────────────┐      ┌───────────────────────┐      ┌──────────────────┐
│  Vercel (Frontend)   │─────▶│  Render (Backend)     │─────▶│  Neon (Postgres) │
│  React + Vite (SPA)  │ HTTPS│  Spring Boot (Docker) │ SSL  │  Postgres grátis │
│  *.vercel.app        │      │  *.onrender.com       │      │  permanente      │
└──────────────────────┘      └───────────────────────┘      └──────────────────┘
```

| Serviço | Papel | Limite grátis | Cartão? |
|---------|-------|---------------|---------|
| **Vercel** | Frontend (SPA) | Ilimitado p/ hobby | Não |
| **Render** | Backend (Web Service Docker) | 512MB RAM; **dorme após 15 min** (1ª request ~50s) | Não |
| **Neon** | PostgreSQL 17 | 0.5GB, permanente | Não |
| **Gmail SMTP / Mailtrap** | E-mails (opcional) | App password grátis | Não |

> **Trade-off aceito:** após 15 min sem acesso, o backend Render hiberna; a primeira requisição seguinte leva ~50s para "acordar". Aceitável para uso gratuito.

---

## Fase 0 — Pré-requisitos (sem código)

1. Garantir que o repositório está no GitHub (já está: `github.com/jalv21/braincoins`).
2. Criar 3 contas via login com GitHub (sem cartão):
   - **Neon** → neon.tech
   - **Render** → render.com
   - **Vercel** → vercel.com

---

## Fase 1 — Mudanças no Código (feitas localmente, commit + push)

### 1A. Remover RabbitMQ (tornar "aceitar troca" síncrono)

**Arquivo:** `code/backend/moeda/src/main/java/com/lab3/moeda/service/TrocaService.java`
No método `aceitar(int trocaId)`, **remover** a linha que publica na fila:
```java
rabbitTemplate.convertAndSend(RabbitConfig.FILA_ACEITE_TROCA, new TrocaAceitaEventDTO(trocaId));
```
e, no lugar, **inlinear a lógica que hoje está no consumidor** (transferir posse dos resgates + status `ACEITA` + e-mail), logo antes do `return toResponseDTO(troca)`:
```java
ResgateEntity resgateOferecido = troca.getResgateOferecido();
ResgateEntity resgateDesejado = troca.getResgateDesejado();
resgateOferecido.setAluno(troca.getAlunoDestinatario());
resgateDesejado.setAluno(troca.getAlunoSolicitante());
resgateRepository.save(resgateOferecido);
resgateRepository.save(resgateDesejado);
troca.setStatus(StatusTroca.ACEITA);
trocaRepository.save(troca);
enviarEmailAceite(troca); // método auxiliar será movido/copiado do consumer
```
Também **remover** o campo/injeção `RabbitTemplate` e os imports do AMQP nesse arquivo. (Status passa direto de `PENDENTE → ACEITA`; o valor `PROCESSANDO` do enum fica sem uso, o que é inofensivo.)

**Excluir os 3 arquivos** que só existem por causa do RabbitMQ:
- `code/backend/moeda/src/main/java/com/lab3/moeda/service/TrocaConsumerService.java` (mover o método `enviarEmailAceite` e os repositórios usados para o `TrocaService` antes de excluir)
- `code/backend/moeda/src/main/java/com/lab3/moeda/config/RabbitConfig.java`
- `code/backend/moeda/src/main/java/com/lab3/moeda/config/GsonMessageConverter.java`

**`code/backend/moeda/pom.xml`:** remover a dependência `spring-boot-starter-amqp`. (Antes de remover `gson`, verificar com busca se é usado fora do `GsonMessageConverter`; se for o único uso, remover também — caso contrário, manter.)

**`code/backend/moeda/src/main/resources/application.properties`:** apagar o bloco:
```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

**`docker-compose.yml`** (raiz): remover o serviço `rabbitmq` (mantém só o Postgres para desenvolvimento local).

> Verificação local após esta etapa: subir só o Postgres (`docker compose up -d`) e rodar `./mvnw spring-boot:run -Dmaven.test.skip=true`. O fluxo de aceitar troca deve funcionar igual, mas sem fila.

### 1B. Externalizar config do backend para produção

**`application.properties`** — tornar configuráveis por variável de ambiente (com fallback p/ dev local):
```properties
# Porta (Render injeta a env PORT)
server.port=${PORT:8080}

# Banco — Render/Neon definem SPRING_DATASOURCE_URL
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/braincoins}
```
(`DB_USERNAME`/`DB_PASSWORD` já são lidos via `${...}` — manter.)

**CORS** — `code/backend/moeda/src/main/java/com/lab3/moeda/CorsConfig.java`: hoje fixa `http://localhost:*`. Trocar por origens vindas de propriedade, mantendo localhost como default de dev:
```java
@Value("${app.cors.allowed-origins:http://localhost:*}")
private String[] allowedOrigins;
// ...
registry.addMapping("/**")
        .allowedOriginPatterns(allowedOrigins)
        .allowedMethods("GET","POST","PUT","DELETE","PATCH")
        .allowedHeaders("*");
```
Em produção definiremos a env `APP_CORS_ALLOWED_ORIGINS` com a URL do Vercel (Spring faz o *relaxed binding* `APP_CORS_ALLOWED_ORIGINS → app.cors.allowed-origins`).

### 1C. Dockerfile do backend (Render só roda Java via Docker)

**Criar** `code/backend/moeda/Dockerfile` (multi-stage; usa skip de testes porque a suíte não compila):
```dockerfile
# build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -Dmaven.test.skip=true

# runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/moeda-0.0.1-SNAPSHOT.jar app.jar
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
```
(`MaxRAMPercentage=75` mantém a JVM dentro dos 512MB do plano grátis.)

### 1D. Frontend — API URL configurável + fallback SPA

**Substituir o host hardcoded** em **todos** os arquivos de `code/frontend/moeda-estudantil/src/api/` que fazem `axios.create({ baseURL: 'http://localhost:8080' })` (ex.: `alunosApi.ts`, `empresasApi.ts`, `instituicoesApi.ts`, `vantagensApi.ts` e os equivalentes de auth/transações/resgates/trocas) por:
```ts
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
```
> Recomendado (opcional, mais limpo): criar um `src/api/http.ts` com uma única instância Axios e reusá-la nos demais — evita repetir a env em cada arquivo. Manter o valor **sem** `/api` no fim para não alterar o comportamento atual das rotas.

**Criar** `code/frontend/moeda-estudantil/vercel.json` (fallback SPA — todas as rotas servem `index.html`, necessário pelo TanStack Router):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Criar** `code/frontend/moeda-estudantil/.env.example`:
```dotenv
VITE_API_URL=http://localhost:8080
```

### 1E. Commit + push

Apresentar todas as mudanças e, **após confirmação explícita** (regra do CLAUDE.md), commitar com autor do GitHub e dar push na `main`.

---

## Fase 2 — Banco de Dados (Neon)

1. Neon → **Create Project** (região mais próxima, ex.: AWS São Paulo se disponível).
2. Copiar a **connection string** (formato `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`).
3. Converter para JDBC (será usado na env do Render):
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx.neon.tech/dbname?sslmode=require
   DB_USERNAME=<user da string>
   DB_PASSWORD=<pass da string>
   ```
   > As tabelas são criadas sozinhas no 1º boot (`spring.jpa.hibernate.ddl-auto=update`), e o `DataSeeder` cria a Instituição demo "PUC Minas".

---

## Fase 3 — Backend (Render)

1. Render → **New → Web Service** → conectar o repositório GitHub.
2. Configurar:
   - **Root Directory:** `code/backend/moeda`
   - **Runtime/Environment:** Docker (detecta o `Dockerfile`)
   - **Instance Type:** Free
3. **Environment Variables** (aba Environment):
   ```
   SPRING_DATASOURCE_URL = jdbc:postgresql://ep-xxx.neon.tech/dbname?sslmode=require
   DB_USERNAME           = <neon user>
   DB_PASSWORD           = <neon pass>
   APP_CORS_ALLOWED_ORIGINS = https://SEU-FRONT.vercel.app   (preenchido na Fase 5)
   # E-mail (opcional — sem isso, o envio falha silenciosamente):
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=seu-email@gmail.com
   MAIL_PASSWORD=sua-app-password
   MAIL_FROM=seu-email@gmail.com
   ```
   > Não definir `PORT` — o Render injeta automaticamente e o `application.properties` já lê `${PORT}`.
4. **Create Web Service** → aguardar o build do Docker. Anotar a URL pública: `https://SEU-BACK.onrender.com`.
5. Teste rápido: abrir `https://SEU-BACK.onrender.com/alunos` (ou outro GET público) — deve responder JSON.

---

## Fase 4 — Frontend (Vercel)

1. Vercel → **Add New → Project** → importar o repositório.
2. Configurar:
   - **Root Directory:** `code/frontend/moeda-estudantil`
   - **Framework Preset:** Vite (Build `npm run build`, Output `dist`)
3. **Environment Variable:**
   ```
   VITE_API_URL = https://SEU-BACK.onrender.com
   ```
4. **Deploy** → anotar a URL: `https://SEU-FRONT.vercel.app`.

---

## Fase 5 — Conectar CORS e finalizar

1. Voltar ao Render → atualizar `APP_CORS_ALLOWED_ORIGINS = https://SEU-FRONT.vercel.app` → salvar (redeploy automático).
2. (Opcional) Configurar domínio próprio grátis no Vercel se tiver um.

---

## Verificação End-to-End

Após tudo no ar, testar pelo navegador em `https://SEU-FRONT.vercel.app`:
1. **Acordar o backend:** abrir a URL do Render uma vez (1ª request ~50s).
2. **Login demo Instituição** (botão "Entrar (demo)" — usa o `DataSeeder` PUC Minas).
3. **Cadastro** de professor/aluno/empresa → confirma escrita no Neon.
4. **Distribuir moedas** (professor → aluno) → confere saldo no extrato do aluno.
5. **Resgatar vantagem** (aluno) → gera cupom.
6. **Troca entre alunos** (criar → aceitar) → **valida o fluxo sem RabbitMQ**: a posse dos resgates deve transferir e o status virar `ACEITA` na hora.
7. **Console do navegador (F12):** nenhum erro de CORS; requisições vão para `onrender.com`.
8. (Se SMTP configurado) confirmar recebimento de e-mail; senão, confirmar que a ação conclui mesmo sem e-mail.

---

## Custos e Limitações Conhecidas

- **Custo: R$ 0/mês, permanente, sem cartão.**
- Backend **hiberna após 15 min** sem uso → 1ª request seguinte ~50s (limite do plano grátis Render).
- **Uploads de imagem são efêmeros** (somem em cada redeploy/restart) — decisão aceita.
- Neon grátis: 0.5GB e pode autosuspender com inatividade (acorda na 1ª query).
- Sem JWT, sem rate limiting (limitações já existentes do projeto) — não recomendado expor publicamente sem isso para uso real.
- A troca deixa de ser assíncrona (sem fila); para o volume de um projeto acadêmico, sem impacto.

---

## Resumo dos Arquivos Tocados

**Backend:**
- Editar: `service/TrocaService.java`, `pom.xml`, `src/main/resources/application.properties`, `CorsConfig.java`, `docker-compose.yml` (raiz)
- Excluir: `service/TrocaConsumerService.java`, `config/RabbitConfig.java`, `config/GsonMessageConverter.java`
- Criar: `code/backend/moeda/Dockerfile`

**Frontend:**
- Editar: todos os `src/api/*.ts` com `axios.create` (host → `VITE_API_URL`)
- Criar: `vercel.json`, `.env.example`
