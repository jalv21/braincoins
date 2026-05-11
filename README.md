
# 🧠📖 BrainCoins - Sistema de Moeda Estudantil 🪙

![Java](https://img.shields.io/badge/Java-21-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-4.0.0-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![React](https://img.shields.io/badge/React-19.2.5-007ec6?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8.0.9-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![GitHub repo size](https://img.shields.io/github/repo-size/jalv21/braincoins?style=for-the-badge&logo=files) ![GitHub directory file count](https://img.shields.io/github/directory-file-count/jalv21/braincoins?style=for-the-badge&logo=files) ![GitHub stars](https://img.shields.io/github/stars/jalv21/braincoins?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/jalv21/braincoins?style=for-the-badge&logo=git) ![GitHub language count](https://img.shields.io/github/languages/count/jalv21/braincoins?style=for-the-badge&logo=python) ![GitHub license](https://img.shields.io/github/license/jalv21/braincoins?style=for-the-badge&color=007ec6&logo=opensourceinitiative) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/jalv21/braincoins?style=for-the-badge&color=007ec6&logo=gitkraken) ![GitHub last commit](https://img.shields.io/github/last-commit/jalv21/braincoins?style=for-the-badge&logo=clockify) ![Views Counter](https://views-counter.vercel.app/badge?pageId=https%3A%2F%2Fgithub%2Ecom%2Fjalv21%2Fbraincoins&leftColor=555555&rightColor=007ec6&type=total&label=RepoViews)

Um sistema gamificado de moeda estudantil em que professores podem reconhecer o mérito dos seus alunos através de moedas virtuais que podem ser trocadas por diversas vantagens, oferecidas por empresas parceiras. Gerencia transferência de moedas de professores para alunos, reivindicação e resgate de vantagens por alunos. Desenvolvido com **Spring Boot**, **React** e **Vite**. 

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
  - [Exemplos de diagramas](#exemplos-de-diagramas)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
     - [1 Back-end (Spring Boot)](#1-back-end-spring-boot)
     - [2 Front-end (React, Vite)](#2-front-end-react-vite)
     - [3 Exemplos de Variáveis de Ambiente na Vercel](#3-exemplos-de-variáveis-de-ambiente-na-vercel)
  - [Instalação de Dependências](#-instalação-de-dependências)
    - [Front-end (React)](#front-end-react)
    - [Back-end (Spring Boot)](#back-end-spring-boot)
  - [Inicialização do Banco de Dados (PostgreSQL)](#-inicialização-do-banco-de-dados-postgresql)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
    - [Terminal 1: Back-end (Spring Boot)](#terminal-1-back-end-spring-boot)
    - [Terminal 2: Front-end (React, Vite)](#terminal-2-front-end-react-vite)
    - [Execução Local Completa com Docker Compose (Incluindo Banco de Dados)](#-execução-local-completa-com-docker-compose-incluindo-banco-de-dados)
    - [Passos para build, inicialização e execução](#-passos-para-build-inicialização-e-execução)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
  - [Aplicativo Mobile](#-aplicativo-mobile)
  - [Aplicação Web](#-aplicação-web)
  - [Exemplo de saída no Terminal (para Back-end, API, CLI)](#-exemplo-de-saída-no-terminal-para-back-end-api-cli)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 📚 **Documentação:** Consulte as seções abaixo para mais informações sobre instalação, arquitetura e uso.
* 🐙 **Repositório GitHub:** [BrainCoins](https://github.com/jalv21/braincoins)
* 🚀 **Backend API:** http://localhost:8080
* 🎨 **Frontend Web:** http://localhost:5173
* 📋 **Postman Collection:** `BrainCoins_API.postman_collection.json`

---

## 📝 Sobre o Projeto
BrainCoins é um sistema de moeda estudantil desenvolvido como projeto acadêmico no contexto universitário. A ideia central é criar uma economia interna entre alunos, professores e empresas parceiras, onde o bom desempenho e a participação acadêmica são recompensados com moedas virtuais que podem ser trocadas por vantagens reais.

- **Por que ele existe?** A motivação é incentivar o engajamento acadêmico de forma tangível — professores reconhecem alunos que se destacam creditando moedas, e alunos utilizam esse saldo para resgatar benefícios oferecidos por empresas parceiras da instituição, como descontos e produtos.
- **Qual problema ele resolve?** A falta de mecanismos práticos de reconhecimento e recompensa dentro do ambiente acadêmico. O BrainCoins cria uma ponte entre o desempenho do aluno e benefícios concretos, tornando o reconhecimento acadêmico mais motivador e visível.
- **Onde pode ser utilizado?** Em instituições de ensino superior que queiram implementar programas de incentivo acadêmico, conectando alunos, corpo docente e empresas do entorno em um ecossistema de recompensas.
- **O que o torna relevante?** O projeto cobre o ciclo completo de uma aplicação moderna — back-end em Spring Boot com PostgreSQL, front-end em React, autenticação, e múltiplos perfis de usuário (aluno, professor, empresa e instituição) com regras de negócio distintas para cada um.

---

## ✨ Funcionalidades Principais

### 🎓 Para Alunos
- 🔐 **Login Seguro:** Acesso individual com email e senha criptografada
- 📊 **Visualizar Saldo:** Consultar saldo atual de moedas
- 📜 **Histórico de Transações:** Ver todas as moedas recebidas de professores
- 🛍️ **Resgatar Vantagens:** Trocar moedas por benefícios oferecidos por empresas
- 📱 **Notificações:** Receber email ao ganhar moedas e ao resgatar vantagens

### 👨‍🏫 Para Professores
- 🔐 **Login Seguro:** Acesso com email e senha criptografada
- 💰 **Distribuir Moedas:** Enviar moedas para alunos como reconhecimento por bom desempenho
- 📋 **Histórico:** Rastrear todas as moedas distribuídas
- 🎯 **Gestão Acadêmica:** Incentivar engajamento estudantil através de recompensas

### 🏢 Para Empresas
- 🔐 **Login Seguro:** Acesso à plataforma com email e senha criptografada
- 🛒 **Criar Vantagens:** Oferecer produtos/serviços que alunos podem resgatar
- 📦 **Gerenciar Estoque:** Controlar quantidade de benefícios disponíveis
- ✅ **Aprovar Resgates:** Validar solicitações de resgate com código de confirmação
- 📧 **Notificações:** Receber alerta ao haver novo resgate de vantagem

### 🏛️ Para Instituições
- 🔐 **Login Seguro:** Acesso administrativo com credenciais
- 📊 **Visão Geral do Sistema:** Monitorar movimentação de moedas e resgates
- ⚙️ **Configuração:** Gerenciar parâmetros e regras do sistema

### 🔐 **Autenticação Segura:** 
- Cadastro e login de usuários (Aluno, Professor, Empresa, Instituição)
- Criptografia de senha com Spring Security
- Validação de credenciais

### ⚙️ **Gerenciamento de CRUD:** 
- Criação, Leitura, Atualização e Deleção de recursos
- Alunos, Professores, Empresas, Instituições
- Transações de moedas e Vantagens

### 💳 **Sistema de Moedas:** 
- Transferência de moedas de professor para aluno
- Rastreamento de saldo por aluno
- Histórico de transações

### 📨 **Envio de E-mail:** 
- Notificação de recebimento de moedas
- Notificação de solicitação de resgate
- Notificação de reembolso para resgates expirados
- Confirmação de resgate com código único

---

## 📖 Histórias de Usuário

### HU-01: Aluno Recebe Moedas do Professor
**Como** um aluno  
**Desejo** receber moedas de reconhecimento de um professor  
**Para que** eu possa acumular saldo e resgatá-las por benefícios  

**Fluxo:**
1. Professor realiza login
2. Professor distribui moedas para um aluno com descrição da ação
3. Aluno recebe notificação por email
4. Aluno visualiza saldo atualizado

### HU-02: Aluno Resga Vantagem
**Como** um aluno  
**Desejo** resgatar minhas moedas por vantagens oferecidas  
**Para que** eu possa obter benefícios reais em troca do meu desempenho  

**Fluxo:**
1. Aluno visualiza lista de vantagens disponíveis
2. Aluno seleciona uma vantagem (se tem saldo suficiente)
3. Sistema cria solicitação de resgate
4. Empresa recebe notificação e código de confirmação
5. Empresa aprova o resgate
6. Aluno recebe email de confirmação

### HU-03: Professor Distribui Moedas
**Como** um professor  
**Desejo** reconhecer alunos que se destacam com moedas  
**Para que** eu possa incentivar engajamento e bom desempenho acadêmico  

**Fluxo:**
1. Professor realiza login
2. Professor acessa seção de distribuição de moedas
3. Professor seleciona aluno e quantidade
4. Professor insere motivo (ex: "Ótima participação em aula")
5. Sistema registra transação
6. Aluno recebe notificação

### HU-04: Empresa Oferece Vantagens
**Como** uma empresa parceira  
**Desejo** oferecer benefícios aos alunos da instituição  
**Para que** eu possa aumentar visibilidade e fidelizar clientes jovens  

**Fluxo:**
1. Empresa realiza login
2. Empresa cria nova vantagem (nome, descrição, custo em moedas, estoque)
3. Vantagem fica disponível para alunos
4. Empresa gerencia estoque e resgates

### HU-05: Instituição Monitora Sistema
**Como** gestor da instituição  
**Desejo** acompanhar a movimentação de moedas no sistema  
**Para que** eu possa verificar se os objetivos de engajamento estão sendo atingidos  

**Fluxo:**
1. Gestor realiza login
2. Gestor acessa dashboard com métricas
3. Gestor visualiza total de moedas distribuídas, resgatadas, etc.

---

## 🛠 Tecnologias Utilizadas

As seguintes ferramentas, frameworks e bibliotecas foram utilizados na construção deste projeto. Recomenda-se o uso das versões listadas (ou superiores) para garantir a compatibilidade.

### 💻 Front-end

* **Framework/Biblioteca:** React v19.2.5
* **Build Tool:** Vite v8.0.9
* **Linguagem/Superset:** TypeScript, JavaScript ES6+
* **Estilização:** TailwindCSS v4.2.3
* **Componentes UI:** Radix UI (Accordion, Dialog, Dropdown, etc.)
* **Roteamento:** TanStack Router v1.169.1
* **Gráficos:** Recharts v3.8.1
* **HTTP Client:** Axios v1.16.0
* **Formulários:** React Hook Form v7.75.0

### 🖥️ Back-end

* **Linguagem/Runtime:** Java 21
* **Framework:** Spring Boot 4.0.6
* **Build Tool:** Maven (com Spring Boot Maven Plugin)
* **Banco de Dados:** PostgreSQL 17
* **ORM / Query Builder:** Hibernate/JPA 7.3.2
* **Autenticação:** Spring Security
* **Email:** Integração com EmailJS
* **Recursos Assincronos:** Spring Async & Scheduling habilitado

### ⚙️ Infraestrutura & DevOps

* **Containerização:** Docker, Docker Compose
* **PostgreSQL:** Versão 17-alpine (otimizada e leve)

---

## 🏗 Arquitetura

A arquitetura usada no projeto foi a **Arquitetura em Camadas** usando o Padrão **MVC**, juntamente com outros padrões de projeto para aumentar a organização do código e separar responsabilidades, incluindo:

- **Controller Layer**: Endpoints REST que recebem requisições HTTP
- **Service Layer** / Camada de Serviço: Implementação das regras de negócio, validações e orquestração de operações
- **Repository Layer**: Acesso ao banco de dados através de JPA/Hibernate
- **DTO** / *Data Transfer Object*: Desacoplamento do contrato da API do schema do banco de dados, aumentando a segurança e flexibilidade
- **Entity/Model Layer**: Entidades JPA que representam as tabelas do banco de dados

### Modelo de Dados (Entidades Principais)

**Aluno**
- `id`: ID único (PK)
- `nome`: Nome completo
- `email`: Email único
- `senha`: Criptografada
- `cpf`: CPF único
- `saldo`: Quantidade de moedas
- `dataCadastro`: Timestamp

**Professor**
- `id`: ID único (PK)
- `nome`: Nome completo
- `email`: Email único
- `senha`: Criptografada
- `cpf`: CPF único
- `disciplina`: Disciplina lecionada
- `dataCadastro`: Timestamp

**Empresa**
- `id`: ID único (PK)
- `nome`: Nome da empresa
- `email`: Email único
- `senha`: Criptografada
- `cnpj`: CNPJ único
- `descricao`: Descrição/Bio
- `dataCadastro`: Timestamp

**Instituição**
- `id`: ID único (PK)
- `nome`: Nome da instituição
- `email`: Email único
- `senha`: Criptografada
- `cnpj`: CNPJ único

**Transação** (Professor → Aluno)
- `id`: ID único (PK)
- `professorId`: FK para Professor
- `alunoId`: FK para Aluno
- `quantidade`: Quantidade de moedas transferidas
- `descricao`: Motivo da transferência
- `data`: Data/hora da transação
- `status`: Status (CONCLUÍDA, PENDENTE, etc.)

**Vantagem** (Ofertada por Empresa)
- `id`: ID único (PK)
- `empresaId`: FK para Empresa
- `nome`: Nome da vantagem
- `descricao`: Descrição detalhada
- `custo`: Custo em moedas
- `estoque`: Quantidade disponível
- `ativo`: Flag de ativação
- `dataCadastro`: Timestamp

**Resgate** (Aluno → Vantagem)
- `id`: ID único (PK)
- `alunoId`: FK para Aluno
- `vantagemId`: FK para Vantagem
- `empresaId`: FK para Empresa
- `codigoConfirmacao`: Código único para validação
- `status`: PENDENTE, APROVADO, REJEITADO
- `dataSolicitacao`: Data de solicitação
- `dataAprovacao`: Data de aprovação

### Componentes Principais

**Camadas da Arquitetura:**
- **Controller Layer**: REST endpoints que recebem requisições HTTP
- **Service Layer**: Lógica de negócio, validações e orquestração
- **Repository Layer**: Acesso a dados via JPA/Hibernate
- **Entity Layer**: Modelos JPA que representam as tabelas
- **DTO Layer**: Data Transfer Objects para requisições/respostas

### Fluxo de Autenticação
```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │ Email + Senha
       ▼
┌──────────────────────┐
│  Spring Security     │
│  (Validação)         │
└──────┬───────────────┘
       │ Credenciais OK?
       ├─────────────────┬─────────────────┐
       │ NÃO             │ SIM             │
       ▼                 ▼                 ▼
   ┌────────┐    ┌──────────────┐    ┌──────────────┐
   │ Erro   │    │ Autenticado  │    │ Token/Sessão │
   │ 401    │    │ & Autorizado │    │   Gerado     │
   └────────┘    └──────────────┘    └──────────────┘
```

### Fluxo de Distribuição de Moedas
```
┌──────────┐
│Professor │
└────┬─────┘
     │ Login
     ▼
┌─────────────────────────┐
│ Seleciona Aluno + Qtd   │
│ + Descrição             │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ Verifica Saldo          │
│ do Professor            │
└────┬────────────────────┘
     │ Saldo OK?
     ├──────┬──────┐
     │ NÃO  │ SIM  │
     ▼      ▼      ▼
  ┌────┐ ┌─────────────────┐
  │Erro│ │ Registra        │
  │    │ │ Transação       │
  └────┘ └────┬────────────┘
              │
              ▼
         ┌──────────────────┐
         │ Envia Email      │
         │ p/ Aluno        │
         └──────────────────┘
```

### Fluxo de Resgate de Vantagem
```
┌────────┐
│ Aluno  │
└───┬────┘
    │ Login
    ▼
┌──────────────────────┐
│ Visualiza Vantagens  │
│ Disponíveis          │
└───┬─────────────────┘
    │
    ▼
┌──────────────────────┐
│ Seleciona Vantagem   │
└───┬─────────────────┘
    │
    ▼
┌──────────────────────┐    Saldo      ┌──────────┐
│ Verifica:            │◄──Insuficiente┤   Erro   │
│ • Saldo              │               └──────────┘
│ • Estoque            │
└───┬─────────────────┘
    │ OK
    ▼
┌──────────────────────┐
│ Cria Solicitação de  │
│ Resgate              │
└───┬─────────────────┘
    │
    ▼
┌──────────────────────┐
│ Notifica Empresa     │
│ com Código           │
└───┬─────────────────┘
    │
    ▼
┌──────────────────────┐
│ Empresa Aprova       │
│ Resgate              │
└───┬─────────────────┘
    │
    ▼
┌──────────────────────┐
│ Notifica Aluno       │
│ Resgate Concluído    │
└──────────────────────┘
```

---

## 🎯 Casos de Uso por Perfil

| Perfil | Ações Permitidas |
|:---:|:---|
| **Aluno** | Login, Visualizar saldo, Histórico de transações, Resgatar vantagens, Visualizar vantagens |
| **Professor** | Login, Distribuir moedas para alunos, Visualizar histórico de distribuições, Selecionar alunos |
| **Empresa** | Login, Criar/atualizar/deletar vantagens, Gerenciar estoque, Aprovar resgates, Receber notificações |
| **Instituição** | Login, Visualizar métricas gerais, Monitorar movimentação de moedas, Configurações |

---

## 🔧 Instalação e Execução

### Pré-requisitos
Certifique-se de que o usuário tenha o ambiente configurado.

* **Java JDK:** Versão **17** ou superior (Necessário para o **Back-end Spring Boot**)
* **Node.js:** Versão LTS (v18.x ou superior) (Necessário para o **Front-end React**)
* **Gerenciador de Pacotes:** npm ou yarn
* **Docker** (Opcional, mas **altamente recomendado** para rodar o Banco de Dados)

---

### 🔑 Variáveis de Ambiente

Crie arquivos `.env` específicos e/ou configure as variáveis de ambiente no seu sistema para cada parte da aplicação.

#### 1 Back-end (Spring Boot)

Configure estas variáveis no arquivo `.env` na raiz do projeto ou como variáveis de ambiente do sistema.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão JDBC (PostgreSQL). | `postgresql://postgres:admin2513@localhost:5432/braincoins?schema=public` |
| `DB_USERNAME` | Usuário do banco de dados. | `postgres` |
| `DB_PASSWORD` | Senha do banco de dados. | `admin2513` |
| `NEXTAUTH_SECRET` | Chave secreta para autenticação. | `secret_chave_aleatoria_123` |
| `NEXTAUTH_URL` | URL base da aplicação para autenticação. | `http://localhost:3000` |

#### 2 Front-end (React, Vite)

Crie um arquivo **`.env.local`** na pasta `/code/frontend/moeda-estudantil` e use o prefixo `VITE_` para expor as variáveis ao *bundle* da aplicação.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base do Backend Spring Boot API. | `http://localhost:8080/api` |

---

#### 3. Configuração Local Completa

Para desenvolvimento local completo, crie/atualize os seguintes arquivos:

**Arquivo: `.env` (raiz do projeto)**
```bash
# Variáveis para o Docker
DB_USERNAME=postgres
DB_PASSWORD=admin2513

# String de conexão com PostgreSQL
DATABASE_URL="postgresql://postgres:admin2513@localhost:5432/braincoins?schema=public"

# Configuração para autenticação
NEXTAUTH_SECRET="secret_chave_aleatoria_123"
NEXTAUTH_URL="http://localhost:3000"
```

**Arquivo: `code/frontend/moeda-estudantil/.env.local`**
```bash
# URL da API Backend
VITE_API_URL=http://localhost:8080/api
```

> 💡 **Localização:** O arquivo `.env.local` deve estar em `code/frontend/moeda-estudantil/.env.local` para que o Vite consiga carregá-lo durante o desenvolvimento.

### 📦 Instalação de Dependências

Clone o repositório e instale as dependências.

1.  **Clone o Repositório:**

```bash
git clone https://github.com/jalv21/braincoins.git
cd braincoins
```

2.  **Instale as Dependências (Monorepo):**

Como o projeto está dividido, você precisa instalar as dependências separadamente para o Front-end (React, usando NPM/Yarn) e garantir que o Back-end (Spring Boot, usando Maven/Gradle Wrapper) tenha suas dependências resolvidas.

#### Front-end (React + Vite)

Acesse a pasta do Front-end e instale as dependências do Node.js:

```bash
cd code/frontend/moeda-estudantil
npm install
cd ../../../ # Retorna para a raiz
```

#### Back-end (Spring Boot + Maven)

O projeto utiliza **Maven Wrapper** (`./mvnw`) para gerenciar dependências:

```bash
cd code/backend/moeda
./mvnw clean install
cd ../../.. # Retorna para a raiz
```

> **Nota:** As dependências serão baixadas automaticamente. Use `clean install` para garantir uma build limpa e consistente.

---

### 💾 Inicialização do Banco de Dados (PostgreSQL)

O projeto utiliza **PostgreSQL**. A forma mais fácil de inicializar o banco é via Docker (para execução sem `docker-compose`):

1. **Rode o Container do PostgreSQL:**  
   (Certifique-se que o Docker está em execução)

```bash
docker run --name braincoins-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin2513 -e POSTGRES_DB=braincoins -p 5432:5432 -d postgres:17-alpine
```

2. **Execute as Migrações:**  
   O Back-end **Spring Boot** geralmente gerencia o schema do banco de dados automaticamente no startup (via Hibernate `ddl-auto`) ou utilizando ferramentas como **Flyway** ou **Liquibase**.

* **Se o Spring Boot gerencia o schema (padrão):** Nenhuma ação manual é necessária, basta rodar o Back-end (veja a próxima seção).
* **Se usar Flyway/Liquibase via Maven:**
    ```bash
    cd backend
    ./mvnw flyway:migrate
    # ou
    ./mvnw liquibase:update
    ```
---

### ⚡ Como Executar a Aplicação
Execute a aplicação em modo de desenvolvimento em **dois terminais separados**.

#### Terminal 1: Back-end (Spring Boot)

Inicie a API do Spring Boot. Ela tentará se conectar ao banco de dados rodando no Docker.

```bash
cd code/backend/moeda
./mvnw spring-boot:run
```
🚀 *O Back-end estará disponível em **http://localhost:8080**.*

---

#### Terminal 2: Front-end (React, Vite)

Inicie o servidor de desenvolvimento do Front-end.

```bash
cd code/frontend/moeda-estudantil
npm run dev
```
🎨 *O Front-end estará disponível em **http://localhost:5173**.*

---

#### 🐳 Execução Local Completa com Docker Compose (Incluindo Banco de Dados)

Para uma execução local que inclui o serviço de Back-end (**Spring Boot**), Front-end (**React**) e o banco de dados **PostgreSQL**, usaremos o **`docker-compose`** para orquestração.

Antes de tudo, certifique-se de que o **Docker Desktop** (no Mac/Windows) ou o **serviço Docker** (em Linux) está em execução.

- **No Mac/Windows**: basta abrir o aplicativo **Docker Desktop**.
- **No Linux**: rode o comando abaixo para iniciar o serviço:

```bash
sudo systemctl start docker
```

---

#### 📦 Passos para build, inicialização e execução

1. Acesse a pasta raiz do projeto (onde o arquivo `docker-compose.yml` está localizado):

```bash
cd /caminho/do/projeto/nome-do-projeto
```

2. Suba todos os serviços (Back-end, Front-end e Banco de Dados) definidos no `docker-compose.yml`:

```bash
docker-compose up --build -d
```

> [!NOTE]
> 💡 O parâmetro `--build` garante que as imagens mais recentes do projeto sejam geradas, e `-d` executa em segundo plano.

3. Verifique se os containers estão rodando:

```bash
docker ps
```

4. **Execute as Migrações do Banco de Dados:**
   O Back-end **Spring Boot** geralmente gerencia o schema do banco de dados (via Flyway/Liquibase ou Hibernate) na **inicialização do serviço**.

* **Verificação:** Se o serviço de Back-end (`backend` ou `api`) for o responsável pelas migrações, verifique os logs para confirmar se o processo foi concluído.
    ```bash
    docker logs <nome_do_container_backend>
    ```
* *Atenção:* O comando `npm run db:migrate` é exclusivo para Node.js e **não** deve ser usado.

5. Abra no navegador:
   O Front-end deve estar acessível na porta configurada no `docker-compose` (Exemplo: <http://localhost:3000> ou <http://localhost:5173>)

6. Para parar e remover todos os containers, redes e volumes (exceto volumes nomeados):

```bash
docker-compose down
```

✅ **Em resumo:** Usar **`docker-compose`** simplifica a execução do ambiente completo, isolando as dependências de **Java (Spring Boot)** e **Node.js (React)** e garantindo que o PostgreSQL esteja disponível.

---

## 🚀 Deploy

Instruções para deploy em produção.

1.  **Build do Projeto:**
    Execute o build separadamente para os dois artefatos (JAR para o Back-end e arquivos estáticos para o Front-end).

```bash
# 1. Build do Front-end (React/Vite)
cd code/frontend/moeda-estudantil
npm run build

# 2. Build do Back-end (Spring Boot/Maven)
cd ../../backend/moeda
./mvnw clean package -DskipTests
```

2.  **Configuração do Ambiente de Produção:** Defina as variáveis de ambiente no seu provedor (e.g., Vercel, Railway, Heroku, DigitalOcean).

> 🔑 **Variáveis Cruciais:** Certifique-se de configurar as variáveis de **conexão com o banco de dados** (`SPRING_DATASOURCE_URL`, etc.) para o Back-end e a **URL da API de produção** (`VITE_API_URL`) para o Front-end.

3.  **Execução em Produção:**
    A forma de execução depende do seu provedor, mas geralmente envolve o seguinte:

```bash
# ☕ Execução do Back-end Spring Boot (Java JAR)
# Este comando inicia a API usando o artefato JAR gerado.
java -jar code/backend/moeda/target/moeda-0.0.1-SNAPSHOT.jar

# 🟢 Execução do Front-end (React/Vite)
# Servir arquivos estáticos com 'serve' (para testes locais)
npm install -g serve
serve -s code/frontend/moeda-estudantil/dist -l 3000

# Em produção, deploy em Vercel/Netlify ou servir com Nginx/Apache
```

---

## 📂 Estrutura de Pastas

```
.
├── .env                         # 🔒 Variáveis de ambiente (contém credenciais do DB).
├── .env.example                 # 🧩 Exemplo de variáveis necessárias.
├── .gitignore                   # 🧹 Ignora arquivos não versionados (.env, node_modules, target, etc.).
├── .vscode/                     # ⚙️ Configurações do VS Code.
├── .github/                     # 🤖 CI/CD (Actions), templates de Issues/PRs.
├── README.md                    # 📘 Documentação do projeto.
├── LICENSE                      # ⚖️ Licença (MIT).
├── docker-compose.yml           # 🐳 Orquestração dos containers (PostgreSQL).
├── package.json                 # 📦 Scripts e dependências da raiz (se houver).
│
├── /code
│   ├── /backend                 # 📁 Aplicação Backend (Spring Boot)
│   │   └── /moeda
│   │       ├── pom.xml          # 🛠️ Dependências e configuração Maven.
│   │       ├── mvnw             # 🔧 Maven Wrapper (executável).
│   │       ├── mvnw.cmd         # 🔧 Maven Wrapper (Windows).
│   │       │
│   │       ├── /src/main/java
│   │       │   └── /com/lab3/moeda
│   │       │       ├── /controller          # 🎮 Endpoints REST (Auth, Aluno, Professor, etc.).
│   │       │       ├── /service             # ⚙️ Lógica de negócio.
│   │       │       ├── /repository          # 🗄️ Acesso a dados (JPA).
│   │       │       ├── /model               # 🧬 Entidades JPA (Aluno, Professor, etc.).
│   │       │       ├── /dto                 # ✉️ DTOs de requisição/resposta.
│   │       │       ├── /config              # 🔧 Configurações (CORS, DB, etc.).
│   │       │       ├── /exception           # 💥 Handlers de exceção.
│   │       │       ├── /security            # 🛡️ Autenticação (Spring Security).
│   │       │       ├── MoedaApplication.java # 🚀 Classe principal.
│   │       │       └── /util                # 🛠️ Utilitários.
│   │       │
│   │       ├── /src/main/resources
│   │       │   ├── application.yml          # ⚙️ Configuração principal.
│   │       │   ├── application-dev.yml      # 🧪 Config de desenvolvimento.
│   │       │   ├── application-prod.yml     # 🚀 Config de produção.
│   │       │   └── /db/migration            # 📜 Migrações SQL (se usar Flyway).
│   │       │
│   │       ├── /src/test/java               # 🧪 Testes.
│   │       ├── /uploads                     # 📁 Uploads de arquivos da aplicação.
│   │       └── /target                      # 📦 Build output (JAR gerado).
│   │
│   └── /frontend                # 📁 Aplicação Frontend (React + Vite)
│       └── /moeda-estudantil
│           ├── package.json                 # 📦 Dependências e scripts npm.
│           ├── package-lock.json            # 🔒 Lockfile das dependências.
│           ├── vite.config.js               # ⚙️ Configuração Vite.
│           ├── index.html                   # 🌐 HTML raiz.
│           ├── .env.local                   # 🔒 Variáveis de ambiente (VITE_API_URL).
│           │
│           ├── /src
│           │   ├── /components              # 🧱 Componentes React (UI reutilizáveis).
│           │   ├── /pages                   # 📄 Páginas/rotas da aplicação.
│           │   ├── /services                # 🔌 Serviços HTTP (axios).
│           │   ├── /hooks                   # 🎣 Hooks personalizados.
│           │   ├── /assets                  # 🖼️ Imagens, ícones, fontes.
│           │   ├── /styles                  # 🎨 Estilos CSS/Tailwind.
│           │   ├── /utils                   # 🛠️ Funções utilitárias.
│           │   ├── /routes                  # 🛣️ Configuração de rotas (TanStack Router).
│           │   ├── App.jsx                  # 🎨 Componente raiz.
│           │   └── main.jsx                 # 🚀 Ponto de entrada.
│           │
│           ├── /public                      # 🌐 Arquivos estáticos.
│           ├── /dist                        # 📦 Build output (gerado por `npm run build`).
│           └── /node_modules                # 📦 Dependências instaladas.
│
├── /docs                        # 📚 Documentação adicional (arquitetura, guias).
├── /.postman                    # 🔗 Coleção Postman para testes da API.
├── /postman                     # 🔗 Exemplos e testes Postman.
└── BrainCoins_API.postman_collection.json # 📋 Collection Postman pronta para importar.
```

---

## 🎥 Demonstração

### 🌐 Endpoints Principais da API

O Backend expõe os seguintes endpoints para interação:

#### Autenticação
```bash
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
```

#### Alunos
```bash
GET /api/aluno                   # Listar todos os alunos
GET /api/aluno/{id}              # Obter aluno por ID
POST /api/aluno                  # Criar novo aluno
PUT /api/aluno/{id}              # Atualizar aluno
DELETE /api/aluno/{id}           # Deletar aluno
```

#### Professores
```bash
GET /api/professor               # Listar professores
POST /api/professor              # Criar professor
GET /api/professor/{id}          # Obter professor por ID
```

#### Transações (Transferência de Moedas)
```bash
GET /api/transacao               # Listar transações
POST /api/transacao              # Criar transação (transferência de moedas)
GET /api/transacao/{id}          # Obter detalhes da transação
```

#### Vantagens
```bash
GET /api/vantagem                # Listar vantagens disponíveis
POST /api/vantagem               # Criar nova vantagem
PUT /api/vantagem/{id}           # Atualizar vantagem
GET /api/vantagem/{id}/redeem    # Resgatar vantagem
```

### 💻 Testando com Postman

1. Importe a collection: **`BrainCoins_API.postman_collection.json`**
2. Configure a URL base: **`http://localhost:8080`**
3. Realize testes nos endpoints listados acima

---

## 🧪 Testes

### Testes do Backend (Spring Boot/Maven)

Execute os testes do backend:

```bash
cd code/backend/moeda
./mvnw test
```

### Testes do Frontend (React)

Se houver testes configurados no frontend:

```bash
cd code/frontend/moeda-estudantil
npm run test
```

> **Nota:** Configure testes unitários e E2E conforme necessário para seu caso de uso.

---

## 🔗 Documentações utilizadas

Liste aqui links para documentação técnica, referências de bibliotecas complexas ou guias de estilo que foram cruciais para o projeto.

* 📖 **Framework/Biblioteca (Front-end):** [Documentação Oficial do **React**](https://react.dev/reference/react)
* 📖 **Build Tool (Front-end):** [Guia de Configuração do **Vite**](https://vitejs.dev/config/)
* 📖 **Framework (Back-end):** [Documentação Oficial do **Spring Boot**](https://docs.spring.io/spring-boot/docs/current/reference/html/)
* 📖 **Containerização:** [Documentação de Referência do **Docker**](https://docs.docker.com/)
* 📖 **Guia de Estilo:** [**Conventional Commits** (Padrão de Mensagens)](https://www.conventionalcommits.org/en/v1.0.0/)
* 📖 **Documentação Interna:** [Design System do Projeto](./docs/design-system.md)

---

## 👥 Autores

- **Bernardo Gomes** - @be.gpereira25@gmail.com
- **João Álvaro** - @jalv21
- **Pedro Silva**

Desenvolvido como projeto acadêmico de Engenharia de Software na **PUC Minas**.

---

## 🤝 Contribuição
Guia para contribuições ao projeto.

1.  Faça um `fork` do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4.  Faça o `push` para a branch (`git push origin feature/minha-feature`).
5.  Abra um **Pull Request (PR)**.

> [!IMPORTANT]
> 📝 **Regras:** Por favor, verifique o arquivo [`CONTRIBUTING.md`](./CONTRIBUTING.md) para detalhes sobre nosso guia de estilo de código e o processo de submissão de PRs.

---

## 🙏 Agradecimentos
Em ambiente acadêmico, citar fontes e inspirações é crucial (integridade acadêmica). Em ambiente profissional, mostra humildade e conexão com a comunidade.

Gostaria de agradecer aos seguintes canais e pessoas que foram fundamentais para o desenvolvimento deste projeto:

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional, estrutura acadêmica e fomento à inovação e boas práticas de engenharia.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos valiosos ensinamentos sobre **Arquitetura de Software** e **Padrões de Projeto**.
* [**Fernanda Kipper**](https://www.instagram.com/kipper.dev/) - Pelos valiosos ensinamentos em **Desenvolvimento Web**, **DevOps** e melhores práticas em **Front-end**.
* [**Rodrigo Branas**](https://branas.io/) - Pela didática excepcional em **Clean Architecture** e **Clean Code**.
* [**Código Fonte TV**](https://codigofonte.tv/) - Pelo vasto conteúdo e cobertura de notícias, tutoriais e apoio à comunidade de **Desenvolvimento Web**.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software/blob/main/LICENSE)**.

---
