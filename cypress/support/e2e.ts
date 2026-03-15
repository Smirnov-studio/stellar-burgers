// cypress/support/e2e.ts
import './commands';

// Можно добавить глобальные хуки
beforeEach(() => {
  // Очищаем localStorage и cookies перед каждым тестом
  cy.clearLocalStorage();
  cy.clearCookies();
});
