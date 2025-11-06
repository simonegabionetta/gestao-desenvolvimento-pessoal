# API de Gestão de Desenvolvimento Profissional

![Node.js 18.x](https://img.shields.io/badge/node.js-18.x-green?logo=node.js)
![Mocha](https://img.shields.io/badge/Mocha-Testing-red?logo=mocha)
![SuperTest](https://img.shields.io/badge/SuperTest-API%20Testing-orange)
![Chai](https://img.shields.io/badge/Chai-Assertion%20Library-brightgreen)



## Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Como Rodar os Testes](#-como-rodar-os-testes)
- [Funcionalidades](#-funcionalidades)
- [Regras de Negócio](#-regras-de-negócio)
- [Endpoints Principais](#-endpoints-principais)
- [Próximos Passos](#-próximos-passos)
- [Documentação Detalhada](#-documentação-detalhada)
- [Créditos e Licença](#-créditos-e-licença)


## Sobre o Projeto

Projeto desenvolvido como **entrega final da Mentoria 2.0 em Testes de Software**, servindo como **portfólio voltado à qualidade de software**.  
Este projeto inclui:

- **Desenvolvimento de API RESTful** com uso IA para gestão de desenvolvimento pessoal: usuários, metas, projetos, mentorias, aprendizados e estatísticas.  
- **Testes automatizados** utilizando **SuperTest** e **Mocha**.  
- Registro de **evidências visuais** e geração de **relatórios detalhados** das execuções de teste.

## Tecnologias Utilizadas
- Node.js
-  **Express** – API REST
-  **Swagger** – Documentação de endpoints REST
-  - **SuperTest** & **Mocha** – Testes automatizados
- **Chai** – Framework de assertions
- **Banco de dados em memória**
- **JWT** para autenticação
- **bcryptjs** para criptografia de senhas

  ## Estrutura do Projeto
  
- `src/models`: Modelos de dados
- `src/services`: Lógica de negócio
- `src/controllers`: Controladores das rotas
- `src/routes`: Definição das rotas
- `src/middleware`: Middlewares de autenticação e outros
- `resources/swagger.yaml`: Documentação da API

## Como Executar

1. **Clone o repositório:**
```sh
git clone https://github.com/simonegabionetta/gestao-desenvolvimento-pessoal
cd gestao-desenvolvimento-pessoal
```

2. **Instale as dependências:**
```sh
npm install
```

3. **Configure o arquivo `.env`:**
```env
BASE_URL_REST=http://localhost:3000
```

4. **Inicie os servidores:**

**API REST:**
```sh
npm start
# ou
node server.js
```

- **API REST** disponível em: <http://localhost:3000>  
- **Documentação Swagger**: <http://localhost:3000/api-docs>

## Como Rodar os Testes

### Testes Funcionais (SuperTest/Mocha)

Total de testes implementados: 73 testes funcionais

**Executar todos os testes funcionais:**
```sh
npm test
```

## Funcionalidades

### Autenticação e Usuários
- Cadastro de novos usuários
- Login e autenticação com JWT
- Gerenciamento de perfil
- Logout
- Histórico de atividades

### Metas
- Criar metas (Pessoais ou Profissionais)
- Listar metas com filtros (tipo, status, período)
- Obter detalhes de uma meta específica
- Atualizar meta
- Deletar meta

### Projetos
- Criar projetos
- Listar projetos com filtros (período, responsável)
- Obter detalhes de um projeto específico
- Atualizar projeto
- Deletar projeto

### Mentorias
- Criar registro de mentoria
- Listar mentorias com filtros (período, responsável)
- Obter detalhes de uma mentoria específica
- Atualizar mentoria
- Deletar mentoria

### Melhorias
- Criar registro de melhoria
- Listar melhorias com filtros (período, responsável)
- Obter detalhes de uma melhoria específica
- Atualizar melhoria
- Deletar melhoria

### Aprendizados
- Criar aprendizado (cursos, palestras, workshops, etc.)
- Listar aprendizados com filtros (tipo, período, responsável)
- Obter detalhes de um aprendizado específico
- Atualizar aprendizado
- Deletar aprendizado

### Anotações
- Criar anotação
- Listar anotações com filtros (período)
- Obter detalhes de uma anotação específica
- Atualizar anotação
- Deletar anotação

### Dashboard
- Resumo de metas (total, concluídas, em progresso, planejadas)
- Gráfico de evolução por período
- Filtros de dados por tipo, status e período

## Regras de Negócio

### Autenticação e Usuários
- **RN001**: Ao registrar um novo usuário, o sistema deve verificar se o email já está cadastrado. Caso esteja, retornar erro "Usuário já existe"
- **RN002**: Senhas de usuários devem ser armazenadas criptografadas usando bcrypt com salt 8
- **RN003**: Ao fazer login, o sistema deve verificar se o email existe e se a senha está correta. Caso contrário, retornar erro específico ("Usuário não encontrado" ou "Senha inválida")
- **RN004**: Tokens JWT gerados no login devem expirar em 1 hora
- **RN005**: Ao buscar o perfil de um usuário, a senha nunca deve ser retornada
- **RN006**: Senhas atualizadas no perfil devem ser re-criptografadas antes de armazenar
- **RN007**: Histórico de atividades deve ser limitado a 10 registros por padrão, com paginação opcional
- **RN008**: Novas ações no histórico devem ser adicionadas no início da lista (mais recente primeiro)
- **RN029**: Histórico de usuário deve permitir paginação com offset e limit (padrão: limit=10, offset=0)

### Metas
- **RN009**: Ao criar uma meta, ela deve ter status inicial "planejada"
- **RN010**: ID de metas deve ser gerado incrementalmente baseado no comprimento do array
- **RN011**: Listagem de metas deve permitir filtros por tipo, status e período. Filtros são opcionais
- **RN012**: Ao atualizar uma meta que não existe, o sistema deve retornar erro "Meta não encontrada"
- **RN013**: Ao deletar uma meta que não existe, o sistema deve retornar erro "Meta não encontrada"
- **RN014**: Filtro de período nas metas deve considerar metas com data de vencimento entre start e end (inclusivo)
- **RN021**: Resumo de metas deve agrupar contagens por tipo (Pessoal/Profissional) e por status (planejada/concluída)
- **RN022**: Cada meta deve ser contada apenas uma vez no resumo
- **RN023**: Gráfico de progresso deve agrupar metas por mês (formato YYYY-MM) e contar planejadas vs concluídas
- **RN024**: Filtro do dashboard segue as mesmas regras de filtro de metas (tipo, status, período)

### Projetos
- **RN010**: ID de projetos deve ser gerado incrementalmente baseado no comprimento do array
- **RN015**: Ao criar projeto, o sistema deve adicionar timestamp de criação
- **RN016**: Listagem de projetos deve permitir filtros por período e responsável
- **RN019**: Ao atualizar ou deletar um projeto que não existe, o sistema deve retornar erro específico
- **RN028**: Períodos devem ser aplicados sobre a data de vencimento (dueDate) do projeto

### Mentorias
- **RN010**: ID de mentorias deve ser gerado incrementalmente baseado no comprimento do array
- **RN015**: Ao criar mentoria, o sistema deve adicionar timestamp de criação
- **RN016**: Listagem de mentorias deve permitir filtros por período e responsável
- **RN019**: Ao atualizar ou deletar uma mentoria que não existe, o sistema deve retornar erro específico
- **RN028**: Períodos devem ser aplicados sobre a data (date) da mentoria

### Melhorias
- **RN010**: ID de melhorias deve ser gerado incrementalmente baseado no comprimento do array
- **RN015**: Ao criar melhoria, o sistema deve adicionar timestamp de criação
- **RN016**: Listagem de melhorias deve permitir filtros por período e responsável
- **RN019**: Ao atualizar ou deletar uma melhoria que não existe, o sistema deve retornar erro específico
- **RN028**: Períodos devem ser aplicados sobre a data (date) da melhoria

### Aprendizados
- **RN010**: ID de aprendizados deve ser gerado incrementalmente baseado no comprimento do array
- **RN015**: Ao criar aprendizado, o sistema deve adicionar timestamp de criação
- **RN017**: Listagem de aprendizados deve permitir filtros por tipo, período e responsável
- **RN019**: Ao atualizar ou deletar um aprendizado que não existe, o sistema deve retornar erro específico
- **RN028**: Períodos devem ser aplicados sobre a data (date) do aprendizado

### Anotações
- **RN010**: ID de anotações deve ser gerado incrementalmente baseado no comprimento do array
- **RN015**: Ao criar anotação, o sistema deve adicionar timestamp de criação
- **RN018**: Listagem de anotações deve permitir filtro por período
- **RN019**: Ao atualizar ou deletar uma anotação que não existe, o sistema deve retornar erro específico
- **RN020**: Anotações devem armazenar a data automaticamente no momento da criação
- **RN028**: Períodos devem ser aplicados sobre a data da anotação

### Dashboard
- **RN021**: Resumo de metas deve agrupar contagens por tipo (Pessoal/Profissional) e por status (planejada/concluída)
- **RN022**: Cada meta deve ser contada apenas uma vez no resumo
- **RN023**: Gráfico de progresso deve agrupar metas por mês (formato YYYY-MM) e contar planejadas vs concluídas
- **RN024**: Filtro do dashboard segue as mesmas regras de filtro de metas (tipo, status, período)

## Regras Gerais do Sistema

### Validação e Tratamento de Erros
- **RN025**: Todas as entidades devem ter tratamento de erro quando não encontradas nas operações de leitura, atualização e exclusão
- **RN026**: Busca por ID em qualquer entidade deve converter o parâmetro para número antes de comparar
- **RN030**: Atualização de entidades deve preservar todos os campos não fornecidos e sobrescrever apenas os fornecidos (Object.assign)

### Filtros e Paginação
- **RN027**: Filtros opcionais devem funcionar de forma inclusiva (AND lógico). Todos os filtros informados devem ser satisfeitos
- **RN028**: Períodos devem ser aplicados sobre a data da entidade (date para mentorias/melhorias/aprendizados, dueDate para metas/projetos)

### Segurança e Integridade
- **Segurança**: Senhas nunca são expostas nas respostas do sistema
- **Incremento de ID**: IDs são sempre incrementais baseados no tamanho do array + 1
- **Timestamps**: Todas as entidades criadas recebem timestamp automático
- **Paginação**: Sistema de paginação aplicado apenas no histórico de usuário

## Endpoints Principais

### Autenticação
- `POST /users/register` - Cadastro de usuário
- `POST /users/login` - Login de usuário
- `GET /users/me` - Obter perfil do usuário logado
- `PUT /users/me` - Atualizar perfil
- `POST /users/logout` - Logout
- `GET /users/me/history` - Histórico de atividades

### Metas
- `POST /goals` - Criar meta
- `GET /goals` - Listar metas
- `GET /goals/:id` - Obter meta por ID
- `PUT /goals/:id` - Atualizar meta
- `DELETE /goals/:id` - Deletar meta

### Projetos
- `POST /projects` - Criar projeto
- `GET /projects` - Listar projetos
- `GET /projects/:id` - Obter projeto por ID
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Deletar projeto

### Mentorias
- `POST /mentorships` - Criar mentoria
- `GET /mentorships` - Listar mentorias
- `GET /mentorships/:id` - Obter mentoria por ID
- `PUT /mentorships/:id` - Atualizar mentoria
- `DELETE /mentorships/:id` - Deletar mentoria

### Melhorias
- `POST /improvements` - Criar melhoria
- `GET /improvements` - Listar melhorias
- `GET /improvements/:id` - Obter melhoria por ID
- `PUT /improvements/:id` - Atualizar melhoria
- `DELETE /improvements/:id` - Deletar melhoria

### Aprendizados
- `POST /learning` - Criar aprendizado
- `GET /learning` - Listar aprendizados
- `GET /learning/:id` - Obter aprendizado por ID
- `PUT /learning/:id` - Atualizar aprendizado
- `DELETE /learning/:id` - Deletar aprendizado

### Anotações
- `POST /notes` - Criar anotação
- `GET /notes` - Listar anotações
- `GET /notes/:id` - Obter anotação por ID
- `PUT /notes/:id` - Atualizar anotação
- `DELETE /notes/:id` - Deletar anotação

### Dashboard
- `GET /dashboard/goals-summary` - Resumo de metas
- `GET /dashboard/progress-graph` - Gráfico de evolução
- `GET /dashboard/filter` - Filtrar dados

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Para obter o token:
1. Faça o cadastro ou login através dos endpoints `/users/register` ou `/users/login`
2. Use o token retornado no header das requisições:
   ```
   Authorization: Bearer <seu_token>
   ```

## Próximos Passos
   
- **Testes de Performance:**  
 Medir tempo de resposta e analisar a escalabilidade de aplicações.

- **Desenvolvimento Web:**  
Construir aplicações web modernas, responsivas e funcionais, integrando boas práticas de desenvolvimento e acessibilidade.

- **Testes Automatizados com Cypress:**  
  Aplicar testes end-to-end para validar fluxos completos da aplicação.

- **Integração Contínua (CI):**  
  Implementar pipelines de CI para automatizar builds, testes e deploys, garantindo que mudanças no código sejam validadas rapidamente e mantendo a qualidade e estabilidade da aplicação.

## Documentação Detalhada

Esta seção aborda todos os aspectos relacionados à qualidade do software e aos testes realizados no projeto. 

[Wiki](URL_da_wiki)


## Créditos e Licença

<a href="https://www.linkedin.com/in/simonegabionetta/" target="_blank">Simone Gabionetta</a><br>
*Portfólio e entrega final – Mentoria 2.0 em Testes de Software - [Júlio de Lima](https://www.linkedin.com/in/julio-de-lima/)*  


