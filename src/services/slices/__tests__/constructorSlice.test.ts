import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  clearOrderData,
  initialState
} from '../constructorSlice';
import { TConstructorIngredient } from '@utils-types';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: () => 'test-id-123'
}));

// Константы
const BASE_INGREDIENT_PROPS = {
  calories: 100,
  carbohydrates: 10,
  fat: 10,
  proteins: 10,
  image: '',
  image_large: '',
  image_mobile: ''
} as const;

const MOCK_INGREDIENTS = {
  BUN: {
    ...BASE_INGREDIENT_PROPS,
    _id: 'bun-1',
    id: 'test-id-123',
    name: 'Булка',
    type: 'bun' as const,
    price: 100
  },
  MAIN_1: {
    ...BASE_INGREDIENT_PROPS,
    _id: 'ing-1',
    id: 'test-id-123',
    name: 'Начинка',
    type: 'main' as const,
    price: 50
  },
  MAIN_2: {
    ...BASE_INGREDIENT_PROPS,
    _id: 'ing-2',
    id: 'ing-2-unique',
    name: 'Начинка 2',
    type: 'main' as const,
    price: 60
  }
} as const;

describe('constructorSlice', () => {
  test('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('должен добавлять булку', () => {
    const action = addIngredient(MOCK_INGREDIENTS.BUN);
    const newState = constructorReducer(initialState, action);

    expect(newState.bun?._id).toBe(MOCK_INGREDIENTS.BUN._id);
    expect(newState.bun?.name).toBe(MOCK_INGREDIENTS.BUN.name);
    expect(newState.bun?.price).toBe(MOCK_INGREDIENTS.BUN.price);
    expect(newState.ingredients).toHaveLength(0);
  });

  test('должен добавлять начинку', () => {
    const action = addIngredient(MOCK_INGREDIENTS.MAIN_1);
    const newState = constructorReducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]._id).toBe(MOCK_INGREDIENTS.MAIN_1._id);
    expect(newState.ingredients[0].name).toBe(MOCK_INGREDIENTS.MAIN_1.name);
  });

  test('должен удалять начинку по id', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [MOCK_INGREDIENTS.MAIN_1]
    };

    const action = removeIngredient(MOCK_INGREDIENTS.MAIN_1.id);
    const newState = constructorReducer(stateWithIngredient, action);

    expect(newState.ingredients).toHaveLength(0);
  });

  test('должен перемещать начинку вверх', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [MOCK_INGREDIENTS.MAIN_1, MOCK_INGREDIENTS.MAIN_2]
    };

    const action = moveIngredientUp(1);
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState.ingredients[0]._id).toBe(MOCK_INGREDIENTS.MAIN_2._id);
    expect(newState.ingredients[1]._id).toBe(MOCK_INGREDIENTS.MAIN_1._id);
  });

  test('должен перемещать начинку вниз', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [MOCK_INGREDIENTS.MAIN_1, MOCK_INGREDIENTS.MAIN_2]
    };

    const action = moveIngredientDown(0);
    const newState = constructorReducer(stateWithIngredients, action);

    expect(newState.ingredients[0]._id).toBe(MOCK_INGREDIENTS.MAIN_2._id);
    expect(newState.ingredients[1]._id).toBe(MOCK_INGREDIENTS.MAIN_1._id);
  });

  test('должен очищать конструктор', () => {
    const stateWithItems = {
      ...initialState,
      bun: MOCK_INGREDIENTS.BUN,
      ingredients: [MOCK_INGREDIENTS.MAIN_1, MOCK_INGREDIENTS.MAIN_2],
      orderModalData: { number: 12345 } as any
    };

    const action = clearConstructor();
    const newState = constructorReducer(stateWithItems, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
    expect(newState.orderModalData).toEqual({ number: 12345 });
  });

  test('должен очищать данные заказа', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: { number: 12345 } as any,
      orderError: 'error'
    };

    const action = clearOrderData();
    const newState = constructorReducer(stateWithOrder, action);

    expect(newState.orderModalData).toBeNull();
    expect(newState.orderError).toBeNull();
  });
});
