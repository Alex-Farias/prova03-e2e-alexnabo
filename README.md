# Playwright E2E.

## GitHub Actions + SonarCloud

[![Build and Tests](https://github.com/ugioni/playwright-e2e/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/ugioni/playwright-e2e/actions/workflows/node.js.yml)

</br>

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ugioni_playwright-e2e&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ugioni_playwright-e2e)

## Getting Started

In order to execute this project you must follow the steps below:

1. Install [Node JS](https://nodejs.org/) (version >= 22.x)
1. Run `npm i --save-dev` to install all the project dependencies
1. Run `npx playwright install` to install the browsers used by Playwright
1. Run `npm run ci` to execute the entire test suite
1. Run `npm run show-report` to visualize the reports

All execution artifacts can be found in `./artifacts`, if you want to remove these files run `npm run clean`.

## Using ZeroStep AI
</br>

To use the AI feature with ZeroStep, you must create the `zerostep.config.json` file in the root of the project and add your ZeroStep token.

## Project Structure
</br>
<ul>
    <li>Scenarios: Test scenario mapping</li>
    <li>Support: Project structure files
        <ul>
            <li>Elements: Mapping the elements of each screen</li>
            <li>Fixtures: Data configuration files</li>
            <li>Pages: Logic used to perform actions in tests</li>
        </ul>
    </li>
</ul>

---

## TodoMVC — Automação E2E com Claude Code

Esta seção documenta a implementação dos testes automatizados para o [TodoMVC](https://demo.playwright.dev/todomvc/), desenvolvida com auxílio do **Claude Code** como agente de desenvolvimento.

### Como o Claude Code foi utilizado

O Claude Code analisou os arquivos de teste já existentes no repositório e aplicou rigorosamente os mesmos padrões de projeto (Page Objects, Elements, `sicolo` para configuração e estrutura de `describe/beforeEach`). A partir do escopo descrito em linguagem natural, gerou os seguintes artefatos:

- `src/support/elements/TodoMvcElements.ts` — localizadores robustos baseados nas classes CSS padrão do TodoMVC
- `src/support/pages/TodoMvcPage.ts` — Page Object com ações de UI e validações de LocalStorage via `page.evaluate`
- `src/scenarios/TodoMVC.spec.ts` — 3 casos de teste integrados ao pipeline existente

### Casos de Teste Implementados

| ID | Descrição |
|----|-----------|
| CT01 | Fluxo de vida completo (CRUD): criar, editar, concluir e excluir tarefa, validando o LocalStorage em cada etapa |
| CT02 | Persistência de sessão e filtros: rota `#/active`, `page.reload()` e integridade dos dados no LocalStorage após recarga |
| CT03 | Ações em lote: Toggle All, desmarcação individual e Clear Completed, com verificação do estado dinâmico no LocalStorage |

### Etapas do Desenvolvimento

1. **Análise do projeto** — Claude Code leu todos os specs, pages e elements existentes para identificar os padrões de nomenclatura, imports e estrutura de describe/hooks
2. **Mapeamento da aplicação** — os seletores CSS do TodoMVC (`.new-todo`, `.todo-list li`, `.toggle`, `.destroy`, `.todo-count`, etc.) foram mapeados na classe `TodoMvcElements`
3. **Implementação do Page Object** — `TodoMvcPage` centraliza ações e validações, incluindo leitura/escrita do `react-todos` no `localStorage` via `page.evaluate`
4. **Escrita dos testes** — cada CT segue a estrutura `beforeEach` com limpeza de estado (`limparLocalStorage` + `page.reload`) garantindo isolamento entre testes
5. **Integração ao pipeline** — nenhuma alteração foi necessária no `playwright.config.ts` ou no workflow do GitHub Actions; os testes são executados automaticamente via `npm run actions`