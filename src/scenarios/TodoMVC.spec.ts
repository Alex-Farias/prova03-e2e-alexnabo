import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import TodoMvcPage from '../support/pages/TodoMvcPage';

test.describe('TodoMVC - Gerenciamento de Tarefas', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let todoMvcPage: TodoMvcPage;
  const BASE_URL = TheConfig.fromFile(CONFIG).andPath('application.todomvc').retrieveData();

  test.beforeEach(async ({ page }) => {
    todoMvcPage = new TodoMvcPage(page);
    await page.goto(BASE_URL);
    await todoMvcPage.limparLocalStorage();
    await page.reload();
  });

  test('CT01 - Fluxo de Vida Completo da Tarefa (CRUD e Persistência de Dados)', async () => {
    await todoMvcPage.adicionarTarefa('Comprar café');
    await todoMvcPage.validarTarefaVisivel('Comprar café');
    await todoMvcPage.validarContador('1 item left');
    await todoMvcPage.validarLocalStorageTarefa('Comprar café', false);

    await todoMvcPage.editarTarefa('Comprar café', 'Comprar café especial');
    await todoMvcPage.validarTarefaVisivel('Comprar café especial');
    await todoMvcPage.validarLocalStorageTarefa('Comprar café especial', false);

    await todoMvcPage.marcarTarefaConcluida('Comprar café especial');
    await todoMvcPage.validarTarefaConcluida('Comprar café especial');
    await todoMvcPage.validarContador('0 items left');
    await todoMvcPage.validarLocalStorageTarefa('Comprar café especial', true);

    await todoMvcPage.excluirTarefa('Comprar café especial');
    await todoMvcPage.validarQuantidadeTarefasNaLista(0);
    await todoMvcPage.validarLocalStorageVazio();
  });

  test('CT02 - Persistência de Sessão e Comportamento de Rotas (Filtros)', async () => {
    await todoMvcPage.adicionarTarefa('Estudar Playwright');
    await todoMvcPage.adicionarTarefa('Configurar Pipeline');
    await todoMvcPage.validarTarefaVisivel('Estudar Playwright');
    await todoMvcPage.validarTarefaVisivel('Configurar Pipeline');
    await todoMvcPage.validarContador('2 items left');

    await todoMvcPage.marcarTarefaConcluida('Estudar Playwright');
    await todoMvcPage.validarContador('1 item left');

    await todoMvcPage.clicarFiltroActive();
    await todoMvcPage.validarUrl('#/active');
    await todoMvcPage.validarTarefaVisivel('Configurar Pipeline');
    await todoMvcPage.validarTarefaInvisivel('Estudar Playwright');
    await todoMvcPage.validarLocalStorageQuantidade(2);

    await todoMvcPage.recarregarPagina();
    await todoMvcPage.validarUrl('#/active');
    await todoMvcPage.validarTarefaVisivel('Configurar Pipeline');
    await todoMvcPage.validarTarefaInvisivel('Estudar Playwright');
    await todoMvcPage.validarLocalStorageQuantidade(2);
  });

  test('CT03 - Ações em Lote e Cálculo Dinâmico de Estado', async () => {
    await todoMvcPage.adicionarTarefa('Tarefa A');
    await todoMvcPage.adicionarTarefa('Tarefa B');
    await todoMvcPage.adicionarTarefa('Tarefa C');
    await todoMvcPage.validarQuantidadeTarefasNaLista(3);
    await todoMvcPage.validarContador('3 items left');

    await todoMvcPage.clicarToggleAll();
    await todoMvcPage.validarTodasConcluidas(['Tarefa A', 'Tarefa B', 'Tarefa C']);
    await todoMvcPage.validarContador('0 items left');
    await todoMvcPage.validarClearCompletedVisivel();
    await todoMvcPage.validarTodosLocalStorageCompleted(true);

    await todoMvcPage.desmarcarTarefaConcluida('Tarefa B');
    await todoMvcPage.validarTarefaNaoConcluida('Tarefa B');
    await todoMvcPage.validarContador('1 item left');

    await todoMvcPage.clicarClearCompleted();
    await todoMvcPage.validarTarefaInvisivel('Tarefa A');
    await todoMvcPage.validarTarefaInvisivel('Tarefa C');
    await todoMvcPage.validarTarefaVisivel('Tarefa B');
    await todoMvcPage.validarClearCompletedInvisivel();
    await todoMvcPage.validarLocalStorageQuantidade(1);
    await todoMvcPage.validarLocalStorageTarefa('Tarefa B', false);
  });
});