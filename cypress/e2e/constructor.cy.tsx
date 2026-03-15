describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.setCookie('accessToken', 'test-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер').should('be.visible');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  describe('Страница ингредиента', () => {
    it('должен открывать страницу ингредиента при клике на название', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.url().should('include', '/ingredients/');
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Калории, ккал').should('be.visible');
      cy.contains('420').should('be.visible');
    });
  });

  describe('Создание заказа', () => {
    it('должно создавать заказ и очищать конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('exist');

      // Нажимаем кнопку "Оформить заказ"
      cy.contains('button', 'Оформить заказ').click();

      // Ждём ответа от сервера
      cy.wait('@createOrder');

      // Проверяем, что номер заказа появился
      cy.contains('12345', { timeout: 10000 }).should('exist');
      cy.contains('идентификатор заказа').should('exist');

      // Закрываем модальное окно
      cy.get('body').click(0, 0);

      // Проверяем, что конструктор пуст
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
