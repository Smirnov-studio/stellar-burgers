// Константы
const INGREDIENTS = {
  BUN: {
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 1255
  },
  MAIN: {
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    price: 424
  },
  SAUCE: {
    name: 'Соус Spicy-X',
    type: 'sauce',
    price: 90
  }
} as const;

const SELECTORS = {
  ingredientItem: 'li',
  addButton: 'button',
  constructorTopBun: 'Краторная булка N-200i (верх)',
  constructorBottomBun: 'Краторная булка N-200i (низ)',
  constructorIngredient: 'span.constructor-element__text',
  constructorSection: 'section',
  modal: 'div[class*="modal"]',
  modalButton: 'div[class*="modal"] button',
  overlay: 'div[class*="overlay"]',
  orderButton: 'button',
  mainTitle: 'Соберите бургер',
  ingredientDetailsTitle: 'Детали ингредиента',
  calories: 'Калории, ккал',
  orderNumber: '12345',
  orderIdText: 'идентификатор заказа',
  emptyBunPlaceholder: 'Выберите булки',
  emptyIngredientPlaceholder: 'Выберите начинку'
} as const;

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
    cy.contains(SELECTORS.mainTitle).should('be.visible');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.contains(INGREDIENTS.BUN.name)
        .closest(SELECTORS.ingredientItem)
        .find(SELECTORS.addButton)
        .click();

      cy.contains(SELECTORS.constructorTopBun).should('exist');
      cy.contains(SELECTORS.constructorBottomBun).should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains(INGREDIENTS.MAIN.name)
        .closest(SELECTORS.ingredientItem)
        .find(SELECTORS.addButton)
        .click();

      cy.contains(INGREDIENTS.MAIN.name).should('exist');
    });
  });

  describe('Страница ингредиента', () => {
    it('должен открывать страницу ингредиента при клике на название', () => {
      cy.contains(INGREDIENTS.BUN.name).click();
      cy.url().should('include', '/ingredients/');
      cy.contains(SELECTORS.ingredientDetailsTitle).should('be.visible');
      cy.contains(INGREDIENTS.BUN.name).should('be.visible');
      cy.contains(SELECTORS.calories).should('be.visible');
      cy.contains(INGREDIENTS.BUN.price.toString()).should('be.visible');
    });
  });

  describe('Создание заказа', () => {
    it('должно создавать заказ и очищать конструктор', () => {
      // Добавляем булку
      cy.contains(INGREDIENTS.BUN.name)
        .closest(SELECTORS.ingredientItem)
        .find(SELECTORS.addButton)
        .click();

      cy.contains(SELECTORS.constructorTopBun).should('exist');

      // Нажимаем кнопку "Оформить заказ"
      cy.contains(SELECTORS.orderButton, 'Оформить заказ').click();

      // Ждём ответа от сервера
      cy.wait('@createOrder');

      // Проверяем, что номер заказа появился
      cy.contains(SELECTORS.orderNumber, { timeout: 10000 }).should('exist');
      cy.contains(SELECTORS.orderIdText).should('exist');

      // Закрываем модальное окно
      cy.get('body').click(0, 0);

      // Проверяем, что конструктор пуст
      cy.contains(SELECTORS.emptyBunPlaceholder).should('be.visible');
      cy.contains(SELECTORS.emptyIngredientPlaceholder).should('be.visible');
    });
  });
});
