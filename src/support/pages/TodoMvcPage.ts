import { Page, expect } from '@playwright/test';
import BasePage from './BasePage';
import TodoMvcElements from '../elements/TodoMvcElements';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = 'react-todos';

export default class TodoMvcPage extends BasePage {
  readonly todoMvcElements: TodoMvcElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.todoMvcElements = new TodoMvcElements(page);
  }

  async limparLocalStorage(): Promise<void> {
    await this.page.evaluate((key: string) => localStorage.removeItem(key), STORAGE_KEY);
  }

  private async obterTodosLocalStorage(): Promise<TodoItem[]> {
    const dados = await this.page.evaluate((key: string) => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    }, STORAGE_KEY);
    return dados as TodoItem[];
  }

  async adicionarTarefa(titulo: string): Promise<void> {
    await this.todoMvcElements.getInputNovaTarefa().fill(titulo);
    await this.todoMvcElements.getInputNovaTarefa().press('Enter');
  }

  async editarTarefa(tituloAtual: string, novoTitulo: string): Promise<void> {
    await this.todoMvcElements.getLabelTarefa(tituloAtual).dblclick();
    const inputEdicao = this.todoMvcElements.getInputEdicaoTarefa();
    await inputEdicao.fill(novoTitulo);
    await inputEdicao.press('Enter');
  }

  async marcarTarefaConcluida(titulo: string): Promise<void> {
    await this.todoMvcElements.getCheckboxTarefa(titulo).check();
  }

  async desmarcarTarefaConcluida(titulo: string): Promise<void> {
    await this.todoMvcElements.getCheckboxTarefa(titulo).uncheck();
  }

  async excluirTarefa(titulo: string): Promise<void> {
    await this.todoMvcElements.getItemTarefa(titulo).hover();
    await this.todoMvcElements.getBotaoExcluirTarefa(titulo).click();
  }

  async clicarToggleAll(): Promise<void> {
    await this.todoMvcElements.getLabelToggleAll().click();
  }

  async clicarFiltroActive(): Promise<void> {
    await this.todoMvcElements.getFiltroActive().click();
  }

  async clicarClearCompleted(): Promise<void> {
    await this.todoMvcElements.getBotaoClearCompleted().click();
  }

  async recarregarPagina(): Promise<void> {
    await this.page.reload();
  }

  async validarTarefaVisivel(titulo: string): Promise<void> {
    await expect(this.todoMvcElements.getItemTarefa(titulo)).toBeVisible();
  }

  async validarTarefaInvisivel(titulo: string): Promise<void> {
    await expect(this.todoMvcElements.getItemTarefa(titulo)).not.toBeVisible();
  }

  async validarContador(texto: string): Promise<void> {
    await expect(this.todoMvcElements.getContadorItens()).toHaveText(texto);
  }

  async validarQuantidadeTarefasNaLista(quantidade: number): Promise<void> {
    await expect(this.todoMvcElements.getListaTarefas()).toHaveCount(quantidade);
  }

  async validarTarefaConcluida(titulo: string): Promise<void> {
    await expect(this.todoMvcElements.getItemTarefa(titulo)).toHaveClass(/completed/);
  }

  async validarTarefaNaoConcluida(titulo: string): Promise<void> {
    await expect(this.todoMvcElements.getItemTarefa(titulo)).not.toHaveClass(/completed/);
  }

  async validarTodasConcluidas(titulos: string[]): Promise<void> {
    for (const titulo of titulos) {
      await this.validarTarefaConcluida(titulo);
    }
  }

  async validarClearCompletedVisivel(): Promise<void> {
    await expect(this.todoMvcElements.getBotaoClearCompleted()).toBeVisible();
  }

  async validarClearCompletedInvisivel(): Promise<void> {
    await expect(this.todoMvcElements.getBotaoClearCompleted()).not.toBeVisible();
  }

  async validarUrl(urlParcial: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(urlParcial));
  }

  async validarLocalStorageTarefa(titulo: string, completed: boolean): Promise<void> {
    const todos = await this.obterTodosLocalStorage();
    const tarefa = todos.find((t) => t.title === titulo);
    expect(tarefa).toBeDefined();
    expect(tarefa!.completed).toBe(completed);
  }

  async validarLocalStorageQuantidade(quantidade: number): Promise<void> {
    const todos = await this.obterTodosLocalStorage();
    expect(todos).toHaveLength(quantidade);
  }

  async validarLocalStorageVazio(): Promise<void> {
    const todos = await this.obterTodosLocalStorage();
    expect(todos).toHaveLength(0);
  }

  async validarTodosLocalStorageCompleted(completed: boolean): Promise<void> {
    const todos = await this.obterTodosLocalStorage();
    todos.forEach((t) => expect(t.completed).toBe(completed));
  }
}