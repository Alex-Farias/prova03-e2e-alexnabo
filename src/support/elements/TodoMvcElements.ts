import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class TodoMvcElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  getInputNovaTarefa(): Locator {
    return this.page.locator('.new-todo');
  }

  getListaTarefas(): Locator {
    return this.page.locator('.todo-list li');
  }

  getItemTarefa(titulo: string): Locator {
    return this.page.locator('.todo-list li').filter({ hasText: titulo });
  }

  getLabelTarefa(titulo: string): Locator {
    return this.getItemTarefa(titulo).locator('label');
  }

  getCheckboxTarefa(titulo: string): Locator {
    return this.getItemTarefa(titulo).locator('.toggle');
  }

  getInputEdicaoTarefa(): Locator {
    return this.page.locator('.todo-list li.editing .edit');
  }

  getBotaoExcluirTarefa(titulo: string): Locator {
    return this.getItemTarefa(titulo).locator('.destroy');
  }

  getContadorItens(): Locator {
    return this.page.locator('.todo-count');
  }

  getLabelToggleAll(): Locator {
    return this.page.locator('label[for="toggle-all"]');
  }

  getFiltroActive(): Locator {
    return this.page.locator('.filters a[href="#/active"]');
  }

  getBotaoClearCompleted(): Locator {
    return this.page.locator('.clear-completed');
  }
}