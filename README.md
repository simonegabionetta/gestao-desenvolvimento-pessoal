# API de Gestão de Desenvolvimento Profissional

![Node.js 18.x](https://img.shields.io/badge/node.js-18.x-green?logo=node.js)
![Mocha](https://img.shields.io/badge/Mocha-Testing-red?logo=mocha)
![SuperTest](https://img.shields.io/badge/SuperTest-API%20Testing-orange)
![Chai](https://img.shields.io/badge/Chai-Assertion%20Library-brightgreen)



## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Como Rodar os Testes](#como-rodar-os-testes)
- [Funcionalidades](#funcionalidades)
- [Regras de Negócio](#regras-de-negócio)
- [Endpoints Principais](#endpoints-principais)
- [Próximos Passos](#próximos-passos)
- [Documentação Detalhada](#documentação-detalhada)
- [Créditos e Licença](#créditos-e-licença)


## Sobre o Projeto

Projeto desenvolvido como **entrega final da Mentoria 2.0 em Testes de Software**, .  
Este projeto inclui:

- **Desenvolvimento de API RESTful** com uso IA para gestão de desenvolvimento pessoal: usuários, metas, projetos, mentorias, aprendizados e estatísticas.  
- **Testes automatizados** utilizando **SuperTest** e **Mocha**.  
- Registro de **evidências visuais** e geração de **relatórios detalhados** das execuções de teste.

## Tecnologias Utilizadas
- Node.js
-  **Express** – API REST
-  **Swagger** – Documentação de endpoints REST
-  **SuperTest** & **Mocha** – Testes automatizados
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
BASE_URL=http://localhost:3000
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

### Segurança e Integridade
- **Segurança**: Senhas nunca são expostas nas respostas do sistema
- **Incremento de ID**: IDs são sempre incrementais baseados no tamanho do array + 1
- **Timestamps**: Todas as entidades criadas recebem timestamp automático
- **Paginação**: Sistema de paginação aplicado apenas no histórico de usuário


## Regras de Negócio

As regras de negócio definem os comportamentos esperados da API, garantindo segurança, integridade e consistência dos dados.

### Tabela de Regras de Negócio

| ID | Regra | Descrição | Validação | Resultado Esperado |
|----|------|-----------|-----------|-------------------|
| RN01 | Cadastro de usuário | O sistema deve permitir o cadastro de novos usuários | Nome, email e senha obrigatórios | Usuário criado com sucesso |
| RN02 | Email único | Não permitir cadastro com email já existente | Verificar email na base | Erro 409 – Conflito |
| RN03 | Criptografia de senha | A senha deve ser armazenada criptografada | Uso de bcrypt | Senha protegida |
| RN04 | Login com sucesso | Usuário deve autenticar com credenciais válidas | Email e senha corretos | Retornar JWT |
| RN05 | Login inválido | Não permitir login com senha incorreta | Email ou senha inválidos | Erro 401 – Não autorizado |
| RN06 | Token obrigatório | Rotas protegidas exigem autenticação | Header Authorization com Bearer Token | Acesso permitido |
| RN07 | Token inválido | Não permitir acesso com token inválido | Token inválido ou expirado | Erro 401 |
| RN08 | Criar meta | Usuário autenticado pode criar metas | Token válido | Meta criada |
| RN09 | Atualizar meta | Usuário pode atualizar suas metas | ID válido e usuário proprietário | Meta atualizada |
| RN10 | Excluir meta | Usuário pode excluir suas metas | ID válido | Meta excluída |
| RN11 | Criar projeto | Usuário autenticado pode criar projetos | Token válido | Projeto criado |
| RN12 | Atualizar projeto | Usuário pode atualizar seus projetos | ID válido | Projeto atualizado |
| RN13 | Excluir projeto | Usuário pode excluir projetos | ID válido | Projeto excluído |
| RN14 | Criar mentoria | Usuário pode registrar mentorias | Token válido | Mentoria criada |
| RN15 | Atualizar mentoria | Usuário pode atualizar mentorias | ID válido | Mentoria atualizada |
| RN16 | Excluir mentoria | Usuário pode excluir mentorias | ID válido | Mentoria excluída |
| RN17 | Criar aprendizado | Usuário pode registrar aprendizados | Token válido | Aprendizado criado |
| RN18 | Atualizar aprendizado | Usuário pode atualizar aprendizados | ID válido | Aprendizado atualizado |
| RN19 | Excluir aprendizado | Usuário pode excluir aprendizados | ID válido | Aprendizado excluído |
| RN20 | Estatísticas | Sistema deve retornar estatísticas do usuário | Token válido | Estatísticas exibidas |
| RN21 | Acesso isolado | Usuário não pode acessar dados de outro | Validar ID usuário | Erro 403 – Proibido |
| RN22 | Campos obrigatórios | Sistema deve validar campos obrigatórios | Campos ausentes | Erro 400 – Bad Request |
| RN23 | Recurso inexistente | Não permitir acesso a recurso inexistente | ID inválido | Erro 404 – Not Found |
| RN24 | Integridade dos dados | Garantir consistência antes de salvar | Validação de dados | Dados válidos armazenados |
| RN25 | Exclusão segura | Sistema deve excluir apenas registros existentes | ID válido | Exclusão realizada |

---

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

## Documentação Detalhada

Esta seção aborda todos os aspectos relacionados à qualidade do software e aos testes realizados no projeto. 

[Wiki](https://github.com/simonegabionetta/gestao-desenvolvimento-pessoal/wiki)

## Cobertura de Testes

O projeto possui **78 casos de teste automatizados**, garantindo validação completa das funcionalidades da API.

### Distribuição dos testes

| Categoria | Quantidade |
|----------|------------|
| Usuários | 12 |
| Autenticação | 10 |
| Metas | 12 |
| Projetos | 12 |
| Mentorias | 10 |
| Aprendizados | 10 |
| Estatísticas | 6 |
| Segurança e autorização | 6 |
| **Total** | **78** |

---

## Tipos de testes implementados

- Testes positivos
- Testes negativos
- Testes de validação
- Testes de autenticação
- Testes de autorização
- Testes de segurança
- Testes de integridade

---

## Resultado esperado da execução

```sh
78 passing
0 failing
```

## Próximos Passos

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| Testes de Performance | Medir tempo de resposta da API e analisar escalabilidade | ☐ |
| Desenvolvimento Web (Interface) | Criar telas principais da aplicação: Dashboard, Metas, Projetos, Mentorías, Aprendizados e Estatísticas. Garantir design responsivo e conexão com a API | ☐ |
| Testes Automatizados com Cypress | Validar fluxos críticos do usuário end-to-end e garantir funcionamento correto de funcionalidades essenciais | ☐ |
| Integração Contínua (CI) | Automatizar builds, testes e deploys para garantir qualidade e estabilidade do sistema | ☐ |

---

## Créditos e Licença

*Desenvolvido por: <a href="https://www.linkedin.com/in/simonegabionetta/" target="_blank">Simone Gabionetta</a><br>*
*Portfólio e entrega final – Mentoria 2.0 em Testes de Software - [Júlio de Lima](https://www.linkedin.com/in/julio-de-lima/)*  


